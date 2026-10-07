'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { backendFixture: fixture } = require('./helpers/backend-fixture.cjs');

test('two TVs with the same model name and different UIDs remain separate', async t => {
  const f = await fixture(t);
  const a = await f.register('test-tcl-uid-A');
  const b = await f.register('test-tcl-uid-B');
  assert.equal(a.status, 201);
  assert.equal(b.status, 201);
  assert.notEqual(a.body.activationCode, b.body.activationCode);
  assert.equal((await f.status('test-tcl-uid-A', a)).status, 200);
  assert.equal((await f.status('test-tcl-uid-B', b)).status, 200);
});

test('a UID collision never invalidates an earlier pending TV', async t => {
  const f = await fixture(t);
  const uid = 'test-tcl-repeated-android-id';
  const a = await f.register(uid);
  const b = await f.register(uid);
  assert.equal((await f.status(uid, a)).status, 200,
    'the first TV must keep its original credential');
  assert.equal((await f.status(uid, b)).status, 200);
  assert.notEqual(a.body.activationCode, b.body.activationCode);
  assert.notEqual(a.body.deviceSecret, b.body.deviceSecret);
  assert.equal(f.db.prepare('SELECT COUNT(*) n FROM client_devices').get().n, 2);
});

test('simultaneous registrations sharing one UID keep all credentials valid', async t => {
  const f = await fixture(t);
  const uid = 'test-tcl-concurrent-id';
  const registrations = await Promise.all(Array.from({ length: 3 }, () => f.register(uid)));
  assert.equal(new Set(registrations.map(r => r.body.activationCode)).size, 3);
  for (const r of registrations) assert.equal((await f.status(uid, r)).status, 200);
});

test('a verified registration retry reuses its code and credential', async t => {
  const f = await fixture(t);
  const uid = 'test-tcl-retry-id';
  const a = await f.register(uid);
  const b = await f.register(uid, { deviceSecret: a.body.deviceSecret });
  assert.equal(b.status, 200);
  assert.equal(b.body.existing, true);
  assert.equal(b.body.activationCode, a.body.activationCode);
  assert.equal(b.body.deviceSecret, a.body.deviceSecret);
  assert.equal(f.db.prepare('SELECT COUNT(*) n FROM client_devices').get().n, 1);
});

test('a verified retry of a collision record does not create another device', async t => {
  const f = await fixture(t);
  const uid = 'test-tcl-collision-retry';
  const a = await f.register(uid);
  const b = await f.register(uid);
  const retry = await f.register(uid, { deviceSecret: b.body.deviceSecret });
  assert.equal(retry.status, 200);
  assert.equal(retry.body.activationCode, b.body.activationCode);
  assert.equal((await f.status(uid, a)).status, 200);
  assert.equal(f.db.prepare('SELECT COUNT(*) n FROM client_devices').get().n, 2);
});

test('a collision preserves a blocked record and its original secret', async t => {
  const f = await fixture(t);
  const uid = 'test-tcl-blocked-id';
  const a = await f.register(uid);
  f.db.prepare("UPDATE client_devices SET status='blocked' WHERE activation_code=?")
    .run(a.body.activationCode);
  const b = await f.register(uid);
  const original = await f.status(uid, a);
  assert.equal(original.status, 200);
  assert.equal(original.body.status, 'blocked');
  assert.notEqual(b.body.activationCode, a.body.activationCode);
  const retry = await f.register(uid, { deviceSecret: a.body.deviceSecret });
  assert.equal(retry.body.status, 'blocked');
  assert.equal(retry.body.activationCode, a.body.activationCode);
});

test('an invalid credential cannot replace or recover an existing record', async t => {
  const f = await fixture(t);
  const uid = 'test-tcl-untrusted-id';
  const a = await f.register(uid);
  const b = await f.register(uid, { deviceSecret: 'invalid-credential' });
  assert.equal(b.status, 201);
  assert.notEqual(b.body.activationCode, a.body.activationCode);
  assert.equal((await f.status(uid, a)).status, 200);
  assert.equal((await f.status(uid, { body: { deviceSecret: 'invalid-credential' } })).status, 401);
});

test('invalid device UIDs are rejected without adding a record', async t => {
  const f = await fixture(t);
  assert.equal((await f.register('short')).status, 400);
  assert.equal(f.db.prepare('SELECT COUNT(*) n FROM client_devices').get().n, 0);
});
