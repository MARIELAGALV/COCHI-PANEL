'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { transferFixture, later } = require('./helpers/transfer-fixture.cjs');
const day = 86400000;
const iso = ms => new Date(ms).toISOString();

test('authenticated customers receive independent themes at the exact 10-day and 2-day boundaries', async t => {
  const now = Date.now(), f = await transferFixture(t, { now });
  const rules = (await f.admin('GET', '/api/admin/app-theme')).body;
  assert.equal(rules.automatic, true);
  const cases = [[10 * day + 1, 'blue'], [10 * day, 'yellow'], [2 * day, 'yellow'], [2 * day - 1, 'red']];
  for (const [remaining, color] of cases) {
    const c = f.client(f.root.id, iso(now + remaining)), d = await f.device(c);
    const session = await f.session(d);
    assert.equal(session.status, 200);
    const config = await f.config(session.body.token);
    assert.equal(config.status, 200);
    assert.equal(config.body.allowed, true);
    assert.equal(config.body.clientExpiresAt, c.expiry);
    assert.deepEqual(config.body.appTheme, rules.rules.find(r => r.color === color).theme);
    for (const key of ['primary', 'selection', 'background', 'button', 'border', 'text', 'secondary']) {
      assert.match(config.body.appTheme[key], /^#[0-9A-F]{6}$/);
    }
    // The usual 24-hour session does not turn a long-lived account red.
    assert.ok(Date.parse(config.body.sessionExpiresAt) <= now + day);
  }
  assert.deepEqual(f.errors, []);
});

test('a real renewal updates the theme on the existing session and leaves other customers alone', async t => {
  const f = await transferFixture(t), c = f.client(f.root.id, later(60 * 24));
  const other = f.client(f.root.id, later(60 * 24 * 5));
  const d = await f.device(c), otherDevice = await f.device(other);
  const login = await f.session(d), otherLogin = await f.session(otherDevice);
  const before = (await f.config(login.body.token)).body;
  const otherBefore = (await f.config(otherLogin.body.token)).body;
  assert.equal(before.appTheme.preset, 'red');
  const renewed = await f.admin('POST', `/api/admin/clients/${c.id}/renew`, {});
  assert.equal(renewed.status, 200);
  const after = (await f.config(login.body.token)).body;
  assert.equal(after.appTheme.preset, 'blue');
  assert.equal(after.clientExpiresAt, renewed.body.newExpiry);
  assert.equal(after.sessionExpiresAt, before.sessionExpiresAt);
  assert.deepEqual(after.sources, before.sources);
  assert.deepEqual(after.homeBanner, before.homeBanner);
  assert.deepEqual((await f.config(otherLogin.body.token)).body.appTheme, otherBefore.appTheme);
});

test('a transferred device follows the destination expiry without replacing its session', async t => {
  const f = await transferFixture(t), source = f.client(f.root.id, later(60 * 24));
  const target = f.client(), d = await f.device(source), login = await f.session(d);
  assert.equal((await f.config(login.body.token)).body.appTheme.preset, 'red');
  const moved = await f.move(d, source, target, { serviceExpiresAt: target.expiry });
  assert.equal(moved.status, 200);
  const config = await f.config(login.body.token);
  assert.equal(config.status, 200);
  assert.equal(config.body.client.name, target.name);
  assert.equal(config.body.appTheme.preset, 'blue');
  assert.equal(config.body.sessionExpiresAt, login.body.sessionExpiresAt);
});

test('legacy published colors cannot override automation and banner editing remains available', async t => {
  const f = await transferFixture(t);
  const manual = JSON.stringify({ preset: 'violet', primary: '#ABCDEF' });
  for (const key of ['app_theme_draft_json', 'app_theme_published_json']) {
    f.db.prepare('INSERT OR REPLACE INTO settings(setting_key,setting_value,updated_at) VALUES (?,?,?)').run(key, manual, new Date().toISOString());
  }
  const c = f.client(), d = await f.device(c), login = await f.session(d);
  for (const [method, route] of [['PUT', 'draft'], ['POST', 'publish'], ['POST', 'reset']]) {
    const blocked = await f.admin(method, '/api/admin/app-theme/' + route, { theme: { primary: '#ABCDEF' } });
    assert.equal(blocked.status, 409);
    assert.equal(blocked.body.reason, 'automatic_expiry_theme');
  }
  assert.equal(f.db.prepare("SELECT setting_value FROM settings WHERE setting_key='app_theme_published_json'").get().setting_value, manual);
  const banner = await f.admin('PUT', '/api/admin/home-banner', {
    banner: { enabled: true, type: 'image', mediaUrl: 'https://example.com/banner.jpg', title: 'Banner independiente' },
  });
  assert.equal(banner.status, 200);
  const config = (await f.config(login.body.token)).body;
  assert.equal(config.appTheme.preset, 'blue');
  assert.equal(config.homeBanner.title, 'Banner independiente');
});

test('a demo without a commercial expiry keeps the default theme', async t => {
  const f = await transferFixture(t), c = f.client(f.root.id, null), d = await f.device(c);
  f.demo(d, c, later(10));
  const login = await f.session(d);
  assert.equal(login.status, 200);
  const config = await f.config(login.body.token);
  assert.equal(config.body.accessMode, 'demo');
  assert.equal(config.body.clientExpiresAt, null);
  assert.equal(config.body.appTheme.preset, 'blue');
});

test('automatic themes do not grant access to expired or disabled service', async t => {
  const f = await transferFixture(t), c = f.client(), d = await f.device(c), login = await f.session(d);
  f.db.prepare('UPDATE clients SET expires_at=? WHERE id=?').run(later(-10), c.id);
  const expired = await f.config(login.body.token);
  assert.equal(expired.status, 403);
  assert.equal(expired.body.allowed, false);
  assert.equal(expired.body.sources, undefined);
  const expiredLogin = await f.session(d);
  assert.equal(expiredLogin.status, 403);
  f.db.prepare('UPDATE clients SET expires_at=?,active=0 WHERE id=?').run(later(), c.id);
  const disabled = await f.config(login.body.token);
  assert.equal(disabled.status, 403);
  assert.equal(disabled.body.allowed, false);
  assert.equal((await f.config('unrecognized-token')).status, 401);
});

test('sellers cannot read or replace the administration theme rules', async t => {
  const f = await transferFixture(t), seller = f.account(4, f.root.id);
  assert.equal((await f.request('GET', '/api/admin/app-theme')).status, 401);
  assert.equal((await f.as(seller, 'GET', '/api/admin/app-theme')).status, 403);
  assert.equal((await f.as(seller, 'POST', '/api/admin/app-theme/publish', { theme: {} })).status, 403);
});


test('a paid service expiry keeps its linked device, denies playback and renews without another code',async t=>{
 const f=await transferFixture(t),c=f.client(),d=await f.device(c);
 const before=f.db.prepare('SELECT * FROM client_devices WHERE id=?').get(d.id);
 const initial=await f.session(d);
 assert.equal(initial.status,200);
 f.db.prepare('UPDATE clients SET expires_at=? WHERE id=?').run(later(-2),c.id);
 const expired=await f.status(d.uid,d.registration);
 assert.equal(expired.status,200);
 assert.equal(expired.body.allowed,false);
 assert.equal(expired.body.status,'active','La vinculación no vuelve a PENDING');
 assert.equal(expired.body.deviceLinked,true);
 assert.equal(expired.body.serviceExpired,true);
 assert.equal(expired.body.reason,'client_expired');
 assert.equal(expired.body.clientId,c.id);
 assert.equal(expired.body.activationCode,d.code);
 assert.equal(expired.body.clientExpiresAt,(f.db.prepare('SELECT expires_at FROM clients WHERE id=?').get(c.id)).expires_at);
 assert.equal((await f.session(d)).status,403,'Vencido no puede reproducir');
 assert.equal((await f.config(initial.body.token)).status,403,'Token anterior tampoco abre contenidos');
 assert.equal(f.db.prepare('SELECT client_id FROM client_devices WHERE id=?').get(d.id).client_id,c.id);
 assert.equal(f.db.prepare('SELECT COUNT(*) n FROM client_devices').get().n,1,'No se crea dispositivo nuevo');
 const renewal=await f.admin('POST',`/api/admin/clients/${c.id}/renew`,{});
 assert.equal(renewal.status,200,JSON.stringify(renewal.body));
 const renewed=await f.status(d.uid,d.registration);
 assert.equal(renewed.status,200);
 assert.equal(renewed.body.allowed,true);
 assert.equal(renewed.body.status,'active');
 assert.equal(renewed.body.deviceLinked,true);
 assert.equal(renewed.body.activationCode,before.activation_code);
 assert.equal((await f.session(d)).status,200,'El mismo equipo funciona tras renovar');
 assert.equal(f.db.prepare('SELECT COUNT(*) n FROM client_devices').get().n,1);
});

test('a linked device left pending by older expired-service logic recovers its link',async t=>{
 const f=await transferFixture(t),c=f.client(f.root.id,later(-15)),d=await f.device(c,{status:'pending'});
 const status=await f.status(d.uid,d.registration);
 assert.equal(status.status,200);
 assert.equal(status.body.status,'active');
 assert.equal(status.body.allowed,false);
 assert.equal(status.body.reason,'client_expired');
 assert.equal(status.body.deviceLinked,true);
 assert.equal(status.body.activationCode,d.code);
 assert.equal((await f.session(d)).status,403);
 const renewed=await f.admin('POST',`/api/admin/clients/${c.id}/renew`,{});
 assert.equal(renewed.status,200);
 assert.equal((await f.status(d.uid,d.registration)).body.allowed,true);
});

test('unlinked and never subscribed devices remain pending, not falsely active',async t=>{
 const f=await transferFixture(t),unlinked=await f.device(null,{status:'pending'});
 const unlinkedStatus=await f.status(unlinked.uid,unlinked.registration);
 assert.equal(unlinkedStatus.body.status,'pending');
 assert.equal(unlinkedStatus.body.deviceLinked,false);
 assert.equal(unlinkedStatus.body.allowed,false);
 const c=f.client(f.root.id,null);
 const waiting=await f.device(c,{status:'pending'});
 const waitingStatus=await f.status(waiting.uid,waiting.registration);
 assert.equal(waitingStatus.body.status,'pending');
 assert.equal(waitingStatus.body.serviceExpired,false);
 assert.equal(waitingStatus.body.reason,'client_no_service');
});
