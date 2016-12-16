const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const _ = require('lodash');
const test = require('tap').test;
const testUtils = require('../test.utils.js');
const theGenerator = require('../../index.js');
const sinon = require('sinon');
const cheerio = require('cheerio');
const supertest = require('supertest');

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
    '_id',
    '__v',
    'updated_at',
    'created_at',
  ]);

  t.end();
});

test('check user apiUrls/permissions', function(t) {
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
  }, new Error('permission need to be finalized first'));

  t.end();
});

test('finalize generator', function(t) {
  const callbackStart = sinon.spy();
  const callbackEnd = sinon.spy();
  g.on('finalize:start', callbackStart);
  g.on('finalize:end', callbackEnd);
  g.finalize();

  setTimeout(function() {
    t.ok(callbackStart.calledOnce, 'finalize:start called once');
    t.ok(callbackEnd.calledOnce, 'finalize:end called once');
    t.end();
  }, 2000);
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
    'ObjectId',
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
    '_id',
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

//
// server test
//
let app;
test('configure a server to include all routers', function(t) {
  app = express();

  app.use(require('body-parser').json());
  app.use(require('body-parser').urlencoded());
  app.use(
    require(path.join(generationPath, 'role.express.router.js'))(g, g.schemas.role)
  );
  app.use(
    require(path.join(generationPath, 'permission.express.router.js'))(g, g.schemas.permission)
  );
  app.use(
    require(path.join(generationPath, 'user.express.router.js'))(g, g.schemas.user)
  );

  t.end();
});

let userId;
test('api user create', function(t) {
  supertest(app)
  .post(g.schemas.user.apiUrls.create)
  .send({
    username: 'admin@admin.com',
    password: 'admin'
  })
  .expect(201)
  .end(function(err, res) {
    t.error(err);
    userId = res.body._id;
    t.equal(res.body.username, 'admin@admin.com');
    t.notEqual(res.body.password, 'Administrator');

    t.end();
  });
});

test('api user get list', function(t) {
  supertest(app)
  .get(g.schemas.user.apiUrls.list)
  .expect(200)
  .end(function(err, res) {
    t.error(err);

    t.type(res.body, 'object');

    $log.info(res.body);

    t.end();
  });
});

test('api user read', function(t) {
  supertest(app)
  .get(g.schemas.user.apiUrls.read.replace(`:${g.schemas.user.apiIdParam}`, userId))
  .expect(200)
  .end(function(err, res) {
    t.error(err);

    // TODO
    //t.equal(res.body.password, undefined);
    //t.equal(res.body.salt, undefined);

    t.apiResult(res.body, {
      '__v': 0,
      'id': 1,
      'permissions': [],
      'roles': [],
      'state': 'active',
      'username': 'admin@admin.com',
    });

    t.end();
  });
});


test('api user update', function(t) {
  supertest(app)
  .patch(g.schemas.user.apiUrls.read.replace(`:${g.schemas.user.apiIdParam}`, userId))
  .send({
    username: 'admin2@admin.com'
  })
  .expect(200)
  .end(function(err, res) {
    t.error(err);

    t.equal(res.body.username, 'admin2@admin.com');

    t.end();
  });
});


test('api user read', function(t) {
  supertest(app)
  .get(g.schemas.user.apiUrls.read.replace(`:${g.schemas.user.apiIdParam}`, userId))
  .expect(200)
  .end(function(err, res) {
    t.error(err);

    t.equal(res.body.username, 'admin2@admin.com');
    t.apiResult(res.body, {
      '__v': 0,
      'id': 1,
      'permissions': [],
      'roles': [],
      'state': 'active',
      'username': 'admin2@admin.com',
    });

    t.end();
  });
});


test('api user delete', function(t) {
  supertest(app)
  .delete(g.schemas.user.apiUrls.delete.replace(`:${g.schemas.user.apiIdParam}`, userId))
  .expect(204)
  .end(function(err/*, res*/) {
    t.error(err);

    t.end();
  });
});

testUtils.finish(test);
