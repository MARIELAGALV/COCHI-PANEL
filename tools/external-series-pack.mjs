#!/usr/bin/env node
// CO-CHI Series External Catalog Pack v1. Node.js 20+; no npm dependencies.
// AES-256-GCM per asset + gzip, using a separate non-public key file.
import { createReadStream, mkdirSync, readFileSync, writeFileSync, chmodSync, existsSync } from 'node:fs';
import { resolve, join, dirname, basename, relative, isAbsolute } from 'node:path';
import { randomBytes, createCipheriv, createDecipheriv, createHash } from 'node:crypto';
import { gzipSync, gunzipSync } from 'node:zlib';
import { StringDecoder } from 'node:string_decoder';
const FORMAT='COCHI_SERIES_EXTERNAL_V1';
function fail(x){throw new Error(x);}
function options(){const a=process.argv.slice(2),cmd=a.shift(),o={cmd};for(let i=0;i<a.length;i++){const k=a[i];if(!k.startsWith('--')||i+1===a.length)fail('Invalid argument: '+k);o[k.slice(2)]=a[++i];}return o;}
function digest(b){return createHash('sha256').update(b).digest('hex');}
function getKey(f){if(!f)fail('Missing private --key-file');const h=readFileSync(resolve(f),'utf8').trim();if(!/^[0-9a-f]{64}$/i.test(h))fail('Key must be 64 hexadecimal characters');return Buffer.from(h,'hex');}
function sealed(name,json,out,key){
 const zip=gzipSync(Buffer.from(JSON.stringify(json),'utf8'),{level:8}),iv=randomBytes(12),c=createCipheriv('aes-256-gcm',key,iv);
 c.setAAD(Buffer.from(FORMAT+'|'+name));const bytes=Buffer.concat([c.update(zip),c.final()]),file=name+'.bin';
 writeFileSync(join(out,file),bytes);
 return {file,iv:iv.toString('base64'),tag:c.getAuthTag().toString('base64'),sha256:digest(bytes),bytes:bytes.length};
}
function opened(name,info,out,key){
 const bytes=readFileSync(join(out,info.file));if(digest(bytes)!==info.sha256)fail('Checksum incorrect: '+info.file);
 const d=createDecipheriv('aes-256-gcm',key,Buffer.from(info.iv,'base64'));
 d.setAAD(Buffer.from(FORMAT+'|'+name));d.setAuthTag(Buffer.from(info.tag,'base64'));
 return JSON.parse(gunzipSync(Buffer.concat([d.update(bytes),d.final()])).toString('utf8'));
}
// Read the large top-level series array one object at a time, not the full document.
async function* records(file){
 const stream=createReadStream(resolve(file),{highWaterMark:1048576}),decoder=new StringDecoder('utf8');
 let search=true,tail='',depth=0,quoted=false,escape=false,parts=[],size=0,found=false,done=false;
 for await(const bytes of stream){
  let chunk=decoder.write(bytes);
  if(search){
   const s=tail+chunk,m=/"series"\s*:\s*\[/.exec(s);
   if(!m){tail=s.slice(-128);continue;}
   chunk=s.slice(m.index+m[0].length);tail='';search=false;found=true;
  }
  let start=-1;
  for(let i=0;i<chunk.length;i++){
   const ch=chunk[i];
   if(depth===0){
    if(ch===']'){done=true;break;}
    if(ch==='{'){depth=1;quoted=false;escape=false;start=i;}
    else if(ch!==','&&!/\s/.test(ch))fail('Malformed series array');
    continue;
   }
   if(quoted){if(escape)escape=false;else if(ch==='\\')escape=true;else if(ch==='"')quoted=false;}
   else if(ch==='"')quoted=true;
   else if(ch==='{')depth++;
   else if(ch==='}')depth--;
   if(depth===0){
    parts.push(chunk.slice(start<0?0:start,i+1));
    const json=parts.join('');parts=[];size=0;start=-1;
    yield JSON.parse(json);
   }
  }
  if(done)break;
  if(depth>0){const s=chunk.slice(start<0?0:start);parts.push(s);size+=s.length;if(size>25000000)fail('Single series exceeds safe processing size');}
 }
 if(!found||!done||depth)fail('Missing or incomplete series collection');
}
function art(season){
 const images=Array.isArray(season?.asset?.posterList)?season.asset.posterList:[];
 return String((images.find(x=>x.fileType==='icon')||images.find(x=>x.fileType==='poster')||images[0])?.fileUrl||'');
}
function convert(original){
 const seasons=Array.isArray(original?.seasons)?original.seasons:[],first=seasons[0]||{},name=String(original?.name||first.name||'').trim();
 if(!name)return null;
 const icon=art(first),temp=[];let missing=0;
 for(const season of seasons)for(const ep of Array.isArray(season.chapters)?season.chapters:[]){
  const sn=Number(season.season_number)||1,en=Number(ep.chapter_number)||1;
  const sources=(Array.isArray(ep.sources)?ep.sources:[]).map(x=>({url:String(x.original_url||''),quality:String(x.quality||x.quality_group||''),audio:String(x.audio||''),video_format:String(x.video_format||'')})).filter(x=>/^https?:\/\//i.test(x.url));
  if(!sources.length){missing++;continue;}
  const subtitles=(Array.isArray(ep.subtitles)?ep.subtitles:[]).map(s=>({language:String(s.language||''),file_type:String(s.file_type||''),url:String(s.url||'')})).filter(s=>/^https?:\/\//i.test(s.url));
  temp.push({name:'T'+sn+' E'+en,uri:sources[0].url,icon:art(season)||icon,season_number:sn,episode_number:en,sources,subtitles});
 }
 return {name,icon,uri:'',temp,aliases:Array.isArray(original.aliases)?original.aliases:[],description:String(first.asset?.description||''),genre:String(first.asset?.tags||''),year:String(first.asset?.releaseTime||'').slice(0,4),_sourceMissing:missing};
}
async function pack(o){
 if(!o.input||!o.out||!o['key-file'])fail('pack: --input --out --key-file are required');
 const out=resolve(o.out),kf=resolve(o['key-file']),rel=relative(out,kf);
 if(!rel||(!rel.startsWith('..')&&!isAbsolute(rel)))fail('Key must be outside public Release directory');
 if(!existsSync(o.input))fail('Input file not found');
 const key=getKey(o['key-file']),limit=Number(o['shard-series']||200);
 if(!Number.isInteger(limit)||limit<10||limit>1000)fail('--shard-series must be between 10 and 1000');
 mkdirSync(out,{recursive:true});
 const manifest={format:FORMAT,version:1,source:basename(o.input),createdAt:new Date().toISOString(),series:0,episodes:0,missingSource:0,index:null,shards:[]},index=[],bucket=[];
 function flush(){if(!bucket.length)return;const name='series-pack-'+String(manifest.shards.length+1).padStart(4,'0');manifest.shards.push({...sealed(name,{format:FORMAT,series:bucket},out,key),series:bucket.length});bucket.length=0;}
 for await(const src of records(o.input)){
  const s=convert(src);if(!s)continue;
  index.push({id:index.length,name:s.name,icon:s.icon,aliases:s.aliases,shard:manifest.shards.length,offset:bucket.length,episodeCount:s.temp.length,seasonCount:Array.isArray(src.seasons)?src.seasons.length:0,year:s.year,genre:s.genre});
  bucket.push(s);manifest.series++;manifest.episodes+=s.temp.length;manifest.missingSource+=s._sourceMissing;
  if(bucket.length>=limit)flush();
 }
 flush();
 manifest.index=sealed('series-index',{format:FORMAT,series:index},out,key);
 writeFileSync(join(out,'series-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log('PACKED',manifest.series,'series',manifest.episodes,'episodes',manifest.shards.length,'shards');
}
function verify(o){
 if(!o.out||!o['key-file'])fail('verify: --out --key-file required');
 const out=resolve(o.out),key=getKey(o['key-file']),m=JSON.parse(readFileSync(join(out,'series-manifest.json'),'utf8'));
 if(m.format!==FORMAT)fail('Wrong catalog format');
 const idx=opened('series-index',m.index,out,key);if(idx.series.length!==m.series)fail('Bad index count');
 let n=0,episodes=0;
 m.shards.forEach((entry,i)=>{
  const name='series-pack-'+String(i+1).padStart(4,'0'),data=opened(name,entry,out,key);
  if(data.series.length!==entry.series)fail('Bad shard count');
  for(const s of data.series){n++;episodes+=s.temp.length;}
 });
 if(n!==m.series||episodes!==m.episodes)fail('Bad total counts');
 console.log('VERIFIED',n,'series',episodes,'episodes; AES-GCM and SHA256 OK');
}
(async()=>{
 const o=options();
 if(o.cmd==='keygen'){
  if(!o['key-file'])fail('keygen: --key-file required');
  const f=resolve(o['key-file']);if(existsSync(f))fail('Will not overwrite a key');
  mkdirSync(dirname(f),{recursive:true});writeFileSync(f,randomBytes(32).toString('hex')+'\n',{flag:'wx',mode:0o600});try{chmodSync(f,0o600);}catch{}
  console.log('KEY CREATED at',f,'KEEP PRIVATE');
 }else if(o.cmd==='pack')await pack(o);
 else if(o.cmd==='verify')verify(o);
 else fail('Available commands: keygen, pack, verify');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
