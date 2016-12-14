const path = require('path');
const mongoose = require('mongoose');
const _ = require('lodash');
const test = require('tap').test;
const testUtils = require('../test.utils.js');
const theGenerator = require('../../index.js');
const sinon = require('sinon');
const fs = require('fs');
var cheerio = require("cheerio");

testUtils.start(test);
const generationPath = path.join(__dirname, 'tmp');
let g;
test('instance theGenerator', function(t) {
  //require("fs").mkdirSync(generationPath);
  g = theGenerator({
    auth: {
      secret: 'xxx'
    },
    generationPath: generationPath
  }, mongoose);

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
    'id',
    '__v',
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
    'id',
    '__v',
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
    '__v',
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

test('check backend fields list', function(t) {
  const user = g.schemas.user;
  const list = [];
  user.eachBack(function(obj) {
    list.push(obj);
  });

  const realpath = _.map(list, 'realpath');
  const types = _.map(list, 'backField.type');

  t.deepEqual(types, [
    'Number',
    'String',
    'String',
    'String',
    'Array',
    'String',
    'Array',
    'String',
    'String',
    'Object',
    'String',
    'String',
    'Date',
    'Date',
    'Number',
  ]);

  t.deepEqual(realpath, [
    'id',
    'username',
    'password',
    'salt',
    'roles',
    'roles[roles_id]',
    'permissions',
    'permissions[permissions_id]',
    'state',
    'data',
    'data.first_name',
    'data.last_name',
    'created_at',
    'updated_at',
    '__v',
  ]);

  t.end();
});

test('check front fields list', function(t) {
  const user = g.schemas.user;
  const list = [];
  user.eachFrontList(function(obj) {
    list.push(obj);
  });

  const realpath = _.map(list, 'realpath');
  const types = _.map(list, 'frontField.type');

  t.deepEqual(types, [
    'number',
    'text',
    'select',
    'select',
    'text',
    'text',
    'date-range',
  ]);

  t.deepEqual(realpath, [
    'id',
    'username',
    'roles',
    'state',
    'data.first_name',
    'data.last_name',
    'created_at',
  ]);

  t.end();
});


test('check front fields create', function(t) {
  const user = g.schemas.user;
  const list = [];
  user.eachFrontForm('create', function(obj) {
    list.push(obj);
  });

  const realpath = _.map(list, 'realpath');
  const types = _.map(list, 'frontField.type');

  t.deepEqual(types, [
    'email',
    'password',
    'checklist',
    'checklist',
    'text',
    'text',
  ]);

  t.deepEqual(realpath, [
    'username',
    'password',
    'roles',
    'permissions',
    'data.first_name',
    'data.last_name',
  ]);

  t.end();
});

test('check front fields update', function(t) {
  const user = g.schemas.user;
  const list = [];
  user.eachFrontForm('update', function(obj) {
    list.push(obj);
  });

  const realpath = _.map(list, 'realpath');
  const types = _.map(list, 'frontField.type');

  t.deepEqual(types, [
    'static',
    'email',
    'password',
    'checklist',
    'checklist',
    'select',
    'text',
    'text',
  ]);

  t.deepEqual(realpath, [
    'id',
    'username',
    'password',
    'roles',
    'permissions',
    'state',
    'data.first_name',
    'data.last_name',
  ]);

  t.end();
});

test('check front fields for create role', function(t) {
  g.generateForm(g.schemas.role, 'create', function(err) {
    t.error(err);
    const filename = path.join(generationPath, 'role.create.tpl.html');
    t.ok(fs.existsSync(filename));

    var $ = cheerio.load(fs.readFileSync(filename, 'utf-8'));
    t.equal($(".form-vertical").toArray().length, 1);
    t.equal($(".control-container").toArray().length, 2);
    t.equal($("input").toArray().length, 2);
    t.equal($("button").toArray().length, 1);

    t.end();
  });
});

/*
test('check front fields update', function(t) {
  t.plan(1);
  g.generateForms(function(err) {
    t.ok(!!err);
    console.log(err);
  });
});
*/

testUtils.finish(test);

