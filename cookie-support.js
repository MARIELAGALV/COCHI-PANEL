'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const dns = require('node:dns').promises;
const net = require('node:net');
const { DatabaseSync } = require('node:sqlite');

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = process.env.COCHI_DATA_DIR ? path.resolve(process.env.COCHI_DATA_DIR) : path.join(ROOT, 'data');
const DB_PATH = path.join(DATA_DIR, 'cochi-panel.db');
const TRUST_PROXY_HTTPS = String(process.env.COCHI_HTTPS || '').toLowerCase() === '1' || String(process.env.NODE_ENV || '').toLowerCase() === 'production';
const COOKIE_ROUTE = '/api/admin/cookie-fetch';
const UI_SCRIPT = '/cookie-ui.js?v=1';
const UI_CSS = '/cookie-ui.css?v=1';
const MAX_BODY = 64 * 1024;
const MAX_RESPONSE_BODY = 1024 * 1024;
const MAX_REDIRECTS = 6;
const REQUEST_TIMEOUT_MS = 15000;
let db = null;

function getDb(){
  if(!db) db = new DatabaseSync(DB_PATH, { timeout: 5000 });
  return db;
}
function sha(v){return crypto.createHash('sha256').update(String(v)).digest('hex');}
function parseCookies(req){
  const out={};
  for(const part of String(req.headers.cookie||'').split(';')){
    const i=part.indexOf('=');if(i<1)continue;
    const k=part.slice(0,i).trim(),raw=part.slice(i+1).trim();
    try{out[k]=decodeURIComponent(raw);}catch{out[k]=raw;}
  }
  return out;
}
function safeSecretMatches(storedHash,secret){
  try{
    const a=Buffer.from(String(storedHash||''),'hex'),b=Buffer.from(sha(secret||''),'hex');
    return a.length===b.length&&a.length>0&&crypto.timingSafeEqual(a,b);
  }catch{return false;}
}
function requireRootAdmin(req){
  try{
    const cookies=parseCookies(req),token=String(cookies.cochi_panel_session||'');
    const proof=String(cookies.cochi_panel_device||'');
    if(!token||!proof)return null;
    const dot=proof.indexOf('.');
    const panelDeviceId=Number(dot>0?proof.slice(0,dot):0),secret=dot>0?proof.slice(dot+1):'';
    if(!Number.isInteger(panelDeviceId)||panelDeviceId<=0||!secret)return null;
    const row=getDb().prepare(`SELECT ps.expires_at,pd.id panel_device_id,pd.secret_hash device_secret_hash,pd.active device_active,a.id account_id,a.role_level
      FROM panel_sessions ps JOIN panel_devices pd ON pd.id=ps.panel_device_id JOIN accounts a ON a.id=pd.account_id
      WHERE ps.token_hash=?`).get(sha(token));
    if(!row||Date.parse(row.expires_at)<=Date.now()||!row.device_active)return null;
    if(Number(row.panel_device_id)!==panelDeviceId||!safeSecretMatches(row.device_secret_hash,secret))return null;
    if(Number(row.role_level)!==1)return null;
    return row;
  }catch{return null;}
}
function sendJson(res,status,obj){
  const body=Buffer.from(JSON.stringify(obj),'utf8');
  res.writeHead(status,{
    'Content-Type':'application/json; charset=utf-8',
    'Content-Length':body.length,
    'Cache-Control':'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma':'no-cache',
    'X-Content-Type-Options':'nosniff'
  });
  res.end(body);
}
function readJson(req){
  return new Promise((resolve,reject)=>{
    const chunks=[];let size=0,done=false;
    const fail=e=>{if(done)return;done=true;reject(e);};
    req.on('data',chunk=>{size+=chunk.length;if(size>MAX_BODY){fail(new Error('Solicitud demasiado grande'));return;}chunks.push(chunk);});
    req.on('end',()=>{if(done)return;done=true;try{resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}'));}catch{reject(new Error('JSON invalido'));}});
    req.on('error',fail);
  });
}
function isPrivateOrUnsafeIp(ip){
  const family=net.isIP(ip);
  if(family===4){
    const p=ip.split('.').map(Number),a=p[0],b=p[1];
    return a===0||a===10||a===127||(a===169&&b===254)||(a===172&&b>=16&&b<=31)||(a===192&&b===168)||(a===100&&b>=64&&b<=127)||(a===198&&(b===18||b===19))||a>=224;
  }
  if(family===6){
    const x=ip.toLowerCase();
    if(x==='::'||x==='::1')return true;
    if(x.startsWith('fc')||x.startsWith('fd')||x.startsWith('fe8')||x.startsWith('fe9')||x.startsWith('fea')||x.startsWith('feb')||x.startsWith('ff'))return true;
    const m=x.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);if(m)return isPrivateOrUnsafeIp(m[1]);
  }
  return false;
}
async function assertSafeUrl(raw){
  let u;try{u=new URL(String(raw||'').trim());}catch{throw new Error('URL invalida');}
  if(!['http:','https:'].includes(u.protocol))throw new Error('Solo se permiten URLs HTTP/HTTPS');
  if(u.username||u.password)throw new Error('La URL no puede incluir usuario o contrasena');
  const host=u.hostname.toLowerCase();
  if(!host||host==='localhost'||host.endsWith('.localhost'))throw new Error('Host no permitido');
  if(net.isIP(host)){if(isPrivateOrUnsafeIp(host))throw new Error('La URL apunta a una red privada o local');return u;}
  const resolved=await dns.lookup(host,{all:true,verbatim:true});
  if(!resolved.length)throw new Error('No se pudo resolver el host');
  if(resolved.some(x=>isPrivateOrUnsafeIp(x.address)))throw new Error('La URL resuelve a una red privada o local');
  return u;
}
function splitCombinedSetCookie(raw){
  return String(raw||'').split(/,(?=\s*[^;,=\s]+\s*=)/g).map(x=>x.trim()).filter(Boolean);
}
function getSetCookie(headers){
  if(headers&&typeof headers.getSetCookie==='function')return headers.getSetCookie().filter(Boolean);
  const raw=headers?.get?.('set-cookie');return raw?splitCombinedSetCookie(raw):[];
}
function cookiePair(setCookie){
  const first=String(setCookie||'').split(';',1)[0].trim(),i=first.indexOf('=');
  if(i<=0)return null;const name=first.slice(0,i).trim(),value=first.slice(i+1).trim();
  return name?{name,value}:null;
}
function cookieDomain(setCookie){
  const m=String(setCookie||'').match(/(?:^|;)\s*Domain\s*=\s*([^;]+)/i);
  return m?m[1].trim().replace(/^\./,'').toLowerCase():'';
}
function appliesToSource(setCookie,responseHost,sourceHost){
  if(!sourceHost)return true;
  const domain=cookieDomain(setCookie);
  if(domain)return sourceHost===domain||sourceHost.endsWith('.'+domain);
  return String(responseHost||'').toLowerCase()===sourceHost;
}
function parseCookieHeader(raw){
  const map=new Map();
  for(const part of String(raw||'').replace(/^\s*Cookie\s*:\s*/i,'').split(';')){
    const p=part.trim(),i=p.indexOf('=');if(i<=0)continue;
    const name=p.slice(0,i).trim(),value=p.slice(i+1).trim();
    if(name&&!/^(path|domain|expires|max-age|samesite|secure|httponly)$/i.test(name))map.set(name,value);
  }
  return map;
}
function serializeCookieMap(map){return [...map.entries()].map(([k,v])=>`${k}=${v}`).join('; ');}
function mergeCookieHeader(jar,raw,received){
  for(const [name,value] of parseCookieHeader(raw)){
    jar.set(name,value);received.add(name);
  }
}
function mergeSetCookieValue(jar,raw,received){
  for(const sc of Array.isArray(raw)?raw:[raw]){
    const pair=cookiePair(sc);if(!pair)continue;
    jar.set(pair.name,pair.value);received.add(pair.name);
  }
}
function extractCookiesFromJson(value,jar,received,depth=0,keyHint=''){
  if(depth>10||value===undefined||value===null)return;
  const hint=String(keyHint||'').toLowerCase().replace(/[\s_-]/g,'');
  const isCookieHint=['cookie','cookies','cookieheader','requestcookie','playbackcookie'].includes(hint);
  const isSetCookieHint=['setcookie','setcookies'].includes(hint);

  if(typeof value==='string'){
    const s=value.trim();if(!s)return;
    if(isSetCookieHint){mergeSetCookieValue(jar,s,received);return;}
    if(isCookieHint){mergeCookieHeader(jar,s,received);return;}
    if(/\bcookie\s*:/i.test(s)){
      const m=s.match(/\bcookie\s*:\s*([^\r\n]+)/i);if(m)mergeCookieHeader(jar,m[1],received);
    }
    if(depth<5&&s.length>=24&&s.length<=MAX_RESPONSE_BODY&&/^[A-Za-z0-9+/_=-]+$/.test(s)&&s.length%4!==1){
      try{
        const decoded=Buffer.from(s.replace(/-/g,'+').replace(/_/g,'/'),'base64').toString('utf8').trim();
        if(decoded&&decoded!==s&&/cookie/i.test(decoded)){
          try{extractCookiesFromJson(JSON.parse(decoded),jar,received,depth+1,'decoded');}
          catch{const m=decoded.match(/\bcookie\s*[:=]\s*([^\r\n]+)/i);if(m)mergeCookieHeader(jar,m[1],received);}
        }
      }catch{}
    }
    return;
  }

  if(Array.isArray(value)){
    for(const entry of value){
      if(isCookieHint&&entry&&typeof entry==='object'&&!Array.isArray(entry)&&typeof entry.name==='string'&&entry.value!==undefined){
        const name=entry.name.trim();if(name){jar.set(name,String(entry.value));received.add(name);continue;}
      }
      extractCookiesFromJson(entry,jar,received,depth+1,keyHint);
    }
    return;
  }

  if(typeof value==='object'){
    if(isCookieHint){
      const simpleEntries=Object.entries(value).filter(([k,v])=>k&&['string','number','boolean'].includes(typeof v));
      if(simpleEntries.length&&simpleEntries.length===Object.keys(value).length){
        for(const [name,val] of simpleEntries){jar.set(String(name),String(val));received.add(String(name));}
        return;
      }
    }
    for(const [k,v] of Object.entries(value))extractCookiesFromJson(v,jar,received,depth+1,k);
  }
}
function extractCookiesFromBody(text,jar,received){
  const raw=String(text||'').trim();if(!raw)return;
  try{
    extractCookiesFromJson(JSON.parse(raw),jar,received,0,'root');
  }catch{
    const setCookieMatches=[...raw.matchAll(/(?:^|[\r\n])\s*Set-Cookie\s*:\s*([^\r\n]+)/ig)];
    for(const m of setCookieMatches)mergeSetCookieValue(jar,m[1],received);
    const cookieMatches=[...raw.matchAll(/(?:^|[\r\n])\s*Cookie\s*:\s*([^\r\n]+)/ig)];
    for(const m of cookieMatches)mergeCookieHeader(jar,m[1],received);
  }
}
function sanitizeRequestHeaders(input){
  const out={};
  const allowed=new Set(['referer','origin','user-agent','authorization','accept','accept-language']);
  if(input&&typeof input==='object'&&!Array.isArray(input)){
    for(const [k0,v0] of Object.entries(input)){
      const k=String(k0||'').trim(),lk=k.toLowerCase(),v=String(v0??'').trim();
      if(!k||!v||lk==='cookie')continue;
      if(allowed.has(lk)||/^x-[a-z0-9-]+$/i.test(k))out[k]=v;
    }
  }
  if(!Object.keys(out).some(k=>k.toLowerCase()==='user-agent'))out['User-Agent']='Mozilla/5.0 CO-CHI-PANEL Cookie Resolver';
  out['Cache-Control']='no-cache';out['Pragma']='no-cache';
  return out;
}
async function readResponseTextLimited(rr){
  const len=Number(rr.headers.get('content-length')||0);
  if(Number.isFinite(len)&&len>MAX_RESPONSE_BODY)throw new Error('La respuesta para obtener cookie supera 1 MB');
  const buf=Buffer.from(await rr.arrayBuffer());
  if(buf.length>MAX_RESPONSE_BODY)throw new Error('La respuesta para obtener cookie supera 1 MB');
  return buf.toString('utf8');
}
async function fetchCookieFromUrl({url,sourceUrl,headers,currentCookie}){
  let sourceHost='';
  if(sourceUrl){try{const s=new URL(sourceUrl);if(['http:','https:'].includes(s.protocol))sourceHost=s.hostname.toLowerCase();}catch{}}
  let current=await assertSafeUrl(url),requestHeaders=sanitizeRequestHeaders(headers);
  const jar=parseCookieHeader(currentCookie||'');
  const received=new Set();
  let status=0,finalUrl=current.toString(),foundIn='';
  for(let hop=0;hop<=MAX_REDIRECTS;hop++){
    const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),REQUEST_TIMEOUT_MS);
    let rr;
    try{
      const h={...requestHeaders};
      if(jar.size&&(!sourceHost||current.hostname.toLowerCase()===sourceHost))h.Cookie=serializeCookieMap(jar);
      rr=await fetch(current,{method:'GET',redirect:'manual',headers:h,signal:ctl.signal,cache:'no-store'});
    }finally{clearTimeout(timer);}
    status=rr.status;finalUrl=current.toString();
    const beforeHeaders=received.size;
    for(const sc of getSetCookie(rr.headers)){
      if(!appliesToSource(sc,current.hostname.toLowerCase(),sourceHost))continue;
      const pair=cookiePair(sc);if(!pair)continue;
      jar.set(pair.name,pair.value);received.add(pair.name);
    }
    if(received.size>beforeHeaders)foundIn=foundIn||'Set-Cookie';

    const location=rr.headers.get('location');
    if(status>=300&&status<400&&location){
      try{if(rr.body)await rr.body.cancel();}catch{}
      if(hop>=MAX_REDIRECTS)throw new Error('Demasiadas redirecciones');
      current=await assertSafeUrl(new URL(location,current).toString());
      continue;
    }

    if(!received.size){
      const text=await readResponseTextLimited(rr);
      const beforeBody=received.size;
      extractCookiesFromBody(text,jar,received);
      if(received.size>beforeBody)foundIn='contenido/JSON';
    }else{
      try{if(rr.body)await rr.body.cancel();}catch{}
    }
    break;
  }
  if(!received.size)throw new Error('La URL no devolvio Set-Cookie ni una cookie reconocible dentro del contenido/JSON');
  return {cookie:serializeCookieMap(jar),received:[...received],status,finalUrl,foundIn:foundIn||'respuesta'};
}
async function handleCookieRoute(req,res){
  if(req.method!=='POST')return sendJson(res,405,{error:'Metodo no permitido'});
  const actor=requireRootAdmin(req);if(!actor)return sendJson(res,403,{error:'Solo ADMINISTRACION puede obtener cookies'});
  let b;try{b=await readJson(req);}catch(e){return sendJson(res,400,{error:e.message});}
  const url=String(b.url||'').trim(),sourceUrl=String(b.sourceUrl||'').trim();
  if(!url||url.length>4096)return sendJson(res,400,{error:'Ingresa una URL valida para obtener la cookie'});
  if(sourceUrl.length>4096)return sendJson(res,400,{error:'URL de fuente invalida'});
  try{
    const result=await fetchCookieFromUrl({url,sourceUrl,headers:b.headers,currentCookie:String(b.currentCookie||'')});
    return sendJson(res,200,{ok:true,...result});
  }catch(e){return sendJson(res,502,{error:String(e?.message||e)});}
}
function serveInjectedIndex(res){
  const fp=path.join(PUBLIC_DIR,'index.html');
  if(!fs.existsSync(fp))return sendJson(res,500,{error:'index.html no encontrado'});
  let html=fs.readFileSync(fp,'utf8');
  if(!html.includes(UI_CSS))html=html.replace(/<\/head>/i,`  <link rel="stylesheet" href="${UI_CSS}">\n</head>`);
  if(!html.includes(UI_SCRIPT))html=html.replace(/<\/body>/i,`  <script src="${UI_SCRIPT}"></script>\n</body>`);
  const body=Buffer.from(html,'utf8');
  const csp="default-src 'self'; img-src 'self' data: blob: https: http:; style-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'";
  const headers={'Content-Type':'text/html; charset=utf-8','Content-Length':body.length,'Cache-Control':'no-store, no-cache, must-revalidate, max-age=0','Pragma':'no-cache','Expires':'0','Content-Security-Policy':csp,'X-Frame-Options':'DENY','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Permissions-Policy':'camera=(), microphone=(), geolocation=(), payment=()','Cross-Origin-Opener-Policy':'same-origin','Cross-Origin-Resource-Policy':'same-origin','X-Permitted-Cross-Domain-Policies':'none'};
  if(TRUST_PROXY_HTTPS)headers['Strict-Transport-Security']='max-age=31536000; includeSubDomains';
  res.writeHead(200,headers);res.end(body);
}

const originalCreateServer=http.createServer;
http.createServer=function(...args){
  const i=args.findIndex(x=>typeof x==='function');
  if(i>=0){
    const originalListener=args[i];
    args[i]=function(req,res){
      let pathname='';try{pathname=new URL(req.url,'http://cochi.local').pathname;}catch{}
      if(pathname===COOKIE_ROUTE)return void handleCookieRoute(req,res);
      if(req.method==='GET'&&(pathname==='/'||pathname==='/index.html'))return void serveInjectedIndex(res);
      return originalListener(req,res);
    };
  }
  return originalCreateServer.apply(this,args);
};
