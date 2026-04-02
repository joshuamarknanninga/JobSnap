import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAuthPayload, validateResourcePayload } from '../src/middleware/validationMiddleware.js';

const createRes = () => ({
  statusCode: 200,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.body = payload;
    return this;
  }
});

test('validateAuthPayload(register) rejects missing name/businessName', () => {
  const req = { body: { email: 'a@a.com', password: 'secret12' } };
  const res = createRes();
  let called = false;

  validateAuthPayload('register')(req, res, () => {
    called = true;
  });

  assert.equal(called, false);
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.message, 'Validation failed');
  assert.ok(res.body.errors.includes('Name is required.'));
  assert.ok(res.body.errors.includes('Business name is required.'));
});

test('validateResourcePayload(estimates) accepts valid lineItems', () => {
  const req = {
    body: {
      customer: 'abc123',
      title: 'Deep clean',
      lineItems: [{ description: 'Kitchen', qty: 2, rate: 50 }]
    }
  };
  const res = createRes();
  let called = false;

  validateResourcePayload('estimates')(req, res, () => {
    called = true;
  });

  assert.equal(called, true);
  assert.equal(res.statusCode, 200);
});

test('validateResourcePayload(invoices) requires amount when no job linked', () => {
  const req = {
    body: {
      customer: 'abc123',
      invoiceNumber: 'INV-1',
      dueDate: '2026-05-01'
    }
  };
  const res = createRes();
  let called = false;

  validateResourcePayload('invoices')(req, res, () => {
    called = true;
  });

  assert.equal(called, false);
  assert.equal(res.statusCode, 400);
  assert.ok(res.body.errors.includes('Amount is required when no job is attached.'));
});
