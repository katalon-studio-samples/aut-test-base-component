import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

function runBootstrap(pageFile, { search = '', stored = {}, pathname = '/' } = {}) {
  const html = readFileSync(pageFile, 'utf8');
  const match = [...html.matchAll(/<script(?:\s+src="([^"]+)")?>([\s\S]*?)<\/script>/g)]
    .find(([, src, body]) => src === '/traffic-agent-bootstrap.js' || body.includes('Load traffic-agent scripts'));
  const bootstrap = match ? (match[1] ? readFileSync(`public${match[1]}`, 'utf8') : match[2]) : '';
  const loaded = [];
  const storage = new Map(Object.entries(stored));
  const document = {
    createElement: () => ({ setAttribute(name, value) { this[name] = value; } }),
    head: { appendChild: script => loaded.push(script) },
  };
  const localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  const location = { search, pathname };
  runInNewContext(bootstrap, { window: { location }, location, localStorage, document, URLSearchParams, console, Math });
  return loaded;
}

for (const page of ['index.html', 'public/tab-workflow-test/signer.html']) {
  test(`${page}: uses the saved QA environment and client code`, () => {
    const loaded = runBootstrap(page, { stored: { 'katalon-env': 'qa', 'katalon-client-code': 'KA-TEST' } });
    assert.equal(loaded.length, 2);
    assert.equal(loaded[0].src, 'https://static.qa.katalon.com/libs/traffic-agent/v1/truetest-sdk.min.js');
    assert.match(loaded[1].src, /^https:\/\/static\.qa\.katalon\.com\/libs\/traffic-agent\/v1\/traffic-agent\.min\.js\?q=/);
    assert.equal(loaded[1]['client-code'], 'KA-TEST');
  });
  test(`${page}: skips the agent when no client code is configured`, () => {
    const loaded = runBootstrap(page);
    assert.equal(loaded.length, 1);
    assert.match(loaded[0].src, /truetest-sdk\.min\.js$/);
  });
}

test('URL environment and client code override saved settings', () => {
  const loaded = runBootstrap('public/tab-workflow-test/signer.html', { search: '?env=staging&clientCode=KA-OTHER', stored: { 'katalon-env': 'qa', 'katalon-client-code': 'KA-TEST' } });
  assert.match(loaded[1].src, /^https:\/\/static\.staging\.katalon\.com\//);
  assert.equal(loaded[1]['client-code'], 'KA-OTHER');
});

test('isolated library route still loads no scripts', () => {
  const loaded = runBootstrap('index.html', { pathname: '/traffic-agent-performance', stored: { 'katalon-env': 'qa', 'katalon-client-code': 'KA-TEST' } });
  assert.equal(loaded.length, 0);
});
