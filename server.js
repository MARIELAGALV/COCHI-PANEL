'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const VERSION = '0.7.4';
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

const nowIso = () => new Date().toISOString();
const roles = {1:'ADMINISTRACIÓN',2:'DISTRIBUIDOR',3:'REVENDEDOR',4:'VENDEDOR',5:'CLIENTE'};
const randomToken = (n=32) => crypto.randomBytes(n).toString('base64url');
const sha = v => crypto.createHash('sha256').update(String(v)).digest('hex');


// v0.7.4 — cifrado de contenido compatible con BLAF / CO-CHI.
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
}

for (const [key,value] of [['demos_enabled','0'],['adult_lock_enabled','0'],['adult_max_attempts',String(DEFAULT_ADULT_MAX_ATTEMPTS)],['adult_pin_hash','']]) {
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
function canCreateLevel(actor,level){if(level<1||level>5)return false;if(actor.role_level===1)return true;return level>=actor.role_level;}
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
function requirePanel(req,res){const s=panelSessionFromReq(req);if(!s){sendJson(res,401,{error:'Panel no activado'});return null;}if(s.blocked){sendJson(res,423,{error:'Panel bloqueado',reason:s.reason,blockReason:s.account?.block_reason||''});return null;}return s;}
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
  return {display_status:label,display_status_code:code,device_count:activeDevices,linked_device_count:linked,demo_active_count:demoActive,demo_used_count:demoUsed,service_active:paid.ok};
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
function clientDeviceFromBearer(req){
  const t=bearer(req); if(!t)return null;
  const r=db.prepare(`SELECT cs.expires_at session_expires_at,cd.*,c.name client_name,c.active client_active,c.expires_at client_expires_at,c.owner_account_id
    FROM client_sessions cs JOIN client_devices cd ON cd.id=cs.device_id LEFT JOIN clients c ON c.id=cd.client_id WHERE cs.token_hash=?`).get(sha(t));
  if(!r)return null;
  if(Date.parse(r.session_expires_at)<=Date.now()){db.prepare('DELETE FROM client_sessions WHERE token_hash=?').run(sha(t));return null;}
  return r;
}

function mime(fp){return ({'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webmanifest':'application/manifest+json; charset=utf-8'})[path.extname(fp).toLowerCase()]||'application/octet-stream';}
function serveStatic(res,urlObj){
  let rel=decodeURIComponent(urlObj.pathname);if(rel==='/')rel='/index.html';
  const fp=path.join(PUBLIC_DIR,path.normalize(rel).replace(/^(\.\.[/\\])+/,''));
  if(!fp.startsWith(PUBLIC_DIR)||!fs.existsSync(fp)||!fs.statSync(fp).isFile())return sendText(res,404,'No encontrado');
  const csp="default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'";
  res.writeHead(200,{'Content-Type':mime(fp),'Cache-Control':'no-store, no-cache, must-revalidate, max-age=0','Pragma':'no-cache','Expires':'0','Content-Security-Policy':csp,'X-Frame-Options':'DENY','X-Content-Type-Options':'nosniff','Permissions-Policy':'camera=(), microphone=(), geolocation=(), payment=()',...(TRUST_PROXY_HTTPS?{'Strict-Transport-Security':'max-age=31536000; includeSubDomains'}:{})});
  res.end(fs.readFileSync(fp));
}

async function route(req,res){
  const u=new URL(req.url,`http://${req.headers.host||'localhost'}`); const p=u.pathname,m=req.method||'GET';
  if(m==='POST'&&['/api/setup','/api/panel/activate','/api/panel/session','/api/client-device/register','/api/client-device/status','/api/client-device/session','/api/client-device/adult/verify'].includes(p)){
    const strict=p==='/api/client-device/status'?600:30;
    if(!rateLimit(req,res,p,strict,10*60*1000))return;
  }
  if(p==='/api/health'&&m==='GET')return sendJson(res,200,{ok:true,service:'CO-CHI',version:VERSION,mode:IS_PRODUCTION?'production':'development',serverTime:nowIso()});
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

  const publicContent=p.match(/^\/api\/content\/(tv1|tv2|movies|series)$/);
  if(publicContent&&m==='GET'){const r=db.prepare('SELECT json_text,updated_at FROM managed_content WHERE source_key=?').get(publicContent[1]);if(!r||!r.json_text)return sendJson(res,404,{error:'Contenido todavía no publicado'});try{return sendJson(res,200,JSON.parse(r.json_text),{'Cache-Control':'no-cache, no-store, must-revalidate'});}catch{return sendJson(res,500,{error:'Contenido guardado inválido'});}}

  // Activación del PANEL por código. Máximo 2 dispositivos por ficha.
  if(p==='/api/panel/activate'&&m==='POST'){
    const b=await readJson(req),code=String(b.code||'').trim().toUpperCase(),uid=String(b.deviceUid||'').trim(),name=String(b.deviceName||'Dispositivo').trim().slice(0,120);
    if(uid.length<8)return sendJson(res,400,{error:'Identificador de dispositivo inválido'});
    let a=db.prepare('SELECT * FROM accounts WHERE activation_code=?').get(code); if(!a)return sendJson(res,404,{error:'Código de activación inválido'});
    a=accountPublic(a);const state=accountAccessState(a);if(!state.ok)return sendJson(res,423,{error:'Ficha bloqueada',reason:state.reason});
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
    const acc=accountPublic(accountRaw(pd.panel_account_id));const st=accountAccessState(acc);if(!st.ok)return sendJson(res,423,{error:'Ficha bloqueada',reason:st.reason});
    const s=createPanelSession(pd.panel_device_id);db.prepare('UPDATE panel_devices SET last_seen_at=?,updated_at=? WHERE id=?').run(nowIso(),nowIso(),pd.panel_device_id);
    return sendJson(res,200,{ok:true,account:acc,expiresAt:s.expiresAt},{'Set-Cookie':sessionCookie(s.token)});
  }
  if(p==='/api/panel/me'&&m==='GET'){
    const s=requirePanel(req,res);if(!s)return;return sendJson(res,200,{account:accountPublic(accountRaw(s.account.id)),limits:{panelDevices:2,clientDevices:2,clientDays:30,renewWindowDays:10,minCreditTransfer:MIN_CREDIT_TRANSFER,demoMinutes:DEMO_DURATION_MINUTES,demoDurations:DEMO_ALLOWED_MINUTES},features:{demosEnabled:boolSetting('demos_enabled',false)}});
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
    d=refreshDeviceState(d);db.prepare('UPDATE client_devices SET last_seen_at=?,updated_at=? WHERE id=?').run(nowIso(),nowIso(),d.id);const c=d.client_id?clientRow(d.client_id):null;const st=deviceAccessState(d,c);
    return sendJson(res,200,{activationCode:d.activation_code,status:d.status,clientId:c?.id||null,clientName:c?.name||null,clientExpiresAt:c?.expires_at||null,allowed:st.ok,reason:st.reason,accessMode:st.mode||null,accessExpiresAt:st.expiresAt||null,demo:demoInfo(d.id)});
  }
  if(p==='/api/client-device/session'&&m==='POST'){
    const b=await readJson(req);let d=clientDeviceByCred(String(b.deviceUid||''),String(b.deviceSecret||''));if(!d)return sendJson(res,401,{error:'Dispositivo no reconocido'});
    d=refreshDeviceState(d);db.prepare('UPDATE client_devices SET last_seen_at=?,updated_at=? WHERE id=?').run(nowIso(),nowIso(),d.id);const c=d.client_id?clientRow(d.client_id):null;const st=deviceAccessState(d,c);if(!st.ok)return sendJson(res,403,{allowed:false,reason:st.reason});
    db.prepare('DELETE FROM client_sessions WHERE device_id=? OR expires_at<=?').run(d.id,nowIso());const token=randomToken();let exp=addDays(nowIso(),1);if(st.expiresAt&&Date.parse(st.expiresAt)<Date.parse(exp))exp=st.expiresAt;
    db.prepare('INSERT INTO client_sessions(device_id,token_hash,expires_at,created_at) VALUES (?,?,?,?)').run(d.id,sha(token),exp,nowIso());
    return sendJson(res,200,{allowed:true,token,expiresAt:exp,accessMode:st.mode,accessExpiresAt:st.expiresAt||null,clientId:c.id,clientName:c.name,clientExpiresAt:c.expires_at||null});
  }
  if(p==='/api/client-device/config'&&m==='GET'){
    let d=clientDeviceFromBearer(req);if(!d)return sendJson(res,401,{error:'Sesión inválida'});d=refreshDeviceState(d);const c=clientRow(d.client_id),st=deviceAccessState(d,c);if(!st.ok)return sendJson(res,403,{allowed:false,reason:st.reason});
    const src={};for(const r of db.prepare('SELECT * FROM sources').all())src[r.source_key]={label:r.label,url:r.enabled?r.url:'',enabled:Boolean(r.enabled),updatedAt:r.updated_at};
    const adult=effectiveAdult(c);
    return sendJson(res,200,{allowed:true,accessMode:st.mode,accessExpiresAt:st.expiresAt||null,client:{name:c.name,expiresAt:c.expires_at},adultControl:{enabled:adult.enabled,locked:adult.locked,pinConfigured:adult.pinConfigured,maxAttempts:adult.maxAttempts},sources:src,serverTime:nowIso()});
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
      return sendJson(res,200,{accounts:rows});
    }
    if(p==='/api/admin/accounts'&&m==='POST'){
      const b=await readJson(req),level=Number(b.roleLevel);if(level===5)return sendJson(res,400,{error:'CLIENTE final no es una ficha PANEL. Se crea únicamente desde la sección Clientes finales'});if(!canCreateLevel(actor,level))return sendJson(res,403,{error:'No podés crear una categoría superior a la tuya'});
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
        if(b.roleLevel!==undefined){role=Number(b.roleLevel);if(role<1||role>4)return sendJson(res,400,{error:'Categoría inválida'});}
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
      const owner=accountRaw(c.owner_account_id);
      if(owner.role_level!==1&&owner.credits<CLIENT_CREDIT_COST)return sendJson(res,409,{error:'La ficha propietaria no tiene créditos'});
      const now=nowIso(),rem=daysRemaining(c.expires_at);if(c.expires_at&&rem>RENEW_WINDOW_DAYS)return sendJson(res,409,{error:`Renovación disponible cuando falten ${RENEW_WINDOW_DAYS} días o menos`,daysRemaining:rem});
      const prev=c.expires_at||null;let action,newExp;if(!prev){action='activate';newExp=addDays(now,CLIENT_DAYS);}else if(Date.parse(prev)<=Date.now()){action='reactivate';newExp=addDays(now,CLIENT_DAYS);}else{action='renew';newExp=addDays(prev,CLIENT_DAYS);}db.exec('BEGIN');
      try{
        if(owner.role_level!==1)db.prepare('UPDATE accounts SET credits=credits-1,updated_at=? WHERE id=?').run(now,owner.id);
        db.prepare('UPDATE clients SET expires_at=?,active=1,updated_at=? WHERE id=?').run(newExp,now,c.id);
        db.prepare("UPDATE client_devices SET status='active',updated_at=? WHERE client_id=? AND status='pending'").run(now,c.id);
        db.prepare('INSERT INTO client_service_ledger(client_id,charged_account_id,created_by_account_id,credits_spent,previous_expiry,new_expiry,action,created_at) VALUES (?,?,?,?,?,?,?,?)').run(c.id,owner.id,actor.id,1,prev,newExp,action,now);
        db.exec('COMMIT');
      }catch(e){db.exec('ROLLBACK');throw e;}
      return sendJson(res,200,{ok:true,action,previousExpiry:prev,newExpiry:newExp,creditsSpent:1,deviceSlots:2,ownerIsAdministration:owner.role_level===1});
    }
    const cdev=p.match(/^\/api\/admin\/clients\/(\d+)\/devices$/);
    if(cdev&&m==='GET'){
      const c=clientRow(Number(cdev[1]));if(!c)return sendJson(res,404,{error:'Cliente no encontrado'});if(!canEditClient(actor,c))return sendJson(res,403,{error:'Sin permiso'});refreshClientDevices(c.id);const devices=db.prepare('SELECT id,device_uid,device_name,activation_code,status,last_seen_at,created_at FROM client_devices WHERE client_id=? ORDER BY id DESC').all(c.id).map(d=>({...d,demo:demoInfo(d.id)}));return sendJson(res,200,{devices,clientStatus:clientStatusSummary(c)});
    }
    if(p==='/api/admin/client-devices/assign-by-code'&&m==='POST'){
      const b=await readJson(req),code=String(b.activationCode||'').trim().toUpperCase(),c=clientRow(Number(b.clientId));
      if(!c)return sendJson(res,404,{error:'Cliente no encontrado'});
      if(!canEditClient(actor,c))return sendJson(res,403,{error:'Solo podés vincular dispositivos de clientes directos'});
      const d=db.prepare("SELECT * FROM client_devices WHERE activation_code=? AND status='pending'").get(code);
      if(!d)return sendJson(res,404,{error:'Código pendiente no encontrado'});
      if(d.client_id&&Number(d.client_id)!==Number(c.id))return sendJson(res,409,{error:'Ese código ya pertenece a otro cliente'});
      if(d.client_id&&Number(d.client_id)===Number(c.id))return sendJson(res,200,{ok:true,alreadyLinked:true,status:d.status,limit:2});
      const linked=Number(db.prepare("SELECT COUNT(*) n FROM client_devices WHERE client_id=? AND status IN ('pending','active')").get(c.id).n);
      if(linked>=CLIENT_DEVICE_LIMIT)return sendJson(res,409,{error:'El cliente ya tiene 2 códigos/dispositivos vinculados'});
      const cs=clientAccessState(c),nextStatus=cs.ok?'active':'pending';
      db.prepare("UPDATE client_devices SET client_id=?,status=?,updated_at=? WHERE id=?").run(c.id,nextStatus,nowIso(),d.id);
      return sendJson(res,200,{ok:true,linkedDevices:linked+1,limit:2,status:nextStatus,waitingForService:nextStatus==='pending'});
    }
    const assign=p.match(/^\/api\/admin\/client-devices\/(\d+)\/assign$/);
    if(assign&&m==='POST'){
      const d=db.prepare("SELECT * FROM client_devices WHERE id=? AND status='pending' AND client_id IS NULL").get(Number(assign[1]));if(!d)return sendJson(res,404,{error:'Dispositivo pendiente no encontrado'});const b=await readJson(req),c=clientRow(Number(b.clientId));if(!c)return sendJson(res,404,{error:'Cliente no encontrado'});if(!canEditClient(actor,c))return sendJson(res,403,{error:'Solo podés activar dispositivos de clientes directos'});const cs=clientAccessState(c);if(!cs.ok)return sendJson(res,409,{error:'El cliente no tiene servicio activo',reason:cs.reason});const n=Number(db.prepare("SELECT COUNT(*) n FROM client_devices WHERE client_id=? AND status='active' AND id<>?").get(c.id,d.id).n);if(n>=CLIENT_DEVICE_LIMIT)return sendJson(res,409,{error:'El cliente ya tiene 2 dispositivos activos'});db.prepare("UPDATE client_devices SET client_id=?,status='active',updated_at=? WHERE id=?").run(c.id,nowIso(),d.id);return sendJson(res,200,{ok:true,activeDevices:n+1,limit:2});
    }
    const block=p.match(/^\/api\/admin\/client-devices\/(\d+)\/block$/);
    if(block&&m==='POST'){
      const d=db.prepare('SELECT cd.*,c.owner_account_id FROM client_devices cd LEFT JOIN clients c ON c.id=cd.client_id WHERE cd.id=?').get(Number(block[1]));if(!d)return sendJson(res,404,{error:'Dispositivo no encontrado'});if(!(actor.role_level===1||d.owner_account_id===actor.id))return sendJson(res,403,{error:'Sin permiso'});db.prepare("UPDATE client_devices SET status='blocked',updated_at=? WHERE id=?").run(nowIso(),d.id);db.prepare('DELETE FROM client_sessions WHERE device_id=?').run(d.id);return sendJson(res,200,{ok:true,creditRefunded:0,slotFreed:true});
    }
    const react=p.match(/^\/api\/admin\/client-devices\/(\d+)\/reactivate$/);
    if(react&&m==='POST'){
      const d=db.prepare('SELECT cd.*,c.owner_account_id,c.id client_id FROM client_devices cd JOIN clients c ON c.id=cd.client_id WHERE cd.id=?').get(Number(react[1]));if(!d)return sendJson(res,404,{error:'Dispositivo no encontrado'});if(!(actor.role_level===1||d.owner_account_id===actor.id))return sendJson(res,403,{error:'Sin permiso'});const c=clientRow(d.client_id);const temp={...d,status:'pending'},st=deviceAccessState(temp,c);if(!st.ok)return sendJson(res,409,{error:'Cliente sin servicio ni demo activo'});const n=Number(db.prepare("SELECT COUNT(*) n FROM client_devices WHERE client_id=? AND status='active' AND id<>?").get(c.id,d.id).n);if(n>=2)return sendJson(res,409,{error:'Ya hay 2 dispositivos activos'});db.prepare("UPDATE client_devices SET status='active',updated_at=? WHERE id=?").run(nowIso(),d.id);return sendJson(res,200,{ok:true,accessMode:st.mode});
    }
    if(p==='/api/admin/client-devices'&&m==='GET'){
      let rows;if(actor.role_level===1)rows=db.prepare(`SELECT cd.*,c.name client_name,a.name owner_name,c.owner_account_id FROM client_devices cd LEFT JOIN clients c ON c.id=cd.client_id LEFT JOIN accounts a ON a.id=c.owner_account_id ORDER BY CASE cd.status WHEN 'pending' THEN 0 ELSE 1 END,cd.id DESC`).all();else rows=db.prepare(`SELECT cd.*,c.name client_name,a.name owner_name,c.owner_account_id FROM client_devices cd JOIN clients c ON c.id=cd.client_id JOIN accounts a ON a.id=c.owner_account_id WHERE c.owner_account_id=? ORDER BY cd.id DESC`).all(actor.id);rows=rows.map(x=>{const r=refreshDeviceState(x),c=r.client_id?clientRow(r.client_id):null,access=deviceAccessState(r,c),di=demoInfo(r.id);return {...r,demo:di,access_mode:access.ok?access.mode:null,effective_status:r.status==='blocked'?'BLOQUEADO':access.ok?(access.mode==='demo'?'DEMO ACTIVO':'ACTIVO'):(di.used?'DEMO VENCIDO':'PENDIENTE')};});return sendJson(res,200,{devices:rows});
    }
    if(p==='/api/admin/client-devices/manual'&&m==='POST'){
      const b=await readJson(req),uid=`manual-${crypto.randomUUID()}`,code=generateCode('client_devices'),secret=randomToken(),t=nowIso();const r=db.prepare("INSERT INTO client_devices(device_uid,device_name,platform,activation_code,secret_hash,status,created_at,updated_at) VALUES (?,?,?,?,?,'pending',?,?)").run(uid,String(b.deviceName||'Dispositivo de prueba').trim(), 'android',code,sha(secret),t,t);return sendJson(res,201,{ok:true,id:Number(r.lastInsertRowid),activationCode:code,deviceUid:uid,deviceSecret:secret});
    }


    if(p==='/api/admin/demo-settings'&&m==='GET'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona demos'});
      const enabled=boolSetting('demos_enabled',false),canGrant=true;
      let demos;if(actor.role_level===1)demos=db.prepare(`SELECT dd.*,cd.activation_code,cd.device_name,cd.device_uid,c.name client_name,a.name granted_by_name FROM device_demos dd JOIN client_devices cd ON cd.id=dd.device_id JOIN clients c ON c.id=dd.client_id JOIN accounts a ON a.id=dd.granted_by_account_id ORDER BY dd.started_at DESC LIMIT 150`).all();else demos=db.prepare(`SELECT dd.*,cd.activation_code,cd.device_name,cd.device_uid,c.name client_name,a.name granted_by_name FROM device_demos dd JOIN client_devices cd ON cd.id=dd.device_id JOIN clients c ON c.id=dd.client_id JOIN accounts a ON a.id=dd.granted_by_account_id WHERE c.owner_account_id=? ORDER BY dd.started_at DESC LIMIT 100`).all(actor.id);
      const normalized=demos.map(x=>({...x,active:Date.parse(x.expires_at)>Date.now(),remainingSeconds:Math.max(0,Math.floor((Date.parse(x.expires_at)-Date.now())/1000))}));return sendJson(res,200,{enabled,durationMinutes:DEMO_DURATION_MINUTES,allowedDurations:DEMO_ALLOWED_MINUTES,canGrant,requiresPositiveCredit:actor.role_level!==1,activeCount:normalized.filter(x=>x.active).length,demos:normalized});
    }
    if(p==='/api/admin/demo-settings'&&m==='PUT'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede activar o desactivar los demos'});const b=await readJson(req);if(typeof b.enabled!=='boolean')return sendJson(res,400,{error:'Estado inválido'});setSetting('demos_enabled',b.enabled?'1':'0');audit(actor.id,b.enabled?'demos_enabled':'demos_disabled','settings',null);return sendJson(res,200,{ok:true,enabled:b.enabled,durationMinutes:DEMO_DURATION_MINUTES,allowedDurations:DEMO_ALLOWED_MINUTES});
    }
    const demoGrant=p.match(/^\/api\/admin\/client-devices\/(\d+)\/demo$/);
    if(demoGrant&&m==='POST'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede otorgar demos'});
      if(!boolSetting('demos_enabled',false))return sendJson(res,409,{error:'Los demos están desactivados por ADMINISTRACIÓN'});
      const d=db.prepare('SELECT cd.*,c.owner_account_id,c.id client_id FROM client_devices cd JOIN clients c ON c.id=cd.client_id WHERE cd.id=?').get(Number(demoGrant[1]));if(!d)return sendJson(res,404,{error:'Dispositivo vinculado no encontrado'});
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede otorgar demos'});
      if(d.status==='blocked')return sendJson(res,409,{error:'El dispositivo está bloqueado'});
      if(demoRow(d.id))return sendJson(res,409,{error:'Este dispositivo ya utilizó su único demo'});
      const c=clientRow(d.client_id);if(clientAccessState(c).ok)return sendJson(res,409,{error:'El cliente ya tiene servicio activo; no necesita demo'});
      const body=await readJson(req);
      const requestedMinutes=Number(body?.durationMinutes ?? DEMO_DURATION_MINUTES);
      if(!DEMO_ALLOWED_MINUTES.includes(requestedMinutes))return sendJson(res,400,{error:'Duración de demo inválida. Solo se permiten 10 o 60 minutos.'});
      const t=nowIso(),exp=addMinutes(t,requestedMinutes);db.exec('BEGIN');try{db.prepare('INSERT INTO device_demos(device_id,client_id,granted_by_account_id,started_at,expires_at,created_at) VALUES (?,?,?,?,?,?)').run(d.id,c.id,actor.id,t,exp,t);db.prepare("UPDATE client_devices SET status='active',updated_at=? WHERE id=?").run(t,d.id);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}audit(actor.id,'demo_granted','client_device',d.id,`${requestedMinutes} minutos; cliente ${c.id}`);return sendJson(res,201,{ok:true,startedAt:t,expiresAt:exp,durationMinutes:requestedMinutes,creditConsumed:0});
    }

    const demoReset=p.match(/^\/api\/admin\/client-devices\/(\d+)\/demo\/reset$/);
    if(demoReset&&m==='POST'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN puede resetear un demo'});
      const deviceId=Number(demoReset[1]),d=db.prepare('SELECT cd.*,c.id client_id,c.name client_name FROM client_devices cd JOIN clients c ON c.id=cd.client_id WHERE cd.id=?').get(deviceId);
      if(!d)return sendJson(res,404,{error:'Dispositivo vinculado no encontrado'});
      const demo=demoRow(deviceId);if(!demo)return sendJson(res,404,{error:'Este dispositivo no tiene demo para resetear'});
      db.exec('BEGIN');try{db.prepare('DELETE FROM device_demos WHERE device_id=?').run(deviceId);db.prepare('DELETE FROM client_sessions WHERE device_id=?').run(deviceId);db.prepare("UPDATE client_devices SET status='pending',updated_at=? WHERE id=? AND status<>'blocked'").run(nowIso(),deviceId);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
      audit(actor.id,'demo_reset_by_admin','client_device',deviceId,`cliente ${d.client_id}`);
      return sendJson(res,200,{ok:true,demoUsed:false,status:d.status==='blocked'?'blocked':'pending'});
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
      let encrypted,text,stats;try{stats=contentStats(b.json);encrypted=encryptManagedContent(b.json);text=JSON.stringify(encrypted);}catch(e){return sendJson(res,400,{error:'No se pudo preparar el contenido: '+e.message});}
      if(Buffer.byteLength(text,'utf8')>25*1024*1024)return sendJson(res,413,{error:'JSON cifrado demasiado grande (máximo 25 MB)'});
      db.prepare('UPDATE managed_content SET json_text=?,updated_at=? WHERE source_key=?').run(text,nowIso(),contentMatch[1]);audit(actor.id,'managed_content_saved_encrypted','content',null,contentMatch[1]);return sendJson(res,200,{ok:true,stats,encrypted:true});
    }
    const importMatch=p.match(/^\/api\/admin\/content\/(tv1|tv2|movies|series)\/import$/);
    if(importMatch&&m==='POST'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona contenido'});const src=db.prepare('SELECT url FROM sources WHERE source_key=?').get(importMatch[1]);if(!src?.url)return sendJson(res,400,{error:'Esta fuente no tiene URL configurada'});
      try{const rr=await fetch(src.url,{headers:{'User-Agent':'CO-CHI-PANEL/0.7.4'},signal:AbortSignal.timeout(20000)});if(!rr.ok)throw new Error(`HTTP ${rr.status}`);const text=await rr.text();if(Buffer.byteLength(text,'utf8')>25*1024*1024)throw new Error('El JSON supera 25 MB');const encrypted=JSON.parse(text);const json=decryptManagedContent(encrypted);return sendJson(res,200,{json,stats:contentStats(json),sourceUrl:src.url,editorMode:'decrypted'});}catch(e){return sendJson(res,502,{error:'No se pudo importar/desencriptar la fuente: '+e.message});}
    }

    if(p==='/api/admin/sources'&&m==='GET'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona las fuentes'});return sendJson(res,200,{sources:db.prepare('SELECT * FROM sources ORDER BY CASE source_key WHEN \'tv1\' THEN 1 WHEN \'tv2\' THEN 2 WHEN \'movies\' THEN 3 ELSE 4 END').all().map(x=>({...x,enabled:Boolean(x.enabled)}))});
    }
    if(p==='/api/admin/sources'&&m==='PUT'){
      if(actor.role_level!==1)return sendJson(res,403,{error:'Solo ADMINISTRACIÓN gestiona las fuentes'});const b=await readJson(req);if(!Array.isArray(b.sources))return sendJson(res,400,{error:'Lista inválida'});const allowed=new Set(['tv1','tv2','movies','series']);db.exec('BEGIN');try{const q=db.prepare('UPDATE sources SET url=?,enabled=?,updated_at=? WHERE source_key=?');for(const x of b.sources){const k=String(x.key||'');if(!allowed.has(k))throw new Error('Fuente inválida');const url=String(x.url||'').trim();if(url&&!/^https?:\/\//i.test(url))throw new Error(`${k}: URL inválida`);q.run(url,x.enabled===false?0:1,nowIso(),k);}db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');return sendJson(res,400,{error:e.message});}return sendJson(res,200,{ok:true});
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
