'use strict';

const crypto = require('node:crypto');
const { backendFixture } = require('./backend-fixture.cjs');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const later = (minutes = 60 * 24 * 20) => new Date(Date.now() + minutes * 60000).toISOString();

async function transferFixture(t) {
  const f = await backendFixture(t);
  let sequence = 0;
  function account(role = 1, parent = null, name = `Panel ${role}`) {
    const n = ++sequence, now = new Date().toISOString();
    const id = Number(f.db.prepare('INSERT INTO accounts(name,role_level,parent_id,activation_code,credits,last_credit_received_at,created_at,updated_at) VALUES (?,?,?,?,50,?,?,?)')
      .run(name, role, parent, `PANEL-${n}`, now, now, now).lastInsertRowid);
    const secret = `test-panel-secret-${n}`, token = `test-panel-token-${n}`, uid = `test-panel-uid-${n}`;
    const panelDeviceId = Number(f.db.prepare('INSERT INTO panel_devices(account_id,device_uid,secret_hash,created_at,updated_at) VALUES (?,?,?,?,?)')
      .run(id, uid, hash(secret), now, now).lastInsertRowid);
    f.db.prepare('INSERT INTO panel_sessions(panel_device_id,token_hash,expires_at,created_at) VALUES (?,?,?,?)')
      .run(panelDeviceId, hash(token), later(), now);
    return { id, cookies: { cochi_panel_session: token, cochi_panel_device: `${panelDeviceId}.${secret}` },
      headers: { authorization: `Bearer ${token}`, 'x-cochi-panel-device-uid': uid, 'x-cochi-panel-device-secret': secret } };
  }
  const root = account(1, null, 'Administración General');
  function client(owner = root.id, expiry = later(), extra = {}) {
    const now = new Date().toISOString(), name = extra.name || `Cliente ${++sequence}`;
    const id = Number(f.db.prepare('INSERT INTO clients(name,owner_account_id,expires_at,device_limit,active,created_at,updated_at) VALUES (?,?,?,?,?,?,?)')
      .run(name, owner, expiry, extra.limit || 2, extra.active === false ? 0 : 1, now, now).lastInsertRowid);
    return { id, name, expiry, owner };
  }
  async function device(customer, { status = 'active', uid = `test-tv-${++sequence}` } = {}) {
    const registration = await f.register(uid);
    const row = f.db.prepare('SELECT * FROM client_devices WHERE activation_code=?').get(registration.body.activationCode);
    f.db.prepare('UPDATE client_devices SET client_id=?,status=?,last_seen_at=? WHERE id=?')
      .run(customer?.id || null, status, new Date().toISOString(), row.id);
    return { id: row.id, uid, code: row.activation_code, secret: registration.body.deviceSecret, registration };
  }
  function demo(d, customer, expiry = later(10)) {
    const now = new Date().toISOString();
    f.db.prepare('INSERT INTO device_demos(device_id,client_id,granted_by_account_id,started_at,expires_at,created_at) VALUES (?,?,?,?,?,?)')
      .run(d.id, customer.id, root.id, now, expiry, now);
    const uid = f.db.prepare('SELECT device_uid FROM client_devices WHERE id=?').get(d.id).device_uid;
    f.db.prepare('INSERT INTO demo_device_history(device_uid,first_demo_at,last_demo_at) VALUES (?,?,?)').run(uid, now, now);
  }
  const as = (actor, method, route, body) => f.request(method, route, body, actor.headers);
  const admin = (method, route, body) => as(root, method, route, body);
  const move = (d, source, target, extra = {}, actor = root) => as(actor, 'POST', `/api/admin/client-devices/${d.id}/transfer`, {
    sourceClientId: source.id, clientId: target.id, ...extra,
  });
  const session = d => f.request('POST', '/api/client-device/session', { deviceUid: d.uid, deviceSecret: d.secret });
  const config = token => f.request('GET', '/api/client-device/config', undefined, { authorization: `Bearer ${token}` });
  return { ...f, root, account, client, device, demo, as, admin, move, session, config };
}

module.exports = { transferFixture, later };
