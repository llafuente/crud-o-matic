process.env.NODE_ENV = "test";

import test from "ava";
import { join } from "path";
import { mkdirSync } from "fs";

import { User, IUser } from "../generated/server/src/models/User";
import { Role, IRole } from "../generated/server/src/models/Role";
import routerUser from "../generated/server/src/users/routerUser";
import { Pagination } from "../generated/server/src/common";
import * as express from "express";
import * as bodyParser from "body-parser";
//import * as supertest from "supertest";

const supertest = require("supertest");
const mongoose = require("mongoose");
const path = require("path");
mongoose.Promise = require("bluebird");
mongoose.set('debug', true);

import { app } from "../generated/server/src/app";
let db;

test.cb.serial("connect to mongo", (t) => {
  t.plan(1);

  mongoose.connect("mongodb://127.0.0.1:27017/test", {
    promiseLibrary: require("bluebird"),
    useMongoClient: true,
  }, function(err) {
    if (err) {
      t.fail("database connection error");
    } else {
      t.pass("Connected to database");
    }

    t.end();
  });
});

test.serial("remove previous users", async (t) => {
  await User.remove({});
  t.pass("clean users");
});

test.serial("remove previous roles", async (t) => {
  await Role.remove({});
  t.pass("clean roles");
});

let adminRole;
let userRole;

test.serial("create roles with mongoose", async (t) => {
  adminRole = new Role({
    label: "Admin"
  });

  adminRole = await adminRole.save();

  userRole = new Role({
    label: "User"
  });

  userRole = await userRole.save();
  t.pass("roles created");
});

test.serial("create admin user with mongoose", async (t) => {
  try {
    var user = new User({
      userlogin: "admin",
      name: "admin",
      surname: "admin",
      roleId: adminRole.id,
      password: "admin",
      email: "admin@tecnofor.es"
    });


    t.true(user instanceof User);
    t.not(user.email, null);
    t.not(user.id.toString(), null);

    user = await user.save();

    let newUser = await User.findOne({
      userlogin: "admin"
    }).exec();

    t.is(newUser.email, "admin@tecnofor.es");
  } catch(e) {
    console.log(e);
    t.fail(e);
  }
});


let bearer;
test.cb.serial("logon: /auth", (t) => {
  supertest(app)
  .post(`/auth`)
  .send({
    userlogin: "admin",
    password: "admin",
  })
  .set('Accept', 'application/json')
  .expect(200)
  .end(function(err, response) {
    console.log("::::::::::::", err);
    if (err) {
      t.fail(err);
    }

    bearer = "Bearer " + response.body.token;
    console.log(`bearer: ${bearer}`);

    t.end();
  });

});


test.serial("create user with mongoose", async (t) => {
  var user = new User({
    userlogin: "mongoose-user",
    name: "mongoose-user-name",
    surname: "mongoose-user-surname",
    roleId: userRole.id,
    password: "password",
    email: "mongoose-user@test.com"
  });

  t.true(user instanceof User);
  t.not(user.email, null);
  t.not(user.id.toString(), null);
  t.not(user.roleId, null);

  user = await user.save();

  let newUser = await User.findOne({
    email: "mongoose-user@test.com"
  }).exec();

  t.is(newUser.userlogin, "mongoose-user");
  t.is(newUser.email, "mongoose-user@test.com");
  t.not(newUser.roleId, null);
});

let userCreatedByApi;
let userCreatedByApi2;

test.cb.serial("create user using API", (t) => {
  supertest(app)
  .post('/users')
  .send({
    userlogin: "api-user",
    name: "api-user-name",
    surname: "api-user-surname",
    password: "password",
    email: "api-user@test.com"
  })
  .set('Authorization', bearer)
  .set('Accept', 'application/json')
  .expect(201)
  .expect('Content-Type', /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }

    userCreatedByApi = response.body;

    t.end();
  });
});

test.cb.serial("create user using API (2)", (t) => {
  supertest(app)
  .post('/users')
  .send({
    userlogin: "api-user2",
    name: "api-user2-name",
    surname: "api-user2-surname",
    password: "password",
    email: "api-user2@test.com"
  })
  .set('Authorization', bearer)
  .set('Accept', 'application/json')
  .expect(201)
  .expect('Content-Type', /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }

    userCreatedByApi2 = response.body;

    t.end();
  });
});

test.serial("check created user using mongoose", async (t) => {
  let newUser = await User.findOne({
    _id: userCreatedByApi.id
  }).exec();

  t.not(newUser, null);
});

test.cb.serial("check created user using API", (t) => {
  supertest(app)
  .get(`/users/${userCreatedByApi.id}`)
  .set('Authorization', bearer)
  .set('Accept', 'application/json')
  .expect(200)
  .expect('Content-Type', /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }

    t.is(response.body._id, undefined);
    t.not(response.body.id, null);
    t.is(response.body.password, undefined);
    t.is(response.body.salt, undefined);
    t.is(response.body.email, "api-user@test.com");

    t.end();
  });
});


test.cb.serial("create user error using API", (t) => {
  supertest(app)
  .post('/users')
  .send({
    userlogin: "api-user2",
    name: "api-user2-name",
    surname: "api-user2-surname",
    password: "password",
    email: "api-user2@test.com"
  })
  .set('Authorization', bearer)
  .set('Accept', 'application/json')
  .expect(400)
  .expect('Content-Type', /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }

    const msg = "E11000 duplicate key error collection: test.users index: userlogin";
    t.is(msg, response.body.message.substring(0, msg.length));

    t.end();
  });
});

test.cb.serial("create user error using API 2", (t) => {
  supertest(app)
  .post('/users')
  .send({
    userlogin: "api-user2",
    password: "password",
    email: "api-user2@test.com"
  })
  .set('Authorization', bearer)
  .set('Accept', 'application/json')
  .expect(400)
  .expect('Content-Type', /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }

    const msg = "User validation failed: surname: Path `surname` is required., name";
    t.is(msg, response.body.message.substring(0, msg.length));

    t.end();
  });
});


test.cb.serial("get users using API", (t) => {
  supertest(app)
  .get('/users')
  .set('Authorization', bearer)
  .set('Accept', 'application/json')
  .expect(200)
  .expect('Content-Type', /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }
    const body: Pagination<IUser> = response.body;

    t.is(body.count, 4);
    t.is(body.limit, 0);
    t.is(body.offset, 0);
    t.is(body.list.length, 4);

    t.is(body.list[0]._id, undefined);
    t.not(body.list[0].id, null);
    t.is(body.list[0].password, undefined);
    t.is(body.list[0].salt, undefined);

    t.end();
  });
});

test.cb.serial("get users using API where", (t) => {
  supertest(app)
  .get('/users?where[email][operator]=EQUALS&where[email][value]=api-user@test.com')
  .set('Authorization', bearer)
  .set('Accept', 'application/json')
  .expect(200)
  .expect('Content-Type', /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }
    const body: Pagination<IUser> = response.body;

    t.is(body.count, 1);
    t.is(body.limit, 0);
    t.is(body.offset, 0);
    t.is(body.list.length, 1);
    t.is(body.list[0].email, "api-user@test.com");

    t.end();
  });
});

test.cb.serial("update user using API", (t) => {
  supertest(app)
  .patch(`/users/${userCreatedByApi.id}`)
  .send({
    email: "updated-email@test.com"
  })
  .set('Authorization', bearer)
  .set('Accept', 'application/json')
  .expect(200)
  .expect('Content-Type', /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }
    const body: IUser = response.body;

    t.is(body.email, "updated-email@test.com");

    t.end();
  });
});

test.cb.serial("check changes using API where", (t) => {
  supertest(app)
  .get('/users?where[email][operator]=EQUALS&where[email][value]=updated-email@test.com')
  .set('Authorization', bearer)
  .set('Accept', 'application/json')
  .expect(200)
  .expect('Content-Type', /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }
    const body: Pagination<IUser> = response.body;

    console.log("body.list", body.list);

    t.is(body.count, 1);
    t.is(body.list[0].email, "updated-email@test.com");

    t.end();
  });
});


test.cb.serial("delete user using API", (t) => {
  supertest(app)
  .delete(`/users/${userCreatedByApi.id}`)
  .set('Authorization', bearer)
  .set('Accept', 'application/json')
  .expect(204)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }

    t.end();
  });

});

test.serial("check deleted user using mongoose", async (t) => {
  let newUser = await User.findOne({
    _id: userCreatedByApi.id
  }).exec();

  t.is(newUser, null);
});

test.cb.serial("create user using CSV", (t) => {
  supertest(app)
  .post('/users/csv')
  .attach('file', path.join(__dirname, 'user.csv'))
  .set('Authorization', bearer)
  .set('Accept', 'application/json')
  .expect(204)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }

    t.end();
  });
});

test.serial("check CSV user", async (t) => {
  let newUser = await User.findOne({
    userlogin: "csv-admin"
  }).exec();

  t.not(newUser, null);
  t.is(newUser.email, "csv-admin@tecnofor.es");
});
