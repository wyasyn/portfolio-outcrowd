import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SUBMISSION_COOLDOWN_MS,
  buildContactPayload,
  contactFormSchema,
  shouldThrottleSubmission,
} from '../src/components/workspace/content/contactFormLogic.js';

test('contact form schema accepts valid values', () => {
  const valid = contactFormSchema.safeParse({
    name: 'Yasin',
    email: 'yasin@example.com',
    message: 'Hello there, this is a message with enough length.',
    company: '',
  });

  assert.equal(valid.success, true);
});

test('contact form schema rejects invalid values', () => {
  const invalid = contactFormSchema.safeParse({
    name: 'Y',
    email: 'invalid-email',
    message: 'short',
    company: 'bot-filled',
  });

  assert.equal(invalid.success, false);
});

test('shouldThrottleSubmission enforces cooldown window', () => {
  const now = 100_000;

  assert.equal(shouldThrottleSubmission(now - SUBMISSION_COOLDOWN_MS + 1, now), true);
  assert.equal(shouldThrottleSubmission(now - SUBMISSION_COOLDOWN_MS, now), false);
  assert.equal(shouldThrottleSubmission(now - SUBMISSION_COOLDOWN_MS - 500, now), false);
});

test('buildContactPayload includes expected formsubmit fields', () => {
  const payload = buildContactPayload({
    name: 'Yasin',
    email: 'yasin@example.com',
    message: 'Interested in working together.',
  });

  assert.equal(payload._subject, 'Portfolio inquiry from Yasin');
  assert.equal(payload._captcha, 'false');
  assert.equal(payload._template, 'table');
  assert.equal(payload.email, 'yasin@example.com');
});
