const path = require('path');
const mongoose = require('mongoose');
const _ = require('lodash');
const test = require('tap').test;
const testUtils = require('../test.utils.js');
const theGenerator = require('../../index.js');
const sinon = require('sinon');
const fs = require('fs');
const cheerio = require('cheerio');

testUtils.start(test);
const generationPath = path.join(__dirname, 'tmp');
//const generationPath = '/home/llafuente/angular-stack/app/entities'
let g;
test('instance theGenerator', function(t) {
  //require("fs").mkdirSync(generationPath);
  g = theGenerator({
    auth: {
      secret: 'xxx'
    },
    apiBasePath: '/api',
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

test('check user apiUrls/permissions', function(t) {
  const paths = [];
  t.deepEqual(g.schemas.user.apiUrls, {
    'create': '/api/users',
    'delete': '/api/users/:user_id',
    'list': '/api/users',
    'read': '/api/users/:user_id',
    'update': '/api/users/:user_id',
  });
  t.deepEqual(g.schemas.user.permissions, {
    'create': 'permission/users-create',
    'delete': 'permission/users-delete',
    'list': 'permission/users-list',
    'read': 'permission/users-read',
    'update': 'permission/users-update',
  });

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
  const role = g.schemas.role;
  const list = [];
  role.eachBack(function(obj) {
    list.push(obj);
  });

  const realpath = _.map(list, 'realpath');
  const types = _.map(list, 'backField.type');
  const names = _.map(list, 'backField.name');

  t.deepEqual(names, [
    '_id',
    'label',
    'permissions',
    'permissions_permissions_id_',
    'id',
    'created_at',
    'updated_at',
    '__v',
  ]);
  t.deepEqual(types, [
    'String',
    'String',
    'Array',
    'String',
    'Number',
    'Date',
    'Date',
    'Number',
  ]);

  t.deepEqual(realpath, [
    '_id',
    'label',
    'permissions',
    'permissions[permissions_id]',
    'id',
    'created_at',
    'updated_at',
    '__v',
  ]);

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


test('check front fields user create', function(t) {
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

test('check front fields user update', function(t) {
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

test('check front fields role update', function(t) {
  const role = g.schemas.role;
  const list = [];
  role.eachFrontForm('update', function(obj) {
    list.push(obj);
  });

  const realpath = _.map(list, 'realpath');
  const types = _.map(list, 'frontField.type');

  t.deepEqual(types, [
    'text',
    'checklist',
    'static',

  ]);

  t.deepEqual(realpath, [
    'label',
    'permissions',
    'id',

  ]);

  t.end();
});


test('check role.create.tpl.html', function(t) {
  g.generateForm(g.schemas.role, 'create', function(err) {
    t.error(err);

    const filename = path.join(generationPath, 'role.create.tpl.html');
    const html = testUtils.checkHTML(t, filename);

    const $ = cheerio.load(html);

    t.equal($('.form-vertical').toArray().length, 1);
    t.equal($('.control-container').toArray().length, 2);
    t.equal($('input').toArray().length, 2);
    t.equal($('button').toArray().length, 1);


    t.end();
  });
});

test('check role.update.tpl.html', function(t) {
  g.generateForm(g.schemas.role, 'update', function(err) {
    t.error(err);

    const filename = path.join(generationPath, 'role.update.tpl.html');
    const html = testUtils.checkHTML(t, filename);

    const $ = cheerio.load(html);

    t.equal($('.form-vertical').toArray().length, 1);
    t.equal($('.control-container').toArray().length, 3);
    t.equal($('input').toArray().length, 2);
    t.equal($('button').toArray().length, 1);


    t.end();
  });
});

test('check front fields for create role', function(t) {
  g.generateAngular(g.schemas.role, function(err) {
    t.error(err);

    t.end();
  });
});
// this are just smoke tests
test('check role.list.tpl.html', function(t) {
  const filename = path.join(generationPath, 'role.list.tpl.html');
  const html = testUtils.checkHTML(t, filename);

  const $ = cheerio.load(html);

  t.equal($('.headers th').toArray().length, 4);

  t.end();
});

test('check all js files', function(t) {
  testUtils.checkJS(t, path.join(generationPath, 'role.create.controller.js'));
  testUtils.checkJS(t, path.join(generationPath, 'role.list.controller.js'));
  testUtils.checkJS(t, path.join(generationPath, 'role.module.js'));
  testUtils.checkJS(t, path.join(generationPath, 'role.routes.config.js'));
  testUtils.checkJS(t, path.join(generationPath, 'role.update.controller.js'));

  t.end();
});

test('g.generateAll', function(t) {
  g.generateAll(function(err) {
    t.error(err);
    t.end();
  });
});

test('smoke test for everything generated', function(t) {
  ['role', 'permission', 'user'].forEach(function(entity) {
    testUtils.checkJS(t, path.join(generationPath, `${entity}.create.controller.js`));
    testUtils.checkJS(t, path.join(generationPath, `${entity}.list.controller.js`));
    testUtils.checkJS(t, path.join(generationPath, `${entity}.module.js`));
    testUtils.checkJS(t, path.join(generationPath, `${entity}.routes.config.js`));
    testUtils.checkJS(t, path.join(generationPath, `${entity}.update.controller.js`));

    testUtils.checkHTML(t, path.join(generationPath, `${entity}.list.tpl.html`));
    testUtils.checkHTML(t, path.join(generationPath, `${entity}.create.tpl.html`));
    testUtils.checkHTML(t, path.join(generationPath, `${entity}.update.tpl.html`));
  });

  t.end();
});

testUtils.finish(test);
