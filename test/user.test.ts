import test from "ava";
import { join } from "path";
import { mkdirSync } from "fs";

import { User, IUser } from "../generated/server/src/models/User";
import routerUser from "../generated/server/src/users/routerUser";
import { Pagination } from "../generated/server/src/common";
import * as express from "express";
import * as bodyParser from "body-parser";
//import * as supertest from "supertest";

const supertest = require("supertest");
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.set('debug', true);

let app: express.Application;
let db;

// configure express
test.serial("configure express", (t) => {
  app = express();

  //use json form parser middlware
  app.use(bodyParser.json());

  //use query string parser middlware
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(routerUser);

  app.use((req, res, next) => {
    res.status(404).json({error: true});
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(404).json({error: true});
  });

  t.pass("express configured");
});

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

test.serial("create user with mongoose", async (t) => {
  var user = new User({
    email: "user@appsilon.pl"
  });

  t.true(user instanceof User);
  t.not(user.email, null);
  t.not(user._id.toString(), null);

  user = await user.save();

  let newUser = await User.findOne({
    email: "user@appsilon.pl"
  }).exec();

  t.is(newUser.email, "user@appsilon.pl");
});

let userCreatedByApi;
let userCreatedByApi2;

test.cb.serial("create user using API", (t) => {
  supertest(app)
  .post('/users')
  .send({
    email: "user@appsilon.pl2"
  })
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
    email: "user@appsilon.pl3"
  })
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
    _id: userCreatedByApi._id
  }).exec();

  t.not(newUser, null);
});

test.cb.serial("check created user using API", (t) => {
  supertest(app)
  .get(`/users/${userCreatedByApi._id}`)
  .set('Accept', 'application/json')
  .expect(200)
  .expect('Content-Type', /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }

    t.end();
  });
});

test.cb.serial("get users using API", (t) => {
  supertest(app)
  .get('/users')
  .set('Accept', 'application/json')
  .expect(200)
  .expect('Content-Type', /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }
    const body: Pagination<IUser> = response.body;

    t.is(body.count, 3);
    t.is(body.limit, 0);
    t.is(body.offset, 0);
    t.is(body.list.length, 3);

    t.end();
  });
});

test.cb.serial("get users using API where", (t) => {
  supertest(app)
  .get('/users?where[email][operator]=EQUALS&where[email][value]=user@appsilon.pl3')
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
    t.is(body.list[0].email, "user@appsilon.pl3");

    t.end();
  });
});

test.cb.serial("update user using API", (t) => {
  supertest(app)
  .patch(`/users/${userCreatedByApi._id}`)
  .send({
    email: "newuser@pl.com"
  })
  .set('Accept', 'application/json')
  .expect(200)
  .expect('Content-Type', /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }
    const body: IUser = response.body;

    t.is(body.email, "newuser@pl.com");

    t.end();
  });
});

test.cb.serial("check changes using API where", (t) => {
  supertest(app)
  .get('/users?where[email][operator]=EQUALS&where[email][value]=newuser@pl.com')
  .set('Accept', 'application/json')
  .expect(200)
  .expect('Content-Type', /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }
    const body: Pagination<IUser> = response.body;

    t.is(body.count, 1);
    t.is(body.list[0].email, "newuser@pl.com");

    t.end();
  });
});


test.cb.serial("delete user using API", (t) => {
  supertest(app)
  .delete(`/users/${userCreatedByApi._id}`)
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
    _id: userCreatedByApi._id
  }).exec();

  t.is(newUser, null);
});
