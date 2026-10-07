'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { transferFixture, later } = require('./helpers/transfer-fixture.cjs');

const devices = f => f.db.prepare('SELECT * FROM client_devices ORDER BY id').all();
const sessions = f => f.db.prepare('SELECT * FROM client_sessions ORDER BY id').all();
const commercial = f => ({
  accounts: f.db.prepare('SELECT id,credits FROM accounts ORDER BY id').all(),
  clients: f.db.prepare('SELECT * FROM clients ORDER BY id').all(),
  ledger: f.db.prepare('SELECT * FROM client_service_ledger ORDER BY id').all(),
  replacements: f.db.prepare('SELECT * FROM client_device_changes ORDER BY id').all(),
});

test('General Administration moves a paid TV across branches and its existing token still works', async t => {
  const f = await transferFixture(t);
  const oldOwner = f.account(4, f.root.id), newOwner = f.account(4, f.root.id);
  const source = f.client(oldOwner.id), target = f.client(newOwner.id, later(60 * 24 * 10));
  const d = await f.device(source), sibling = await f.device(source);
  f.demo(d, source, later(-10));
  const login = await f.session(d);
  assert.equal(login.status, 200);
  const before = devices(f), oldSessions = sessions(f), billing = commercial(f);
  const history = f.db.prepare('SELECT * FROM demo_device_history').all();
  const preview = await f.admin('GET', `/api/admin/client-devices/${d.id}/transfer`);
  assert.equal(preview.status, 200);
  assert.equal(preview.body.device.activationCode, d.code);
  assert.equal(JSON.stringify(preview.body).includes('secret_hash'), false);
  assert.equal(preview.body.targets.some(c => c.id === source.id), false);
  const moved = await f.move(d, source, target, { serviceExpiresAt: target.expiry });
  assert.equal(moved.status, 200);
  assert.equal(moved.body.sessionsPreserved, true);
  assert.equal(moved.body.creditsSpent, 0);
  const after = devices(f), movedRow = after.find(x => x.id === d.id);
  assert.deepEqual({ ...movedRow, client_id: source.id, updated_at: before[0].updated_at }, { ...before[0] });
  assert.deepEqual(after.find(x => x.id === sibling.id), before[1]);
  assert.deepEqual(sessions(f), oldSessions);
  assert.deepEqual(commercial(f), billing);
  assert.deepEqual(f.db.prepare('SELECT * FROM demo_device_history').all(), history);
  assert.equal(f.db.prepare('SELECT client_id FROM device_demos WHERE device_id=?').get(d.id).client_id, target.id);
  const status = await f.status(d.uid, d.registration);
  assert.equal(status.body.allowed, true);
  assert.equal(status.body.clientId, target.id);
  assert.equal(status.body.activationCode, d.code);
  const config = await f.config(login.body.token);
  assert.equal(config.status, 200);
  assert.equal(config.body.allowed, true);
  assert.equal(config.body.client.name, target.name);
  assert.equal(config.body.serviceExpiresAt, target.expiry);
  assert.equal(config.body.sessionExpiresAt, login.body.sessionExpiresAt);
  const counts = await f.admin('GET', '/api/admin/clients');
  assert.equal(counts.body.clients.find(c => c.id === source.id).linked_device_count, 1);
  assert.equal(counts.body.clients.find(c => c.id === target.id).linked_device_count, 1);
  assert.equal((await f.as(oldOwner, 'GET', `/api/admin/clients/${target.id}/devices`)).status, 403);
  assert.equal((await f.as(newOwner, 'GET', `/api/admin/clients/${target.id}/devices`)).status, 200);
  const audit = f.db.prepare("SELECT * FROM security_audit WHERE action='client_device_transferred'").get();
  assert.equal(audit.actor_account_id, f.root.id);
  assert.equal(audit.target_id, d.id);
  assert.equal(JSON.parse(audit.detail).sourceClientId, source.id);
  assert.equal(JSON.parse(audit.detail).targetClientId, target.id);
});

test('a new empty customer inherits the exact paid expiry without another activation or charge', async t => {
  const f = await transferFixture(t), source = f.client(), target = f.client(f.root.id, null);
  const d = await f.device(source), login = await f.session(d), before = commercial(f);
  const preview = await f.admin('GET', `/api/admin/client-devices/${d.id}/transfer`);
  const option = preview.body.targets.find(c => c.id === target.id);
  assert.equal(option.inheritExpiry, true);
  assert.equal(option.serviceExpiresAt, source.expiry);
  assert.equal((await f.move(d, source, target, { serviceExpiresAt: option.serviceExpiresAt })).body.inheritedExpiry, true);
  const after = commercial(f);
  assert.deepEqual(after.accounts, before.accounts);
  assert.deepEqual(after.ledger, before.ledger);
  assert.deepEqual(after.replacements, before.replacements);
  assert.deepEqual(after.clients.find(c => c.id === source.id), before.clients.find(c => c.id === source.id));
  const targetRow = after.clients.find(c => c.id === target.id), oldTarget = before.clients.find(c => c.id === target.id);
  assert.equal(targetRow.expires_at, source.expiry);
  assert.deepEqual({ ...targetRow, expires_at: null, updated_at: oldTarget.updated_at }, { ...oldTarget });
  assert.equal((await f.config(login.body.token)).status, 200);
  assert.equal((await f.status(d.uid, d.registration)).body.serviceExpiresAt, source.expiry);
});

test('secondary administrators and all lower panel roles cannot preview or perform transfers', async t => {
  const f = await transferFixture(t), source = f.client(), target = f.client(), d = await f.device(source);
  const before = devices(f), billing = commercial(f);
  for (const role of [1, 2, 3, 4]) {
    const actor = f.account(role, role === 1 ? null : f.root.id);
    assert.equal((await f.as(actor, 'GET', `/api/admin/client-devices/${d.id}/transfer`)).status, 403);
    assert.equal((await f.move(d, source, target, {}, actor)).status, 403);
  }
  assert.deepEqual(devices(f), before);
  assert.deepEqual(commercial(f).clients, billing.clients);
  assert.equal(f.db.prepare("SELECT COUNT(*) n FROM security_audit WHERE action='client_device_transferred'").get().n, 0);
});

test('unauthenticated requests and a panel token without its device proof are rejected', async t => {
  const f = await transferFixture(t), source = f.client(), target = f.client(), d = await f.device(source);
  for (const headers of [{}, { authorization: f.root.headers.authorization }]) {
    for (const method of ['GET', 'POST']) {
      const r = await f.request(method, `/api/admin/client-devices/${d.id}/transfer`, method === 'POST' ? { sourceClientId: source.id, clientId: target.id } : undefined, headers);
      assert.equal(r.status, 401);
    }
  }
  assert.equal(devices(f)[0].client_id, source.id);
});

test('destination capacity counts pending and active devices, and a rejected move changes nothing', async t => {
  const f = await transferFixture(t), source = f.client(), target = f.client(), d = await f.device(source);
  await f.device(target);
  await f.device(target, { status: 'pending' });
  const before = devices(f), billing = commercial(f);
  const preview = await f.admin('GET', `/api/admin/client-devices/${d.id}/transfer`);
  assert.equal(preview.body.targets.find(c => c.id === target.id).allowed, false);
  assert.equal((await f.move(d, source, target)).status, 409);
  assert.deepEqual(devices(f), before);
  assert.deepEqual(commercial(f), billing);
});

test('invalid IDs, the same customer, missing records and stale source links are rejected', async t => {
  const f = await transferFixture(t), source = f.client(), target = f.client(), d = await f.device(source);
  const before = devices(f);
  for (const clientId of [null, 0, -1, 1.5, '2', true]) {
    assert.equal((await f.move(d, source, target, { clientId })).status, 400);
  }
  for (const body of [null, [], 'invalid']) {
    assert.equal((await f.admin('POST', `/api/admin/client-devices/${d.id}/transfer`, body)).status, 400);
  }
  assert.equal((await f.move(d, source, target, { sourceClientId: undefined })).status, 400);
  assert.equal((await f.move(d, source, source)).status, 409);
  assert.equal((await f.move(d, target, source)).status, 409);
  assert.equal((await f.move(d, source, { id: 99999 })).status, 404);
  assert.equal((await f.move({ id: 99999 }, source, target)).status, 404);
  const unlinked = await f.device(null, { status: 'pending' });
  assert.equal((await f.move(unlinked, source, target)).status, 409);
  assert.equal((await f.admin('GET', `/api/admin/client-devices/${unlinked.id}/transfer`)).status, 409);
  assert.deepEqual(devices(f).filter(x => x.id === d.id), before);
});

test('an active paid TV cannot be moved to a disabled, expired or blocked-owner customer', async t => {
  const f = await transferFixture(t), source = f.client(), d = await f.device(source);
  const owner = f.account(4, f.root.id), blockedOwner = f.client(owner.id);
  f.db.prepare('UPDATE accounts SET manual_blocked=1 WHERE id=?').run(owner.id);
  const targets = [f.client(f.root.id, later(), { active: false }), f.client(f.root.id, later(-10)), blockedOwner];
  const before = devices(f);
  for (const target of targets) assert.equal((await f.move(d, source, target)).status, 409);
  assert.deepEqual(devices(f), before);
});

test('paid time is never copied to a customer that already has devices or service history', async t => {
  const f = await transferFixture(t), source = f.client(), d = await f.device(source);
  const hasDevice = f.client(f.root.id, null), hasHistory = f.client(f.root.id, null);
  await f.device(hasDevice, { status: 'blocked' });
  f.db.prepare('INSERT INTO client_service_ledger(client_id,charged_account_id,created_by_account_id,credits_spent,new_expiry,action,created_at) VALUES (?,?,?,1,?,?,?)')
    .run(hasHistory.id, f.root.id, f.root.id, later(-10), 'activate', new Date().toISOString());
  const before = commercial(f);
  for (const target of [hasDevice, hasHistory]) assert.equal((await f.move(d, source, target)).status, 409);
  assert.deepEqual(commercial(f), before);
});

test('an active demo retains its original expiry, session and history under the new customer', async t => {
  const f = await transferFixture(t), source = f.client(f.root.id, null), target = f.client(f.root.id, null);
  const d = await f.device(source);
  f.demo(d, source);
  const login = await f.session(d), demoBefore = f.db.prepare('SELECT * FROM device_demos').get();
  const oldSessions = sessions(f), history = f.db.prepare('SELECT * FROM demo_device_history').all();
  assert.equal((await f.move(d, source, target)).status, 200);
  const demoAfter = f.db.prepare('SELECT * FROM device_demos').get();
  assert.deepEqual({ ...demoAfter, client_id: source.id }, { ...demoBefore });
  assert.deepEqual(sessions(f), oldSessions);
  assert.deepEqual(f.db.prepare('SELECT * FROM demo_device_history').all(), history);
  const config = await f.config(login.body.token);
  assert.equal(config.status, 200);
  assert.equal(config.body.accessMode, 'demo');
  assert.equal(config.body.accessExpiresAt, demoBefore.expires_at);
  const counts = await f.admin('GET', '/api/admin/clients');
  assert.equal(counts.body.clients.find(c => c.id === source.id).demo_used_count, 0);
  assert.equal(counts.body.clients.find(c => c.id === target.id).demo_active_count, 1);
  assert.equal((await f.admin('DELETE', `/api/admin/clients/${source.id}`, { confirm: 'ELIMINAR' })).status, 200);
  assert.equal((await f.config(login.body.token)).status, 200, 'deleting the old customer must not delete the moved demo');
});

test('moving an expired demo never grants another demo, even when automatic demos are enabled', async t => {
  const f = await transferFixture(t), source = f.client(f.root.id, null), target = f.client(f.root.id, null);
  const d = await f.device(source, { status: 'pending' });
  f.demo(d, source, later(-20));
  f.db.prepare("UPDATE settings SET setting_value='1' WHERE setting_key='demos_enabled'").run();
  const before = f.db.prepare('SELECT * FROM device_demos').get();
  assert.equal((await f.move(d, source, target)).status, 200);
  const status = await f.status(d.uid, d.registration);
  assert.equal(status.body.allowed, false);
  assert.equal(status.body.demo.used, true);
  assert.equal(status.body.demo.expiresAt, before.expires_at);
  assert.equal((await f.session(d)).status, 403);
  assert.equal(f.db.prepare('SELECT COUNT(*) n FROM device_demos').get().n, 1);
});

test('a blocked device remains blocked and can later reactivate using its preserved token', async t => {
  const f = await transferFixture(t), source = f.client(), target = f.client(f.root.id, null), d = await f.device(source);
  const login = await f.session(d), oldSessions = sessions(f);
  f.db.prepare("UPDATE client_devices SET status='blocked' WHERE id=?").run(d.id);
  assert.equal((await f.move(d, source, target)).status, 200);
  assert.deepEqual(sessions(f), oldSessions);
  assert.equal(devices(f)[0].status, 'blocked');
  const config = await f.config(login.body.token);
  assert.equal(config.status, 403);
  assert.equal(config.body.reason, 'device_blocked');
  assert.equal((await f.admin('POST', `/api/admin/client-devices/${d.id}/reactivate`, {})).status, 200);
  assert.equal((await f.config(login.body.token)).status, 200);
});

test('an audit failure rolls back the device link, inherited expiry and demo together', async t => {
  const f = await transferFixture(t), source = f.client(), target = f.client(f.root.id, null), d = await f.device(source);
  f.demo(d, source, later(-10));
  await f.session(d);
  const before = devices(f), billing = commercial(f), oldSessions = sessions(f), demos = f.db.prepare('SELECT * FROM device_demos').all();
  f.db.exec("CREATE TRIGGER reject_transfer_audit BEFORE INSERT ON security_audit WHEN NEW.action='client_device_transferred' BEGIN SELECT RAISE(ABORT,'test audit failure'); END");
  assert.equal((await f.move(d, source, target)).status, 500);
  assert.equal(f.errors.length, 1);
  assert.equal(f.errors[0].message, 'test audit failure');
  assert.deepEqual(devices(f), before);
  assert.deepEqual(commercial(f), billing);
  assert.deepEqual(sessions(f), oldSessions);
  assert.deepEqual(f.db.prepare('SELECT * FROM device_demos').all(), demos);
  f.db.exec('DROP TRIGGER reject_transfer_audit');
  assert.equal((await f.move(d, source, target)).status, 200, 'the failed transaction must not leave the database locked');
});

test('simultaneous moves cannot overfill the last destination slot', async t => {
  const f = await transferFixture(t), source = f.client(), target = f.client(f.root.id, later(), { limit: 1 });
  const a = await f.device(source), b = await f.device(source);
  const results = await Promise.all([f.move(a, source, target), f.move(b, source, target)]);
  assert.deepEqual(results.map(r => r.status).sort(), [200, 409]);
  assert.equal(devices(f).filter(d => d.client_id === target.id).length, 1);
  assert.equal(devices(f).filter(d => d.client_id === source.id).length, 1);
});

test('the server rejects changed expiry and source data after a transfer preview', async t => {
  const f = await transferFixture(t), source = f.client(), target = f.client(), third = f.client(), d = await f.device(source);
  const preview = await f.admin('GET', `/api/admin/client-devices/${d.id}/transfer`);
  const option = preview.body.targets.find(c => c.id === target.id);
  f.db.prepare('UPDATE clients SET expires_at=? WHERE id=?').run(later(60), target.id);
  assert.equal((await f.move(d, source, target, { serviceExpiresAt: option.serviceExpiresAt })).status, 409);
  assert.equal(devices(f)[0].client_id, source.id);
  assert.equal((await f.move(d, source, target)).status, 200);
  assert.equal((await f.move(d, source, third)).status, 409);
  assert.equal(devices(f)[0].client_id, target.id);
});

test('linking endpoints cannot bypass the General Administration transfer rule', async t => {
  const f = await transferFixture(t), owner = f.account(4, f.root.id), source = f.client(owner.id), target = f.client(owner.id);
  const d = await f.device(source);
  assert.equal((await f.as(owner, 'POST', '/api/admin/client-devices/assign-by-code', { activationCode: d.code, clientId: target.id })).status, 409);
  assert.equal((await f.as(owner, 'POST', `/api/admin/client-devices/${d.id}/assign`, { clientId: target.id })).status, 404);
  assert.equal(devices(f)[0].client_id, source.id);
});

test('moving a UID-collision TV preserves both TVs and their individual credentials', async t => {
  const f = await transferFixture(t), source = f.client(), target = f.client();
  const a = await f.device(source, { uid: 'same-android-id-transfer' });
  const b = await f.device(source, { uid: a.uid });
  const aLogin = await f.session(a), bLogin = await f.session(b);
  assert.equal((await f.move(b, source, target)).status, 200);
  assert.equal((await f.status(a.uid, a.registration)).body.clientId, source.id);
  assert.equal((await f.status(b.uid, b.registration)).body.clientId, target.id);
  assert.equal((await f.config(aLogin.body.token)).body.client.name, source.name);
  assert.equal((await f.config(bLogin.body.token)).body.client.name, target.name);
});
