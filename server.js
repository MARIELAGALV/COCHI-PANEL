'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');
const puppeteer = require('puppeteer-core');

const VERSION = '0.9.52';
const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 8787);
const ROOT = __dirname;
const DATA_DIR = process.env.COCHI_DATA_DIR ? path.resolve(process.env.COCHI_DATA_DIR) : path.join(ROOT, 'data');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DB_PATH = path.join(DATA_DIR, 'cochi-panel.db');
const PANEL_DEVICE_LIMIT = 2;
const CLIENT_DEVICE_LIMIT = 2;
const CLIENT_CREDIT_COST = 1;
const CLIENT_DAYS = 30;
const RENEW_WINDOW_DAYS = 10;
const MIN_CREDIT_TRANSFER = 10;
const DEMO_DURATION_MINUTES = 10;
const DEMO_ALLOWED_MINUTES = [10, 60];
const DEFAULT_ADULT_MAX_ATTEMPTS = 5;
const IS_PRODUCTION = String(process.env.NODE_ENV || '').toLowerCase() === 'production';
const TRUST_PROXY_HTTPS = String(process.env.COCHI_HTTPS || '').toLowerCase() === '1' || IS_PRODUCTION;
const RATE_BUCKETS = new Map();

// v0.9.52 — Buscador de series y películas + proveedores de reproducción.
// La credencial TMDb vive solo en el backend; nunca se entrega a la APK.
const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = String(process.env.TMDB_API_KEY || '').trim();
const TMDB_READ_TOKEN = String(process.env.TMDB_READ_TOKEN || '').trim();
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';


// v0.9.52 — Proveedores de reproducción autorizados y reemplazables sin recompilar la APK.
// Formato: [{"name":"Mi fuente","url":"https://.../resolve","token":"...","enabled":true}]
function parseMediaProviders(){
  const raw=String(process.env.COCHI_MEDIA_PROVIDERS_JSON||'').trim();
  if(!raw)return [];
  try{
    const parsed=JSON.parse(raw);if(!Array.isArray(parsed))return [];
    return parsed.map((x,i)=>({
      name:String(x?.name||`Proveedor ${i+1}`).trim().slice(0,80),
      url:String(x?.url||'').trim(),token:String(x?.token||'').trim(),
      enabled:x?.enabled!==false
    })).filter(x=>x.enabled&&/^https?:\/\//i.test(x.url));
  }catch(e){console.warn('[MEDIA-PROVIDERS] JSON inválido:',e.message);return []}
}
const MEDIA_PROVIDERS=parseMediaProviders();


// v0.9.43 — Gateway de reproducción separado para CO-CHI con compatibilidad estricta.
// La seguridad queda APAGADA por defecto y solo puede habilitarse si Railway
// tiene configurados URL + secretos del Worker dedicado de Cloudflare.
const COCHI_GATEWAY_URL = String(process.env.COCHI_GATEWAY_URL || '').trim().replace(/\/+$/,'');
const COCHI_GATEWAY_MASTER_SECRET = String(process.env.COCHI_GATEWAY_MASTER_SECRET || '').trim();
const COCHI_GATEWAY_CONTROL_SECRET = String(process.env.COCHI_GATEWAY_CONTROL_SECRET || '').trim();
const COCHI_GATEWAY_TICKET_TTL_SECONDS = Math.max(900, Math.min(86400, Number(process.env.COCHI_GATEWAY_TICKET_TTL_SECONDS || 21600)));

// v0.9.46 — Gateways dedicados solo para TV1 / TV2.
// Se mantienen separados del gateway general de reproducción para poder
// enrutar únicamente los canales de TV por Cloudflare sin tocar Películas/Series.
const COCHI_TV1_GATEWAY_URL = String(process.env.COCHI_TV1_GATEWAY_URL || '').trim().replace(/\/+$/,'');
const COCHI_TV1_GATEWAY_SECRET = String(process.env.COCHI_TV1_GATEWAY_SECRET || '').trim();
const COCHI_TV2_GATEWAY_URL = String(process.env.COCHI_TV2_GATEWAY_URL || '').trim().replace(/\/+$/,'');
const COCHI_TV2_GATEWAY_SECRET = String(process.env.COCHI_TV2_GATEWAY_SECRET || '').trim();
const COCHI_TV_GATEWAY_TTL_SECONDS = Math.max(900, Math.min(86400, Number(process.env.COCHI_TV_GATEWAY_TTL_SECONDS || 21600)));

function sessionCookie(token,maxAge=604800){
  const secure=TRUST_PROXY_HTTPS?'; Secure':'';
  return `cochi_panel_session=${encodeURIComponent(token||'')}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${secure}`;
}
function requestIp(req){
  const forwarded=String(req.headers['x-forwarded-for']||'').split(',')[0].trim();
  return forwarded || req.socket?.remoteAddress || 'unknown';
}
function rateLimit(req,res,key,limit,windowMs){
  const now=Date.now(),id=`${key}:${requestIp(req)}`;let b=RATE_BUCKETS.get(id);
  if(!b||now>=b.resetAt)b={count:0,resetAt:now+windowMs};
  b.count++;RATE_BUCKETS.set(id,b);
  if(b.count<=limit)return true;
  const retry=Math.max(1,Math.ceil((b.resetAt-now)/1000));
  sendJson(res,429,{error:'Demasiados intentos. Probá nuevamente en unos minutos.',retryAfterSeconds:retry},{'Retry-After':String(retry)});
  return false;
}

fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(DB_PATH, { timeout: 5000 });
db.exec('PRAGMA journal_mode=WAL;');

db.exec('PRAGMA foreign_keys=ON;');
function ensureAccountColumn(name, ddl){
  const cols=db.prepare("PRAGMA table_info(accounts)").all().map(x=>x.name);
  if(!cols.includes(name)) db.exec(`ALTER TABLE accounts ADD COLUMN ${ddl}`);
}


db.exec(`
CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role_level INTEGER NOT NULL CHECK(role_level BETWEEN 1 AND 4),
  parent_id INTEGER,
  contact TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  credits INTEGER NOT NULL DEFAULT 0 CHECK(credits >= 0),
  active INTEGER NOT NULL DEFAULT 1,
  inactivity_blocked INTEGER NOT NULL DEFAULT 0,
  activation_code TEXT NOT NULL UNIQUE,
  last_credit_received_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(parent_id) REFERENCES accounts(id) ON DELETE SET NULL
) STRICT;

`);
ensureAccountColumn('manual_blocked', "manual_blocked INTEGER NOT NULL DEFAULT 0");
ensureAccountColumn('block_reason', "block_reason TEXT NOT NULL DEFAULT ''");
ensureAccountColumn('blocked_by_account_id', "blocked_by_account_id INTEGER");
ensureAccountColumn('blocked_at', "blocked_at TEXT");
ensureAccountColumn('deleted_at', "deleted_at TEXT");
ensureAccountColumn('deleted_by_account_id', "deleted_by_account_id INTEGER");
db.exec(`
CREATE TABLE IF NOT EXISTS panel_devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  device_uid TEXT NOT NULL,
  device_name TEXT NOT NULL DEFAULT '',
  secret_hash TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  last_seen_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(account_id, device_uid),
  FOREIGN KEY(account_id) REFERENCES accounts(id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS panel_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  panel_device_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY(panel_device_id) REFERENCES panel_devices(id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  owner_account_id INTEGER NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(owner_account_id) REFERENCES accounts(id) ON DELETE RESTRICT
) STRICT;

CREATE TABLE IF NOT EXISTS client_devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_uid TEXT NOT NULL UNIQUE,
  device_name TEXT NOT NULL DEFAULT '',
  platform TEXT NOT NULL DEFAULT 'android',
  activation_code TEXT NOT NULL UNIQUE,
  secret_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','active','blocked')),
  client_id INTEGER,
  last_seen_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE SET NULL
) STRICT;

CREATE TABLE IF NOT EXISTS client_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY(device_id) REFERENCES client_devices(id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS sources (
  source_key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  enabled INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS managed_content (
  source_key TEXT PRIMARY KEY,
  json_text TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS published_content (
  source_key TEXT PRIMARY KEY,
  json_text TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS private_source_files (
  source_key TEXT PRIMARY KEY,
  file_name TEXT NOT NULL DEFAULT '',
  json_text TEXT NOT NULL DEFAULT '',
  source_bytes INTEGER NOT NULL DEFAULT 0,
  stats_json TEXT NOT NULL DEFAULT '{}',
  uploaded_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS private_source_backups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_key TEXT NOT NULL,
  file_name TEXT NOT NULL DEFAULT '',
  json_text TEXT NOT NULL DEFAULT '',
  source_bytes INTEGER NOT NULL DEFAULT 0,
  stats_json TEXT NOT NULL DEFAULT '{}',
  backed_up_at TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS promotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  percent_bonus INTEGER NOT NULL CHECK(percent_bonus BETWEEN 1 AND 500),
  target_levels TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_by_account_id INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(created_by_account_id) REFERENCES accounts(id) ON DELETE RESTRICT
) STRICT;

CREATE TABLE IF NOT EXISTS credit_movements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,
  from_account_id INTEGER,
  to_account_id INTEGER NOT NULL,
  amount INTEGER NOT NULL CHECK(amount > 0),
  promotion_id INTEGER,
  created_by_account_id INTEGER NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  FOREIGN KEY(from_account_id) REFERENCES accounts(id) ON DELETE SET NULL,
  FOREIGN KEY(to_account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
  FOREIGN KEY(promotion_id) REFERENCES promotions(id) ON DELETE SET NULL,
  FOREIGN KEY(created_by_account_id) REFERENCES accounts(id) ON DELETE RESTRICT
) STRICT;

CREATE TABLE IF NOT EXISTS client_service_ledger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  charged_account_id INTEGER NOT NULL,
  created_by_account_id INTEGER NOT NULL,
  credits_spent INTEGER NOT NULL,
  previous_expiry TEXT,
  new_expiry TEXT NOT NULL,
  action TEXT NOT NULL CHECK(action IN ('activate','renew','reactivate')),
  created_at TEXT NOT NULL,
  FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY(charged_account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
  FOREIGN KEY(created_by_account_id) REFERENCES accounts(id) ON DELETE RESTRICT
) STRICT;
`);

// v0.6.0: configuración global, demos por dispositivo y control parental.
db.exec(`
CREATE TABLE IF NOT EXISTS settings (
  setting_key TEXT PRIMARY KEY,
  setting_value TEXT NOT NULL,
  updated_at TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS device_demos (
  device_id INTEGER PRIMARY KEY,
  client_id INTEGER NOT NULL,
  granted_by_account_id INTEGER NOT NULL,
  started_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY(device_id) REFERENCES client_devices(id) ON DELETE RESTRICT,
  FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE RESTRICT,
  FOREIGN KEY(granted_by_account_id) REFERENCES accounts(id) ON DELETE RESTRICT
) STRICT;

CREATE TABLE IF NOT EXISTS deleted_clients_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_client_id INTEGER NOT NULL,
  client_name TEXT NOT NULL,
  owner_account_id INTEGER,
  owner_name TEXT NOT NULL DEFAULT '',
  expired_at TEXT,
  deleted_at TEXT NOT NULL,
  deleted_by_account_id INTEGER,
  delete_reason TEXT NOT NULL DEFAULT '',
  automatic INTEGER NOT NULL DEFAULT 0
) STRICT;

CREATE TABLE IF NOT EXISTS security_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_account_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id INTEGER,
  detail TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  FOREIGN KEY(actor_account_id) REFERENCES accounts(id) ON DELETE RESTRICT
) STRICT;
`);

function ensureColumn(table,name,definition){
  const cols=db.prepare(`PRAGMA table_info(${table})`).all();
  if(!cols.some(c=>c.name===name))db.exec(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`);
}
ensureColumn('clients','adult_policy',"TEXT NOT NULL DEFAULT 'inherit'");
ensureColumn('clients','adult_pin_hash','TEXT');
ensureColumn('clients','adult_locked','INTEGER NOT NULL DEFAULT 0');
ensureColumn('clients','adult_fail_count','INTEGER NOT NULL DEFAULT 0');
ensureColumn('clients','device_limit','INTEGER NOT NULL DEFAULT 2');

db.exec(`
CREATE TABLE IF NOT EXISTS client_device_changes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  device_uid TEXT NOT NULL,
  activation_code TEXT NOT NULL DEFAULT '',
  changed_by_account_id INTEGER NOT NULL,
  change_type TEXT NOT NULL DEFAULT 'delete',
  created_at TEXT NOT NULL,
  FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY(changed_by_account_id) REFERENCES accounts(id) ON DELETE RESTRICT
) STRICT;
CREATE TABLE IF NOT EXISTS demo_device_history (
  device_uid TEXT PRIMARY KEY,
  first_demo_at TEXT NOT NULL,
  last_demo_at TEXT NOT NULL,
  reset_by_admin_at TEXT
) STRICT;
`);

const nowIso = () => new Date().toISOString();
const roles = {1:'ADMINISTRACIÓN',2:'DISTRIBUIDOR',3:'REVENDEDOR',4:'VENDEDOR',5:'CLIENTE'};
const randomToken = (n=32) => crypto.randomBytes(n).toString('base64url');
const sha = v => crypto.createHash('sha256').update(String(v)).digest('hex');


// v0.8.2 — cifrado de contenido compatible con BLAF / CO-CHI.
// El Manager trabaja en claro dentro de la sesión ADMIN; el JSON público se guarda cifrado.
const CONTENT_CIPHER_KEY_TEXT = process.env.COCHI_CONTENT_KEY || 'R0JyelFiaDBzZFJWdGtRVTJ4RzZFSVlE';
function contentCipherKey(){
  const key=Buffer.from(String(CONTENT_CIPHER_KEY_TEXT),'utf8');
  if(key.length!==32)throw new Error('COCHI_CONTENT_KEY debe tener exactamente 32 bytes UTF-8');
  return key;
}
function encryptContentValue(value){
  const c=crypto.createCipheriv('aes-256-ecb',contentCipherKey(),null);c.setAutoPadding(true);
  return Buffer.concat([c.update(String(value),'utf8'),c.final()]).toString('base64');
}
function decryptContentValue(value){
  const d=crypto.createDecipheriv('aes-256-ecb',contentCipherKey(),null);d.setAutoPadding(true);
  return Buffer.concat([d.update(Buffer.from(String(value),'base64')),d.final()]).toString('utf8');
}
function cloneJson(v){return v===undefined?undefined:JSON.parse(JSON.stringify(v));}
function decryptManagedContent(input){
  if(!Array.isArray(input))throw new Error('La lista debe ser un arreglo de categorías');
  return input.map((group,gi)=>{
    const out={...group};
    if(gi===0&&group?.jwt){try{out.jwt=decryptContentValue(group.jwt)}catch{out.jwt=group.jwt;}}
    const samples=Array.isArray(group?.samples)?group.samples:[];
    out.samples=samples.map((sample)=>{
      // Si ya está en claro (por ejemplo, contenido recién editado), conservarlo.
      if(!sample||typeof sample!=='object'||!sample.code)return cloneJson(sample||{});
      let parsed;
      try{parsed=JSON.parse(decryptContentValue(sample.code));}
      catch(e){throw new Error('No se pudo desencriptar un contenido. Verificá que use la misma clave/formato que CO-CHI.');}
      const result={...parsed};
      if(Array.isArray(sample.temp)){
        result.temp=sample.temp.map(t=>{
          if(!t||typeof t!=='object'||!t.code)return cloneJson(t||{});
          try{return JSON.parse(decryptContentValue(t.code));}
          catch{throw new Error('No se pudo desencriptar un capítulo/temporada del contenido.');}
        });
      }
      return result;
    });
    return out;
  });
}
function encryptManagedContent(input){
  if(!Array.isArray(input))throw new Error('La lista debe ser un arreglo de categorías');
  return input.map((group,gi)=>{
    const out={name:String(group?.name??'')};
    if(gi===0&&group?.jwt!==undefined&&String(group.jwt).trim()!=='')out.jwt=encryptContentValue(String(group.jwt).trim());
    const samples=Array.isArray(group?.samples)?group.samples:[];
    out.samples=samples.map(sample=>{
      const plain=cloneJson(sample||{});
      const wrapped={code:encryptContentValue(JSON.stringify(plain))};
      if(Array.isArray(plain.temp))wrapped.temp=plain.temp.map(t=>({code:encryptContentValue(JSON.stringify(t||{}))}));
      return wrapped;
    });
    return out;
  });
}
function githubToken(){return String(process.env.COCHI_GITHUB_TOKEN||'').trim();}
function githubApiHeaders(token,extra={}){return {'Authorization':`Bearer ${token}`,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':`CO-CHI-PANEL/${VERSION}`,...extra};}
function parseGithubWritableSource(raw){
  let u;try{u=new URL(String(raw||''));}catch{return null}
  const host=u.hostname.toLowerCase(),parts=u.pathname.split('/').filter(Boolean);
  if(host==='github.com'&&parts.length>=6&&parts[2]==='releases'&&parts[3]==='download'){
    return {kind:'release_asset',owner:parts[0],repo:parts[1],tag:decodeURIComponent(parts[4]),assetName:decodeURIComponent(parts.slice(5).join('/'))};
  }
  if(host==='raw.githubusercontent.com'&&parts.length>=4){
    return {kind:'contents',owner:parts[0],repo:parts[1],ref:decodeURIComponent(parts[2]),filePath:parts.slice(3).map(decodeURIComponent).join('/')};
  }
  if(host==='github.com'&&parts.length>=5&&(parts[2]==='blob'||parts[2]==='raw')){
    return {kind:'contents',owner:parts[0],repo:parts[1],ref:decodeURIComponent(parts[3]),filePath:parts.slice(4).map(decodeURIComponent).join('/')};
  }
  return null;
}
async function githubRequest(url,options={}){
  const token=githubToken();if(!token)throw new Error('Falta configurar COCHI_GITHUB_TOKEN en Railway para poder guardar en el JSON original de GitHub.');
  const rr=await fetch(url,{...options,headers:githubApiHeaders(token,options.headers||{}),signal:AbortSignal.timeout(30000)});
  return rr;
}
async function replaceGithubReleaseAsset(info,newText){
  const releaseUrl=`https://api.github.com/repos/${encodeURIComponent(info.owner)}/${encodeURIComponent(info.repo)}/releases/tags/${encodeURIComponent(info.tag)}`;
  const relRes=await githubRequest(releaseUrl);if(!relRes.ok)throw new Error(`GitHub no pudo abrir la release ${info.tag} (HTTP ${relRes.status})`);
  const release=await relRes.json(),asset=(release.assets||[]).find(a=>String(a.name)===info.assetName);
  if(!asset)throw new Error(`No se encontró el asset ${info.assetName} dentro de la release ${info.tag}`);
  // Guardamos una copia de seguridad en memoria para poder restaurar si falla la sustitución.
  const oldRes=await githubRequest(`https://api.github.com/repos/${encodeURIComponent(info.owner)}/${encodeURIComponent(info.repo)}/releases/assets/${asset.id}`,{headers:{Accept:'application/octet-stream'}});
  if(!oldRes.ok)throw new Error(`No se pudo respaldar el asset actual (HTTP ${oldRes.status})`);
  const oldBytes=Buffer.from(await oldRes.arrayBuffer()),newBytes=Buffer.from(newText,'utf8');
  const delRes=await githubRequest(`https://api.github.com/repos/${encodeURIComponent(info.owner)}/${encodeURIComponent(info.repo)}/releases/assets/${asset.id}`,{method:'DELETE'});
  if(!delRes.ok&&delRes.status!==204)throw new Error(`No se pudo reemplazar el asset original (DELETE HTTP ${delRes.status})`);
  const uploadUrl=`https://uploads.github.com/repos/${encodeURIComponent(info.owner)}/${encodeURIComponent(info.repo)}/releases/${release.id}/assets?name=${encodeURIComponent(info.assetName)}`;
  const token=githubToken();
  const upload=async(bytes)=>fetch(uploadUrl,{method:'POST',headers:githubApiHeaders(token,{'Content-Type':'application/json','Content-Length':String(bytes.length)}),body:bytes,signal:AbortSignal.timeout(30000)});
  let upRes=await upload(newBytes);
  if(!upRes.ok){
    const firstStatus=upRes.status;try{await upload(oldBytes);}catch{}
    throw new Error(`GitHub eliminó el asset anterior pero no pudo subir la nueva versión (HTTP ${firstStatus}). Se intentó restaurar automáticamente el respaldo.`);
  }
  const uploaded=await upRes.json();
  // v0.9.11: no damos el guardado por bueno hasta volver a consultar GitHub y
  // comprobar que el asset visible en la release es exactamente el recién subido.
  const verifyRes=await githubRequest(releaseUrl);
  if(!verifyRes.ok)throw new Error(`El asset se subió, pero GitHub no permitió verificar la release (HTTP ${verifyRes.status})`);
  const verifiedRelease=await verifyRes.json();
  const verified=(verifiedRelease.assets||[]).find(a=>String(a.name)===info.assetName);
  if(!verified||Number(verified.id)!==Number(uploaded.id)){
    throw new Error(`GitHub no confirmó el reemplazo visible de ${info.assetName}. No se actualizará la copia local para evitar una falsa confirmación.`);
  }
  return {kind:'release_asset',owner:info.owner,repo:info.repo,tag:info.tag,assetName:info.assetName,assetId:uploaded.id,url:uploaded.browser_download_url||'',githubUpdatedAt:verified.updated_at||verified.created_at||'',verified:true};
}
async function updateGithubContents(info,newText){
  const apiBase=`https://api.github.com/repos/${encodeURIComponent(info.owner)}/${encodeURIComponent(info.repo)}/contents/${info.filePath.split('/').map(encodeURIComponent).join('/')}`;
  const getRes=await githubRequest(`${apiBase}?ref=${encodeURIComponent(info.ref)}`);if(!getRes.ok)throw new Error(`GitHub no pudo abrir el archivo original (HTTP ${getRes.status})`);
  const current=await getRes.json();if(!current?.sha)throw new Error('GitHub no devolvió el SHA del archivo original');
  const body={message:`CO-CHI PANEL ${VERSION}: actualizar ${info.filePath}`,content:Buffer.from(newText,'utf8').toString('base64'),sha:current.sha,branch:info.ref};
  const putRes=await githubRequest(apiBase,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!putRes.ok){let detail='';try{detail=(await putRes.json())?.message||''}catch{}throw new Error(`GitHub no pudo guardar el archivo original (HTTP ${putRes.status}${detail?`: ${detail}`:''})`)}
  const out=await putRes.json();return {kind:'contents',owner:info.owner,repo:info.repo,ref:info.ref,filePath:info.filePath,commitSha:out?.commit?.sha||'',url:out?.content?.download_url||''};
}
function privateSourceRow(key){return db.prepare('SELECT * FROM private_source_files WHERE source_key=?').get(key);}
function backupPrivateSource(key){const old=privateSourceRow(key);if(!old?.json_text)return;db.prepare('INSERT INTO private_source_backups(source_key,file_name,json_text,source_bytes,stats_json,backed_up_at) VALUES (?,?,?,?,?,?)').run(key,old.file_name||'',old.json_text||'',Number(old.source_bytes||0),old.stats_json||'{}',nowIso());db.prepare('DELETE FROM private_source_backups WHERE id IN (SELECT id FROM private_source_backups WHERE source_key=? ORDER BY id DESC LIMIT -1 OFFSET 5)').run(key);}
function savePrivateSourceMaster(key,json,fileName=''){const encrypted=encryptManagedContent(json),text=JSON.stringify(encrypted,null,2)+'\n';JSON.parse(text);const bytes=Buffer.byteLength(JSON.stringify(json),'utf8');if(bytes>25*1024*1024)throw new Error('El JSON supera 25 MB');backupPrivateSource(key);const stats=contentStats(json),t=nowIso();db.prepare(`INSERT INTO private_source_files(source_key,file_name,json_text,source_bytes,stats_json,uploaded_at,updated_at) VALUES (?,?,?,?,?,?,?) ON CONFLICT(source_key) DO UPDATE SET file_name=excluded.file_name,json_text=excluded.json_text,source_bytes=excluded.source_bytes,stats_json=excluded.stats_json,updated_at=excluded.updated_at`).run(key,String(fileName||'').slice(0,255),text,bytes,JSON.stringify(stats),t,t);return {text,stats,bytes,updatedAt:t};}

async function saveEditableToOriginalSource(key,json){
  const privateRow=privateSourceRow(key);
  if(privateRow){const saved=savePrivateSourceMaster(key,json,privateRow.file_name||`${key}.json`);return {remote:{kind:'private_upload',fileName:privateRow.file_name||`${key}.json`,bytes:saved.bytes,updatedAt:saved.updatedAt,verified:true},text:saved.text,stats:saved.stats};}
  const src=db.prepare('SELECT url FROM sources WHERE source_key=?').get(key);if(!src?.url)throw new Error('Esta lista no tiene una fuente maestra configurada. Subí un JSON privado al PANEL o configurá una URL de origen.');
  const info=parseGithubWritableSource(src.url);if(!info)throw new Error('GUARDAR EN JSON ORIGINAL admite una fuente privada subida al PANEL o URLs compatibles de GitHub.');
  const encrypted=encryptManagedContent(json),text=JSON.stringify(encrypted,null,2)+'\n';
  // v0.9.12: validar antes de tocar el original remoto.
  try{JSON.parse(text);}catch(e){throw new Error('Validación interna: el JSON generado no es válido: '+e.message);}
  if(Buffer.byteLength(text,'utf8')>25*1024*1024)throw new Error('El JSON cifrado supera 25 MB');
  const remote=info.kind==='release_asset'?await replaceGithubReleaseAsset(info,text):await updateGithubContents(info,text);
  return {remote,text,stats:contentStats(json)};
}

function contentStats(list){
  const categories=Array.isArray(list)?list.length:0;
  let items=0,nested=0;
  for(const g of Array.isArray(list)?list:[]){for(const x of Array.isArray(g?.samples)?g.samples:[]){items++;if(Array.isArray(x?.temp))nested+=x.temp.length;}}
  return {categories,items,nested};
}

for (const [key,label] of [['tv1','TV1'],['tv2','TV2'],['movies','Películas'],['series','Series']]) {
  db.prepare('INSERT OR IGNORE INTO sources(source_key,label,url,enabled,updated_at) VALUES (?,?,?,?,?)')
    .run(key,label,'',1,nowIso());
  db.prepare('INSERT OR IGNORE INTO managed_content(source_key,json_text,updated_at) VALUES (?,?,?)').run(key,'',nowIso());
  db.prepare('INSERT OR IGNORE INTO published_content(source_key,json_text,updated_at) VALUES (?,?,?)').run(key,'',nowIso());
  // Migración segura: en la primera ejecución de v0.9.9, la app conserva exactamente lo que ya estaba publicado.
  const managedNow=db.prepare('SELECT json_text,updated_at FROM managed_content WHERE source_key=?').get(key);
  const publishedNow=db.prepare('SELECT json_text FROM published_content WHERE source_key=?').get(key);
  if(!publishedNow?.json_text && managedNow?.json_text){
    db.prepare('UPDATE published_content SET json_text=?,updated_at=? WHERE source_key=?').run(managedNow.json_text,managedNow.updated_at||nowIso(),key);
  }
}

function contentDeliveryPath(key){ return `/api/content/${key}`; }
function looksLikeOwnContentEndpoint(raw,key){
  try{ const u=new URL(String(raw||'')); return u.pathname.replace(/\/+$/,'')===contentDeliveryPath(key); }catch{return false;}
}
for (const key of ['tv1','tv2','movies','series']) {
  const r=db.prepare('SELECT url FROM sources WHERE source_key=?').get(key);
  if(r?.url && looksLikeOwnContentEndpoint(r.url,key)) db.prepare('UPDATE sources SET url=?,updated_at=? WHERE source_key=?').run('',nowIso(),key);
}

for (const [key,value] of [['demos_enabled','0'],['demo_duration_minutes','10'],['demo_blocked_categories','[]'],['adult_lock_enabled','0'],['adult_max_attempts',String(DEFAULT_ADULT_MAX_ATTEMPTS)],['adult_pin_hash',''],['playback_security_enabled','0'],['playback_generation','1']]) {
  db.prepare('INSERT OR IGNORE INTO settings(setting_key,setting_value,updated_at) VALUES (?,?,?)').run(key,value,nowIso());
}

function sendJson(res, status, payload, extra={}) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':'no-store',
    'X-Content-Type-Options':'nosniff',
    'X-Frame-Options':'DENY',
    'Referrer-Policy':'no-referrer',
    'Permissions-Policy':'camera=(), microphone=(), geolocation=(), payment=()',
    ...(TRUST_PROXY_HTTPS?{'Strict-Transport-Security':'max-age=31536000; includeSubDomains'}:{}),
    ...extra,
  });
  res.end(body);
}
function sendText(res,status,body,type='text/plain; charset=utf-8') {
  res.writeHead(status, {'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer'});
  res.end(body);
}
async function readJson(req,limit=1024*1024){
  return new Promise((resolve,reject)=>{
    let size=0; const chunks=[];
    req.on('data',c=>{size+=c.length;if(size>limit){reject(new Error('Payload demasiado grande'));req.destroy();return;}chunks.push(c);});
    req.on('end',()=>{if(!chunks.length)return resolve({});try{resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))}catch{reject(new Error('JSON inválido'))}});
    req.on('error',reject);
  });
}
function parseCookies(req){const out={};for(const c of (req.headers.cookie||'').split(';')){const i=c.indexOf('=');if(i>0)out[c.slice(0,i).trim()]=decodeURIComponent(c.slice(i+1).trim());}return out;}
function bearer(req){const a=req.headers.authorization||'';return a.startsWith('Bearer ')?a.slice(7).trim():'';}
function addDays(value,days){const d=new Date(value);d.setUTCDate(d.getUTCDate()+days);return d.toISOString();}
function addMonths(value,months){const d=new Date(value);d.setUTCMonth(d.getUTCMonth()+months);return d.toISOString();}
function daysRemaining(expiry){if(!expiry)return null;return (Date.parse(expiry)-Date.now())/(86400*1000);}

function addMinutes(value,minutes){const d=new Date(value);d.setUTCMinutes(d.getUTCMinutes()+minutes);return d.toISOString();}
function getSetting(key,fallback=''){const r=db.prepare('SELECT setting_value FROM settings WHERE setting_key=?').get(key);return r?r.setting_value:fallback;}
function setSetting(key,value){db.prepare(`INSERT INTO settings(setting_key,setting_value,updated_at) VALUES (?,?,?) ON CONFLICT(setting_key) DO UPDATE SET setting_value=excluded.setting_value,updated_at=excluded.updated_at`).run(key,String(value),nowIso());}
function boolSetting(key,fallback=false){return getSetting(key,fallback?'1':'0')==='1';}

const PANEL_ROLE_LEVELS=[1,2,3,4];
function enabledPanelRoleLevels(){
  try{
    const parsed=JSON.parse(getSetting('panel_enabled_role_levels','[1,2,3,4]'));
    if(!Array.isArray(parsed))return [...PANEL_ROLE_LEVELS];
    return [...new Set(parsed.map(Number).filter(x=>PANEL_ROLE_LEVELS.includes(x)))].sort((a,b)=>a-b);
  }catch{return [...PANEL_ROLE_LEVELS];}
}
function isPanelRoleCreationEnabled(level){return enabledPanelRoleLevels().includes(Number(level));}
function creatablePanelRoleLevelsFor(actor){
  const enabled=enabledPanelRoleLevels();
  if(Number(actor?.role_level)===1)return enabled;
  return enabled.filter(level=>level>Number(actor?.role_level||99));
}

// ---- v0.9.42 / Seguridad de reproducción CO-CHI ----
function playbackGeneration(){
  const n=Number(getSetting('playback_generation','1'));
  return Number.isInteger(n)&&n>0?n:1;
}
function gatewayConfigured(){
  return /^https:\/\//i.test(COCHI_GATEWAY_URL)
    && COCHI_GATEWAY_MASTER_SECRET.length>=24
    && COCHI_GATEWAY_CONTROL_SECRET.length>=16;
}
function playbackSecurityState(){
  return {
    enabled: boolSetting('playback_security_enabled',false),
    generation: playbackGeneration(),
    gatewayUrl: COCHI_GATEWAY_URL,
    gatewayConfigured: gatewayConfigured(),
    ticketTtlSeconds: COCHI_GATEWAY_TICKET_TTL_SECONDS,
  };
}
function b64url(buf){return Buffer.from(buf).toString('base64url');}
function gatewayAesKey(){return crypto.createHash('sha256').update(COCHI_GATEWAY_MASTER_SECRET,'utf8').digest();}
function gatewayTicket(payload){
  if(!gatewayConfigured())throw new Error('Gateway de reproducción no configurado');
  const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',gatewayAesKey(),iv);
  const plain=Buffer.from(JSON.stringify(payload),'utf8');
  const enc=Buffer.concat([cipher.update(plain),cipher.final()]),tag=cipher.getAuthTag();
  return `${b64url(iv)}.${b64url(enc)}.${b64url(tag)}`;
}
function httpStreamUrl(v){
  const x=String(v||'').trim();
  return /^https?:\/\//i.test(x) && !/youtube\.com\/|youtu\.be\//i.test(x);
}
function objectPlaybackHeaders(obj){
  if(!obj||typeof obj!=='object')return {};
  const out={};
  const merge=(src)=>{
    if(!src||typeof src!=='object'||Array.isArray(src))return;
    for(const [k,v] of Object.entries(src)){
      if(v===undefined||v===null||!String(v).trim())continue;
      out[String(k).slice(0,80)]=String(v).slice(0,4000);
    }
  };

  // Formato moderno: { headers: { Origin, Referer, User-Agent, ... } }
  merge(obj.headers);

  // Formato histórico de TV1/TV2 (también reconocido por la APK):
  // { drm_header: [ { Origin, Referer, User-Agent, ... } ] }
  // v0.9.46 no copiaba estos headers al ticket del Gateway, por lo que
  // el Worker pedía el MPD/HLS al origen sin los headers requeridos.
  if(Array.isArray(obj.drm_header)){
    for(const entry of obj.drm_header)merge(entry);
  }else{
    merge(obj.drm_header);
  }

  // Alias tolerados para fuentes importadas de otros formatos.
  if(Array.isArray(obj.drm_headers)){
    for(const entry of obj.drm_headers)merge(entry);
  }else{
    merge(obj.drm_headers);
  }

  for(const [srcKey,dstKey] of [['referer','Referer'],['referrer','Referer'],['origin','Origin'],['userAgent','User-Agent'],['user_agent','User-Agent'],['cookie','Cookie']]){
    if(obj[srcKey]!==undefined&&obj[srcKey]!==null&&String(obj[srcKey]).trim()&&!out[dstKey])out[dstKey]=String(obj[srcKey]).slice(0,4000);
  }
  return out;
}
function gatewayUrlFor(originUrl,headers,generation){
  const exp=Math.floor(Date.now()/1000)+COCHI_GATEWAY_TICKET_TTL_SECONDS;
  const t=gatewayTicket({u:String(originUrl),h:headers||{},g:Number(generation),e:exp});
  return `${COCHI_GATEWAY_URL}/v1/p/${t}`;
}
function securePlaybackObject(value,generation){
  if(Array.isArray(value))return value.map(v=>securePlaybackObject(v,generation));
  if(!value||typeof value!=='object')return value;
  const out={};
  const headers=objectPlaybackHeaders(value);
  for(const [k,v] of Object.entries(value)){
    if(['url','uri','stream'].includes(k)&&typeof v==='string'&&httpStreamUrl(v)&&!String(v).startsWith(COCHI_GATEWAY_URL+'/')){
      out[k]=gatewayUrlFor(v,headers,generation);
    }else if(k==='backupUris'&&Array.isArray(v)){
      out[k]=v.map(x=>httpStreamUrl(x)?gatewayUrlFor(x,headers,generation):x);
    }else{
      out[k]=securePlaybackObject(v,generation);
    }
  }
  return out;
}
async function syncGatewayGeneration(generation){
  if(!gatewayConfigured())throw new Error('Faltan variables COCHI_GATEWAY_* en Railway');
  const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),10000);
  try{
    const r=await fetch(`${COCHI_GATEWAY_URL}/admin/generation`,{
      method:'POST',signal:ctl.signal,
      headers:{'Authorization':`Bearer ${COCHI_GATEWAY_CONTROL_SECRET}`,'Content-Type':'application/json','User-Agent':`CO-CHI-PANEL/${VERSION}`},
      body:JSON.stringify({generation:Number(generation)})
    });
    let body={};try{body=await r.json()}catch{}
    if(!r.ok||body.ok!==true)throw new Error(body.error||`Worker respondió HTTP ${r.status}`);
    return body;
  }finally{clearTimeout(timer)}
}
async function gatewayHealth(){
  if(!/^https:\/\//i.test(COCHI_GATEWAY_URL))return {ok:false,error:'URL no configurada'};
  const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),7000);
  try{
    const r=await fetch(`${COCHI_GATEWAY_URL}/health`,{signal:ctl.signal,headers:{'User-Agent':`CO-CHI-PANEL/${VERSION}`}});
    let body={};try{body=await r.json()}catch{}
    return {ok:r.ok&&body.ok===true,status:r.status,...body};
  }catch(e){return {ok:false,error:e.message||'Worker no disponible'};}finally{clearTimeout(timer)}
}


// ---- v0.9.46 / Gateways dedicados TV1-TV2 ----
function tvDedicatedConfig(sourceKey){
  if(sourceKey==='tv1')return {sourceKey:'tv1',label:'TV1',url:COCHI_TV1_GATEWAY_URL,secret:COCHI_TV1_GATEWAY_SECRET};
  if(sourceKey==='tv2')return {sourceKey:'tv2',label:'TV2',url:COCHI_TV2_GATEWAY_URL,secret:COCHI_TV2_GATEWAY_SECRET};
  return {sourceKey,label:String(sourceKey||'').toUpperCase(),url:'',secret:''};
}
function tvDedicatedConfigured(sourceKey){
  const c=tvDedicatedConfig(sourceKey);
  return /^https:\/\//i.test(c.url)&&c.secret.length>=24;
}
function tvDedicatedEnabled(sourceKey){
  return boolSetting(`tv_gateway_${sourceKey}_enabled`,false);
}
function tvDedicatedAesKey(secret){
  const raw=String(secret||'').trim();
  if(/^[0-9a-f]{64}$/i.test(raw))return Buffer.from(raw,'hex');
  return crypto.createHash('sha256').update(raw,'utf8').digest();
}
function tvDedicatedTicket(payload,secret){
  const iv=crypto.randomBytes(12);
  const cipher=crypto.createCipheriv('aes-256-gcm',tvDedicatedAesKey(secret),iv);
  const enc=Buffer.concat([cipher.update(Buffer.from(JSON.stringify(payload),'utf8')),cipher.final()]);
  const tag=cipher.getAuthTag();
  return Buffer.concat([iv,enc,tag]).toString('base64url');
}
function splitTvOrigin(raw){
  const u=new URL(String(raw));
  const pathName=u.pathname||'/';
  const slash=pathName.lastIndexOf('/');
  return {
    base:`${u.protocol}//${u.host}${pathName.slice(0,slash+1)||'/'}`,
    file:pathName.slice(slash+1),
    query:u.search||''
  };
}
function tvDedicatedUrlFor(originUrl,headers,sourceKey){
  const cfg=tvDedicatedConfig(sourceKey);
  if(!tvDedicatedConfigured(sourceKey))throw new Error(`Gateway ${cfg.label} no configurado`);
  const p=splitTvOrigin(originUrl);
  const exp=Math.floor(Date.now()/1000)+COCHI_TV_GATEWAY_TTL_SECONDS;
  const ticket=tvDedicatedTicket({v:1,b:p.base,q:p.query,h:headers||{},e:exp},cfg.secret);
  return `${cfg.url}/r/${ticket}/${encodeURIComponent(p.file)}`;
}
function tvDedicatedPlaybackObject(value,sourceKey){
  if(Array.isArray(value))return value.map(v=>tvDedicatedPlaybackObject(v,sourceKey));
  if(!value||typeof value!=='object')return value;
  const out={};
  const headers=objectPlaybackHeaders(value);
  const cfg=tvDedicatedConfig(sourceKey);
  for(const [k,v] of Object.entries(value)){
    if(['url','uri','stream'].includes(k)&&typeof v==='string'&&httpStreamUrl(v)&&!String(v).startsWith(cfg.url+'/')){
      out[k]=tvDedicatedUrlFor(v,headers,sourceKey);
    }else if(k==='backupUris'&&Array.isArray(v)){
      out[k]=v.map(x=>httpStreamUrl(x)?tvDedicatedUrlFor(x,headers,sourceKey):x);
    }else{
      out[k]=tvDedicatedPlaybackObject(v,sourceKey);
    }
  }
  return out;
}
async function tvDedicatedHealth(sourceKey){
  const cfg=tvDedicatedConfig(sourceKey);
  if(!/^https:\/\//i.test(cfg.url))return {ok:false,error:'URL no configurada'};
  const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),7000);
  try{
    const r=await fetch(`${cfg.url}/health`,{signal:ctl.signal,headers:{'User-Agent':`CO-CHI-PANEL/${VERSION}`}});
    let body={};try{body=await r.json()}catch{}
    return {ok:r.ok&&body.ok===true&&body.configured===true,status:r.status,...body};
  }catch(e){return {ok:false,error:e.message||'Worker no disponible'};}finally{clearTimeout(timer)}
}
async function tvDedicatedAdminState(sourceKey){
  const cfg=tvDedicatedConfig(sourceKey);
  return {
    sourceKey,
    label:cfg.label,
    enabled:tvDedicatedEnabled(sourceKey),
    configured:tvDedicatedConfigured(sourceKey),
    gatewayUrl:cfg.url,
    ticketTtlSeconds:COCHI_TV_GATEWAY_TTL_SECONDS,
    worker:await tvDedicatedHealth(sourceKey)
  };
}

// ---- v0.9.44 / Cifrado TV V2 exclusivo CO-CHI ----
// TV1/TV2 pueden solicitar una respuesta cifrada por sesión con ECDH P-256 + AES-256-GCM.
// No existe una clave estática de descifrado en la APK: cada solicitud usa una pareja EC temporal.
const COCHI_TV_CRYPTO_FORMAT='cochi-tv-crypto-2';
const COCHI_TV_CRYPTO_ALG='ECDH-P256+A256GCM';
const COCHI_TV_CRYPTO_SALT=crypto.createHash('sha256').update('COCHI-TV-CATALOG-V2-SALT','utf8').digest();
function tvCryptoRequested(req,sourceKey){
  if(sourceKey!=='tv1'&&sourceKey!=='tv2')return false;
  return String(req.headers['x-cochi-tv-crypto']||'').trim()==='2'
    && String(req.headers['x-cochi-tv-pub']||'').trim().length>40;
}
function tvCatalogEnvelope(clear,sourceKey,clientPublicText){
  const encoded=String(clientPublicText||'').trim();
  if(encoded.length<40||encoded.length>1024)throw new Error('Clave pública temporal TV inválida');
  let clientPublic;
  try{
    clientPublic=crypto.createPublicKey({key:Buffer.from(encoded,'base64url'),format:'der',type:'spki'});
  }catch{throw new Error('Clave pública temporal TV no reconocida');}
  if(clientPublic.asymmetricKeyType!=='ec')throw new Error('La clave temporal TV debe ser EC P-256');
  const details=clientPublic.asymmetricKeyDetails||{};
  if(details.namedCurve&&details.namedCurve!=='prime256v1')throw new Error('Curva TV no permitida');
  const {publicKey,privateKey}=crypto.generateKeyPairSync('ec',{namedCurve:'prime256v1'});
  const shared=crypto.diffieHellman({privateKey,publicKey:clientPublic});
  const info=Buffer.from(`COCHI-TV-CATALOG-V2|${sourceKey}`,'utf8');
  const key=Buffer.from(crypto.hkdfSync('sha256',shared,COCHI_TV_CRYPTO_SALT,info,32));
  const iv=crypto.randomBytes(12);
  const cipher=crypto.createCipheriv('aes-256-gcm',key,iv);
  const aad=Buffer.from(`${COCHI_TV_CRYPTO_FORMAT}|${sourceKey}|1`,'utf8');
  cipher.setAAD(aad);
  const plain=Buffer.from(JSON.stringify(clear),'utf8');
  const encrypted=Buffer.concat([cipher.update(plain),cipher.final()]);
  const tag=cipher.getAuthTag();
  const serverPublic=publicKey.export({format:'der',type:'spki'});
  return {
    v:COCHI_TV_CRYPTO_FORMAT,
    alg:COCHI_TV_CRYPTO_ALG,
    rev:1,
    src:sourceKey,
    spk:Buffer.from(serverPublic).toString('base64url'),
    iv:iv.toString('base64url'),
    ct:encrypted.toString('base64url'),
    tag:tag.toString('base64url')
  };
}

function normalizeCategoryKey(value){return String(value||'').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ');}
function demoBlockedCategories(){
  try{const parsed=JSON.parse(getSetting('demo_blocked_categories','[]'));return Array.isArray(parsed)?[...new Set(parsed.map(x=>String(x||'').trim()).filter(Boolean))]:[];}catch{return [];}
}
function publishedCategoryNames(){
  const names=new Map();
  for(const row of db.prepare('SELECT source_key,json_text FROM published_content').all()){
    if(!row?.json_text)continue;
    try{for(const group of JSON.parse(row.json_text)){const name=String(group?.name||'').trim();if(name&&!names.has(normalizeCategoryKey(name)))names.set(normalizeCategoryKey(name),name);}}catch{}
  }
  return [...names.values()].sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}));
}
function demoEntryCategoryName(entry){
  if(!entry||typeof entry!=='object')return '';
  // Las distintas fuentes históricas de CO-CHI no siempre usan la misma clave.
  // Admitimos los nombres usados por TV/Películas/Series y por importadores antiguos.
  for(const key of ['category','categoryName','group','groupName','genre']){
    const value=entry[key];
    if(typeof value==='string'&&value.trim())return value.trim();
  }
  return '';
}
function demoGroupName(entry){
  if(!entry||typeof entry!=='object')return '';
  for(const key of ['name','category','categoryName','group','groupName','title']){
    const value=entry[key];
    if(typeof value==='string'&&value.trim())return value.trim();
  }
  return '';
}
function filterDemoCategories(payload){
  const blocked=new Set(demoBlockedCategories().map(normalizeCategoryKey));
  if(!blocked.size)return payload;
  const isBlocked=value=>blocked.has(normalizeCategoryKey(value));

  // CO-CHI publica el contenido por categorías completas:
  // [{ name:'DEPORTES', samples:[...] }, ...].
  // La restricción de demos debe quitar SOLAMENTE el grupo cuya categoría
  // coincide exactamente con una categoría bloqueada. No se inspeccionan
  // títulos, géneros ni campos internos de canales/películas/series, porque
  // eso puede vaciar listas válidas por coincidencias accidentales.
  if(Array.isArray(payload)){
    return payload.filter(group=>{
      if(!group||typeof group!=='object')return true;
      const category=typeof group.name==='string'?group.name.trim():'';
      return !category||!isBlocked(category);
    });
  }

  // Compatibilidad defensiva con publicaciones envueltas. Solo filtramos
  // arrays que representen grupos/categorías, conservando intactos los ítems.
  if(payload&&typeof payload==='object'){
    const out={...payload};
    for(const key of ['categories','groups']){
      if(Array.isArray(out[key]))out[key]=filterDemoCategories(out[key]);
    }
    return out;
  }
  return payload;
}
function audit(actorId,action,targetType,targetId=null,detail=''){db.prepare('INSERT INTO security_audit(actor_account_id,action,target_type,target_id,detail,created_at) VALUES (?,?,?,?,?,?)').run(actorId,action,targetType,targetId,detail,nowIso());}

function deleteClientRecord(clientId,{actorId=null,reason='Eliminación manual',automatic=false}={}){
  const c=db.prepare(`SELECT c.*,a.name owner_name FROM clients c JOIN accounts a ON a.id=c.owner_account_id WHERE c.id=?`).get(clientId);
  if(!c)return false;
  const deviceIds=db.prepare('SELECT id FROM client_devices WHERE client_id=?').all(clientId).map(x=>x.id);
  db.exec('BEGIN');
  try{
    db.prepare('INSERT INTO deleted_clients_history(original_client_id,client_name,owner_account_id,owner_name,expired_at,deleted_at,deleted_by_account_id,delete_reason,automatic) VALUES (?,?,?,?,?,?,?,?,?)')
      .run(c.id,c.name,c.owner_account_id,c.owner_name,c.expires_at,nowIso(),actorId,reason,automatic?1:0);
    for(const id of deviceIds){
      db.prepare('DELETE FROM client_sessions WHERE device_id=?').run(id);
      db.prepare('DELETE FROM device_demos WHERE device_id=?').run(id);
    }
    db.prepare('DELETE FROM client_devices WHERE client_id=?').run(clientId);
    db.prepare('DELETE FROM clients WHERE id=?').run(clientId);
    db.exec('COMMIT');
  }catch(e){db.exec('ROLLBACK');throw e;}
  if(actorId) audit(actorId,'client_deleted','client',clientId,`${c.name}; ${reason}`);
  return true;
}
function cleanupExpiredClients(){
  const cutoff=new Date(Date.now()-15*86400000).toISOString();
  const rows=db.prepare('SELECT id,name FROM clients WHERE expires_at IS NOT NULL AND expires_at<?').all(cutoff);
  for(const c of rows){try{deleteClientRecord(c.id,{reason:'Vencido hace más de 15 días',automatic:true});console.log(`[limpieza] Cliente eliminado: ${c.name} (#${c.id})`);}catch(e){console.error('[limpieza] No se pudo eliminar cliente',c.id,e.message);}}
  return rows.length;
}
function validPin(pin){return /^\d{4,8}$/.test(String(pin||''));}
function hashPin(pin){const salt=crypto.randomBytes(16).toString('hex');const hash=crypto.scryptSync(String(pin),salt,32).toString('hex');return `scrypt$${salt}$${hash}`;}
function verifyPin(pin,stored){
  const parts=String(stored||'').split('$');if(parts.length!==3||parts[0]!=='scrypt')return false;
  try{const got=crypto.scryptSync(String(pin),parts[1],32);const want=Buffer.from(parts[2],'hex');return got.length===want.length&&crypto.timingSafeEqual(got,want);}catch{return false;}
}

function generateCode(table='accounts'){
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for(let n=0;n<100;n++){
    let a='',b='';for(let i=0;i<4;i++)a+=alphabet[crypto.randomInt(alphabet.length)];for(let i=0;i<4;i++)b+=alphabet[crypto.randomInt(alphabet.length)];
    const code=`${a}-${b}`;
    const col=table==='accounts'?'activation_code':'activation_code';
    if(!db.prepare(`SELECT 1 FROM ${table} WHERE ${col}=?`).get(code))return code;
  }
  throw new Error('No se pudo generar código');
}

function accountRaw(id){return db.prepare('SELECT * FROM accounts WHERE id=?').get(id);}
function refreshInactivity(account){
  if(!account || account.role_level===1)return account;
  const base=account.last_credit_received_at || account.created_at;
  const due=Date.parse(addMonths(base,2));
  const should=Date.now()>due ? 1 : 0;
  if(Number(account.inactivity_blocked)!==should){
    db.prepare('UPDATE accounts SET inactivity_blocked=?,updated_at=? WHERE id=?').run(should,nowIso(),account.id);
    account={...account,inactivity_blocked:should};
  }
  return account;
}
function accountAccessState(account){
  account=refreshInactivity(account);
  if(!account)return {ok:false,reason:'account_not_found'};
  if(account.deleted_at)return {ok:false,reason:'panel_deleted'};
  if(account.manual_blocked)return {ok:false,reason:'manual_block',blockReason:account.block_reason||''};
  if(!account.active)return {ok:false,reason:'account_disabled'};
  if(account.inactivity_blocked)return {ok:false,reason:'no_credit_load_for_two_months'};
  return {ok:true,reason:'ok'};
}
function rootAdminId(){
  const r=db.prepare("SELECT id FROM accounts WHERE role_level=1 AND parent_id IS NULL ORDER BY id ASC LIMIT 1").get();
  return r?Number(r.id):null;
}
function isRootAdminAccount(a){return Boolean(a&&Number(a.id)===rootAdminId());}

function accountPublic(a){
  a=refreshInactivity({...a});
  const nextBlock=a.role_level===1?null:addMonths(a.last_credit_received_at||a.created_at,2);
  return {...a,role_name:roles[a.role_level],active:Boolean(a.active),inactivity_blocked:Boolean(a.inactivity_blocked),manual_blocked:Boolean(a.manual_blocked),block_reason:a.block_reason||'',deleted:Boolean(a.deleted_at),next_inactivity_block_at:nextBlock,is_root_admin:isRootAdminAccount(a),credits_unlimited:Number(a.role_level)===1};
}
function canEditAccount(actor,target){return actor.role_level===1 || target.parent_id===actor.id;}
function canManageDirectPanel(actor,target){return Boolean(actor&&target&&!isRootAdminAccount(target)&&(actor.role_level===1 || Number(target.parent_id)===Number(actor.id)));}
function canEditClient(actor,client){return actor.role_level===1 || client.owner_account_id===actor.id;}
function accountIsInBranch(actor,targetAccountId){
  if(!actor||!targetAccountId)return false;
  if(Number(actor.role_level)===1)return true;
  let cur=accountRaw(Number(targetAccountId)),guard=0;
  while(cur&&guard++<100){
    if(Number(cur.id)===Number(actor.id))return true;
    cur=cur.parent_id?accountRaw(Number(cur.parent_id)):null;
  }
  return false;
}
function canManageClientDevice(actor,client){return Boolean(actor&&client&&(Number(actor.role_level)===1||accountIsInBranch(actor,client.owner_account_id)));}
function clientDeviceLimit(c){return Math.max(CLIENT_DEVICE_LIMIT,Number(c?.device_limit||CLIENT_DEVICE_LIMIT));}
function clientRenewCreditCost(c){return Math.max(1,Math.ceil(clientDeviceLimit(c)/2));}
function monthStartIso(){const d=new Date();return new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),1)).toISOString();}
function clientDeviceChangesThisMonth(clientId){return Number(db.prepare('SELECT COUNT(*) n FROM client_device_changes WHERE client_id=? AND created_at>=?').get(clientId,monthStartIso()).n);}
function demoEverUsedByUid(uid){return Boolean(db.prepare('SELECT 1 FROM demo_device_history WHERE device_uid=? AND reset_by_admin_at IS NULL').get(uid));}
function canCreateLevel(actor,level){level=Number(level);if(!PANEL_ROLE_LEVELS.includes(level)||!isPanelRoleCreationEnabled(level))return false;if(Number(actor.role_level)===1)return true;return level>Number(actor.role_level); }
function wouldCycle(accountId,newParentId){
  let cur=newParentId; let guard=0;
  while(cur && guard++<100){if(cur===accountId)return true;const r=accountRaw(cur);cur=r?r.parent_id:null;}
  return false;
}

function createPanelSession(panelDeviceId){
  db.prepare('DELETE FROM panel_sessions WHERE panel_device_id=? OR expires_at<=?').run(panelDeviceId,nowIso());
  const token=randomToken(); const exp=addDays(nowIso(),7);
  db.prepare('INSERT INTO panel_sessions(panel_device_id,token_hash,expires_at,created_at) VALUES (?,?,?,?)').run(panelDeviceId,sha(token),exp,nowIso());
  return {token,expiresAt:exp};
}
function panelSessionFromReq(req){
  const t=parseCookies(req).cochi_panel_session || bearer(req); if(!t)return null;
  const row=db.prepare(`SELECT ps.id session_id,ps.expires_at,pd.id panel_device_id,pd.device_uid,pd.active device_active,
    a.* FROM panel_sessions ps JOIN panel_devices pd ON pd.id=ps.panel_device_id JOIN accounts a ON a.id=pd.account_id WHERE ps.token_hash=?`).get(sha(t));
  if(!row)return null;
  if(Date.parse(row.expires_at)<=Date.now()){db.prepare('DELETE FROM panel_sessions WHERE id=?').run(row.session_id);return null;}
  if(!row.device_active)return null;
  const a=accountPublic(row); const st=accountAccessState(a); if(!st.ok)return {blocked:true,reason:st.reason,account:a};
  db.prepare('UPDATE panel_devices SET last_seen_at=?,updated_at=? WHERE id=?').run(nowIso(),nowIso(),row.panel_device_id);
  return {blocked:false,account:a,panelDeviceId:row.panel_device_id};
}
function blockerInfo(account){
  if(!account?.blocked_by_account_id)return {blockedByName:'',blockedByRole:''};
  const b=accountRaw(account.blocked_by_account_id);
  return b?{blockedByName:b.name||'',blockedByRole:roles[b.role_level]||''}:{blockedByName:'',blockedByRole:''};
}
function requirePanel(req,res){const st=panelSessionFromReq(req);if(!st){sendJson(res,401,{error:'Panel no activado'});return null;}if(st.blocked){const bi=blockerInfo(st.account);sendJson(res,423,{error:'Panel bloqueado',reason:st.reason,blockReason:st.account?.block_reason||'',...bi});return null;}return st;}
function requireAdmin(req,res){const s=requirePanel(req,res);if(!s)return null;if(s.account.role_level!==1){sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede realizar esta acción'});return null;}return s;}

function activePromotionFor(level){
  const now=Date.now();
  const rows=db.prepare('SELECT * FROM promotions WHERE active=1 ORDER BY id DESC').all();
  return rows.find(p=>Date.parse(p.starts_at)<=now && Date.parse(p.ends_at)>=now && String(p.target_levels).split(',').map(Number).includes(Number(level))) || null;
}
function promoBonus(amount,p){return p?Math.floor(amount*Number(p.percent_bonus)/100):0;}

function clientRow(id){return db.prepare(`SELECT c.*,a.name owner_name,a.credits owner_credits,a.role_level owner_role FROM clients c JOIN accounts a ON a.id=c.owner_account_id WHERE c.id=?`).get(id);}
function clientAccessState(c){
  if(!c||!c.active)return {ok:false,reason:'client_disabled'};
  if(!c.expires_at)return {ok:false,reason:'client_no_service'};
  if(Date.parse(c.expires_at)<=Date.now())return {ok:false,reason:'client_expired'};
  const owner=accountRaw(c.owner_account_id); const o=accountAccessState(owner); if(!o.ok)return {ok:false,reason:'owner_'+o.reason};
  return {ok:true,reason:'ok',mode:'paid',expiresAt:c.expires_at};
}
function demoRow(deviceId){return db.prepare('SELECT * FROM device_demos WHERE device_id=?').get(deviceId);}
function demoInfo(deviceId){
  const d=demoRow(deviceId);if(!d)return {used:false,active:false,startedAt:null,expiresAt:null,remainingSeconds:0};
  const remaining=Math.max(0,Math.floor((Date.parse(d.expires_at)-Date.now())/1000));
  return {used:true,active:remaining>0,startedAt:d.started_at,expiresAt:d.expires_at,remainingSeconds:remaining,grantedByAccountId:d.granted_by_account_id};
}
function configuredDemoMinutes(){
  const n=Number(getSetting('demo_duration_minutes',String(DEMO_DURATION_MINUTES)));
  return DEMO_ALLOWED_MINUTES.includes(n)?n:DEMO_DURATION_MINUTES;
}
function grantConfiguredDemoToDevice(d,c,{grantedByAccountId=rootAdminId()}={}){
  if(!d||!c)return {granted:false,reason:'missing_device_or_client'};
  if(!boolSetting('demos_enabled',false))return {granted:false,reason:'demos_disabled'};
  if(!c.active)return {granted:false,reason:'client_disabled'};
  if(d.status==='blocked')return {granted:false,reason:'device_blocked'};
  if(clientAccessState(c).ok)return {granted:false,reason:'paid_service_active'};

  // v0.9.37: si el demo ya existe y todavía está vigente, la vinculación debe
  // recuperar el estado ACTIVE en vez de dejar el dispositivo como PENDING.
  const existing=demoRow(d.id);
  if(existing){
    const remaining=Math.max(0,Math.floor((Date.parse(existing.expires_at)-Date.now())/1000));
    if(remaining>0){
      const t=nowIso();
      db.prepare("UPDATE client_devices SET client_id=?,status='active',updated_at=? WHERE id=?").run(c.id,t,d.id);
      return {granted:true,reason:'demo_already_active',startedAt:existing.started_at,expiresAt:existing.expires_at,durationMinutes:Math.max(1,Math.round((Date.parse(existing.expires_at)-Date.parse(existing.started_at))/60000)),existing:true};
    }
    return {granted:false,reason:'demo_already_used'};
  }
  if(demoEverUsedByUid(d.device_uid))return {granted:false,reason:'demo_already_used'};

  const minutes=configuredDemoMinutes(),t=nowIso(),exp=addMinutes(t,minutes);
  db.prepare('INSERT INTO device_demos(device_id,client_id,granted_by_account_id,started_at,expires_at,created_at) VALUES (?,?,?,?,?,?)').run(d.id,c.id,grantedByAccountId,t,exp,t);
  db.prepare("INSERT INTO demo_device_history(device_uid,first_demo_at,last_demo_at,reset_by_admin_at) VALUES (?,?,?,NULL) ON CONFLICT(device_uid) DO UPDATE SET last_demo_at=excluded.last_demo_at,reset_by_admin_at=NULL").run(d.device_uid,t,t);
  db.prepare("UPDATE client_devices SET client_id=?,status='active',updated_at=? WHERE id=?").run(c.id,t,d.id);
  return {granted:true,reason:'ok',startedAt:t,expiresAt:exp,durationMinutes:minutes};
}
// v0.9.39: reintenta el demo automático para un dispositivo ya vinculado que siga PENDING.
function ensureAutomaticDemoForLinkedDevice(d){
  if(!d||!d.client_id||d.status==='blocked')return {granted:false,reason:'not_eligible'};
  const c=clientRow(d.client_id);if(!c)return {granted:false,reason:'client_not_found'};
  if(clientAccessState(c).ok)return {granted:false,reason:'paid_service_active'};
  const di=demoInfo(d.id);if(di.active)return {granted:true,reason:'demo_already_active',expiresAt:di.expiresAt,existing:true};
  if(!boolSetting('demos_enabled',false))return {granted:false,reason:'demos_disabled'};

  // v0.9.40: reparación única del estado heredado de las versiones de prueba.
  // Algunas desvinculaciones anteriores podían dejar demo_device_history sin un
  // device_demos asociado. Eso hacía que un dispositivo actualmente vinculado y
  // PENDING quedara bloqueado para siempre aunque nunca hubiera recibido el demo
  // en esta vinculación. Reparamos ese huérfano una sola vez por UID y dejamos
  // una marca persistente; después de conceder el demo, el historial normal vuelve
  // a impedir una segunda concesión.
  if(d.status==='pending'&&!demoRow(d.id)&&demoEverUsedByUid(d.device_uid)){
    const repairKey='demo_legacy_repair_0940_'+sha(String(d.device_uid)).slice(0,24);
    if(getSetting(repairKey,'0')!=='1'){
      // v0.9.50: esta reparación puede ejecutarse mientras assign-by-code ya
      // está dentro de una transacción. SAVEPOINT funciona tanto anidado como
      // fuera de una transacción y evita "cannot start a transaction within a transaction".
      db.exec('SAVEPOINT demo_legacy_repair_0940');
      try{
        db.prepare('DELETE FROM demo_device_history WHERE device_uid=?').run(d.device_uid);
        setSetting(repairKey,'1');
        db.exec('RELEASE SAVEPOINT demo_legacy_repair_0940');
      }catch(e){
        try{db.exec('ROLLBACK TO SAVEPOINT demo_legacy_repair_0940')}catch{}
        try{db.exec('RELEASE SAVEPOINT demo_legacy_repair_0940')}catch{}
        throw e;
      }
    }
  }
  return grantConfiguredDemoToDevice(d,c,{grantedByAccountId:rootAdminId()});
}
function deviceAccessState(d,c){
  if(!d)return {ok:false,reason:'device_not_found'};
  if(d.status==='blocked')return {ok:false,reason:'device_blocked'};
  if(!c)return {ok:false,reason:'device_not_linked'};
  const paid=clientAccessState(c);if(paid.ok)return paid;
  const di=demoInfo(d.id);
  if(di.active&&c.active){const owner=accountAccessState(accountRaw(c.owner_account_id));if(owner.ok)return {ok:true,reason:'ok',mode:'demo',expiresAt:di.expiresAt,demo:di};}
  return {ok:false,reason:di.used?'demo_expired':paid.reason,mode:di.used?'demo':null,expiresAt:di.expiresAt||null,demo:di};
}
function refreshDeviceState(d){
  if(!d||d.status==='blocked'||!d.client_id)return d;
  const c=clientRow(d.client_id);const access=deviceAccessState(d,c);const desired=access.ok?'active':'pending';
  if(d.status!==desired){db.prepare('UPDATE client_devices SET status=?,updated_at=? WHERE id=?').run(desired,nowIso(),d.id);d={...d,status:desired};}
  return d;
}
function refreshClientDevices(clientId){for(const d of db.prepare('SELECT * FROM client_devices WHERE client_id=?').all(clientId))refreshDeviceState(d);}
function clientStatusSummary(c){
  refreshClientDevices(c.id);
  const linked=Number(db.prepare("SELECT COUNT(*) n FROM client_devices WHERE client_id=? AND status IN ('pending','active')").get(c.id).n);
  const activeDevices=Number(db.prepare("SELECT COUNT(*) n FROM client_devices WHERE client_id=? AND status='active'").get(c.id).n);
  const demoActive=Number(db.prepare(`SELECT COUNT(*) n FROM device_demos dd JOIN client_devices cd ON cd.id=dd.device_id WHERE dd.client_id=? AND cd.status<>'blocked' AND dd.expires_at>?`).get(c.id,nowIso()).n);
  const demoUsed=Number(db.prepare('SELECT COUNT(*) n FROM device_demos WHERE client_id=?').get(c.id).n);
  const paid=clientAccessState(c);
  let code='no_service',label='SIN SERVICIO';
  if(!c.active){code='blocked';label='BLOQUEADO';}
  else if(paid.ok&&linked===0){code='pending_device';label='PENDIENTE DE DISPOSITIVO';}
  else if(paid.ok&&activeDevices>0){code='active';label='ACTIVO';}
  else if(demoActive>0){code='demo_active';label='DEMO ACTIVO';}
  else if(c.expires_at&&Date.parse(c.expires_at)<=Date.now()){code='expired';label='VENCIDO';}
  else if(demoUsed>0){code='demo_expired';label='DEMO VENCIDO';}
  else if(linked===0){code='no_code';label='SIN CÓDIGO';}
  else if(String(paid.reason||'').startsWith('owner_')){code='blocked';label='BLOQUEADO';}
  return {display_status:label,display_status_code:code,device_count:activeDevices,linked_device_count:linked,device_limit:clientDeviceLimit(c),device_changes_this_month:clientDeviceChangesThisMonth(c.id),device_changes_remaining:Math.max(0,2-clientDeviceChangesThisMonth(c.id)),renew_credit_cost:clientRenewCreditCost(c),demo_active_count:demoActive,demo_used_count:demoUsed,service_active:paid.ok};
}
function effectiveAdult(c){
  const globalEnabled=boolSetting('adult_lock_enabled',false);
  const policy=['inherit','force_on','force_off'].includes(c?.adult_policy)?c.adult_policy:'inherit';
  const enabled=policy==='force_on'?true:policy==='force_off'?false:globalEnabled;
  const pinHash=c?.adult_pin_hash||getSetting('adult_pin_hash','');
  return {enabled,policy,pinConfigured:Boolean(pinHash),pinHash,locked:Boolean(c?.adult_locked),failedAttempts:Number(c?.adult_fail_count||0),maxAttempts:Math.max(1,Number(getSetting('adult_max_attempts',String(DEFAULT_ADULT_MAX_ATTEMPTS)))||DEFAULT_ADULT_MAX_ATTEMPTS)};
}

function clientDeviceByCred(uid,secret){
  const d=db.prepare(`SELECT cd.*,c.name client_name,c.active client_active,c.expires_at client_expires_at,c.owner_account_id
    FROM client_devices cd LEFT JOIN clients c ON c.id=cd.client_id WHERE cd.device_uid=?`).get(uid);
  if(!d)return null;
  const a=Buffer.from(d.secret_hash,'hex'),b=Buffer.from(sha(secret||''),'hex');
  if(a.length!==b.length || !crypto.timingSafeEqual(a,b))return null;
  return d;
}
function clientDeviceFromToken(t){
  t=String(t||'').trim(); if(!t)return null;
  const r=db.prepare(`SELECT cs.expires_at session_expires_at,cd.*,c.name client_name,c.active client_active,c.expires_at client_expires_at,c.owner_account_id
    FROM client_sessions cs JOIN client_devices cd ON cd.id=cs.device_id LEFT JOIN clients c ON c.id=cd.client_id WHERE cs.token_hash=?`).get(sha(t));
  if(!r)return null;
  if(Date.parse(r.session_expires_at)<=Date.now()){db.prepare('DELETE FROM client_sessions WHERE token_hash=?').run(sha(t));return null;}
  return r;
}
function clientDeviceFromBearer(req){return clientDeviceFromToken(bearer(req));}
function clientContentDevice(req,urlObj){return clientDeviceFromToken(bearer(req)||urlObj.searchParams.get('access_token')||'');}
function publicBaseUrl(req){
  const proto=String(req.headers['x-forwarded-proto']||'').split(',')[0].trim() || (TRUST_PROXY_HTTPS?'https':'http');
  const host=String(req.headers['x-forwarded-host']||req.headers.host||'localhost').split(',')[0].trim();
  return `${proto}://${host}`;
}


function isPrivateHost(host){
  const h=String(host||'').toLowerCase();
  return h==='localhost'||h==='::1'||h==='0.0.0.0'||/^127\./.test(h)||/^10\./.test(h)||/^192\.168\./.test(h)||/^169\.254\./.test(h)||/^172\.(1[6-9]|2\d|3[01])\./.test(h);
}
function assertPublicHttpUrl(rawUrl){
  let u;try{u=new URL(String(rawUrl||''))}catch{throw new Error('URL inválida')}
  if(!/^https?:$/.test(u.protocol)||isPrivateHost(u.hostname))throw new Error('Solo se permiten URLs web públicas HTTP/HTTPS');
  return u;
}
async function safeWebFetch(rawUrl, referer=''){
  let u;try{u=new URL(rawUrl)}catch{throw new Error('URL inválida')}
  if(!/^https?:$/.test(u.protocol)||isPrivateHost(u.hostname))throw new Error('Solo se permiten URLs web públicas HTTP/HTTPS');
  const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),10000);
  try{
    const headers={'User-Agent':'Mozilla/5.0 (compatible; CO-CHI-StreamResolver/0.9.9)','Accept':'text/html,application/xhtml+xml,application/vnd.apple.mpegurl,application/dash+xml,*/*;q=0.8'};
    if(referer)headers.Referer=referer;
    const r=await fetch(u,{headers,redirect:'follow',signal:ctl.signal});
    if(!r.ok)throw new Error(`La página respondió HTTP ${r.status}`);
    const len=Number(r.headers.get('content-length')||0);if(len>2_000_000)throw new Error('Respuesta demasiado grande para analizar');
    const text=(await r.text()).slice(0,2_000_000);
    return {url:r.url,text,contentType:r.headers.get('content-type')||''};
  }finally{clearTimeout(timer)}
}
function absoluteCandidate(v,base){try{return new URL(String(v||'').replace(/&amp;/g,'&'),base).href}catch{return ''}}
function originFor(raw){try{return new URL(String(raw||'')).origin}catch{return ''}}
function candidateHeaders(sourcePage){return {Referer:String(sourcePage||''),Origin:originFor(sourcePage),'User-Agent':'Android/CO-CHI (Media3)'};}
function extractWebCandidates(html,base){
  const found=new Map();
  const add=(raw,kind)=>{const cleaned=String(raw||'').replace(/\\\//g,'/').replace(/&amp;/g,'&').trim();const url=absoluteCandidate(cleaned,base);if(!url||!/^https?:/i.test(url))return;const low=url.toLowerCase();let type=kind;if(/\.m3u8(?:[?#]|$)/i.test(low))type='HLS';else if(/\.mpd(?:[?#]|$)/i.test(low))type='DASH';else if(/\.mp4(?:[?#]|$)/i.test(low))type='MP4';else if(/\.(?:json)(?:[?#]|$)/i.test(low)||/(?:config|player|stream|live|source|manifest)/i.test(low))type=type==='SCRIPT'?'SCRIPT':'CONFIG';if(!found.has(url))found.set(url,{url,type,sourcePage:base,headers:candidateHeaders(base)});};
  for(const m of html.matchAll(/<(iframe|source|video|audio|script)[^>]+(?:src|data-src)=['"]([^'"]+)['"]/gi)){const tag=String(m[1]||'').toLowerCase();add(m[2],tag==='iframe'?'IFRAME':tag==='script'?'SCRIPT':'MEDIA');}
  for(const m of html.matchAll(/(?:href|data-href)=['"]([^'"]+)['"]/gi))add(m[1],'LINK');
  for(const m of html.matchAll(/['"]([^'"]+\.(?:m3u8|mpd|mp4)(?:\?[^'"]*)?)['"]/gi))add(m[1],'MEDIA');
  for(const m of html.matchAll(/https?:\?\/\?\/[^\s'"<>]+/gi))add(m[0],'LINK');
  for(const m of html.matchAll(/(?:fetch|axios\.(?:get|post)|url|file|src|source|manifest|playlist|hls|dash)\s*[:=(]\s*['"]([^'"]+)['"]/gi))add(m[1],'CONFIG');
  for(const m of html.matchAll(/['"](\/[^'"]*(?:config|player|stream|live|manifest|playlist)[^'"]*)['"]/gi))add(m[1],'CONFIG');
  return [...found.values()].slice(0,180);
}
async function probePlayableUrl(rawUrl,headers={}){
  assertPublicHttpUrl(rawUrl);const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),10000);
  try{const cleanHeaders={};for(const [k,v] of Object.entries(headers||{})){if(v)cleanHeaders[k]=String(v).slice(0,1000)}cleanHeaders['User-Agent']=cleanHeaders['User-Agent']||'Android/CO-CHI (Media3)';cleanHeaders.Accept=cleanHeaders.Accept||'*/*';cleanHeaders.Range='bytes=0-65535';const r=await fetch(rawUrl,{headers:cleanHeaders,redirect:'follow',signal:ctl.signal});const ct=String(r.headers.get('content-type')||'').toLowerCase();let body='';try{body=Buffer.from(await r.arrayBuffer()).subarray(0,65536).toString('utf8')}catch{}const low=String(r.url||rawUrl).toLowerCase();let type=/\.m3u8(?:[?#]|$)/i.test(low)||body.includes('#EXTM3U')||ct.includes('mpegurl')?'HLS':/\.mpd(?:[?#]|$)/i.test(low)||ct.includes('dash+xml')||/<MPD[\s>]/i.test(body)?'DASH':/\.mp4(?:[?#]|$)/i.test(low)||ct.includes('video/mp4')?'MP4':'';return {ok:r.ok&&Boolean(type),status:r.status,type:type||'DESCONOCIDO',contentType:ct,finalUrl:r.url||rawUrl};}finally{clearTimeout(timer)}
}
async function resolvePublicStreamPage(rawUrl){
  const first=await safeWebFetch(rawUrl),pages=[first.url],visited=new Set([first.url]),all=new Map(),queue=[{page:first,depth:0}];let fetched=0;
  while(queue.length&&fetched<28){const {page,depth}=queue.shift();fetched++;const items=extractWebCandidates(page.text,page.url);for(const c of items){if(!all.has(c.url))all.set(c.url,c)}if(depth>=4)continue;for(const x of items.filter(v=>['IFRAME','SCRIPT','CONFIG'].includes(v.type)).slice(0,12)){if(visited.has(x.url))continue;visited.add(x.url);try{const sub=await safeWebFetch(x.url,page.url);pages.push(sub.url);queue.push({page:sub,depth:depth+1})}catch{}}}
  const candidates=[...all.values()],playable=candidates.filter(x=>['HLS','DASH','MP4'].includes(x.type));return {pageUrl:first.url,pagesChecked:pages,candidates,playable,recommendedHeaders:candidateHeaders(first.url),note:'Detector experimental: sigue iframes, scripts y configuraciones públicas hasta 4 niveles. No evita DRM, autenticación ni controles de acceso.'};
}

function streamKind(rawUrl,contentType=''){
  const u=String(rawUrl||'').toLowerCase(),ct=String(contentType||'').toLowerCase();
  if(/\.m3u8(?:[?#]|$)/i.test(u)||ct.includes('mpegurl'))return 'HLS';
  if(/\.mpd(?:[?#]|$)/i.test(u)||ct.includes('dash+xml'))return 'DASH';
  if(/\.mp4(?:[?#]|$)/i.test(u)||ct.includes('video/mp4'))return 'MP4';
  return '';
}
function publicBrowserUrl(raw){let u;try{u=new URL(String(raw||''))}catch{return false}return /^https?:$/.test(u.protocol)&&!isPrivateHost(u.hostname);}
function selectedBrowserHeaders(reqHeaders={},sourcePage=''){
  const h={}; const pick=(src,dst)=>{const v=reqHeaders[src];if(v)h[dst]=String(v).slice(0,4000)};
  pick('referer','Referer');pick('origin','Origin');pick('user-agent','User-Agent');pick('cookie','Cookie');
  if(!h.Referer&&sourcePage)h.Referer=sourcePage;if(!h.Origin&&sourcePage)h.Origin=originFor(sourcePage);if(!h['User-Agent'])h['User-Agent']='Android/CO-CHI (Media3)';return h;
}
async function resolveDynamicPublicStreamPage(rawUrl){
  assertPublicHttpUrl(rawUrl);const executablePath=process.env.CHROMIUM_PATH||'/usr/bin/chromium';
  if(!fs.existsSync(executablePath))throw new Error('Chromium no está instalado en el servidor. Volvé a desplegar esta versión completa.');
  const browser=await puppeteer.launch({executablePath,headless:true,args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu','--no-first-run','--no-zygote']});
  const found=new Map(),bodyJobs=[];let finalPage=rawUrl;
  const add=(url,type,sourcePage,headers={})=>{if(!url||!publicBrowserUrl(url))return;const kind=type||streamKind(url);if(!kind)return;if(!found.has(url))found.set(url,{url,type:kind,sourcePage:sourcePage||finalPage,headers:selectedBrowserHeaders(headers,sourcePage||finalPage),dynamic:true});};
  try{
    const page=await browser.newPage();await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36 CO-CHI-Resolver/0.9.9');await page.setViewport({width:1280,height:720});await page.setRequestInterception(true);
    page.on('request',req=>{const url=req.url();if(!publicBrowserUrl(url)){req.abort().catch(()=>{});return}const kind=streamKind(url);if(kind)add(url,kind,req.frame()?.url()||finalPage,req.headers());req.continue().catch(()=>{});});
    page.on('response',resp=>{try{const url=resp.url(),headers=resp.headers(),kind=streamKind(url,headers['content-type']);if(kind)add(url,kind,resp.request().frame()?.url()||finalPage,resp.request().headers());const rt=resp.request().resourceType(),len=Number(headers['content-length']||0);if(['xhr','fetch','script','document'].includes(rt)&&(!len||len<1000000)){bodyJobs.push((async()=>{try{const text=(await resp.text()).slice(0,1000000);const re=/https?:\\?\/\\?\/[^\s'"<>]+(?:\.m3u8|\.mpd|\.mp4)(?:\?[^\s'"<>]*)?/gi;for(const m of text.matchAll(re)){const clean=m[0].replace(/\\\//g,'/');add(clean,streamKind(clean),resp.url(),resp.request().headers())}for(const m of text.matchAll(/['"]([^'"]+\.(?:m3u8|mpd|mp4)(?:\?[^'"]*)?)['"]/gi)){const abs=absoluteCandidate(m[1].replace(/\\\//g,'/'),resp.url());add(abs,streamKind(abs),resp.url(),resp.request().headers())}}catch{}})())}}catch{}});
    const nav=await page.goto(rawUrl,{waitUntil:'domcontentloaded',timeout:18000});finalPage=page.url()||nav?.url()||rawUrl;await new Promise(r=>setTimeout(r,8000));
    try{const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(x=>x.name).slice(-800));for(const u of resources){const kind=streamKind(u);if(kind)add(u,kind,finalPage,{referer:finalPage})}}catch{}
    for(const frame of page.frames()){const fu=frame.url();if(publicBrowserUrl(fu)){const kind=streamKind(fu);if(kind)add(fu,kind,finalPage,{referer:finalPage})}}
    await Promise.allSettled(bodyJobs.slice(0,120));const candidates=[...found.values()].slice(0,80),playable=[];
    for(const c of candidates.slice(0,18)){try{const pr=await probePlayableUrl(c.url,c.headers);c.probe=pr;if(pr.ok){c.type=pr.type;c.url=pr.finalUrl||c.url;playable.push(c)}}catch{}}
    const frameUrls=[...new Set(page.frames().map(f=>f.url()).filter(publicBrowserUrl))];
    return {pageUrl:finalPage,pagesChecked:frameUrls,candidates,playable,recommendedHeaders:candidateHeaders(finalPage),dynamic:true,note:'Resolver dinámico: ejecutó la página en un navegador limpio y observó únicamente solicitudes públicas generadas por el reproductor. No inicia sesión ni intenta evitar DRM o controles de acceso.'};
  }finally{await browser.close().catch(()=>{})}
}

function mergeImportedWithManaged(imported,managed){
  if(!Array.isArray(imported))imported=[];if(!Array.isArray(managed)||!managed.length)return imported;
  const clone=x=>JSON.parse(JSON.stringify(x));
  const itemKey=x=>{const u=String(x?.uri||x?.url||'').trim().toLowerCase();if(u)return 'u:'+u;const n=String(x?.name||x?.title||'').trim().toLowerCase();return n?'n:'+n:''};
  const out=clone(imported);
  for(const mg of managed){
    const name=String(mg?.name||'').trim();let g=out.find(x=>String(x?.name||'').trim().toLowerCase()===name.toLowerCase());
    if(!g){out.push(clone(mg));continue}
    const imp=Array.isArray(g.samples)?g.samples:[], man=Array.isArray(mg?.samples)?mg.samples:[];
    const pos=new Map();imp.forEach((x,i)=>{const k=itemKey(x);if(k)pos.set(k,i)});
    for(const x of man){const k=itemKey(x);if(k&&pos.has(k))imp[pos.get(k)]=clone(x);else imp.push(clone(x))}
    g.samples=imp;
  }
  return out;
}
function loadManagedEditable(key){const r=db.prepare('SELECT * FROM managed_content WHERE source_key=?').get(key);if(!r?.json_text)return [];return decryptManagedContent(JSON.parse(r.json_text));}
function encodeEditableContent(json){const stats=contentStats(json),encrypted=encryptManagedContent(json),text=JSON.stringify(encrypted);if(Buffer.byteLength(text,'utf8')>25*1024*1024)throw new Error('JSON cifrado demasiado grande');return {stats,text};}
function saveManagedEditable(key,json,actorId,action='managed_content_saved_encrypted'){const {stats,text}=encodeEditableContent(json);db.prepare('UPDATE managed_content SET json_text=?,updated_at=? WHERE source_key=?').run(text,nowIso(),key);audit(actorId,action,'content',null,key);return stats;}
function publishEditable(key,json,actorId,action='content_published_to_app'){const {stats,text}=encodeEditableContent(json),t=nowIso();db.exec('BEGIN');try{db.prepare('UPDATE managed_content SET json_text=?,updated_at=? WHERE source_key=?').run(text,t,key);db.prepare('UPDATE published_content SET json_text=?,updated_at=? WHERE source_key=?').run(text,t,key);audit(actorId,action,'content',null,key);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e}return stats;}
function publishOnlyEditable(key,json,actorId,action='content_published_to_app_only'){const {stats,text}=encodeEditableContent(json),t=nowIso();db.prepare('UPDATE published_content SET json_text=?,updated_at=? WHERE source_key=?').run(text,t,key);audit(actorId,action,'content',null,key);return stats;}
async function saveOriginalAndPublish(key,json,actorId,action='content_saved_original_and_published'){const saved=await saveEditableToOriginalSource(key,json);const t=nowIso();db.exec('BEGIN');try{db.prepare('UPDATE managed_content SET json_text=?,updated_at=? WHERE source_key=?').run(saved.text,t,key);db.prepare('UPDATE published_content SET json_text=?,updated_at=? WHERE source_key=?').run(saved.text,t,key);audit(actorId,action,'content',null,`${key};${saved.remote.kind};${saved.remote.owner}/${saved.remote.repo}`);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e}return {stats:saved.stats,remote:saved.remote};}
function resolverPublishedEntries(){const out=[];for(const key of ['tv1','tv2']){let json=[];try{json=loadManagedEditable(key)}catch{}json.forEach((g,gi)=>(Array.isArray(g?.samples)?g.samples:[]).forEach((x,si)=>{if(x?._resolverId)out.push({id:x._resolverId,destination:key,category:g.name||'',name:x.name||'',uri:x.uri||'',type:x._resolverType||'',pageUrl:x._resolverPage||'',groupIndex:gi,itemIndex:si})}));}return out;}

function mime(fp){return ({'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webmanifest':'application/manifest+json; charset=utf-8'})[path.extname(fp).toLowerCase()]||'application/octet-stream';}
function serveStatic(res,urlObj){
  let rel=decodeURIComponent(urlObj.pathname);if(rel==='/')rel='/index.html';
  const fp=path.join(PUBLIC_DIR,path.normalize(rel).replace(/^(\.\.[/\\])+/,''));
  if(!fp.startsWith(PUBLIC_DIR)||!fs.existsSync(fp)||!fs.statSync(fp).isFile())return sendText(res,404,'No encontrado');
  const csp="default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'";
  res.writeHead(200,{'Content-Type':mime(fp),'Cache-Control':'no-store, no-cache, must-revalidate, max-age=0','Pragma':'no-cache','Expires':'0','Content-Security-Policy':csp,'X-Frame-Options':'DENY','X-Content-Type-Options':'nosniff','Permissions-Policy':'camera=(), microphone=(), geolocation=(), payment=()',...(TRUST_PROXY_HTTPS?{'Strict-Transport-Security':'max-age=31536000; includeSubDomains'}:{})});
  res.end(fs.readFileSync(fp));
}


// v0.9.24 - Failover liviano de fuentes TV. Solo se evalúan canales que tengan backupUris.
// El resultado se cachea para no agregar sondeos repetidos en cada carga del catálogo.
const failoverHealthCache=new Map();
async function failoverProbe(url,headers={}){
  const key=String(url||'');const cached=failoverHealthCache.get(key),now=Date.now();
  if(cached&&now-cached.at<20000)return cached.ok;
  let ok=false;const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),4500);
  try{const h={};for(const [k,v] of Object.entries(headers||{}))if(v)h[k]=String(v);h['User-Agent']=h['User-Agent']||'Android/CO-CHI (Media3)';h.Range='bytes=0-2047';const r=await fetch(key,{headers:h,redirect:'follow',signal:ctl.signal});ok=r.ok||r.status===206;}catch{}finally{clearTimeout(timer)}
  failoverHealthCache.set(key,{ok,at:now});return ok;
}
async function applyTvFailover(payload){
  if(!Array.isArray(payload))return payload;
  const out=structuredClone(payload);
  for(const g of out){for(const item of (Array.isArray(g?.samples)?g.samples:[])){
    const primary=String(item?.uri||'').trim(),backups=Array.isArray(item?.backupUris)?item.backupUris.map(x=>String(x||'').trim()).filter(Boolean):[];
    if(!primary||!backups.length)continue;
    const candidates=[primary,...backups];let selected=primary,idx=0;
    for(let i=0;i<candidates.length;i++){if(await failoverProbe(candidates[i],item.headers||{})){selected=candidates[i];idx=i;break}}
    item.uri=selected;item._failover={active:idx>0,sourceIndex:idx,checkedAt:nowIso()};
  }}return out;
}


function mediaNormTitle(value){
  return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/&/g,' ').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
}
function mediaYear(item,title=''){
  const raw=String(item?.year||item?.release_year||item?.releaseYear||item?.date||item?.release_date||'');
  const m=raw.match(/(?:19|20)\d{2}/)||String(title||'').match(/(?:19|20)\d{2}/);return m?m[0]:'';
}
function localCatalogSearch(query){
  const wanted=mediaNormTitle(query),out=[],seen=new Set();
  for(const [key,type] of [['movies','movie'],['series','tv']]){
    const row=db.prepare('SELECT json_text FROM published_content WHERE source_key=?').get(key);if(!row?.json_text)continue;
    let clear;try{clear=decryptManagedContent(JSON.parse(row.json_text))}catch{continue}
    for(const group of (Array.isArray(clear)?clear:[]))for(const item of (Array.isArray(group?.samples)?group.samples:[])){
      if(!item||typeof item!=='object'||item.adult===true)continue;
      const title=String(item.name||item.title||'').trim();if(!title)continue;
      const normalized=mediaNormTitle(title);if(!normalized||(!normalized.includes(wanted)&&!wanted.includes(normalized)))continue;
      const year=mediaYear(item,title),dedupe=`${type}|${normalized}|${year}`;if(seen.has(dedupe))continue;seen.add(dedupe);
      out.push({id:0,media_type:type,title,original_title:String(item.original_title||item.originalName||'').trim(),year,
        poster_path:'',poster_url:String(item.logo||item.poster||item.image||item.thumbnail||'').trim(),
        overview:String(item.description||item.overview||item.synopsis||'').trim(),source:'cochi'});
      if(out.length>=30)return out;
    }
  }
  return out;
}
function normalizeProviderOption(raw,providerName,index){
  if(!raw||typeof raw!=='object')return null;
  const url=String(raw.url||raw.uri||raw.stream||'').trim();if(!/^https?:\/\//i.test(url))return null;
  const headers={};for(const [k,v] of Object.entries(raw.headers||{}))if(k&&v!==undefined&&v!==null)headers[String(k)]=String(v);
  const drm=raw.drm&&typeof raw.drm==='object'?raw.drm:{};
  let pairs=String(raw.clear_key_pairs||raw.clearKeyPairs||raw.clearkey||drm.clear_key_pairs||drm.clearKeyPairs||'').trim();
  if(!pairs&&raw.kid&&raw.key)pairs=`${String(raw.kid).trim()}:${String(raw.key).trim()}`;
  return {
    provider:String(raw.provider||providerName||'Proveedor').trim().slice(0,80),
    server:String(raw.server||raw.servidor||raw.provider||providerName||`Servidor ${index+1}`).trim().slice(0,80),
    language:String(raw.language||raw.idioma||raw.audio||'').trim().slice(0,80),
    subtitles:String(raw.subtitles||raw.subtitulos||raw.subs||'').trim().slice(0,80),
    quality:String(raw.quality||raw.qualityLabel||raw.calidad||'').trim().slice(0,40),
    type:String(raw.type||raw.tipo||'auto').trim().slice(0,20),url,headers,clear_key_pairs:pairs,
    priority:Number.isFinite(Number(raw.priority))?Number(raw.priority):100+index
  };
}
function flattenProviderPayload(payload,providerName){
  const raw=[];
  if(Array.isArray(payload))raw.push(...payload);
  if(Array.isArray(payload?.options))raw.push(...payload.options);
  if(Array.isArray(payload?.sources))raw.push(...payload.sources);
  if(Array.isArray(payload?.groups))for(const g of payload.groups){
    const arr=Array.isArray(g?.options)?g.options:Array.isArray(g?.sources)?g.sources:[];
    for(const x of arr)raw.push({...x,server:x?.server||g?.server||g?.name||providerName,language:x?.language||g?.language||'',subtitles:x?.subtitles||g?.subtitles||''});
  }
  return raw.map((x,i)=>normalizeProviderOption(x,providerName,i)).filter(Boolean);
}
async function fetchMediaProvider(provider,params){
  const target=new URL(provider.url);for(const [k,v] of Object.entries(params))if(v!==undefined&&v!==null&&String(v)!=='')target.searchParams.set(k,String(v));
  const headers={Accept:'application/json','User-Agent':'CO-CHI-PANEL/'+VERSION};if(provider.token)headers.Authorization='Bearer '+provider.token;
  const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),9000);
  try{const r=await fetch(target,{headers,redirect:'follow',signal:ctl.signal});if(!r.ok)return [];const payload=await r.json();return flattenProviderPayload(payload,provider.name)}
  catch(e){console.warn(`[MEDIA-PROVIDER] ${provider.name}: ${String(e?.message||e)}`);return []}finally{clearTimeout(timer)}
}
function mediaLanguageRank(option){
  const l=String(option?.language||'').toLowerCase(),s=String(option?.subtitles||'').toLowerCase();
  if(l.includes('lat')||l.includes('es-419')||l.includes('es-la'))return 0;
  if(l.includes('cast')||l.includes('es-es'))return 1;
  if(l==='es'||l.includes('españ')||l.includes('spanish'))return 2;
  if(s.includes('es')||s.includes('spanish')||s.includes('españ'))return 3;
  if(!l)return 5;return 4;
}

async function route(req,res){
  const u=new URL(req.url,`http://${req.headers.host||'localhost'}`); const p=u.pathname,m=req.method||'GET';
  if(m==='POST'&&['/api/setup','/api/panel/activate','/api/panel/session','/api/client-device/register','/api/client-device/status','/api/client-device/session','/api/client-device/adult/verify'].includes(p)){
    const strict=p==='/api/client-device/status'?600:30;
    if(!rateLimit(req,res,p,strict,10*60*1000))return;
  }
  if(p==='/api/health'&&m==='GET')return sendJson(res,200,{ok:true,service:'CO-CHI',version:VERSION,mode:IS_PRODUCTION?'production':'development',mediaSearchConfigured:true,tmdbConfigured:Boolean(TMDB_API_KEY||TMDB_READ_TOKEN),mediaProvidersConfigured:MEDIA_PROVIDERS.length,serverTime:nowIso()});
  if(p==='/api/public/info'&&m==='GET')return sendJson(res,200,{service:'CO-CHI',version:VERSION,clientRegistration:true,panelWeb:true,pwa:true,demoMinutes:DEMO_DURATION_MINUTES,demoDurations:DEMO_ALLOWED_MINUTES,clientDevices:CLIENT_DEVICE_LIMIT});
  if(p==='/api/setup/status'&&m==='GET')return sendJson(res,200,{needsSetup:Number(db.prepare('SELECT COUNT(*) n FROM accounts WHERE role_level=1').get().n)===0});
  if(p==='/api/setup'&&m==='POST'){
    if(Number(db.prepare('SELECT COUNT(*) n FROM accounts WHERE role_level=1').get().n)!==0)return sendJson(res,409,{error:'El panel ya fue configurado'});
    const b=await readJson(req); const name=String(b.name||'').trim(); if(name.length<2)return sendJson(res,400,{error:'Nombre requerido'});
    const code=generateCode('accounts'),t=nowIso();
    const r=db.prepare('INSERT INTO accounts(name,role_level,parent_id,contact,notes,credits,active,inactivity_blocked,activation_code,created_at,updated_at) VALUES (?,1,NULL,?,?,0,1,0,?,?,?)')
      .run(name,String(b.contact||'').trim(),String(b.notes||'').trim(),code,t,t);
    return sendJson(res,201,{ok:true,id:Number(r.lastInsertRowid),activationCode:code,role:'ADMINISTRACIÓN'});
  }

  // v0.9.51 — proxy autenticado de búsqueda. No expone la credencial de TMDb.
  if(p==='/api/client-device/media-search'&&m==='GET'){
    if(!rateLimit(req,res,'client_media_search',120,10*60*1000))return;
    let d=clientDeviceFromBearer(req);if(!d)return sendJson(res,401,{error:'Sesión inválida'});
    d=refreshDeviceState(d);const c=d.client_id?clientRow(d.client_id):null,st=deviceAccessState(d,c);
    if(!st.ok)return sendJson(res,403,{allowed:false,reason:st.reason});
    const q=String(u.searchParams.get('q')||'').trim();
    if(q.length<2)return sendJson(res,400,{error:'Escribí al menos 2 letras'});
    if(q.length>100)return sendJson(res,400,{error:'Búsqueda demasiado larga'});
    if(!TMDB_API_KEY&&!TMDB_READ_TOKEN)return sendJson(res,200,{ok:true,query:q,provider:'cochi-local',results:localCatalogSearch(q)});
    const target=new URL(TMDB_API_BASE+'/search/multi');
    target.searchParams.set('include_adult','false');
    target.searchParams.set('language','es-AR');
    target.searchParams.set('page','1');
    target.searchParams.set('query',q);
    if(TMDB_API_KEY)target.searchParams.set('api_key',TMDB_API_KEY);
    const headers={Accept:'application/json','User-Agent':'CO-CHI-PANEL/'+VERSION};
    if(TMDB_READ_TOKEN)headers.Authorization='Bearer '+TMDB_READ_TOKEN;
    const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),10000);
    try{
      const r=await fetch(target,{method:'GET',headers,redirect:'follow',signal:ctl.signal});
      const text=await r.text();
      if(!r.ok)return sendJson(res,200,{ok:true,query:q,provider:'cochi-local-fallback',results:localCatalogSearch(q)});
      const payload=JSON.parse(text),items=Array.isArray(payload?.results)?payload.results:[],results=[];
      for(const item of items){
        if(results.length>=30)break;
        const type=String(item?.media_type||'');
        if(type!=='movie'&&type!=='tv')continue;
        if(item?.adult===true)continue;
        const tv=type==='tv';
        const title=String(tv?item?.name:item?.title||'').trim();
        if(!title)continue;
        const original=String(tv?item?.original_name:item?.original_title||'').trim();
        const date=String(tv?item?.first_air_date:item?.release_date||'');
        results.push({
          id:Number(item?.id||0),media_type:type,title,original_title:original,
          year:/^\d{4}/.test(date)?date.slice(0,4):'',poster_path:String(item?.poster_path||''),
          overview:String(item?.overview||'').trim()
        });
      }
      return sendJson(res,200,{ok:true,query:q,results});
    }catch(e){
      return sendJson(res,200,{ok:true,query:q,provider:'cochi-local-fallback',results:localCatalogSearch(q)});
    }finally{clearTimeout(timer)}
  }


  // v0.9.52 — opciones directas de reproducción desde proveedores autorizados.
  // El PANEL normaliza los resultados y la APK nunca abre páginas web.
  if(p==='/api/client-device/media-playback-options'&&m==='GET'){
    if(!rateLimit(req,res,'client_media_playback_options',120,10*60*1000))return;
    let d=clientDeviceFromBearer(req);if(!d)return sendJson(res,401,{error:'Sesión inválida'});
    d=refreshDeviceState(d);const c=d.client_id?clientRow(d.client_id):null,st=deviceAccessState(d,c);
    if(!st.ok)return sendJson(res,403,{allowed:false,reason:st.reason});
    const mediaType=String(u.searchParams.get('media_type')||'').trim();
    const mediaId=String(u.searchParams.get('media_id')||'').trim();
    const title=String(u.searchParams.get('title')||'').trim().slice(0,180);
    const originalTitle=String(u.searchParams.get('original_title')||'').trim().slice(0,180);
    const year=String(u.searchParams.get('year')||'').trim().slice(0,8);
    if(!title)return sendJson(res,400,{error:'Título requerido'});
    const params={media_type:mediaType,media_id:mediaId,title,original_title:originalTitle,year,language:'es-AR'};
    const settled=await Promise.all(MEDIA_PROVIDERS.map(provider=>fetchMediaProvider(provider,params)));
    const options=[],seen=new Set();
    for(const list of settled)for(const option of list){
      const key=`${option.url}|${option.type}|${option.clear_key_pairs}`;if(seen.has(key))continue;seen.add(key);options.push(option);if(options.length>=40)break;
    }
    options.sort((a,b)=>mediaLanguageRank(a)-mediaLanguageRank(b)||Number(a.priority||100)-Number(b.priority||100)||String(a.server).localeCompare(String(b.server)));
    return sendJson(res,200,{ok:true,title,media_type:mediaType,providersConfigured:MEDIA_PROVIDERS.length,options});
  }

  const publicContent=p.match(/^\/api\/content\/(tv1|tv2|movies|series)$/);
  if(publicContent&&m==='GET'){
    let d=clientContentDevice(req,u);if(!d)return sendJson(res,401,{error:'Sesión de CO-CHI requerida'});
    d=refreshDeviceState(d);const c=d.client_id?clientRow(d.client_id):null,st=deviceAccessState(d,c);if(!st.ok)return sendJson(res,403,{allowed:false,reason:st.reason});
    const src=db.prepare('SELECT enabled FROM sources WHERE source_key=?').get(publicContent[1]);if(!src||!src.enabled)return sendJson(res,404,{error:'Fuente deshabilitada'});
    const r=db.prepare('SELECT json_text,updated_at FROM published_content WHERE source_key=?').get(publicContent[1]);if(!r||!r.json_text)return sendJson(res,404,{error:'Contenido todavía no publicado'});
    try{
      const sec=playbackSecurityState();
      const sourceKey=publicContent[1];

      // v0.9.45 — TV1/TV2: cifrado V2 por solicitud, exclusivo de CO-CHI.
      // La app nueva envía una clave pública EC temporal; el backend devuelve
      // el catálogo completo dentro de un sobre ECDH P-256 + AES-256-GCM.
      // Películas/Series y clientes anteriores conservan su formato histórico.
      if(tvCryptoRequested(req,sourceKey)){
        // v0.9.45: Crypto V2 es negociado, nunca destructivo.
        // Si una lista histórica no puede abrirse para generar el sobre V2,
        // seguimos abajo y entregamos automáticamente el formato compatible.
        try{
          let clear=decryptManagedContent(JSON.parse(r.json_text));
          if(st.mode==='demo')clear=filterDemoCategories(clear);
          clear=await applyTvFailover(clear);
          const dedicatedOn=tvDedicatedEnabled(sourceKey);
          if(dedicatedOn){
            if(!tvDedicatedConfigured(sourceKey))throw new Error(`Gateway ${sourceKey.toUpperCase()} activado pero no configurado`);
            clear=tvDedicatedPlaybackObject(clear,sourceKey);
          }else if(sec.enabled){
            if(!sec.gatewayConfigured)return sendJson(res,503,{error:'Seguridad de reproducción activada pero Gateway no configurado'});
            clear=securePlaybackObject(clear,sec.generation);
          }
          const envelope=tvCatalogEnvelope(clear,sourceKey,req.headers['x-cochi-tv-pub']);
          return sendJson(res,200,envelope,{
            'Cache-Control':'private, no-cache, no-store, must-revalidate','Pragma':'no-cache',
            'X-COCHI-Access-Mode':String(st.mode||''),
            'X-COCHI-Demo-Blocked':st.mode==='demo'?demoBlockedCategories().join('|'):'',
            'X-COCHI-Playback-Security':sec.enabled?'gateway':'compatible',
            'X-COCHI-Playback-Generation':String(sec.generation),
            'X-COCHI-TV-Crypto':'2',
            'X-COCHI-TV-Gateway':tvDedicatedEnabled(sourceKey)?sourceKey:'off'
          });
        }catch(cryptoV2Error){
          console.warn(`[TV-CRYPTO-V2] ${sourceKey}: fallback compatible: ${String(cryptoV2Error?.message||cryptoV2Error)}`);
        }
      }

      // v0.9.43 — compatibilidad estricta.
      // Con seguridad APAGADA devolvemos exactamente el mismo formato publicado
      // que usaba v0.9.41. Esto es importante porque TV1, TV2 y Películas pueden
      // contener variantes históricas del wrapper BLAF/CO-CHI que no deben
      // reconstruirse si el gateway no está activo.
      if(!sec.enabled){
        let payload=JSON.parse(r.json_text);
        if(st.mode==='demo')payload=filterDemoCategories(payload);
        if(publicContent[1]==='tv1'||publicContent[1]==='tv2')payload=await applyTvFailover(payload);
        return sendJson(res,200,payload,{
          'Cache-Control':'private, no-cache, no-store, must-revalidate','Pragma':'no-cache',
          'X-COCHI-Access-Mode':String(st.mode||''),
          'X-COCHI-Demo-Blocked':st.mode==='demo'?demoBlockedCategories().join('|'):'',
          'X-COCHI-Playback-Security':'compatible',
          'X-COCHI-Playback-Generation':String(sec.generation)
        });
      }

      // Solo cuando Seguridad está ENCENDIDA abrimos temporalmente el contenido
      // dentro del backend, sustituimos las URLs por tickets del gateway y lo
      // volvemos a cifrar antes de entregarlo a la app.
      if(!sec.gatewayConfigured)return sendJson(res,503,{error:'Seguridad de reproducción activada pero Gateway no configurado'});
      let clear=decryptManagedContent(JSON.parse(r.json_text));
      if(st.mode==='demo')clear=filterDemoCategories(clear);
      if(publicContent[1]==='tv1'||publicContent[1]==='tv2')clear=await applyTvFailover(clear);
      clear=securePlaybackObject(clear,sec.generation);
      const payload=encryptManagedContent(clear);
      return sendJson(res,200,payload,{
        'Cache-Control':'private, no-cache, no-store, must-revalidate','Pragma':'no-cache',
        'X-COCHI-Access-Mode':String(st.mode||''),
        'X-COCHI-Demo-Blocked':st.mode==='demo'?demoBlockedCategories().join('|'):'',
        'X-COCHI-Playback-Security':'gateway',
        'X-COCHI-Playback-Generation':String(sec.generation)
      });
    }catch(e){return sendJson(res,500,{error:'Contenido guardado inválido: '+String(e?.message||e)});}
  }

  // Activación del PANEL por código. Máximo 2 dispositivos por ficha.
  if(p==='/api/panel/activate'&&m==='POST'){
    const b=await readJson(req),code=String(b.code||'').trim().toUpperCase(),uid=String(b.deviceUid||'').trim(),name=String(b.deviceName||'Dispositivo').trim().slice(0,120);
    if(uid.length<8)return sendJson(res,400,{error:'Identificador de dispositivo inválido'});
    let a=db.prepare('SELECT * FROM accounts WHERE activation_code=?').get(code); if(!a)return sendJson(res,404,{error:'Código de activación inválido'});
    a=accountPublic(a);const state=accountAccessState(a);if(!state.ok){const bi=blockerInfo(a);return sendJson(res,423,{error:'Ficha bloqueada',reason:state.reason,blockReason:a.block_reason||'',...bi});}
    let pd=db.prepare('SELECT * FROM panel_devices WHERE account_id=? AND device_uid=?').get(a.id,uid);
    let secret=null;
    if(!pd){
      const n=Number(db.prepare('SELECT COUNT(*) n FROM panel_devices WHERE account_id=? AND active=1').get(a.id).n);
      if(n>=PANEL_DEVICE_LIMIT)return sendJson(res,409,{error:'Esta ficha ya tiene 2 dispositivos de PANEL autorizados'});
      secret=randomToken(); const t=nowIso();
      const rr=db.prepare('INSERT INTO panel_devices(account_id,device_uid,device_name,secret_hash,active,last_seen_at,created_at,updated_at) VALUES (?,?,?,?,1,?,?,?)')
        .run(a.id,uid,name,sha(secret),t,t,t);
      pd={id:Number(rr.lastInsertRowid)};
    } else {
      if(pd.active)return sendJson(res,409,{error:'Este dispositivo ya está activado. Usá el acceso guardado en este navegador.'});
      const n=Number(db.prepare('SELECT COUNT(*) n FROM panel_devices WHERE account_id=? AND active=1').get(a.id).n);
      if(n>=PANEL_DEVICE_LIMIT)return sendJson(res,409,{error:'Esta ficha ya tiene 2 dispositivos de PANEL autorizados'});
      secret=randomToken(); const t=nowIso();
      db.prepare('UPDATE panel_devices SET device_name=?,secret_hash=?,active=1,last_seen_at=?,updated_at=? WHERE id=?').run(name,sha(secret),t,t,pd.id);
    }
    const s=createPanelSession(pd.id);
    return sendJson(res,200,{ok:true,deviceSecret:secret,account:accountPublic(a),expiresAt:s.expiresAt},{'Set-Cookie':sessionCookie(s.token)});
  }
  if(p==='/api/panel/session'&&m==='POST'){
    const b=await readJson(req),uid=String(b.deviceUid||''),secret=String(b.deviceSecret||'');
    const pd=db.prepare(`SELECT pd.id panel_device_id,pd.account_id panel_account_id,pd.device_uid,pd.device_name,pd.secret_hash,pd.active device_active,a.* FROM panel_devices pd JOIN accounts a ON a.id=pd.account_id WHERE pd.device_uid=? AND pd.active=1`).get(uid);
    if(!pd)return sendJson(res,401,{error:'Dispositivo PANEL no reconocido'});
    const a=Buffer.from(pd.secret_hash,'hex'),bb=Buffer.from(sha(secret),'hex'); if(a.length!==bb.length||!crypto.timingSafeEqual(a,bb))return sendJson(res,401,{error:'Credencial de dispositivo inválida'});
    const acc=accountPublic(accountRaw(pd.panel_account_id));const st=accountAccessState(acc);if(!st.ok){const bi=blockerInfo(acc);return sendJson(res,423,{error:'Ficha bloqueada',reason:st.reason,blockReason:acc.block_reason||'',...bi});}
    const s=createPanelSession(pd.panel_device_id);db.prepare('UPDATE panel_devices SET last_seen_at=?,updated_at=? WHERE id=?').run(nowIso(),nowIso(),pd.panel_device_id);
    return sendJson(res,200,{ok:true,account:acc,expiresAt:s.expiresAt},{'Set-Cookie':sessionCookie(s.token)});
  }
  if(p==='/api/panel/me'&&m==='GET'){
    const s=requirePanel(req,res);if(!s)return;return sendJson(res,200,{account:accountPublic(accountRaw(s.account.id)),limits:{panelDevices:2,clientDevices:2,clientDays:30,renewWindowDays:10,minCreditTransfer:MIN_CREDIT_TRANSFER,demoMinutes:DEMO_DURATION_MINUTES,demoDurations:DEMO_ALLOWED_MINUTES},features:{demosEnabled:boolSetting('demos_enabled',false),playbackSecurityEnabled:boolSetting('playback_security_enabled',false)}});
  }
  if(p==='/api/panel/logout'&&m==='POST'){
    const tok=parseCookies(req).cochi_panel_session;if(tok)db.prepare('DELETE FROM panel_sessions WHERE token_hash=?').run(sha(tok));
    return sendJson(res,200,{ok:true},{'Set-Cookie':sessionCookie('',0)});
  }

  // API cliente Android: registro pendiente, sesión y fuentes.
  if(p==='/api/client-device/register'&&m==='POST'){
    const b=await readJson(req),uid=String(b.deviceUid||'').trim();if(uid.length<8)return sendJson(res,400,{error:'deviceUid inválido'});
    const ex=db.prepare('SELECT activation_code,status FROM client_devices WHERE device_uid=?').get(uid);if(ex){db.prepare('UPDATE client_devices SET last_seen_at=?,updated_at=? WHERE device_uid=?').run(nowIso(),nowIso(),uid);return sendJson(res,200,{existing:true,activationCode:ex.activation_code,status:ex.status,requiresExistingSecret:true});}
    const code=generateCode('client_devices'),secret=randomToken(),t=nowIso();
    db.prepare('INSERT INTO client_devices(device_uid,device_name,platform,activation_code,secret_hash,status,created_at,updated_at) VALUES (?,?,?,?,?,\'pending\',?,?)')
      .run(uid,String(b.deviceName||'Android').trim().slice(0,120),String(b.platform||'android').trim().slice(0,30),code,sha(secret),t,t);
    return sendJson(res,201,{existing:false,activationCode:code,deviceSecret:secret,status:'pending'});
  }
  if(p==='/api/client-device/status'&&m==='POST'){
    const b=await readJson(req);let d=clientDeviceByCred(String(b.deviceUid||''),String(b.deviceSecret||''));if(!d)return sendJson(res,401,{error:'Dispositivo no reconocido'});
    const autoDemo=ensureAutomaticDemoForLinkedDevice(d);if(autoDemo.granted)d=db.prepare('SELECT * FROM client_devices WHERE id=?').get(d.id);d=refreshDeviceState(d);db.prepare('UPDATE client_devices SET last_seen_at=?,updated_at=? WHERE id=?').run(nowIso(),nowIso(),d.id);const c=d.client_id?clientRow(d.client_id):null;const st=deviceAccessState(d,c);
    return sendJson(res,200,{activationCode:d.activation_code,status:d.status,clientId:c?.id||null,clientName:c?.name||null,clientExpiresAt:c?.expires_at||null,allowed:st.ok,reason:st.reason,accessMode:st.mode||null,accessExpiresAt:st.expiresAt||null,demo:demoInfo(d.id)});
  }
  if(p==='/api/client-device/session'&&m==='POST'){
    const b=await readJson(req);let d=clientDeviceByCred(String(b.deviceUid||''),String(b.deviceSecret||''));if(!d)return sendJson(res,401,{error:'Dispositivo no reconocido'});
    const autoDemo=ensureAutomaticDemoForLinkedDevice(d);if(autoDemo.granted)d=db.prepare('SELECT * FROM client_devices WHERE id=?').get(d.id);d=refreshDeviceState(d);db.prepare('UPDATE client_devices SET last_seen_at=?,updated_at=? WHERE id=?').run(nowIso(),nowIso(),d.id);const c=d.client_id?clientRow(d.client_id):null;const st=deviceAccessState(d,c);if(!st.ok)return sendJson(res,403,{allowed:false,reason:st.reason});
    db.prepare('DELETE FROM client_sessions WHERE device_id=? OR expires_at<=?').run(d.id,nowIso());const token=randomToken();let exp=addDays(nowIso(),1);if(st.expiresAt&&Date.parse(st.expiresAt)<Date.parse(exp))exp=st.expiresAt;
    db.prepare('INSERT INTO client_sessions(device_id,token_hash,expires_at,created_at) VALUES (?,?,?,?)').run(d.id,sha(token),exp,nowIso());
    return sendJson(res,200,{allowed:true,token,expiresAt:exp,accessMode:st.mode,accessExpiresAt:st.expiresAt||null,clientId:c.id,clientName:c.name,clientExpiresAt:c.expires_at||null});
  }
  if(p==='/api/client-device/config'&&m==='GET'){
    let d=clientDeviceFromBearer(req);if(!d)return sendJson(res,401,{error:'Sesión inválida'});d=refreshDeviceState(d);const c=clientRow(d.client_id),st=deviceAccessState(d,c);if(!st.ok)return sendJson(res,403,{allowed:false,reason:st.reason});
    const sessionToken=bearer(req),base=publicBaseUrl(req),src={};
    for(const r of db.prepare('SELECT * FROM sources').all()){
      const endpoint=`${base}/api/content/${r.source_key}`;
      src[r.source_key]={label:r.label,url:r.enabled?`${endpoint}?access_token=${encodeURIComponent(sessionToken)}`:'',enabled:Boolean(r.enabled),updatedAt:r.updated_at,managedByBackend:true};
    }
    const adult=effectiveAdult(c);
    return sendJson(res,200,{allowed:true,accessMode:st.mode,accessExpiresAt:st.expiresAt||null,client:{name:c.name,expiresAt:c.expires_at},adultControl:{enabled:adult.enabled,locked:adult.locked,pinConfigured:adult.pinConfigured,maxAttempts:adult.maxAttempts},sources:src,contentDelivery:'backend-protected',serverTime:nowIso()});
  }
  if(p==='/api/client-device/adult/verify'&&m==='POST'){
    let d=clientDeviceFromBearer(req);if(!d)return sendJson(res,401,{error:'Sesión inválida'});d=refreshDeviceState(d);const c=clientRow(d.client_id),st=deviceAccessState(d,c);if(!st.ok)return sendJson(res,403,{allowed:false,reason:st.reason});
    const adult=effectiveAdult(c);if(!adult.enabled)return sendJson(res,200,{allowed:true,adultLockEnabled:false});
    if(adult.locked)return sendJson(res,423,{allowed:false,error:'PIN de adultos bloqueado. Administración debe desbloquearlo.',reason:'adult_pin_locked'});
    if(!adult.pinConfigured)return sendJson(res,503,{allowed:false,error:'PIN de adultos no configurado',reason:'adult_pin_not_configured'});
    const b=await readJson(req),ok=verifyPin(String(b.pin||''),adult.pinHash);
    if(ok){db.prepare('UPDATE clients SET adult_fail_count=0,updated_at=? WHERE id=?').run(nowIso(),c.id);return sendJson(res,200,{allowed:true,adultLockEnabled:true});}
    const fail=Number(c.adult_fail_count||0)+1,locked=fail>=adult.maxAttempts?1:0;db.prepare('UPDATE clients SET adult_fail_count=?,adult_locked=?,updated_at=? WHERE id=?').run(fail,locked,nowIso(),c.id);
    return sendJson(res,locked?423:401,{allowed:false,error:locked?'PIN bloqueado por intentos fallidos':'PIN incorrecto',reason:locked?'adult_pin_locked':'invalid_pin',attempts:fail,maxAttempts:adult.maxAttempts});
  }

  if(p.startsWith('/api/admin/')){
    const s=requirePanel(req,res);if(!s)return;const actor=accountPublic(accountRaw(s.account.id));

    if(p==='/api/admin/stream-resolver'&&m==='POST'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede usar el resolver experimental'});
      const b=await readJson(req),url=String(b.url||'').trim();if(!url)return sendJson(res,400,{error:'Ingresá una URL web'});
      try{const result=await resolvePublicStreamPage(url);audit(actor.id,'stream_resolver_test','web',null,url.slice(0,500));return sendJson(res,200,{ok:true,...result});}
      catch(e){return sendJson(res,400,{error:'No se pudo analizar la página: '+e.message});}
    }
    if(p==='/api/admin/stream-resolver/dynamic'&&m==='POST'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede usar el resolver dinámico'});
      if(!rateLimit(req,res,'dynamic_stream_resolver',8,10*60*1000))return;
      const b=await readJson(req),url=String(b.url||'').trim();if(!url)return sendJson(res,400,{error:'Ingresá una URL web'});
      try{const result=await resolveDynamicPublicStreamPage(url);audit(actor.id,'stream_resolver_dynamic','web',null,url.slice(0,500));return sendJson(res,200,{ok:true,...result});}
      catch(e){return sendJson(res,400,{error:'No se pudo ejecutar el análisis dinámico: '+e.message});}
    }
    if(p==='/api/admin/stream-resolver/published'&&m==='GET'){if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede usar el resolver experimental'});return sendJson(res,200,{items:resolverPublishedEntries()});}
    if(p==='/api/admin/stream-resolver/probe'&&m==='POST'){if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede usar el resolver experimental'});const b=await readJson(req),url=String(b.url||'').trim();if(!url)return sendJson(res,400,{error:'Falta URL'});try{return sendJson(res,200,await probePlayableUrl(url,b.headers||{}));}catch(e){return sendJson(res,400,{error:'No se pudo probar la fuente: '+e.message});}}
    if(p==='/api/admin/stream-resolver/publish'&&m==='POST'){if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede publicar canales'});const b=await readJson(req),destination=String(b.destination||'').toLowerCase();if(!['tv1','tv2'].includes(destination))return sendJson(res,400,{error:'Destino inválido'});const url=String(b.url||'').trim(),name=String(b.name||'').trim(),category=String(b.category||'RESOLVER WEB').trim()||'RESOLVER WEB';if(!url||!name)return sendJson(res,400,{error:'Faltan nombre o URL'});try{const headers=b.headers&&typeof b.headers==='object'?b.headers:{};const probe=await probePlayableUrl(url,headers);if(!probe.ok)return sendJson(res,400,{error:`La fuente no pasó la prueba de reproducción (HTTP ${probe.status}, ${probe.type}). No se agregó.`});const json=loadManagedEditable(destination);let group=json.find(g=>String(g?.name||'').toLowerCase()===category.toLowerCase());if(!group){group={name:category,samples:[]};json.push(group)}if(!Array.isArray(group.samples))group.samples=[];if(group.samples.some(x=>String(x?.uri||'')===probe.finalUrl))return sendJson(res,409,{error:'Ese stream ya existe en la categoría seleccionada'});const id=randomToken(9),item={name,uri:probe.finalUrl,_resolverId:id,_resolverPage:String(b.pageUrl||''),_resolverType:probe.type,headers};const icon=String(b.icon||'').trim();if(icon)item.icon=icon;group.samples.push(item);const saved=await saveOriginalAndPublish(destination,json,actor.id,'stream_resolver_published_original_and_app');return sendJson(res,201,{ok:true,id,destination,category,name,probe,stats:saved.stats,remote:saved.remote});}catch(e){return sendJson(res,400,{error:'No se pudo publicar: '+e.message});}}
    const resolverDelete=p.match(/^\/api\/admin\/stream-resolver\/published\/([^/]+)$/);
    if(resolverDelete&&m==='DELETE'){if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede quitar canales'});const id=decodeURIComponent(resolverDelete[1]);for(const key of ['tv1','tv2']){let json;try{json=loadManagedEditable(key)}catch{continue}let removed=null;for(const g of json){const arr=Array.isArray(g?.samples)?g.samples:[];const i=arr.findIndex(x=>x?._resolverId===id);if(i>=0){removed=arr.splice(i,1)[0];break}}if(removed){const saved=await saveOriginalAndPublish(key,json,actor.id,'stream_resolver_removed_original_and_app');return sendJson(res,200,{ok:true,destination:key,name:removed.name||'',remote:saved.remote});}}return sendJson(res,404,{error:'Canal agregado por Resolver no encontrado'});}
    const resolverMove=p.match(/^\/api\/admin\/stream-resolver\/published\/([^/]+)\/move$/);
    if(resolverMove&&m==='POST'){if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede mover canales'});const id=decodeURIComponent(resolverMove[1]),b=await readJson(req),destination=String(b.destination||'').toLowerCase();if(!['tv1','tv2'].includes(destination))return sendJson(res,400,{error:'Destino inválido'});let sourceKey=null,sourceJson=null,item=null,category='RESOLVER WEB';for(const key of ['tv1','tv2']){const json=loadManagedEditable(key);for(const g of json){const arr=Array.isArray(g?.samples)?g.samples:[];const i=arr.findIndex(x=>x?._resolverId===id);if(i>=0){sourceKey=key;sourceJson=json;item=arr[i];category=String(g?.name||category);if(sourceKey===destination)return sendJson(res,200,{ok:true,alreadyThere:true,destination,name:item.name||''});arr.splice(i,1);break}}if(item)break}if(!item)return sendJson(res,404,{error:'Canal agregado por Resolver no encontrado'});const destJson=loadManagedEditable(destination);let group=destJson.find(g=>String(g?.name||'').toLowerCase()===category.toLowerCase());if(!group){group={name:category,samples:[]};destJson.push(group)}if(!Array.isArray(group.samples))group.samples=[];if(group.samples.some(x=>String(x?.uri||'')===String(item.uri||'')))return sendJson(res,409,{error:'Ese stream ya existe en el destino'});group.samples.push(item);const outSaved=await saveOriginalAndPublish(sourceKey,sourceJson,actor.id,'stream_resolver_moved_out_original_and_app');const inSaved=await saveOriginalAndPublish(destination,destJson,actor.id,'stream_resolver_moved_in_original_and_app');return sendJson(res,200,{ok:true,from:sourceKey,destination,name:item.name||'',category,sourceRemote:outSaved.remote,destinationRemote:inSaved.remote});}

    if(p==='/api/admin/dashboard'&&m==='GET'){
      const directAccounts=actor.role_level===1?Number(db.prepare('SELECT COUNT(*) n FROM accounts').get().n)-1:Number(db.prepare('SELECT COUNT(*) n FROM accounts WHERE parent_id=?').get(actor.id).n);
      const directClients=actor.role_level===1?Number(db.prepare('SELECT COUNT(*) n FROM clients').get().n):Number(db.prepare('SELECT COUNT(*) n FROM clients WHERE owner_account_id=?').get(actor.id).n);
      const pending=actor.role_level===1?Number(db.prepare("SELECT COUNT(*) n FROM client_devices WHERE status='pending'").get().n):Number(db.prepare("SELECT COUNT(*) n FROM client_devices cd JOIN clients c ON c.id=cd.client_id WHERE cd.status='pending' AND c.owner_account_id=?").get(actor.id).n);
      const promo=activePromotionFor(actor.role_level);
      return sendJson(res,200,{role:roles[actor.role_level],credits:actor.credits,creditsUnlimited:actor.role_level===1,minCreditTransfer:MIN_CREDIT_TRANSFER,directAccounts,directClients,pendingClientDevices:pending,demosEnabled:boolSetting('demos_enabled',false),demoMinutes:DEMO_DURATION_MINUTES,demoDurations:DEMO_ALLOWED_MINUTES,demoCanGrant:actor.role_level===1,activePromotion:promo?{name:promo.name,percent:promo.percent_bonus,endsAt:promo.ends_at}:null});
    }

    if(p==='/api/admin/accounts'&&m==='GET'){
      let rows=actor.role_level===1?db.prepare('SELECT * FROM accounts WHERE deleted_at IS NULL ORDER BY role_level,id').all():db.prepare('SELECT * FROM accounts WHERE parent_id=? AND deleted_at IS NULL ORDER BY role_level,id').all(actor.id);
      rows=rows.filter(x=>x.id!==actor.id || actor.role_level===1).map(accountPublic);
      for(const x of rows){x.panel_device_count=Number(db.prepare('SELECT COUNT(*) n FROM panel_devices WHERE account_id=? AND active=1').get(x.id).n);x.parent_name=x.parent_id?(accountRaw(x.parent_id)?.name||null):null;}
      return sendJson(res,200,{accounts:rows,enabledRoleLevels:enabledPanelRoleLevels(),creatableRoleLevels:creatablePanelRoleLevelsFor(actor)});
    }
    if(p==='/api/admin/role-settings'&&m==='PUT'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede configurar las categorías habilitadas'});
      const b=await readJson(req),raw=Array.isArray(b.enabledRoleLevels)?b.enabledRoleLevels:[];
      const enabled=[...new Set(raw.map(Number).filter(x=>PANEL_ROLE_LEVELS.includes(x)))].sort((a,b)=>a-b);
      setSetting('panel_enabled_role_levels',JSON.stringify(enabled));
      audit(actor.id,'panel_role_creation_settings_changed','settings',null,enabled.map(x=>roles[x]).join(', '));
      return sendJson(res,200,{ok:true,enabledRoleLevels:enabled});
    }
    if(p==='/api/admin/accounts'&&m==='POST'){
      const b=await readJson(req),level=Number(b.roleLevel);
      if(level===5)return sendJson(res,400,{error:'CLIENTE final no es una ficha PANEL. Se crea únicamente desde la sección Clientes finales'});
      if(!PANEL_ROLE_LEVELS.includes(level))return sendJson(res,400,{error:'Categoría PANEL inválida'});
      if(!isPanelRoleCreationEnabled(level))return sendJson(res,403,{error:`La categoría ${roles[level]} está desactivada por ADMINISTRACIÓN`});
      if(!canCreateLevel(actor,level))return sendJson(res,403,{error:'Solo podés crear categorías inferiores a la tuya'});
      const name=String(b.name||'').trim();if(name.length<2)return sendJson(res,400,{error:'Nombre requerido'});const t=nowIso(),code=generateCode('accounts');
      const r=db.prepare('INSERT INTO accounts(name,role_level,parent_id,contact,notes,credits,active,inactivity_blocked,activation_code,created_at,updated_at) VALUES (?,?,?,?,?,0,1,0,?,?,?)')
        .run(name,level,actor.id,String(b.contact||'').trim(),String(b.notes||'').trim(),code,t,t);
      return sendJson(res,201,{ok:true,id:Number(r.lastInsertRowid),activationCode:code,role:roles[level]});
    }
    const am=p.match(/^\/api\/admin\/accounts\/(\d+)$/);
    if(am&&m==='PUT'){
      const id=Number(am[1]),target=accountRaw(id);if(!target)return sendJson(res,404,{error:'Ficha no encontrada'});if(!canEditAccount(actor,target))return sendJson(res,403,{error:'Solo podés editar tus fichas directas'});
      const b=await readJson(req);let role=target.role_level,parent=target.parent_id;
      const rootProtected=isRootAdminAccount(target);
      if(rootProtected){
        if(b.roleLevel!==undefined&&Number(b.roleLevel)!==1)return sendJson(res,409,{error:'La ADMINISTRACIÓN principal no puede bajar de categoría'});
        if(b.parentId!==undefined&&b.parentId!==null)return sendJson(res,409,{error:'La ADMINISTRACIÓN principal no puede tener propietario'});
        if(b.active!==undefined&&!b.active)return sendJson(res,409,{error:'La ADMINISTRACIÓN principal no puede bloquearse ni deshabilitarse'});
      }
      if(actor.role_level===1&&!rootProtected){
        if(b.roleLevel!==undefined){const requestedRole=Number(b.roleLevel);if(!PANEL_ROLE_LEVELS.includes(requestedRole))return sendJson(res,400,{error:'Categoría inválida'});if(requestedRole!==Number(target.role_level)&&!isPanelRoleCreationEnabled(requestedRole))return sendJson(res,409,{error:`La categoría ${roles[requestedRole]} está desactivada por ADMINISTRACIÓN`});role=requestedRole;}
        if(b.parentId!==undefined){parent=b.parentId===null?null:Number(b.parentId);if(parent===id||wouldCycle(id,parent))return sendJson(res,400,{error:'Relación de propietario inválida'});}
      } else if(actor.role_level!==1&&(b.roleLevel!==undefined||b.parentId!==undefined))return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede cambiar categoría o propietario'});
      const name=b.name!==undefined?String(b.name).trim():target.name;if(name.length<2)return sendJson(res,400,{error:'Nombre requerido'});
      const active=rootProtected?1:(b.active!==undefined?(b.active?1:0):target.active);
      db.prepare('UPDATE accounts SET name=?,role_level=?,parent_id=?,contact=?,notes=?,active=?,updated_at=? WHERE id=?').run(name,role,parent,b.contact!==undefined?String(b.contact).trim():target.contact,b.notes!==undefined?String(b.notes).trim():target.notes,active,nowIso(),id);
      return sendJson(res,200,{ok:true});
    }

    const accountBlock=p.match(/^\/api\/admin\/accounts\/(\d+)\/block$/);
    if(accountBlock&&m==='POST'){
      const id=Number(accountBlock[1]),target=accountRaw(id);if(!target||target.deleted_at)return sendJson(res,404,{error:'Ficha no encontrada'});
      if(!canManageDirectPanel(actor,target))return sendJson(res,403,{error:'Solo podés bloquear paneles inferiores de tu propia rama'});
      const b=await readJson(req),reason=String(b.reason||'').trim();if(reason.length<2)return sendJson(res,400,{error:'Debés indicar el motivo del bloqueo'});
      const t=nowIso();db.prepare('UPDATE accounts SET manual_blocked=1,block_reason=?,blocked_by_account_id=?,blocked_at=?,updated_at=? WHERE id=?').run(reason,actor.id,t,t,id);
      audit(actor.id,'panel_blocked','account',id,reason);
      return sendJson(res,200,{ok:true,creditRefunded:0,clientsTransferred:0,clientsRemainActiveUntilExpiry:true});
    }
    const accountUnblock=p.match(/^\/api\/admin\/accounts\/(\d+)\/unblock$/);
    if(accountUnblock&&m==='POST'){
      const id=Number(accountUnblock[1]),target=accountRaw(id);if(!target||target.deleted_at)return sendJson(res,404,{error:'Ficha no encontrada'});
      if(!canManageDirectPanel(actor,target))return sendJson(res,403,{error:'Solo podés desbloquear paneles inferiores de tu propia rama'});
      db.prepare("UPDATE accounts SET manual_blocked=0,block_reason='',blocked_by_account_id=NULL,blocked_at=NULL,updated_at=? WHERE id=?").run(nowIso(),id);
      audit(actor.id,'panel_unblocked','account',id);
      return sendJson(res,200,{ok:true});
    }
    const accountDelete=p.match(/^\/api\/admin\/accounts\/(\d+)$/);
    if(accountDelete&&m==='DELETE'){
      const id=Number(accountDelete[1]),target=accountRaw(id);if(!target||target.deleted_at)return sendJson(res,404,{error:'Ficha no encontrada'});
      if(!canManageDirectPanel(actor,target))return sendJson(res,403,{error:'Solo podés eliminar paneles inferiores de tu propia rama'});
      const b=await readJson(req);if(String(b.confirm||'')!=='ELIMINAR')return sendJson(res,400,{error:'Confirmación inválida'});
      const t=nowIso();
      // Borrado lógico deliberado: NO mueve clientes, NO devuelve créditos y NO altera vencimientos/dispositivos de clientes.
      db.prepare("UPDATE accounts SET manual_blocked=1,block_reason='Panel eliminado',deleted_at=?,deleted_by_account_id=?,updated_at=? WHERE id=?").run(t,actor.id,t,id);
      db.prepare('DELETE FROM panel_sessions WHERE panel_device_id IN (SELECT id FROM panel_devices WHERE account_id=?)').run(id);
      db.prepare('UPDATE panel_devices SET active=0,updated_at=? WHERE account_id=?').run(t,id);
      audit(actor.id,'panel_deleted','account',id,'Sin devolución de créditos; sin transferencia de clientes; clientes activos continúan hasta vencimiento');
      return sendJson(res,200,{ok:true,creditRefunded:0,clientsTransferred:0,clientsRemainActiveUntilExpiry:true});
    }

    const regen=p.match(/^\/api\/admin\/accounts\/(\d+)\/regenerate-code$/);
    if(regen&&m==='POST'){
      const id=Number(regen[1]),target=accountRaw(id);if(!target)return sendJson(res,404,{error:'Ficha no encontrada'});if(!canEditAccount(actor,target))return sendJson(res,403,{error:'Sin permiso'});const code=generateCode('accounts');db.prepare('UPDATE accounts SET activation_code=?,updated_at=? WHERE id=?').run(code,nowIso(),id);return sendJson(res,200,{ok:true,activationCode:code});
    }
    const pdev=p.match(/^\/api\/admin\/accounts\/(\d+)\/panel-devices$/);
    if(pdev&&m==='GET'){
      const id=Number(pdev[1]),target=accountRaw(id);if(!target)return sendJson(res,404,{error:'Ficha no encontrada'});if(!(actor.id===id||canEditAccount(actor,target)))return sendJson(res,403,{error:'Sin permiso'});
      return sendJson(res,200,{devices:db.prepare('SELECT id,device_uid,device_name,active,last_seen_at,created_at FROM panel_devices WHERE account_id=? ORDER BY id DESC').all(id).map(d=>({...d,active:Boolean(d.active)}))});
    }
    const prelease=p.match(/^\/api\/admin\/panel-devices\/(\d+)\/release$/);
    if(prelease&&m==='POST'){
      const d=db.prepare('SELECT pd.*,a.parent_id FROM panel_devices pd JOIN accounts a ON a.id=pd.account_id WHERE pd.id=?').get(Number(prelease[1]));if(!d)return sendJson(res,404,{error:'Dispositivo no encontrado'});
      if(!(actor.role_level===1||d.parent_id===actor.id))return sendJson(res,403,{error:'Solo el propietario directo o ADMINISTRACIÓN puede liberar este dispositivo'});
      if(Number(d.account_id)===rootAdminId()){
        const activeCount=Number(db.prepare('SELECT COUNT(*) n FROM panel_devices WHERE account_id=? AND active=1').get(d.account_id).n);
        if(activeCount<=1)return sendJson(res,409,{error:'La ADMINISTRACIÓN principal debe conservar al menos 1 dispositivo activo. Activá el reemplazo antes de liberar este equipo.'});
      }
      db.prepare('UPDATE panel_devices SET active=0,updated_at=? WHERE id=?').run(nowIso(),d.id);db.prepare('DELETE FROM panel_sessions WHERE panel_device_id=?').run(d.id);return sendJson(res,200,{ok:true});
    }

    const credit=p.match(/^\/api\/admin\/accounts\/(\d+)\/credits$/);
    if(credit&&m==='POST'){
      const to=accountRaw(Number(credit[1]));if(!to)return sendJson(res,404,{error:'Ficha destino no encontrada'});if(Number(to.id)===Number(actor.id))return sendJson(res,400,{error:'No podés cargarte créditos a tu propia ficha'});if(Number(to.role_level)===1)return sendJson(res,409,{error:'Esta ficha no recibe cargas de créditos'});if(actor.role_level!==1&&to.parent_id!==actor.id)return sendJson(res,403,{error:'Solo podés cargar créditos a una ficha directa'});
      const b=await readJson(req),amount=Number(b.amount);if(!Number.isInteger(amount)||amount<MIN_CREDIT_TRANSFER)return sendJson(res,400,{error:`La carga mínima es de ${MIN_CREDIT_TRANSFER} créditos`});if(actor.role_level!==1&&actor.credits<amount)return sendJson(res,409,{error:`Saldo insuficiente. Disponible: ${actor.credits} créditos`});
      const promo=activePromotionFor(to.role_level),bonus=promoBonus(amount,promo),t=nowIso();db.exec('BEGIN');
      try{
        if(actor.role_level!==1)db.prepare('UPDATE accounts SET credits=credits-?,updated_at=? WHERE id=?').run(amount,t,actor.id);
        db.prepare('UPDATE accounts SET credits=credits+?,last_credit_received_at=?,inactivity_blocked=0,updated_at=? WHERE id=?').run(amount+bonus,t,t,to.id);
        db.prepare('INSERT INTO credit_movements(kind,from_account_id,to_account_id,amount,promotion_id,created_by_account_id,note,created_at) VALUES (?,?,?,?,?,?,?,?)')
          .run(actor.role_level===1?'admin_load':'transfer',actor.role_level===1?null:actor.id,to.id,amount,null,actor.id,'Carga de créditos',t);
        if(bonus>0)db.prepare('INSERT INTO credit_movements(kind,from_account_id,to_account_id,amount,promotion_id,created_by_account_id,note,created_at) VALUES (\'promo_bonus\',NULL,?,?,?,?,?,?)')
          .run(to.id,bonus,promo.id,actor.id,`Bonus automático ${promo.percent_bonus}%`,t);
        db.exec('COMMIT');
      }catch(e){db.exec('ROLLBACK');throw e;}
      return sendJson(res,200,{ok:true,baseAmount:amount,promoBonus:bonus,totalReceived:amount+bonus,promotion:promo?promo.name:null,senderCharged:actor.role_level===1?0:amount,senderUnlimited:actor.role_level===1,senderBalance:actor.role_level===1?null:actor.credits-amount,minCreditTransfer:MIN_CREDIT_TRANSFER});
    }
    if(p==='/api/admin/credit-history'&&m==='GET'){
      const rows=actor.role_level===1?db.prepare(`SELECT cm.*,fa.name from_name,ta.name to_name,ca.name created_by_name FROM credit_movements cm LEFT JOIN accounts fa ON fa.id=cm.from_account_id JOIN accounts ta ON ta.id=cm.to_account_id JOIN accounts ca ON ca.id=cm.created_by_account_id ORDER BY cm.id DESC LIMIT 300`).all():db.prepare(`SELECT cm.*,fa.name from_name,ta.name to_name,ca.name created_by_name FROM credit_movements cm LEFT JOIN accounts fa ON fa.id=cm.from_account_id JOIN accounts ta ON ta.id=cm.to_account_id JOIN accounts ca ON ca.id=cm.created_by_account_id WHERE cm.created_by_account_id=? OR cm.to_account_id=? ORDER BY cm.id DESC LIMIT 200`).all(actor.id,actor.id);
      return sendJson(res,200,{movements:rows});
    }

    if(p==='/api/admin/clients'&&m==='GET'){
      let rows=actor.role_level===1?db.prepare(`SELECT c.*,a.name owner_name,a.role_level owner_role FROM clients c JOIN accounts a ON a.id=c.owner_account_id ORDER BY c.id DESC`).all():db.prepare(`SELECT c.*,a.name owner_name,a.role_level owner_role FROM clients c JOIN accounts a ON a.id=c.owner_account_id WHERE c.owner_account_id=? ORDER BY c.id DESC`).all(actor.id);
      rows=rows.map(c=>({...c,active:Boolean(c.active),days_remaining:daysRemaining(c.expires_at),renew_available:!c.expires_at||daysRemaining(c.expires_at)<=RENEW_WINDOW_DAYS,...clientStatusSummary(c)}));
      return sendJson(res,200,{clients:rows});
    }
    if(p==='/api/admin/clients'&&m==='POST'){
      const b=await readJson(req),name=String(b.name||'').trim();if(name.length<2)return sendJson(res,400,{error:'Nombre requerido'});let owner=actor.id;
      if(actor.role_level===1&&b.ownerAccountId!==undefined){owner=Number(b.ownerAccountId);if(!accountRaw(owner))return sendJson(res,400,{error:'Propietario inválido'});}const t=nowIso();const r=db.prepare('INSERT INTO clients(name,owner_account_id,notes,active,expires_at,created_at,updated_at) VALUES (?,?,?,1,NULL,?,?)').run(name,owner,String(b.notes||'').trim(),t,t);return sendJson(res,201,{ok:true,id:Number(r.lastInsertRowid)});
    }
    const cm=p.match(/^\/api\/admin\/clients\/(\d+)$/);
    if(cm&&m==='PUT'){
      const c=clientRow(Number(cm[1]));if(!c)return sendJson(res,404,{error:'Cliente no encontrado'});if(!canEditClient(actor,c))return sendJson(res,403,{error:'Solo podés editar clientes directos'});const b=await readJson(req);let owner=c.owner_account_id;if(actor.role_level===1&&b.ownerAccountId!==undefined){owner=Number(b.ownerAccountId);if(!accountRaw(owner))return sendJson(res,400,{error:'Propietario inválido'});}else if(actor.role_level!==1&&b.ownerAccountId!==undefined)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede mover clientes'});
      db.prepare('UPDATE clients SET name=?,owner_account_id=?,notes=?,active=?,updated_at=? WHERE id=?').run(b.name!==undefined?String(b.name).trim():c.name,owner,b.notes!==undefined?String(b.notes).trim():c.notes,b.active!==undefined?(b.active?1:0):c.active,nowIso(),c.id);return sendJson(res,200,{ok:true});
    }
    if(cm&&m==='DELETE'){
      const c=clientRow(Number(cm[1]));if(!c)return sendJson(res,404,{error:'Cliente no encontrado'});
      if(!canEditClient(actor,c))return sendJson(res,403,{error:'Solo podés eliminar tus propios clientes'});
      const b=await readJson(req);if(String(b.confirm||'')!=='ELIMINAR')return sendJson(res,400,{error:'Falta confirmación de eliminación'});
      deleteClientRecord(c.id,{actorId:actor.id,reason:String(b.reason||'Eliminación manual').trim()||'Eliminación manual'});
      return sendJson(res,200,{ok:true,deletedClientId:c.id});
    }
    if(p==='/api/admin/deleted-clients'&&m==='GET'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede ver el historial de eliminados'});
      return sendJson(res,200,{items:db.prepare('SELECT * FROM deleted_clients_history ORDER BY id DESC LIMIT 300').all()});
    }
    const renew=p.match(/^\/api\/admin\/clients\/(\d+)\/renew$/);
    if(renew&&m==='POST'){
      const c=clientRow(Number(renew[1]));if(!c)return sendJson(res,404,{error:'Cliente no encontrado'});if(!canEditClient(actor,c))return sendJson(res,403,{error:'Solo podés renovar clientes directos'});
      const owner=accountRaw(c.owner_account_id),renewCost=clientRenewCreditCost(c);
      if(owner.role_level!==1&&owner.credits<renewCost)return sendJson(res,409,{error:`La ficha propietaria necesita ${renewCost} crédito(s) para renovar este perfil`});
      const now=nowIso(),rem=daysRemaining(c.expires_at);if(c.expires_at&&rem>RENEW_WINDOW_DAYS)return sendJson(res,409,{error:`Renovación disponible cuando falten ${RENEW_WINDOW_DAYS} días o menos`,daysRemaining:rem});
      const prev=c.expires_at||null;let action,newExp;if(!prev){action='activate';newExp=addDays(now,CLIENT_DAYS);}else if(Date.parse(prev)<=Date.now()){action='reactivate';newExp=addDays(now,CLIENT_DAYS);}else{action='renew';newExp=addDays(prev,CLIENT_DAYS);}db.exec('BEGIN');
      try{
        if(owner.role_level!==1)db.prepare('UPDATE accounts SET credits=credits-?,updated_at=? WHERE id=?').run(renewCost,now,owner.id);
        db.prepare('UPDATE clients SET expires_at=?,active=1,updated_at=? WHERE id=?').run(newExp,now,c.id);
        db.prepare("UPDATE client_devices SET status='active',updated_at=? WHERE client_id=? AND status='pending'").run(now,c.id);
        db.prepare('INSERT INTO client_service_ledger(client_id,charged_account_id,created_by_account_id,credits_spent,previous_expiry,new_expiry,action,created_at) VALUES (?,?,?,?,?,?,?,?)').run(c.id,owner.id,actor.id,renewCost,prev,newExp,action,now);
        db.exec('COMMIT');
      }catch(e){db.exec('ROLLBACK');throw e;}
      return sendJson(res,200,{ok:true,action,previousExpiry:prev,newExpiry:newExp,creditsSpent:renewCost,deviceSlots:clientDeviceLimit(c),ownerIsAdministration:owner.role_level===1});
    }
    const convertDemo=p.match(/^\/api\/admin\/clients\/(\d+)\/convert-demo$/);
    if(convertDemo&&m==='POST'){
      const c=clientRow(Number(convertDemo[1]));if(!c)return sendJson(res,404,{error:'Cliente no encontrado'});if(!canEditClient(actor,c))return sendJson(res,403,{error:'Solo podés convertir demos de clientes directos'});
      const activeDemos=Number(db.prepare(`SELECT COUNT(*) n FROM device_demos dd JOIN client_devices cd ON cd.id=dd.device_id WHERE dd.client_id=? AND cd.status<>'blocked' AND dd.expires_at>?`).get(c.id,nowIso()).n);
      if(activeDemos<1)return sendJson(res,409,{error:'Este cliente no tiene un demo activo para convertir'});
      const owner=accountRaw(c.owner_account_id),cost=clientRenewCreditCost(c);if(owner.role_level!==1&&owner.credits<cost)return sendJson(res,409,{error:`La ficha propietaria necesita ${cost} crédito(s) para contratar este perfil`});
      const now=nowIso(),newExp=addDays(now,CLIENT_DAYS);db.exec('BEGIN');
      try{
        if(owner.role_level!==1)db.prepare('UPDATE accounts SET credits=credits-?,updated_at=? WHERE id=?').run(cost,now,owner.id);
        db.prepare('UPDATE clients SET expires_at=?,active=1,updated_at=? WHERE id=?').run(newExp,now,c.id);
        db.prepare("UPDATE client_devices SET status='active',updated_at=? WHERE client_id=? AND status<>'blocked'").run(now,c.id);
        db.prepare('UPDATE device_demos SET expires_at=? WHERE client_id=? AND expires_at>?').run(now,c.id,now);
        db.prepare('DELETE FROM client_sessions WHERE device_id IN (SELECT id FROM client_devices WHERE client_id=?)').run(c.id);
        db.prepare('INSERT INTO client_service_ledger(client_id,charged_account_id,created_by_account_id,credits_spent,previous_expiry,new_expiry,action,created_at) VALUES (?,?,?,?,?,?,?,?)').run(c.id,owner.id,actor.id,cost,c.expires_at||null,newExp,'activate',now);
        db.exec('COMMIT');
      }catch(e){db.exec('ROLLBACK');throw e;}
      audit(actor.id,'demo_converted_to_paid','client',c.id,`costo ${cost}; vence ${newExp}`);
      return sendJson(res,200,{ok:true,newExpiry:newExp,creditsSpent:owner.role_level===1?0:cost,deviceSlots:clientDeviceLimit(c),demoEnded:true,sharedExpiry:true});
    }
    const cdev=p.match(/^\/api\/admin\/clients\/(\d+)\/devices$/);
    if(cdev&&m==='GET'){
      const c=clientRow(Number(cdev[1]));if(!c)return sendJson(res,404,{error:'Cliente no encontrado'});if(!canManageClientDevice(actor,c))return sendJson(res,403,{error:'Sin permiso para gestionar dispositivos de este cliente'});refreshClientDevices(c.id);const devices=db.prepare('SELECT id,device_uid,device_name,activation_code,status,last_seen_at,created_at FROM client_devices WHERE client_id=? ORDER BY id DESC').all(c.id).map(d=>({...d,demo:{...demoInfo(d.id),used:demoInfo(d.id).used||demoEverUsedByUid(d.device_uid)}}));const changes=clientDeviceChangesThisMonth(c.id);return sendJson(res,200,{devices,clientStatus:clientStatusSummary(c),deviceLimit:clientDeviceLimit(c),changesThisMonth:changes,changesRemaining:Math.max(0,2-changes),renewCreditCost:clientRenewCreditCost(c)});
    }
    const extraDevices=p.match(/^\/api\/admin\/clients\/(\d+)\/extra-devices$/);
    if(extraDevices&&m==='POST'){
      const c=clientRow(Number(extraDevices[1]));if(!c)return sendJson(res,404,{error:'Cliente no encontrado'});
      if(!canEditClient(actor,c))return sendJson(res,403,{error:'Solo podés ampliar dispositivos de clientes directos'});
      const owner=accountRaw(c.owner_account_id);if(owner.role_level!==1&&owner.credits<1)return sendJson(res,409,{error:'El vendedor no tiene créditos suficientes'});
      const t=nowIso(),oldLimit=clientDeviceLimit(c),newLimit=oldLimit+2;
      db.exec('BEGIN');try{
        if(owner.role_level!==1)db.prepare('UPDATE accounts SET credits=credits-1,updated_at=? WHERE id=?').run(t,owner.id);
        db.prepare('UPDATE clients SET device_limit=?,updated_at=? WHERE id=?').run(newLimit,t,c.id);
        if(owner.role_level!==1)db.prepare("INSERT INTO credit_movements(kind,from_account_id,to_account_id,amount,promotion_id,created_by_account_id,note,created_at) VALUES ('extra_devices',?,?,?,?,?,?,?)").run(owner.id,owner.id,1,null,actor.id,`+2 dispositivos para ${c.name}; vencimiento compartido ${c.expires_at||'sin activar'}`,t);
        db.exec('COMMIT');
      }catch(e){db.exec('ROLLBACK');throw e;}
      audit(actor.id,'client_extra_devices','client',c.id,`límite ${oldLimit}→${newLimit}; costo 1 crédito`);
      return sendJson(res,200,{ok:true,creditsSpent:owner.role_level===1?0:1,oldLimit,newLimit,expiresAt:c.expires_at||null,sharedExpiry:true});
    }

    const deleteDevice=p.match(/^\/api\/admin\/client-devices\/(\d+)$/);
    if(deleteDevice&&m==='DELETE'){
      const d=db.prepare('SELECT cd.*,c.owner_account_id,c.name client_name FROM client_devices cd JOIN clients c ON c.id=cd.client_id WHERE cd.id=?').get(Number(deleteDevice[1]));
      if(!d)return sendJson(res,404,{error:'Dispositivo vinculado no encontrado'});
      if(!canManageClientDevice(actor,{owner_account_id:d.owner_account_id}))return sendJson(res,403,{error:'Solo podés reemplazar dispositivos de clientes de tu propia rama'});
      const changes=clientDeviceChangesThisMonth(d.client_id);
      if(actor.role_level!==1&&changes>=2)return sendJson(res,409,{error:'Este cliente ya realizó los 2 cambios de dispositivo permitidos este mes',changesThisMonth:changes,remaining:0});
      const t=nowIso(),demo=demoRow(d.id);
      db.exec('BEGIN');try{
        if(demo||demoEverUsedByUid(d.device_uid))db.prepare("INSERT INTO demo_device_history(device_uid,first_demo_at,last_demo_at,reset_by_admin_at) VALUES (?,?,?,NULL) ON CONFLICT(device_uid) DO UPDATE SET last_demo_at=excluded.last_demo_at,reset_by_admin_at=NULL").run(d.device_uid,demo?.started_at||t,demo?.started_at||t);
        db.prepare('DELETE FROM client_sessions WHERE device_id=?').run(d.id);
        if(demo)db.prepare('DELETE FROM device_demos WHERE device_id=?').run(d.id);
        db.prepare('INSERT INTO client_device_changes(client_id,device_uid,activation_code,changed_by_account_id,change_type,created_at) VALUES (?,?,?,?,?,?)').run(d.client_id,d.device_uid,d.activation_code,actor.id,'delete',t);
        db.prepare('DELETE FROM client_devices WHERE id=?').run(d.id);
        db.exec('COMMIT');
      }catch(e){db.exec('ROLLBACK');throw e;}
      audit(actor.id,'client_device_deleted','client',d.client_id,`${d.device_uid}; demo preservado=${Boolean(demo)}`);
      return sendJson(res,200,{ok:true,deleted:true,changesThisMonth:changes+1,remaining:Math.max(0,2-(changes+1)),creditRefunded:0,demoReset:false});
    }

    if(p==='/api/admin/client-devices/assign-by-code'&&m==='POST'){
      const b=await readJson(req),code=String(b.activationCode||'').trim().toUpperCase(),c=clientRow(Number(b.clientId));
      if(!c)return sendJson(res,404,{error:'Cliente no encontrado'});
      if(!canEditClient(actor,c))return sendJson(res,403,{error:'Solo podés vincular dispositivos de clientes directos'});
      const d=db.prepare('SELECT * FROM client_devices WHERE activation_code=?').get(code);
      if(!d)return sendJson(res,404,{error:'Código no encontrado'});
      if(d.client_id&&Number(d.client_id)!==Number(c.id))return sendJson(res,409,{error:'Ese código ya pertenece a otro cliente'});
      if(d.status==='blocked')return sendJson(res,409,{error:'Ese dispositivo está bloqueado'});
      const alreadyLinked=Boolean(d.client_id&&Number(d.client_id)===Number(c.id));
      const linked=Number(db.prepare("SELECT COUNT(*) n FROM client_devices WHERE client_id=? AND status IN ('pending','active')").get(c.id).n);
      if(!alreadyLinked&&linked>=clientDeviceLimit(c))return sendJson(res,409,{error:`El cliente ya alcanzó su límite de ${clientDeviceLimit(c)} dispositivos`});

      // v0.9.35: ADMINISTRACIÓN controla globalmente si existen demos y su duración (10/60 min).
      // Los paneles inferiores no pueden conceder demos manualmente. Al vincular un código a un cliente
      // sin servicio pago, el backend aplica automáticamente la configuración global, sin consumir créditos.
      const cs=clientAccessState(c),t=nowIso();
      let nextStatus=cs.ok?'active':'pending',demoResult={granted:false,reason:cs.ok?'paid_service_active':'not_granted'};
      db.exec('BEGIN');
      try{
        if(!alreadyLinked)db.prepare('UPDATE client_devices SET client_id=?,status=?,updated_at=? WHERE id=?').run(c.id,nextStatus,t,d.id);
        else if(d.status!=='active'&&!cs.ok)db.prepare("UPDATE client_devices SET status='pending',updated_at=? WHERE id=?").run(t,d.id);
        const current={...d,client_id:c.id,status:alreadyLinked?d.status:nextStatus};
        if(!cs.ok)demoResult=ensureAutomaticDemoForLinkedDevice(current);
        if(demoResult.granted)nextStatus='active';
        else if(cs.ok&&d.status!=='blocked'){db.prepare("UPDATE client_devices SET status='active',updated_at=? WHERE id=?").run(t,d.id);nextStatus='active';}
        db.exec('COMMIT');
      }catch(e){db.exec('ROLLBACK');throw e;}
      if(demoResult.granted)audit(actor.id,'demo_auto_granted_on_link','client_device',d.id,`${demoResult.durationMinutes} minutos según configuración ADMIN; cliente ${c.id}`);
      return sendJson(res,200,{ok:true,alreadyLinked,linkedDevices:alreadyLinked?linked:linked+1,limit:clientDeviceLimit(c),status:nextStatus,waitingForService:nextStatus==='pending',autoActivated:false,newExpiry:c.expires_at||null,creditsSpent:0,autoDemo:demoResult.granted,demoDurationMinutes:demoResult.granted?demoResult.durationMinutes:0,demoExpiresAt:demoResult.expiresAt||null,autoDemoReason:demoResult.reason,demosEnabled:boolSetting('demos_enabled',false)});
    }
    const assign=p.match(/^\/api\/admin\/client-devices\/(\d+)\/assign$/);
    if(assign&&m==='POST'){
      const d=db.prepare("SELECT * FROM client_devices WHERE id=? AND status='pending' AND client_id IS NULL").get(Number(assign[1]));if(!d)return sendJson(res,404,{error:'Dispositivo pendiente no encontrado'});const b=await readJson(req),c=clientRow(Number(b.clientId));if(!c)return sendJson(res,404,{error:'Cliente no encontrado'});if(!canEditClient(actor,c))return sendJson(res,403,{error:'Solo podés activar dispositivos de clientes directos'});const cs=clientAccessState(c);if(!cs.ok)return sendJson(res,409,{error:'El cliente no tiene servicio activo',reason:cs.reason});const n=Number(db.prepare("SELECT COUNT(*) n FROM client_devices WHERE client_id=? AND status='active' AND id<>?").get(c.id,d.id).n);if(n>=clientDeviceLimit(c))return sendJson(res,409,{error:`El cliente ya alcanzó su límite de ${clientDeviceLimit(c)} dispositivos`});db.prepare("UPDATE client_devices SET client_id=?,status='active',updated_at=? WHERE id=?").run(c.id,nowIso(),d.id);return sendJson(res,200,{ok:true,activeDevices:n+1,limit:clientDeviceLimit(c)});
    }
    const block=p.match(/^\/api\/admin\/client-devices\/(\d+)\/block$/);
    if(block&&m==='POST'){
      const d=db.prepare('SELECT cd.*,c.owner_account_id FROM client_devices cd LEFT JOIN clients c ON c.id=cd.client_id WHERE cd.id=?').get(Number(block[1]));if(!d)return sendJson(res,404,{error:'Dispositivo no encontrado'});if(!canManageClientDevice(actor,{owner_account_id:d.owner_account_id}))return sendJson(res,403,{error:'Solo podés bloquear dispositivos de clientes de tu propia rama'});const changedAt=nowIso();db.prepare("UPDATE client_devices SET status='blocked',updated_at=? WHERE id=?").run(changedAt,d.id);audit(actor.id,'client_device_blocked','client_device',d.id,'sesión preservada para permitir reactivación inmediata');return sendJson(res,200,{ok:true,creditRefunded:0,slotFreed:true,stateChangedAt:changedAt,sessionsPreserved:true});
    }
    const react=p.match(/^\/api\/admin\/client-devices\/(\d+)\/reactivate$/);
    if(react&&m==='POST'){
      const d=db.prepare('SELECT cd.*,c.owner_account_id,c.id client_id FROM client_devices cd JOIN clients c ON c.id=cd.client_id WHERE cd.id=?').get(Number(react[1]));if(!d)return sendJson(res,404,{error:'Dispositivo no encontrado'});if(!canManageClientDevice(actor,{owner_account_id:d.owner_account_id}))return sendJson(res,403,{error:'Solo podés reactivar dispositivos de clientes de tu propia rama'});const c=clientRow(d.client_id);const temp={...d,status:'pending'},st=deviceAccessState(temp,c);if(!st.ok)return sendJson(res,409,{error:'Cliente sin servicio ni demo activo'});const n=Number(db.prepare("SELECT COUNT(*) n FROM client_devices WHERE client_id=? AND status='active' AND id<>?").get(c.id,d.id).n);if(n>=clientDeviceLimit(c))return sendJson(res,409,{error:`Ya hay ${clientDeviceLimit(c)} dispositivos activos`});const changedAt=nowIso();db.prepare("UPDATE client_devices SET status='active',updated_at=? WHERE id=?").run(changedAt,d.id);audit(actor.id,'client_device_reactivated','client_device',d.id,'reactivación inmediata; sesión existente conservada si seguía vigente');return sendJson(res,200,{ok:true,accessMode:st.mode,stateChangedAt:changedAt,sessionsPreserved:true});
    }
    if(p==='/api/admin/client-devices'&&m==='GET'){
      let rows;if(actor.role_level===1)rows=db.prepare(`SELECT cd.*,c.name client_name,a.name owner_name,c.owner_account_id FROM client_devices cd LEFT JOIN clients c ON c.id=cd.client_id LEFT JOIN accounts a ON a.id=c.owner_account_id ORDER BY CASE cd.status WHEN 'pending' THEN 0 ELSE 1 END,cd.id DESC`).all();else rows=db.prepare(`SELECT cd.*,c.name client_name,a.name owner_name,c.owner_account_id FROM client_devices cd JOIN clients c ON c.id=cd.client_id JOIN accounts a ON a.id=c.owner_account_id WHERE c.owner_account_id=? ORDER BY cd.id DESC`).all(actor.id);rows=rows.map(x=>{const r=refreshDeviceState(x),c=r.client_id?clientRow(r.client_id):null,access=deviceAccessState(r,c),di=demoInfo(r.id);return {...r,demo:di,access_mode:access.ok?access.mode:null,effective_status:r.status==='blocked'?'BLOQUEADO':access.ok?(access.mode==='demo'?'DEMO ACTIVO':'ACTIVO'):(di.used?'DEMO VENCIDO':'PENDIENTE')};});return sendJson(res,200,{devices:rows});
    }
    if(p==='/api/admin/client-devices/manual'&&m==='POST'){
      const b=await readJson(req),uid=`manual-${crypto.randomUUID()}`,code=generateCode('client_devices'),secret=randomToken(),t=nowIso();const r=db.prepare("INSERT INTO client_devices(device_uid,device_name,platform,activation_code,secret_hash,status,created_at,updated_at) VALUES (?,?,?,?,?,'pending',?,?)").run(uid,String(b.deviceName||'Dispositivo de prueba').trim(), 'android',code,sha(secret),t,t);return sendJson(res,201,{ok:true,id:Number(r.lastInsertRowid),activationCode:code,deviceUid:uid,deviceSecret:secret});
    }



    if(p==='/api/admin/tv-gateways'&&m==='GET'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona los gateways de TV'});
      const [tv1,tv2]=await Promise.all([tvDedicatedAdminState('tv1'),tvDedicatedAdminState('tv2')]);
      return sendJson(res,200,{ticketTtlSeconds:COCHI_TV_GATEWAY_TTL_SECONDS,tv1,tv2});
    }
    const tvGatewayToggle=p.match(/^\/api\/admin\/tv-gateways\/(tv1|tv2)$/);
    if(tvGatewayToggle&&m==='PUT'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona los gateways de TV'});
      const sourceKey=tvGatewayToggle[1],b=await readJson(req);
      if(typeof b.enabled!=='boolean')return sendJson(res,400,{error:'Estado inválido'});
      if(b.enabled){
        if(!tvDedicatedConfigured(sourceKey))return sendJson(res,409,{error:`Configurá COCHI_${sourceKey.toUpperCase()}_GATEWAY_URL y COCHI_${sourceKey.toUpperCase()}_GATEWAY_SECRET en Railway antes de activar`});
        const health=await tvDedicatedHealth(sourceKey);
        if(!health.ok)return sendJson(res,502,{error:`No se activó ${sourceKey.toUpperCase()} porque su Worker no confirmó configuración: ${health.error||health.status||'sin respuesta'}`});
      }
      setSetting(`tv_gateway_${sourceKey}_enabled`,b.enabled?'1':'0');
      audit(actor.id,b.enabled?'tv_gateway_enabled':'tv_gateway_disabled','settings',null,sourceKey);
      return sendJson(res,200,{ok:true,state:await tvDedicatedAdminState(sourceKey)});
    }

    if(p==='/api/admin/playback-security'&&m==='GET'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona la seguridad de reproducción'});
      const st=playbackSecurityState(),health=await gatewayHealth();
      return sendJson(res,200,{...st,worker:health});
    }
    if(p==='/api/admin/playback-security'&&m==='PUT'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona la seguridad de reproducción'});
      const b=await readJson(req);
      if(typeof b.enabled!=='boolean')return sendJson(res,400,{error:'Estado inválido'});
      if(b.enabled){
        if(!gatewayConfigured())return sendJson(res,409,{error:'Configurá COCHI_GATEWAY_URL, COCHI_GATEWAY_MASTER_SECRET y COCHI_GATEWAY_CONTROL_SECRET en Railway antes de activar'});
        try{await syncGatewayGeneration(playbackGeneration());}catch(e){return sendJson(res,502,{error:'No se activó la seguridad porque el Worker no pudo sincronizarse: '+e.message});}
      }
      setSetting('playback_security_enabled',b.enabled?'1':'0');
      audit(actor.id,b.enabled?'playback_security_enabled':'playback_security_disabled','settings',null,`generation=${playbackGeneration()}`);
      return sendJson(res,200,{ok:true,...playbackSecurityState()});
    }
    if(p==='/api/admin/playback-security/rotate'&&m==='POST'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede rotar la clave de reproducción'});
      if(!gatewayConfigured())return sendJson(res,409,{error:'Gateway no configurado'});
      const current=playbackGeneration(),next=current>=2147483646?1:current+1;
      try{await syncGatewayGeneration(next);}catch(e){return sendJson(res,502,{error:'No se rotó la clave porque el Worker no confirmó el cambio: '+e.message});}
      setSetting('playback_generation',String(next));
      audit(actor.id,'playback_generation_rotated','settings',null,`${current}->${next}`);
      return sendJson(res,200,{ok:true,previousGeneration:current,generation:next,...playbackSecurityState()});
    }
    if(p==='/api/admin/playback-security/sync'&&m==='POST'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede sincronizar el Gateway'});
      try{const worker=await syncGatewayGeneration(playbackGeneration());return sendJson(res,200,{ok:true,generation:playbackGeneration(),worker});}
      catch(e){return sendJson(res,502,{error:'No se pudo sincronizar el Worker: '+e.message});}
    }

    if(p==='/api/admin/demo-settings'&&m==='GET'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona demos'});
      const enabled=boolSetting('demos_enabled',false),canGrant=true,durationMinutes=DEMO_ALLOWED_MINUTES.includes(Number(getSetting('demo_duration_minutes',String(DEMO_DURATION_MINUTES))))?Number(getSetting('demo_duration_minutes',String(DEMO_DURATION_MINUTES))):DEMO_DURATION_MINUTES;
      let demos;if(actor.role_level===1)demos=db.prepare(`SELECT dd.*,cd.activation_code,cd.device_name,cd.device_uid,c.name client_name,a.name granted_by_name FROM device_demos dd JOIN client_devices cd ON cd.id=dd.device_id JOIN clients c ON c.id=dd.client_id JOIN accounts a ON a.id=dd.granted_by_account_id ORDER BY dd.started_at DESC LIMIT 150`).all();else demos=db.prepare(`SELECT dd.*,cd.activation_code,cd.device_name,cd.device_uid,c.name client_name,a.name granted_by_name FROM device_demos dd JOIN client_devices cd ON cd.id=dd.device_id JOIN clients c ON c.id=dd.client_id JOIN accounts a ON a.id=dd.granted_by_account_id WHERE c.owner_account_id=? ORDER BY dd.started_at DESC LIMIT 100`).all(actor.id);
      const normalized=demos.map(x=>({...x,active:Date.parse(x.expires_at)>Date.now(),remainingSeconds:Math.max(0,Math.floor((Date.parse(x.expires_at)-Date.now())/1000))}));return sendJson(res,200,{enabled,durationMinutes,allowedDurations:DEMO_ALLOWED_MINUTES,canGrant,requiresPositiveCredit:actor.role_level!==1,activeCount:normalized.filter(x=>x.active).length,blockedCategories:demoBlockedCategories(),availableCategories:publishedCategoryNames(),demos:normalized});
    }
    if(p==='/api/admin/demo-settings'&&m==='PUT'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede gestionar los demos'});
      const b=await readJson(req);let changed=false;
      if(b.enabled!==undefined){if(typeof b.enabled!=='boolean')return sendJson(res,400,{error:'Estado inválido'});setSetting('demos_enabled',b.enabled?'1':'0');audit(actor.id,b.enabled?'demos_enabled':'demos_disabled','settings',null);changed=true;}
      if(b.durationMinutes!==undefined){const minutes=Number(b.durationMinutes);if(!DEMO_ALLOWED_MINUTES.includes(minutes))return sendJson(res,400,{error:'Duración inválida. Elegí 10 minutos o 1 hora.'});setSetting('demo_duration_minutes',String(minutes));audit(actor.id,'demo_duration_changed','settings',null,`${minutes} minutos`);changed=true;}
      if(b.blockedCategories!==undefined){
        if(!Array.isArray(b.blockedCategories))return sendJson(res,400,{error:'Categorías bloqueadas inválidas'});
        const available=new Map(publishedCategoryNames().map(name=>[normalizeCategoryKey(name),name]));
        const clean=[...new Set(b.blockedCategories.map(x=>String(x||'').trim()).filter(Boolean))].slice(0,200);
        const canonical=[];for(const name of clean){const k=normalizeCategoryKey(name);if(available.has(k)&&!canonical.some(x=>normalizeCategoryKey(x)===k))canonical.push(available.get(k));}
        setSetting('demo_blocked_categories',JSON.stringify(canonical));audit(actor.id,'demo_categories_changed','settings',null,canonical.join(', '));changed=true;
      }
      if(!changed)return sendJson(res,400,{error:'No se enviaron cambios'});
      return sendJson(res,200,{ok:true,enabled:boolSetting('demos_enabled',false),blockedCategories:demoBlockedCategories(),availableCategories:publishedCategoryNames(),durationMinutes:Number(getSetting('demo_duration_minutes',String(DEMO_DURATION_MINUTES))),allowedDurations:DEMO_ALLOWED_MINUTES});
    }
    // v0.9.38: no existe concesión manual de demos. Los demos se otorgan únicamente
    // de forma automática al vincular el dispositivo, según la configuración global.
    const demoReset=p.match(/^\/api\/admin\/client-devices\/(\d+)\/demo\/reset$/);
    if(demoReset&&m==='POST'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede resetear un demo'});
      const deviceId=Number(demoReset[1]),d=db.prepare('SELECT cd.*,c.id client_id,c.name client_name FROM client_devices cd JOIN clients c ON c.id=cd.client_id WHERE cd.id=?').get(deviceId);
      if(!d)return sendJson(res,404,{error:'Dispositivo vinculado no encontrado'});
      const demo=demoRow(deviceId),historyUsed=demoEverUsedByUid(d.device_uid);
      if(!demo&&!historyUsed)return sendJson(res,404,{error:'Este dispositivo no tiene demo ni historial de demo para resetear'});
      db.exec('BEGIN');try{db.prepare('DELETE FROM device_demos WHERE device_id=?').run(deviceId);db.prepare('DELETE FROM demo_device_history WHERE device_uid=?').run(d.device_uid);db.prepare('DELETE FROM client_sessions WHERE device_id=?').run(deviceId);db.prepare("UPDATE client_devices SET status='pending',updated_at=? WHERE id=? AND status<>'blocked'").run(nowIso(),deviceId);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
      audit(actor.id,'demo_reset_by_admin','client_device',deviceId,`cliente ${d.client_id}; historial_huerfano=${!demo&&historyUsed}`);
      return sendJson(res,200,{ok:true,demoUsed:false,historyReset:true,status:d.status==='blocked'?'blocked':'pending'});
    }
    const demoReduce=p.match(/^\/api\/admin\/client-devices\/(\d+)\/demo\/reduce-10$/);
    if(demoReduce&&m==='POST'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede reducir un demo'});
      const deviceId=Number(demoReduce[1]),d=db.prepare('SELECT cd.*,c.id client_id,c.name client_name FROM client_devices cd JOIN clients c ON c.id=cd.client_id WHERE cd.id=?').get(deviceId);
      if(!d)return sendJson(res,404,{error:'Dispositivo vinculado no encontrado'});
      const demo=demoRow(deviceId);if(!demo)return sendJson(res,404,{error:'Este dispositivo todavía no utilizó demo'});
      if(Date.parse(demo.expires_at)<=Date.now())return sendJson(res,409,{error:'El demo ya está finalizado'});
      const t=nowIso(),tenMin=addMinutes(t,10),exp=Date.parse(demo.expires_at)<=Date.parse(tenMin)?demo.expires_at:tenMin;
      db.exec('BEGIN');try{db.prepare('UPDATE device_demos SET expires_at=? WHERE device_id=?').run(exp,deviceId);db.prepare('DELETE FROM client_sessions WHERE device_id=?').run(deviceId);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
      refreshDeviceState(db.prepare('SELECT * FROM client_devices WHERE id=?').get(deviceId));audit(actor.id,'demo_reduced_10m','client_device',deviceId,`cliente ${d.client_id}; vence ${exp}`);
      return sendJson(res,200,{ok:true,expiresAt:exp,remainingSeconds:Math.max(0,Math.floor((Date.parse(exp)-Date.now())/1000)),demoStillUsed:true});
    }
    const demoExpire=p.match(/^\/api\/admin\/client-devices\/(\d+)\/demo\/expire$/);
    if(demoExpire&&m==='POST'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede cortar un demo'});
      const deviceId=Number(demoExpire[1]),d=db.prepare('SELECT cd.*,c.id client_id,c.name client_name FROM client_devices cd JOIN clients c ON c.id=cd.client_id WHERE cd.id=?').get(deviceId);
      if(!d)return sendJson(res,404,{error:'Dispositivo vinculado no encontrado'});
      const demo=demoRow(deviceId);if(!demo)return sendJson(res,404,{error:'Este dispositivo todavía no utilizó demo'});
      if(Date.parse(demo.expires_at)<=Date.now())return sendJson(res,200,{ok:true,alreadyExpired:true,expiresAt:demo.expires_at,demoStillUsed:true});
      const t=nowIso();db.exec('BEGIN');try{db.prepare('UPDATE device_demos SET expires_at=? WHERE device_id=?').run(t,deviceId);db.prepare('DELETE FROM client_sessions WHERE device_id=?').run(deviceId);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
      refreshDeviceState(db.prepare('SELECT * FROM client_devices WHERE id=?').get(deviceId));audit(actor.id,'demo_expired_by_admin','client_device',deviceId,`cliente ${d.client_id}`);
      return sendJson(res,200,{ok:true,expiresAt:t,demoStillUsed:true});
    }
    if(p==='/api/admin/demos/expire-all'&&m==='POST'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede cortar todos los demos'});
      const t=nowIso(),active=db.prepare('SELECT device_id,client_id FROM device_demos WHERE expires_at>?').all(t);
      if(!active.length)return sendJson(res,200,{ok:true,expiredCount:0,demoStillUsed:true});
      db.exec('BEGIN');try{const qExp=db.prepare('UPDATE device_demos SET expires_at=? WHERE device_id=?'),qSession=db.prepare('DELETE FROM client_sessions WHERE device_id=?');for(const x of active){qExp.run(t,x.device_id);qSession.run(x.device_id);}db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
      for(const x of active){const d=db.prepare('SELECT * FROM client_devices WHERE id=?').get(x.device_id);if(d)refreshDeviceState(d);}
      audit(actor.id,'all_active_demos_expired','settings',null,`cantidad=${active.length}`);
      return sendJson(res,200,{ok:true,expiredCount:active.length,expiresAt:t,demoStillUsed:true});
    }

    if(p==='/api/admin/adult-settings'&&m==='GET'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona el PIN de adultos'});const globalHash=getSetting('adult_pin_hash',''),globalEnabled=boolSetting('adult_lock_enabled',false),maxAttempts=Math.max(1,Number(getSetting('adult_max_attempts',String(DEFAULT_ADULT_MAX_ATTEMPTS)))||DEFAULT_ADULT_MAX_ATTEMPTS);const clients=db.prepare(`SELECT c.id,c.name,c.owner_account_id,c.adult_policy,c.adult_pin_hash,c.adult_locked,c.adult_fail_count,a.name owner_name FROM clients c JOIN accounts a ON a.id=c.owner_account_id ORDER BY c.id DESC`).all().map(c=>{const eff=effectiveAdult(c);return {id:c.id,name:c.name,ownerName:c.owner_name,policy:c.adult_policy,customPinConfigured:Boolean(c.adult_pin_hash),locked:Boolean(c.adult_locked),failedAttempts:Number(c.adult_fail_count||0),effectiveEnabled:eff.enabled,effectivePinConfigured:eff.pinConfigured};});return sendJson(res,200,{globalEnabled,globalPinConfigured:Boolean(globalHash),maxAttempts,clients});
    }
    if(p==='/api/admin/adult-settings'&&m==='PUT'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona el PIN de adultos'});const b=await readJson(req);if(b.pin!==undefined&&String(b.pin)!==''){if(!validPin(b.pin))return sendJson(res,400,{error:'El PIN debe tener entre 4 y 8 números'});setSetting('adult_pin_hash',hashPin(String(b.pin)));audit(actor.id,'adult_global_pin_changed','settings',null);}if(b.enabled!==undefined){if(typeof b.enabled!=='boolean')return sendJson(res,400,{error:'Estado inválido'});if(b.enabled&&!getSetting('adult_pin_hash',''))return sendJson(res,409,{error:'Configurá primero un PIN global'});setSetting('adult_lock_enabled',b.enabled?'1':'0');audit(actor.id,b.enabled?'adult_global_enabled':'adult_global_disabled','settings',null);}if(b.maxAttempts!==undefined){const n=Number(b.maxAttempts);if(!Number.isInteger(n)||n<1||n>10)return sendJson(res,400,{error:'Intentos permitidos: entre 1 y 10'});setSetting('adult_max_attempts',String(n));audit(actor.id,'adult_max_attempts_changed','settings',null,String(n));}return sendJson(res,200,{ok:true});
    }
    const adultClient=p.match(/^\/api\/admin\/clients\/(\d+)\/adult$/);
    if(adultClient&&m==='PUT'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona el PIN de adultos'});const c=clientRow(Number(adultClient[1]));if(!c)return sendJson(res,404,{error:'Cliente no encontrado'});const b=await readJson(req);let policy=c.adult_policy,pinHash=c.adult_pin_hash,locked=Number(c.adult_locked||0),fails=Number(c.adult_fail_count||0);if(b.policy!==undefined){policy=String(b.policy);if(!['inherit','force_on','force_off'].includes(policy))return sendJson(res,400,{error:'Política inválida'});}if(b.pin!==undefined&&String(b.pin)!==''){if(!validPin(b.pin))return sendJson(res,400,{error:'El PIN debe tener entre 4 y 8 números'});pinHash=hashPin(String(b.pin));fails=0;locked=0;}if(b.clearCustomPin===true){pinHash=null;fails=0;locked=0;}if(b.locked!==undefined){locked=b.locked?1:0;if(!locked)fails=0;}db.prepare('UPDATE clients SET adult_policy=?,adult_pin_hash=?,adult_locked=?,adult_fail_count=?,updated_at=? WHERE id=?').run(policy,pinHash,locked,fails,nowIso(),c.id);audit(actor.id,'adult_client_changed','client',c.id,`policy=${policy};locked=${locked};customPin=${Boolean(pinHash)}`);return sendJson(res,200,{ok:true});
    }

    if(p==='/api/admin/promotions'&&m==='GET'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona promociones'});return sendJson(res,200,{promotions:db.prepare('SELECT * FROM promotions ORDER BY id DESC').all().map(x=>({...x,active:Boolean(x.active),targetLevels:String(x.target_levels).split(',').map(Number)}))});
    }
    if(p==='/api/admin/promotions'&&m==='POST'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona promociones'});const b=await readJson(req),name=String(b.name||'').trim(),pct=Number(b.percentBonus),start=String(b.startsAt||''),end=String(b.endsAt||''),levels=[...new Set((Array.isArray(b.targetLevels)?b.targetLevels:[]).map(Number).filter(x=>x>=2&&x<=4))];if(name.length<2||!Number.isInteger(pct)||pct<=0||!levels.length||!Number.isFinite(Date.parse(start))||!Number.isFinite(Date.parse(end))||Date.parse(end)<=Date.parse(start))return sendJson(res,400,{error:'Datos de promoción inválidos'});
      const existing=db.prepare('SELECT * FROM promotions WHERE active=1').all();for(const x of existing){const overlap=Date.parse(start)<=Date.parse(x.ends_at)&&Date.parse(end)>=Date.parse(x.starts_at);const targetOverlap=String(x.target_levels).split(',').map(Number).some(v=>levels.includes(v));if(overlap&&targetOverlap)return sendJson(res,409,{error:'Ya existe una promoción activa que se superpone para alguna de esas categorías'});}
      const t=nowIso();const r=db.prepare('INSERT INTO promotions(name,percent_bonus,target_levels,starts_at,ends_at,active,created_by_account_id,created_at,updated_at) VALUES (?,?,?,?,?,1,?,?,?)').run(name,pct,levels.join(','),start,end,actor.id,t,t);return sendJson(res,201,{ok:true,id:Number(r.lastInsertRowid)});
    }
    const pm=p.match(/^\/api\/admin\/promotions\/(\d+)$/);
    if(pm&&m==='PUT'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona promociones'});const x=db.prepare('SELECT * FROM promotions WHERE id=?').get(Number(pm[1]));if(!x)return sendJson(res,404,{error:'Promoción no encontrada'});const b=await readJson(req);db.prepare('UPDATE promotions SET name=?,percent_bonus=?,active=?,updated_at=? WHERE id=?').run(b.name!==undefined?String(b.name).trim():x.name,b.percentBonus!==undefined?Number(b.percentBonus):x.percent_bonus,b.active!==undefined?(b.active?1:0):x.active,nowIso(),x.id);return sendJson(res,200,{ok:true});
    }

    const contentMatch=p.match(/^\/api\/admin\/content\/(tv1|tv2|movies|series)$/);
    if(contentMatch&&m==='GET'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona contenido'});
      const r=db.prepare('SELECT * FROM managed_content WHERE source_key=?').get(contentMatch[1]);let json=null,stats=null;
      if(r?.json_text){try{const stored=JSON.parse(r.json_text);json=decryptManagedContent(stored);stats=contentStats(json);}catch(e){return sendJson(res,500,{error:'El contenido guardado no pudo abrirse en modo editable: '+e.message});}}
      return sendJson(res,200,{key:contentMatch[1],json,stats,updatedAt:r?.updated_at||null,editorMode:'decrypted'});
    }
    if(contentMatch&&m==='PUT'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona contenido'});
      const b=await readJson(req,30*1024*1024);if(b.json===undefined)return sendJson(res,400,{error:'Falta json'});
      try{
        // v0.9.15: la fuente maestra puede ser privada en el PANEL o remota en GitHub.
        // Si existe un JSON privado subido, GUARDAR EN JSON ORIGINAL actualiza exclusivamente esa fuente privada.
        const saved=await saveEditableToOriginalSource(contentMatch[1],b.json);
        db.prepare('UPDATE managed_content SET json_text=?,updated_at=? WHERE source_key=?').run(saved.text,nowIso(),contentMatch[1]);
        const isPrivate=saved.remote?.kind==='private_upload';
        const auditDetail=isPrivate
          ? `${contentMatch[1]};private_panel;${saved.remote.fileName||''};${saved.stats?.items||0}`
          : `${contentMatch[1]};${saved.remote?.kind||'remote'};${saved.remote?.owner||''}/${saved.remote?.repo||''}`;
        audit(actor.id,isPrivate?'managed_content_saved_to_private_original':'managed_content_saved_to_remote_original','content',null,auditDetail);
        return sendJson(res,200,{ok:true,stats:saved.stats,encrypted:true,published:false,originalUpdated:true,originalStorage:isPrivate?'private_panel':'remote',remote:saved.remote,updatedAt:nowIso()});
      }catch(e){return sendJson(res,502,{error:'No se pudo guardar en el JSON original: '+e.message});}
    }
    const publishMatch=p.match(/^\/api\/admin\/content\/(tv1|tv2|movies|series)\/publish$/);
    if(publishMatch&&m==='POST'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona contenido'});
      const b=await readJson(req,30*1024*1024);if(b.json===undefined)return sendJson(res,400,{error:'Falta json'});
      try{const stats=publishOnlyEditable(publishMatch[1],b.json,actor.id,'content_encrypted_and_loaded_to_app_only');return sendJson(res,200,{ok:true,stats,encrypted:true,published:true,originalUpdated:false,updatedAt:nowIso()});}catch(e){return sendJson(res,400,{error:'No se pudo encriptar y cargar a la app: '+e.message});}
    }
    const importMatch=p.match(/^\/api\/admin\/content\/(tv1|tv2|movies|series)\/import$/);
    if(importMatch&&m==='POST'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona contenido'});const src=db.prepare('SELECT url FROM sources WHERE source_key=?').get(importMatch[1]);const privateSrc=privateSourceRow(importMatch[1]);if(!privateSrc?.json_text&&!src?.url)return sendJson(res,400,{error:'Esta fuente no tiene JSON privado subido ni URL configurada'});
      const b=await readJson(req).catch(()=>({}));
      try{
        if(privateSrc?.json_text){const imported=decryptManagedContent(JSON.parse(privateSrc.json_text));const current=loadManagedEditable(importMatch[1]);const json=b.preserveManaged===false?imported:mergeImportedWithManaged(imported,current);const stats=contentStats(json);let updatedAt=null;if(b.persist===true){saveManagedEditable(importMatch[1],json,actor.id,'managed_content_reimported_merged_from_private_upload');updatedAt=nowIso();}return sendJson(res,200,{json,stats,sourceUrl:'private-upload://'+importMatch[1],resolvedSource:`PANEL PRIVADO · ${privateSrc.file_name||'JSON subido'}`,sourceBytes:Number(privateSrc.source_bytes||0),sourceSha256:crypto.createHash('sha256').update(privateSrc.json_text,'utf8').digest('hex'),fetchedAt:nowIso(),editorMode:'decrypted',persisted:b.persist===true,preservedManaged:b.preserveManaged!==false,updatedAt,privateUpload:true});}
        // v0.9.13: leer GitHub sin pasar por la URL CDN cacheada del Release.
        // Si es un asset de Release usamos la API autenticada y el ID actual del asset.
        const sourceInfo=parseGithubWritableSource(src.url);
        let rr, resolvedSource=src.url;
        if(sourceInfo?.kind==='release_asset' && githubToken()){
          const releaseUrl=`https://api.github.com/repos/${encodeURIComponent(sourceInfo.owner)}/${encodeURIComponent(sourceInfo.repo)}/releases/tags/${encodeURIComponent(sourceInfo.tag)}`;
          const relRes=await githubRequest(releaseUrl,{headers:{'Cache-Control':'no-cache'}});
          if(!relRes.ok)throw new Error(`GitHub no pudo abrir la release ${sourceInfo.tag} (HTTP ${relRes.status})`);
          const release=await relRes.json();
          const asset=(release.assets||[]).find(a=>String(a.name)===sourceInfo.assetName);
          if(!asset)throw new Error(`No se encontró el asset ${sourceInfo.assetName} dentro de la release ${sourceInfo.tag}`);
          resolvedSource=`github-api:asset/${asset.id}`;
          rr=await githubRequest(`https://api.github.com/repos/${encodeURIComponent(sourceInfo.owner)}/${encodeURIComponent(sourceInfo.repo)}/releases/assets/${asset.id}`,{headers:{Accept:'application/octet-stream','Cache-Control':'no-cache'}});
        }else{
          const fresh=new URL(src.url);fresh.searchParams.set('_cochi',Date.now().toString());
          resolvedSource=fresh.toString();
          rr=await fetch(resolvedSource,{cache:'no-store',headers:{'User-Agent':`CO-CHI-PANEL/${VERSION}`,'Cache-Control':'no-cache, no-store','Pragma':'no-cache'},signal:AbortSignal.timeout(20000)});
        }
        if(!rr.ok)throw new Error(`HTTP ${rr.status}`);
        const text=await rr.text(),bytes=Buffer.byteLength(text,'utf8');
        if(bytes>25*1024*1024)throw new Error('El JSON supera 25 MB');
        const hash=crypto.createHash('sha256').update(text,'utf8').digest('hex');
        let encrypted;try{encrypted=JSON.parse(text);}catch(parseErr){throw new Error(`${parseErr.message} · descargado ${bytes} bytes · SHA256 ${hash.slice(0,16)} · ${resolvedSource}`)}
        const imported=decryptManagedContent(encrypted);const current=loadManagedEditable(importMatch[1]);const json=b.preserveManaged===false?imported:mergeImportedWithManaged(imported,current);const stats=contentStats(json);let updatedAt=null;if(b.persist===true){saveManagedEditable(importMatch[1],json,actor.id,'managed_content_reimported_merged_from_private_source');updatedAt=nowIso();}
        return sendJson(res,200,{json,stats,sourceUrl:src.url,resolvedSource,sourceBytes:bytes,sourceSha256:hash,fetchedAt:nowIso(),editorMode:'decrypted',persisted:b.persist===true,preservedManaged:b.preserveManaged!==false,updatedAt});
      }catch(e){return sendJson(res,502,{error:'No se pudo importar/desencriptar la fuente: '+e.message});}
    }

    const privateUploadMatch=p.match(/^\/api\/admin\/sources\/(movies)\/upload-json$/);
    if(privateUploadMatch&&m==='POST'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede subir la fuente privada'});
      const key=privateUploadMatch[1],b=await readJson(req,30*1024*1024);if(b.json===undefined)return sendJson(res,400,{error:'Seleccioná un archivo JSON'});
      try{if(!Array.isArray(b.json))throw new Error('El JSON debe ser un arreglo de categorías');const stats=contentStats(b.json);if(!stats.categories)throw new Error('El JSON no contiene categorías');const fileName=String(b.fileName||'peliculas.json').slice(0,255);const saved=savePrivateSourceMaster(key,b.json,fileName);db.prepare('UPDATE managed_content SET json_text=?,updated_at=? WHERE source_key=?').run(saved.text,nowIso(),key);db.prepare('UPDATE sources SET updated_at=? WHERE source_key=?').run(nowIso(),key);audit(actor.id,'private_source_json_uploaded','content',null,`${key}; ${fileName}; ${stats.items} contenidos`);return sendJson(res,200,{ok:true,key,fileName,stats,bytes:saved.bytes,uploadedAt:saved.updatedAt,private:true,backupsKept:5});}catch(e){return sendJson(res,400,{error:'No se pudo guardar el JSON privado: '+e.message});}
    }
    if(p==='/api/admin/sources/movies/private-upload'&&m==='DELETE'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede cambiar la fuente privada'});const old=privateSourceRow('movies');if(!old)return sendJson(res,404,{error:'Películas no tiene un JSON privado subido'});backupPrivateSource('movies');db.prepare('DELETE FROM private_source_files WHERE source_key=?').run('movies');audit(actor.id,'private_source_json_removed','content',null,'movies');return sendJson(res,200,{ok:true});
    }

    const sourceImportMatch=p.match(/^\/api\/admin\/sources\/(tv1|tv2|movies|series)\/save-import$/);
    if(sourceImportMatch&&m==='POST'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona las fuentes'});
      const key=sourceImportMatch[1],b=await readJson(req),url=String(b.url||'').trim(),enabled=b.enabled===false?0:1;
      if(!url)return sendJson(res,400,{error:'Ingresá la URL de origen privada antes de importar'});
      if(!/^https?:\/\//i.test(url))return sendJson(res,400,{error:'URL de origen inválida'});
      if(looksLikeOwnContentEndpoint(url,key))return sendJson(res,400,{error:'Esa es la salida protegida del backend. Pegá la URL real del JSON/repo.'});
      let json,stats,encrypted,text;
      try{
        const rr=await fetch(url,{headers:{'User-Agent':'CO-CHI-PANEL/0.9.1'},signal:AbortSignal.timeout(20000)});
        if(!rr.ok)throw new Error(`HTTP ${rr.status}`);
        const raw=await rr.text();
        if(Buffer.byteLength(raw,'utf8')>25*1024*1024)throw new Error('El JSON supera 25 MB');
        json=decryptManagedContent(JSON.parse(raw));
        json=mergeImportedWithManaged(json,loadManagedEditable(key));
        stats=contentStats(json);
        encrypted=encryptManagedContent(json);
        text=JSON.stringify(encrypted);
        if(Buffer.byteLength(text,'utf8')>25*1024*1024)throw new Error('El JSON cifrado supera 25 MB');
      }catch(e){return sendJson(res,502,{error:'No se pudo guardar e importar la fuente: '+e.message});}
      const t=nowIso();db.exec('BEGIN');try{
        db.prepare('UPDATE sources SET url=?,enabled=?,updated_at=? WHERE source_key=?').run(url,enabled,t,key);
        db.prepare('UPDATE managed_content SET json_text=?,updated_at=? WHERE source_key=?').run(text,t,key);
        audit(actor.id,'source_saved_and_imported','content',null,`${key}; ${stats.items} contenidos`);
        db.exec('COMMIT');
      }catch(e){db.exec('ROLLBACK');return sendJson(res,500,{error:'No se pudieron guardar los cambios importados: '+e.message});}
      return sendJson(res,200,{ok:true,key,sourceUrl:url,stats,updatedAt:t});
    }

    if(p==='/api/admin/sources'&&m==='GET'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona las fuentes'});
      const base=`${TRUST_PROXY_HTTPS?'https':'http'}://${req.headers.host||`localhost:${PORT}`}`;
      return sendJson(res,200,{sources:db.prepare("SELECT * FROM sources ORDER BY CASE source_key WHEN 'tv1' THEN 1 WHEN 'tv2' THEN 2 WHEN 'movies' THEN 3 ELSE 4 END").all().map(x=>{const pr=privateSourceRow(x.source_key);return {...x,enabled:Boolean(x.enabled),delivery_url:`${base}${contentDeliveryPath(x.source_key)}`,url_role:pr?'private_upload':'private_origin',private_upload:pr?{fileName:pr.file_name,bytes:Number(pr.source_bytes||0),stats:(()=>{try{return JSON.parse(pr.stats_json||'{}')}catch{return {}}})(),uploadedAt:pr.uploaded_at,updatedAt:pr.updated_at}:null};})});
    }
    if(p==='/api/admin/sources'&&m==='PUT'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona las fuentes'});const b=await readJson(req);if(!Array.isArray(b.sources))return sendJson(res,400,{error:'Lista inválida'});const allowed=new Set(['tv1','tv2','movies','series']);db.exec('BEGIN');try{const q=db.prepare('UPDATE sources SET url=?,enabled=?,updated_at=? WHERE source_key=?');for(const x of b.sources){const k=String(x.key||'');if(!allowed.has(k))throw new Error('Fuente inválida');const url=String(x.url||'').trim();if(url&&!/^https?:\/\//i.test(url))throw new Error(`${k}: URL inválida`);if(url&&looksLikeOwnContentEndpoint(url,k))throw new Error(`${k}: esa es la salida protegida del backend, no la URL de origen. Pegá la URL real del JSON/repo.`);q.run(url,x.enabled===false?0:1,nowIso(),k);}db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');return sendJson(res,400,{error:e.message});}return sendJson(res,200,{ok:true});
    }

    return sendJson(res,404,{error:'Ruta de panel no encontrada'});
  }

  if(p.startsWith('/api/'))return sendJson(res,404,{error:'Ruta no encontrada'});
  return serveStatic(res,u);
}

cleanupExpiredClients();
const cleanupTimer=setInterval(cleanupExpiredClients,60*60*1000);cleanupTimer.unref?.();

const server=http.createServer((req,res)=>route(req,res).catch(err=>{console.error(err);if(!res.headersSent)sendJson(res,500,{error:'Error interno',detail:process.env.DEBUG?' '+err.message:undefined});else res.end();}));
server.listen(PORT,HOST,()=>{console.log(`\nCO-CHI v${VERSION} · ${IS_PRODUCTION?'ONLINE':'LOCAL'}\nEscuchando en ${HOST}:${PORT}\nDatos: ${DB_PATH}\n`);});
function shutdown(){try{db.close()}catch{}server.close(()=>process.exit(0));}
process.on('SIGINT',shutdown);process.on('SIGTERM',shutdown);
