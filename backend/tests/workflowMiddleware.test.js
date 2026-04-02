import test from 'node:test';
import assert from 'node:assert/strict';
import createStatusTransitionGuard from '../src/middleware/workflowMiddleware.js';

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

test('status transition guard blocks invalid transition', async () => {
  const Model = {
    findOne: () => ({
      select: async () => ({ status: 'draft' })
    })
  };
  const guard = createStatusTransitionGuard(Model, { draft: ['sent'], sent: [] });

  const req = { body: { status: 'accepted' }, params: { id: '1' }, user: { business: 'b1' } };
  const res = createRes();
  let called = false;

  await guard(req, res, () => {
    called = true;
  });

  assert.equal(called, false);
  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /Invalid status transition/);
});

test('status transition guard allows valid transition', async () => {
  const Model = {
    findOne: () => ({
      select: async () => ({ status: 'draft' })
    })
  };
  const guard = createStatusTransitionGuard(Model, { draft: ['sent'], sent: [] });

  const req = { body: { status: 'sent' }, params: { id: '1' }, user: { business: 'b1' } };
  const res = createRes();
  let called = false;

  await guard(req, res, () => {
    called = true;
  });

  assert.equal(called, true);
  assert.equal(res.statusCode, 200);
});
