'use strict';

const http = require('node:http');
const fs = require('node:fs');

const ROUTES = new Set(['/get-yt.m3u8','/api/youtube/live.m3u8']);
const CACHE = new Map();
const INFLIGHT = new Map();
const RATE = new Map();
const FETCH_TIMEOUT_MS = 15000;
const MAX_HTML_BYTES = 5 * 1024 * 1024;
const DEFAULT_CACHE_MS = 2 * 60 * 1000;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36';

function sendText(res,status,text,extra={}){
  const body=Buffer.from(String(text||''),'utf8');
  res.writeHead(status,{
    'Content-Type':'text/plain; charset=utf-8',
    'Content-Length':body.length,
    'Cache-Control':'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma':'no-cache',
    'X-Content-Type-Options':'nosniff',
    ...extra
  });
  res.end(body);
}
function clientIp(req){
  return String(req.headers['x-forwarded-for']||'').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}
function allowRequest(req){
  const now=Date.now(),key=clientIp(req),windowMs=60_000,limit=90;
  let b=RATE.get(key);
  if(!b||now>=b.resetAt)b={count:0,resetAt:now+windowMs};
  b.count++;RATE.set(key,b);
  if(RATE.size>2000){for(const [k,v] of RATE)if(now>=v.resetAt)RATE.delete(k);}
  return b.count<=limit;
}
function isYoutubeHost(host){
  const h=String(host||'').toLowerCase();
  return h==='youtube.com'||h.endsWith('.youtube.com')||h==='youtu.be'||h==='www.youtu.be';
}
function sanitizeHandle(raw){
  let s=String(raw||'').trim().replace(/[\s]+/g,'');
  s=s.replace(/[.,;]+$/,'');
  if(!s.startsWith('@'))s='@'+s.replace(/^@+/,'');
  if(!/^@[A-Za-z0-9._-]{3,100}$/.test(s))throw new Error('Canal de YouTube no reconocido');
  return s;
}
function normalizeYoutubeTarget(raw){
  let value=String(raw||'').trim();
  if(!value)throw new Error('Falta ch');
  value=value.replace(/[.,;]+$/,'');
  if(value.startsWith('@')||(!/^https?:\/\//i.test(value)&&/^[A-Za-z0-9._-]{3,100}$/.test(value))){
    const handle=sanitizeHandle(value);
    return {key:`handle:${handle.toLowerCase()}`,pageUrl:`https://www.youtube.com/${handle}/live`,label:handle};
  }
  let u;try{u=new URL(value);}catch{throw new Error('URL de YouTube inválida');}
  if(!isYoutubeHost(u.hostname))throw new Error('Solo se admiten URLs de YouTube');
  if(u.hostname.toLowerCase().endsWith('youtu.be')){
    const id=u.pathname.split('/').filter(Boolean)[0]||'';
    if(!/^[A-Za-z0-9_-]{11}$/.test(id))throw new Error('Video de YouTube inválido');
    return {key:`video:${id}`,pageUrl:`https://www.youtube.com/watch?v=${id}`,label:id};
  }
  const v=u.searchParams.get('v');
  if(v&&/^[A-Za-z0-9_-]{11}$/.test(v))return {key:`video:${v}`,pageUrl:`https://www.youtube.com/watch?v=${v}`,label:v};
  const parts=u.pathname.split('/').filter(Boolean);
  if(parts[0]?.startsWith('@')){
    const handle=sanitizeHandle(parts[0]);
    return {key:`handle:${handle.toLowerCase()}`,pageUrl:`https://www.youtube.com/${handle}/live`,label:handle};
  }
  if(['channel','c','user'].includes(parts[0])&&parts[1]){
    const base=`https://www.youtube.com/${parts[0]}/${encodeURIComponent(parts[1])}`;
    return {key:`channel:${parts[0]}:${parts[1].toLowerCase()}`,pageUrl:`${base}/live`,label:`${parts[0]}/${parts[1]}`};
  }
  throw new Error('Usá @canal, una URL de canal de YouTube o watch?v=...');
}
function decodeJsonEscapedString(raw){
  try{return JSON.parse(`"${String(raw||'')}"`);}catch{return String(raw||'').replace(/\\u0026/g,'&').replace(/\\\//g,'/');}
}
function extractHlsManifestUrl(html){
  const text=String(html||'');
  const patterns=[
    /"hlsManifestUrl"\s*:\s*"((?:\\.|[^"\\])*)"/i,
    /hlsManifestUrl\\?"?\s*:\s*\\?"((?:\\.|[^"\\])*)/i
  ];
  for(const re of patterns){const m=text.match(re);if(m?.[1]){const url=decodeJsonEscapedString(m[1]);if(/^https?:\/\//i.test(url))return url;}}
  return '';
}
function extractVideoId(html,finalUrl=''){
  try{const u=new URL(finalUrl);const v=u.searchParams.get('v');if(v&&/^[A-Za-z0-9_-]{11}$/.test(v))return v;}catch{}
  const text=String(html||'');
  const canonical=text.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/i)
    ||text.match(/<meta[^>]+itemprop=["']videoId["'][^>]+content=["']([A-Za-z0-9_-]{11})/i)
    ||text.match(/"videoId":"([A-Za-z0-9_-]{11})"[\s\S]{0,2500}?"isLiveContent":true/i)
    ||text.match(/"isLiveContent":true[\s\S]{0,2500}?"videoId":"([A-Za-z0-9_-]{11})"/i);
  return canonical?.[1]||'';
}
async function fetchYoutubeHtml(url){
  const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),FETCH_TIMEOUT_MS);
  try{
    const r=await fetch(url,{
      method:'GET',redirect:'follow',cache:'no-store',signal:ctl.signal,
      headers:{
        'User-Agent':USER_AGENT,
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language':'es-AR,es;q=0.9,en;q=0.7',
        'Cache-Control':'no-cache','Pragma':'no-cache',
        'Cookie':'CONSENT=YES+cb.20210328-17-p0.en+FX+410'
      }
    });
    if(!r.ok)throw new Error(`YouTube HTTP ${r.status}`);
    const len=Number(r.headers.get('content-length')||0);if(len>MAX_HTML_BYTES)throw new Error('Respuesta de YouTube demasiado grande');
    const buf=Buffer.from(await r.arrayBuffer());if(buf.length>MAX_HTML_BYTES)throw new Error('Respuesta de YouTube demasiado grande');
    return {html:buf.toString('utf8'),finalUrl:r.url||url};
  }finally{clearTimeout(timer);}
}
async function resolvePlain(target){
  let page=await fetchYoutubeHtml(target.pageUrl);
  let hls=extractHlsManifestUrl(page.html),videoId=extractVideoId(page.html,page.finalUrl);
  if(!hls&&videoId&&!/\/watch\?v=/i.test(page.finalUrl)){
    page=await fetchYoutubeHtml(`https://www.youtube.com/watch?v=${videoId}`);
    hls=extractHlsManifestUrl(page.html);videoId=extractVideoId(page.html,page.finalUrl)||videoId;
  }
  return {hls,videoId,pageUrl:page.finalUrl||target.pageUrl,method:'fetch'};
}
async function resolveWithChromium(target){
  let puppeteer;try{puppeteer=require('puppeteer-core');}catch{return {hls:'',videoId:'',pageUrl:target.pageUrl,method:'none'};}
  const executablePath=String(process.env.CHROMIUM_PATH||'').trim();
  if(!executablePath||!fs.existsSync(executablePath))return {hls:'',videoId:'',pageUrl:target.pageUrl,method:'none'};
  let browser;
  try{
    browser=await puppeteer.launch({executablePath,headless:true,args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu']});
    const page=await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    await page.setExtraHTTPHeaders({'Accept-Language':'es-AR,es;q=0.9,en;q=0.7'});
    await page.setCookie({name:'CONSENT',value:'YES+cb.20210328-17-p0.en+FX+410',domain:'.youtube.com',path:'/'}).catch(()=>{});
    await page.goto(target.pageUrl,{waitUntil:'domcontentloaded',timeout:FETCH_TIMEOUT_MS});
    await new Promise(r=>setTimeout(r,1200));
    const direct=await page.evaluate(()=>{
      try{
        const p=window.ytInitialPlayerResponse||null;
        return {hls:p?.streamingData?.hlsManifestUrl||'',videoId:p?.videoDetails?.videoId||''};
      }catch{return {hls:'',videoId:''};}
    });
    if(direct?.hls)return {hls:String(direct.hls),videoId:String(direct.videoId||''),pageUrl:page.url(),method:'chromium'};
    const html=await page.content(),hls=extractHlsManifestUrl(html),videoId=extractVideoId(html,page.url());
    return {hls,videoId,pageUrl:page.url(),method:'chromium'};
  }catch{return {hls:'',videoId:'',pageUrl:target.pageUrl,method:'chromium'};}
  finally{if(browser)await browser.close().catch(()=>{});}
}
function cacheUntilForHls(hls){
  const now=Date.now();let until=now+DEFAULT_CACHE_MS;
  try{const exp=Number(new URL(hls).searchParams.get('expire')||0)*1000;if(exp>now+60_000)until=Math.min(until,exp-60_000);}catch{}
  return Math.max(now+30_000,until);
}
async function resolveFresh(target){
  let r=await resolvePlain(target).catch(()=>({hls:'',videoId:'',pageUrl:target.pageUrl,method:'fetch'}));
  if(!r.hls)r=await resolveWithChromium(target);
  if(!r.hls)throw new Error('No se encontró un vivo HLS activo para ese canal/video de YouTube');
  return {...r,expiresAt:cacheUntilForHls(r.hls)};
}
async function resolveCached(target){
  const now=Date.now(),cached=CACHE.get(target.key);
  if(cached&&cached.expiresAt>now)return {...cached,cached:true};
  if(INFLIGHT.has(target.key))return INFLIGHT.get(target.key);
  const p=resolveFresh(target).then(r=>{CACHE.set(target.key,r);return {...r,cached:false};}).finally(()=>INFLIGHT.delete(target.key));
  INFLIGHT.set(target.key,p);return p;
}
async function handleYoutubeResolver(req,res,urlObj){
  if(req.method!=='GET'&&req.method!=='HEAD')return sendText(res,405,'Método no permitido',{'Allow':'GET, HEAD'});
  if(!allowRequest(req))return sendText(res,429,'Demasiadas solicitudes. Probá nuevamente en un minuto.',{'Retry-After':'60'});
  let target;try{target=normalizeYoutubeTarget(urlObj.searchParams.get('ch')||urlObj.searchParams.get('url')||'');}catch(e){return sendText(res,400,e.message);}
  try{
    const r=await resolveCached(target);
    const headers={
      'Location':r.hls,
      'Cache-Control':'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma':'no-cache',
      'X-Content-Type-Options':'nosniff',
      'X-COCHI-YT-Resolver':'1',
      'X-COCHI-YT-Method':String(r.method||''),
      'X-COCHI-YT-Cached':r.cached?'1':'0'
    };
    if(r.videoId)headers['X-COCHI-YT-Video']=r.videoId;
    res.writeHead(302,headers);return res.end();
  }catch(e){return sendText(res,502,String(e?.message||e));}
}

const originalCreateServer=http.createServer;
http.createServer=function(...args){
  const i=args.findIndex(x=>typeof x==='function');
  if(i>=0){
    const originalListener=args[i];
    args[i]=function(req,res){
      let u;try{u=new URL(req.url,'http://cochi.local');}catch{return originalListener(req,res);}
      if(ROUTES.has(u.pathname))return void handleYoutubeResolver(req,res,u);
      return originalListener(req,res);
    };
  }
  return originalCreateServer.apply(this,args);
};
