'use strict';
const http=require('node:http');
const dns=require('node:dns').promises;
const net=require('node:net');
const crypto=require('node:crypto');

const PORT=Number(process.env.PORT||8788);
const HOST=process.env.HOST||'0.0.0.0';
const SECRET=String(process.env.RESCUE_SHARED_SECRET||'').trim();
const MAX_REDIRECTS=Math.max(1,Math.min(20,Number(process.env.RESCUE_MAX_REDIRECTS||10)));
const ALLOWED_SUFFIXES=String(process.env.RESCUE_ALLOWED_HOST_SUFFIXES||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);

function json(res,status,obj){const body=JSON.stringify(obj);res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','content-length':Buffer.byteLength(body)});res.end(body)}
function safeEqual(a,b){const aa=Buffer.from(String(a||'')),bb=Buffer.from(String(b||''));return aa.length===bb.length&&crypto.timingSafeEqual(aa,bb)}
function isPrivateIp(ip){
  if(net.isIP(ip)===4){const p=ip.split('.').map(Number);return p[0]===10||p[0]===127||p[0]===0||p[0]===169&&p[1]===254||p[0]===172&&p[1]>=16&&p[1]<=31||p[0]===192&&p[1]===168||p[0]>=224}
  const x=String(ip).toLowerCase();return x==='::1'||x==='::'||x.startsWith('fc')||x.startsWith('fd')||x.startsWith('fe8')||x.startsWith('fe9')||x.startsWith('fea')||x.startsWith('feb')||x.startsWith('::ffff:127.')||x.startsWith('::ffff:10.')||x.startsWith('::ffff:192.168.');
}
function hostAllowed(host){if(!ALLOWED_SUFFIXES.length)return true;const h=host.toLowerCase();return ALLOWED_SUFFIXES.some(s=>h===s||h.endsWith('.'+s))}
async function validatePublicUrl(raw){let u;try{u=new URL(String(raw||''))}catch{throw new Error('URL inválida')}if(!['http:','https:'].includes(u.protocol))throw new Error('Solo http/https');if(u.username||u.password)throw new Error('No se permiten credenciales en URL');if(!hostAllowed(u.hostname))throw new Error('Host no permitido por RESCUE_ALLOWED_HOST_SUFFIXES');const records=await dns.lookup(u.hostname,{all:true,verbatim:true});if(!records.length)throw new Error('DNS sin resultados');for(const r of records)if(isPrivateIp(r.address))throw new Error('Destino privado/local no permitido');return u}
function cleanHeaders(input){const out={};for(const [k,v] of Object.entries(input&&typeof input==='object'?input:{})){const key=String(k).trim();if(!key||/^(host|connection|content-length|transfer-encoding|authorization)$/i.test(key))continue;out[key]=String(v).slice(0,4000)}out['User-Agent']=out['User-Agent']||'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36';out.Accept=out.Accept||'*/*';return out}
async function resolveRedirects(rawUrl,headers,timeoutSeconds){const started=Date.now();let current=(await validatePublicUrl(rawUrl)).href;const hops=[];const timeoutMs=Math.max(3,Math.min(60,Number(timeoutSeconds)||15))*1000;
  for(let i=0;i<=MAX_REDIRECTS;i++){
    await validatePublicUrl(current);
    const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),timeoutMs);
    try{
      const r=await fetch(current,{method:'GET',headers:cleanHeaders(headers),redirect:'manual',signal:ctl.signal});
      const loc=r.headers.get('location');hops.push({url:current,status:r.status,location:loc||''});
      try{if(r.body)await r.body.cancel()}catch{}
      if(r.status>=300&&r.status<400&&loc){current=new URL(loc,current).href;continue}
      return {ok:true,status:r.status,finalUrl:current,hops,elapsedMs:Date.now()-started};
    }catch(e){return {ok:false,status:null,finalUrl:current,hops,error:e?.name==='AbortError'?'Timeout':String(e?.message||e),elapsedMs:Date.now()-started}}
    finally{clearTimeout(timer)}
  }
  return {ok:false,status:null,finalUrl:current,hops,error:'Demasiadas redirecciones',elapsedMs:Date.now()-started};
}
async function readBody(req){return new Promise((resolve,reject)=>{let s='';req.on('data',c=>{s+=c;if(s.length>1024*128){reject(new Error('Body demasiado grande'));req.destroy()}});req.on('end',()=>{try{resolve(s?JSON.parse(s):{})}catch{reject(new Error('JSON inválido'))}});req.on('error',reject)})}
const server=http.createServer(async(req,res)=>{try{
  if(req.method==='GET'&&req.url==='/health')return json(res,200,{ok:true,service:'cochi-rescue',version:'1.0.0'});
  if(req.method!=='POST'||req.url!=='/resolve')return json(res,404,{error:'Not found'});
  if(!SECRET)return json(res,503,{error:'RESCUE_SHARED_SECRET no configurado'});
  const auth=String(req.headers.authorization||'');if(!auth.startsWith('Bearer ')||!safeEqual(auth.slice(7),SECRET))return json(res,401,{error:'No autorizado'});
  const b=await readBody(req);const url=String(b.url||'').trim();if(!url)return json(res,400,{error:'Falta url'});
  const out=await resolveRedirects(url,b.headers||{},b.timeoutSeconds||15);return json(res,200,out);
}catch(e){return json(res,400,{error:String(e?.message||e)})}});
server.listen(PORT,HOST,()=>console.log(`[COCHI RESCUE] v1.0.0 escuchando en ${HOST}:${PORT}`));
