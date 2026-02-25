import assert from 'node:assert/strict';
import test from 'node:test';
import { clamp, getInitialWindowSize, getWindowMinimums } from '../src/stores/workspaceLayout.js';

test('clamp constrains values inside min/max bounds', () => {
  assert.equal(clamp(5, 1, 10), 5);
  assert.equal(clamp(-2, 1, 10), 1);
  assert.equal(clamp(14, 1, 10), 10);
});

test('getWindowMinimums returns expected bounds per kind', () => {
  assert.deepEqual(getWindowMinimums('about'), { width: 340, height: 240 });
  assert.deepEqual(getWindowMinimums('projects'), { width: 360, height: 300 });
  assert.deepEqual(getWindowMinimums('contact'), { width: 360, height: 320 });
});

test('getInitialWindowSize scales by kind and viewport bounds', () => {
  const largeBounds = { width: 1400, height: 900 };
  const contact = getInitialWindowSize('contact', largeBounds);
  const about = getInitialWindowSize('about', largeBounds);

  assert.ok(contact.width >= about.width);
  assert.ok(contact.height >= 320);

  const narrowBounds = { width: 480, height: 700 };
  const narrow = getInitialWindowSize('projects', narrowBounds);

  assert.ok(narrow.width <= narrowBounds.width);
  assert.ok(narrow.height <= 460);
});
