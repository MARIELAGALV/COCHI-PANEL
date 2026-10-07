'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { once } = require('node:events');

// Execute the real backend against an isolated SQLite database and local HTTP.
// Browser resolution and background jobs are outside these device API tests.
async function backendFixture(t) {
  const root = path.resolve(__dirname, '../..');
  const data = fs.mkdtempSync(path.join(os.tmpdir(), 'cochi-device-test-'));
  const timer = () => ({ unref() {} });
  const errors = [];
  const context = vm.createContext({
    require(name) {
      if (name === 'puppeteer-core') {
        return { launch() { throw new Error('Browser use is outside device API tests'); } };
      }
      return require(name);
    },
    __dirname: root,
    process: { env: { COCHI_DATA_DIR: data, HOST: '127.0.0.1', PORT: '0' }, on() {} },
    console: { log() {}, warn() {}, error(...args) { errors.push(...args); } },
    Buffer, URL, URLSearchParams, AbortController, AbortSignal, TextEncoder, TextDecoder,
    fetch, setTimeout: timer, setInterval: timer, clearTimeout() {}, clearInterval() {},
  });
  const source = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
  vm.runInContext(source + '\n globalThis.backendFixture = {server, db};', context,
    { filename: path.join(root, 'server.js') });
  const { server, db } = context.backendFixture;
  await once(server, 'listening');
  t.after(async () => {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    db.close();
    fs.rmSync(data, { recursive: true, force: true });
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  async function request(method, route, body, headers = {}) {
    const response = await fetch(base + route, {
      method, headers: { 'content-type': 'application/json', ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: response.status, body: await response.json() };
  }
  const post = (route, body) => request('POST', '/api/client-device/' + route, body);
  return {
    db, base, request, errors,
    register: (uid, extra = {}) => post('register', {
      deviceUid: uid, deviceName: 'TCL BeyondTV', platform: 'android-tv', ...extra,
    }),
    status: (uid, registration) => post('status', {
      deviceUid: uid, deviceSecret: registration.body.deviceSecret,
    }),
  };
}

module.exports = { backendFixture };
