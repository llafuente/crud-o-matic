const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const _ = require('lodash');
const test = require('tap').test;
const testUtils = require('../test.utils.js');
const theGenerator = require('../../index.js');
const cheerio = require('cheerio');
const supertest = require('supertest');
const rmrf = require('rimraf').sync;

testUtils.start(test);
const angularPath = path.join(__dirname, 'tmp', 'angular');
const expressPath = path.join(__dirname, 'tmp', 'express');

rmrf(path.join(__dirname, 'tmp'));

let g;
test('instance theGenerator', function(t) {
  g = theGenerator({
    auth: {
      secret: 'xxx'
    },
    apiBasePath: '/api',
    mongoose: mongoose,
    angularPath: angularPath,
    expressPath: expressPath,
  });

  t.ok(!!g.schemas.permission);
  t.ok(!!g.schemas.permission.mongooseSchema);
  t.ok(!!g.schemas.role);
  t.ok(!!g.schemas.role.mongooseSchema);
  t.ok(!!g.schemas.user);
  t.ok(!!g.schemas.user.mongooseSchema);


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
    'create': 'permission-users-create',
    'delete': 'permission-users-delete',
    'list': 'permission-users-list',
    'read': 'permission-users-read',
    'update': 'permission-users-update',
  });

  t.end();
});

test('check backend fields list', function(t) {
  const role = g.schemas.role;
  const list = [];
  role.eachBack(function(obj, entering) {
    if (entering) {
      list.push(obj);
    }
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
  user.eachBack(function(obj, entering) {
    if (entering) {
      list.push(obj);
    }
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
  user.eachFrontForm('create', function(control, entering) {
    if (!entering) {return;}

    list.push(control);
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
  user.eachFrontForm('update', function(control, entering) {
    if (!entering) {return;}

    list.push(control);
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
  role.eachFrontForm('update', function(control, entering) {
    if (!entering) {return;}

    list.push(control);
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
  const controls = g.schemas.role.getFrontForm('create');
  const realpaths = _.map(controls, 'realpath');

  t.deepEqual(realpaths, [
    'label',
    'permissions',
  ]);

  g.generateForm(g.schemas.role, 'create', function(err) {
    t.error(err);

    const filename = path.join(angularPath, 'role.create.tpl.html');
    const html = testUtils.checkHTML(t, filename);

    const $ = cheerio.load(html);

    t.equal($('.form-vertical').toArray().length, 1);
    t.equal($('.form-group').toArray().length, 2);
    t.equal($('input').toArray().length, 2);
    t.equal($('button').toArray().length, 1);


    t.end();
  });
});

test('check role.update.tpl.html', function(t) {
  g.generateForm(g.schemas.role, 'update', function(err) {
    t.error(err);

    const filename = path.join(angularPath, 'role.update.tpl.html');
    const html = testUtils.checkHTML(t, filename);

    const $ = cheerio.load(html);

    t.equal($('.form-vertical').toArray().length, 1);
    t.equal($('.form-group').toArray().length, 3);
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
  const filename = path.join(angularPath, 'role.list.tpl.html');
  const html = testUtils.checkHTML(t, filename);

  const $ = cheerio.load(html);

  t.equal($('.headers th').toArray().length, 4);
  t.equal($('input').toArray().length, 2);
  t.equal($('st-select').toArray().length, 1);
  t.equal($('button').toArray().length, 4);

  t.end();
});

test('check all js files', function(t) {
  testUtils.checkJS(t, path.join(angularPath, 'role.create.controller.js'));
  testUtils.checkJS(t, path.join(angularPath, 'role.list.controller.js'));
  testUtils.checkJS(t, path.join(angularPath, 'role.module.js'));
  testUtils.checkJS(t, path.join(angularPath, 'role.routes.config.js'));
  testUtils.checkJS(t, path.join(angularPath, 'role.update.controller.js'));

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
    // angular
    testUtils.checkJS(t, path.join(angularPath, `${entity}.create.controller.js`));
    testUtils.checkJS(t, path.join(angularPath, `${entity}.list.controller.js`));
    testUtils.checkJS(t, path.join(angularPath, `${entity}.module.js`));
    testUtils.checkJS(t, path.join(angularPath, `${entity}.routes.config.js`));
    testUtils.checkJS(t, path.join(angularPath, `${entity}.update.controller.js`));

    // templates
    testUtils.checkHTML(t, path.join(angularPath, `${entity}.list.tpl.html`));
    testUtils.checkHTML(t, path.join(angularPath, `${entity}.create.tpl.html`));
    testUtils.checkHTML(t, path.join(angularPath, `${entity}.update.tpl.html`));

    // express
    testUtils.checkJS(t, path.join(expressPath, `${entity}.express.create.js`));
    testUtils.checkJS(t, path.join(expressPath, `${entity}.express.destroy.js`));
    testUtils.checkJS(t, path.join(expressPath, `${entity}.express.list.js`));
    testUtils.checkJS(t, path.join(expressPath, `${entity}.express.read.js`));
    testUtils.checkJS(t, path.join(expressPath, `${entity}.express.router.js`));
    testUtils.checkJS(t, path.join(expressPath, `${entity}.express.update.js`));
  });

  testUtils.checkJS(t, path.join(expressPath, 'user.express.authentication.js'));
  testUtils.checkJS(t, path.join(expressPath, 'user.model.override.js'));
  testUtils.checkJS(t, path.join(expressPath, 'app.js'));

  t.end();
});

test('user.create.tpl.html', function(t) {
  const filename = path.join(angularPath, 'user.create.tpl.html');
  const html = testUtils.checkHTML(t, filename);

  const $ = cheerio.load(html);

  var input = $('#username-container .form-control')

  t.equal($(input).attr("ng-required"), "true", "check ng-required attribute");
  t.equal($(input).attr("ng-maxlength"), "254", "check ng-maxlength attribute");
  t.equal($(input).attr("type"), "email", "check type attribute");

  t.equal($('#username-container .error-list .error-block').toArray().length, 3,
    'three posible errors for username: required, maxlength email');

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

  require(path.join(expressPath, 'app.js'))(mongoose, function(err, router) {
    app.use(router);
    t.end();
  });
});


test('check role paths', function(t) {
  const paths = [];
  mongoose.modelSchemas.role.eachPath(function(name) {
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
  mongoose.modelSchemas.permission.eachPath(function(name) {
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
  mongoose.modelSchemas.user.eachPath(function(name) {
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

test('create admin role', function(t) {
  mongoose.models.permission.find({}, function(err, list) {
    t.error(err);
    const allPermissions = _.map(list, '_id');
    mongoose.models.role.create({
      _id: 'admin',
      label: 'admin',
      permissions: allPermissions
    }, function(err2/*, role*/) {
      t.error(err2);
      t.end();
    });
  });
});

let userId;
test('create admin user', function(t) {
  g.mongoose.models.user.create({
    username: 'admin@admin.com',
    password: 'admin',
    roles: 'admin'
  }, function(err, user) {
    t.error(err);
    userId = user._id;
    t.end();
  });
});


let token;
test('api user delete', function(t) {
  supertest(app)
  .post(`${g.schemas.user.apiUrls.list}/auth`)
  .send({
    username: 'admin@admin.com',
    password: 'admin'
  })
  .expect(200)
  .end(function(err, res) {
    t.error(err);

    t.type(res.body.token, 'string');
    token = res.body.token;

    t.end();
  });
});


test('api user get list', function(t) {
  supertest(app)
  .get(g.schemas.user.apiUrls.list)
  .set('Authorization', `Bearer ${token}`)
  .expect(200)
  .end(function(err, res) {
    t.error(err);

    t.type(res.body, 'object');

    $log.info(res.body);

    t.end();
  });
});

test('api user get list (err)', function(t) {
  supertest(app)
  .get(g.schemas.user.apiUrls.list + '?where[invalid_field]=123')
  .set('Authorization', `Bearer ${token}`)
  .expect(400)
  .end(function(err, res) {
    t.error(err);

    t.deepEqual(res.body, {
      "error": [
        {
          "message": "not found in schema",
          "path": "query:where",
          "type": "invalid-where",
          "value": "invalid_field",
          "value_type": null
        }
      ]
    });

    $log.info(res.body);

    t.end();
  });
});

test('api user read', function(t) {
  supertest(app)
  .get(g.schemas.user.apiUrls.read.replace(`:${g.schemas.user.apiIdParam}`, userId))
  .set('Authorization', `Bearer ${token}`)
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
      'roles': ['admin'],
      'state': 'active',
      'username': 'admin@admin.com',
    });

    t.end();
  });
});


test('api user update', function(t) {
  supertest(app)
  .patch(g.schemas.user.apiUrls.read.replace(`:${g.schemas.user.apiIdParam}`, userId))
  .set('Authorization', `Bearer ${token}`)
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
  .set('Authorization', `Bearer ${token}`)
  .expect(200)
  .end(function(err, res) {
    t.error(err);

    t.equal(res.body.username, 'admin2@admin.com');
    t.apiResult(res.body, {
      '__v': 0,
      'id': 1,
      'permissions': [],
      'roles': ['admin'],
      'state': 'active',
      'username': 'admin2@admin.com',
    });

    t.end();
  });
});

test('api user delete', function(t) {
  supertest(app)
  .post(`${g.schemas.user.apiUrls.list}/me`)
  .set('Authorization', `Bearer ${token}`)
  .expect(200)
  .end(function(err, res) {
    t.error(err);

    const roles = res.body.roles;
    delete res.body.roles;

    t.apiResult(res.body, {
      '__v': 0,
      'id': 1,
      'permissions': [],
      // removed: 'roles': [],
      'state': 'active',
      'username': 'admin2@admin.com',
    });

    t.equal(roles.length, 1);
    t.apiResult(roles[0], {
      '__v': 0,
      'id': 1,
      'label': 'admin',
      'permissions': [
        'permission-permissions-list',
        'permission-permissions-create',
        'permission-permissions-read',
        'permission-permissions-update',
        'permission-permissions-delete',
        'permission-roles-list',
        'permission-roles-create',
        'permission-roles-read',
        'permission-roles-update',
        'permission-roles-delete',
        'permission-users-list',
        'permission-users-create',
        'permission-users-read',
        'permission-users-update',
        'permission-users-delete',
      ],

    });

    t.end();
  });
});

test('api user delete', function(t) {
  supertest(app)
  .delete(g.schemas.user.apiUrls.delete.replace(`:${g.schemas.user.apiIdParam}`, userId))
  .set('Authorization', `Bearer ${token}`)
  .expect(204)
  .end(function(err/*, res*/) {
    t.error(err);

    t.end();
  });
});

test('api user delete', function(t) {
  t.deepEqual(g.schemas.user.getSelects(), [
    {
      'name': 'state',
      'values': [
        {
          '_id': 'active',
          'label': 'Active'
        },
        {
          '_id': 'banned',
          'label': 'Banned'
        }
      ]
    }
  ]);
  t.end();
});

testUtils.finish(test);
