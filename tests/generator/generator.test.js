const mongoose = require('mongoose');
const _ = require('lodash');
const test = require('tap').test;
const testUtils = require('../test.utils.js');
const theGenerator = require('../../index.js');
const sinon = require('sinon');


testUtils.start(test);

let g;
test('instance theGenerator', function(t) {
  g = theGenerator({auth: {secret: 'xxx'}}, mongoose);
  t.ok(!!g.schemas.permission);
  t.ok(!!g.schemas.permission.mongooseSchema);
  t.ok(!!g.schemas.role);
  t.ok(!!g.schemas.role.mongooseSchema);
  t.ok(!!g.schemas.user);
  t.ok(!!g.schemas.user.mongooseSchema);
  t.ok(!!mongoose.models.autoincrements);


  t.end();
});

test('check role paths', function(t) {
  const paths = [];
  g.schemas.role.mongooseSchema.eachPath(function(name) {
    paths.push(name);
  });

  t.deepEqual(paths, [
    '_id',
    'label',
    'permissions',
    'updated_at',
    'created_at',
  ]);

  t.end();
});

test('check permission paths', function(t) {
  const paths = [];
  g.schemas.permission.mongooseSchema.eachPath(function(name) {
    paths.push(name);
  });

  t.deepEqual(paths, [
    '_id',
    'label',
    'updated_at',
    'created_at',
  ]);

  t.end();
});

test('check user paths', function(t) {
  const paths = [];
  g.schemas.user.mongooseSchema.eachPath(function(name) {
    paths.push(name);
  });

  t.deepEqual(paths, [
    'id',
    'username',
    'password',
    'salt',
    'roles',
    'permissions',
    'state',
    'data.first_name',
    'data.last_name',
    '_id',
    'updated_at',
    'created_at',
  ]);

  t.end();
});

test('check invalid model', function(t) {
  t.throws(function() {
    g.schemas.permission.getModel();
  }, new Error('finalize first'));

  t.end();
});

test('finalize generator', function(t) {
  const callbackStart = sinon.spy();
  const callbackEnd = sinon.spy();
  g.on('finalize:start', callbackStart);
  g.on('finalize:end', callbackEnd);
  g.finalize();

  t.ok(callbackStart.calledOnce);
  t.ok(callbackEnd.calledOnce);

  t.end();
});


test('check models', function(t) {
  t.ok(!!g.models.role);
  t.ok(!!g.models.permission);

  t.end();
});


testUtils.finish(test);

