process.env.NODE_ENV = "test";
process.env.MONGO_URI = "mongodb://127.0.0.1:27017/unit-test";

import test from "ava";
import { join } from "path";
import { mkdirSync } from "fs";

import { User, IUser } from "../server/src/models/User";
import { Role, IRole } from "../server/src/models/Role";
import routerUser from "../server/src/users/routerUser";
import { Order, Operators, WhereQuery, Pagination, ListQueryParams } from "../server/src/common";
import * as express from "express";
import * as bodyParser from "body-parser";
//import * as supertest from "supertest";
import * as _ from "lodash";
import * as qs from "qs";
import * as supertest from "supertest";

const baseApiUrl = "/api/v1";
import * as mongoose  from "mongoose";
const path = require("path");
(mongoose as any).Promise = require("bluebird");
mongoose.set("debug", true);

import { app } from "../server/src/app";

test.cb.serial("connect to mongo", (t) => {
  t.plan(1);

  mongoose.connect(process.env.MONGO_URI, {
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

test.serial("remove previous users", async(t) => {
  await User.remove({});
  t.pass("clean users");
});

test.serial("remove previous roles", async(t) => {
  await Role.remove({});
  t.pass("clean roles");
});

let adminRole;
let userRole;

test.serial("create roles with mongoose", async(t) => {
  adminRole = new Role({
    _id: "000000000000000000000001",
    //_id: mongoose.Types.ObjectId.createFromHexString('1'),
    label: "Admin",
  });

  adminRole = await adminRole.save();
  t.not(adminRole, undefined);

  userRole = new Role({
    _id: "000000000000000000000002",
    //_id: mongoose.Types.ObjectId.createFromHexString('000000000000000000000002'),
    label: "User",
  });

  userRole = await userRole.save();
  t.not(userRole, undefined);

  t.pass("roles created");
});

test.serial("create admin user with mongoose", async(t) => {
  try {
    let user = new User({
      userlogin: "admin",
      name: "admin",
      surname: "admin",
      roleId: adminRole.id,
      password: "admin",
      email: "admin@tecnofor.es",
      testsDoneIds: [
        mongoose.Types.ObjectId("000000000000000000000001"),
        mongoose.Types.ObjectId("000000000000000000000002"),
        mongoose.Types.ObjectId("000000000000000000000003"),
      ]
    });


    t.true(user instanceof User);
    t.not(user.email, null);
    t.not(user.id.toString(), null);

    user = await user.save();

    const newUser = await User.findOne({
      userlogin: "admin",
    }).exec();

    t.is(newUser.email, "admin@tecnofor.es");
  } catch (e) {
    console.log(e);
    t.fail(e);
  }
});


let bearer;
test.cb.serial("logon: /auth", (t) => {
  supertest(app)
  .post(`${baseApiUrl}/auth`)
  .send({
    userlogin: "admin",
    password: "admin",
  })
  .set("Accept", "application/json")
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


test.serial("create user with mongoose", async(t) => {
  let user = new User({
    userlogin: "mongoose-user",
    name: "mongoose-user-name",
    surname: "mongoose-user-surname",
    roleId: userRole.id,
    password: "password",
    email: "mongoose-user@test.com",
  });

  t.true(user instanceof User);
  t.not(user.email, null);
  t.not(user.id.toString(), null);
  t.not(user.roleId, null);

  user = await user.save();

  const newUser = await User.findOne({
    email: "mongoose-user@test.com",
  }).exec();

  t.is(newUser.userlogin, "mongoose-user");
  t.is(newUser.email, "mongoose-user@test.com");
  t.not(newUser.roleId, null);
});

let userCreatedByApi;
let userCreatedByApi2;

test.cb.serial("create user using API", (t) => {
  supertest(app)
  .post(`${baseApiUrl}/users`)
  .send({
    userlogin: "api-user",
    name: "api-user-name",
    surname: "api-user-surname",
    password: "password",
    email: "api-user@test.com",
  })
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(201)
  .expect("Content-Type", /json/)
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
  .post(`${baseApiUrl}/users`)
  .send({
    userlogin: "api-user2",
    name: "api-user2-name",
    surname: "api-user2-surname",
    password: "password",
    email: "api-user2@test.com",
  })
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(201)
  .expect("Content-Type", /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }

    userCreatedByApi2 = response.body;

    t.end();
  });
});

test.serial("check created users using mongoose", async(t) => {
  const newUser = await User.findOne({
    _id: userCreatedByApi.id,
  }).exec();

  t.not(newUser, null);

  const newUser2 = await User.findOne({
    _id: userCreatedByApi2.id,
  }).exec();

  t.not(newUser2, null);
});

test.cb.serial("check created user using API", (t) => {
  supertest(app)
  .get(`${baseApiUrl}/users/${userCreatedByApi.id}`)
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(200)
  .expect("Content-Type", /json/)
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
  .post(`${baseApiUrl}/users`)
  .send({
    userlogin: "api-user2",
    name: "api-user2-name",
    surname: "api-user2-surname",
    password: "password",
    email: "api-user2@test.com",
  })
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(400)
  .expect("Content-Type", /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }

    const msg = "E11000 duplicate key error collection: unit-test.users index: user";

    console.log(response.body);

    t.is(msg, response.body.message.substring(0, msg.length));

    t.end();
  });
});

test.cb.serial("create user error using API 2", (t) => {
  supertest(app)
  .post(`${baseApiUrl}/users`)
  .send({
    userlogin: "api-user2",
    password: "password",
    email: "api-user2@test.com",
  })
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(400)
  .expect("Content-Type", /json/)
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
  .get(`${baseApiUrl}/users`)
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(200)
  .expect("Content-Type", /json/)
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
  .get(`${baseApiUrl}/users?where[email][operator]=EQUALS&where[email][value]=api-user@test.com`)
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(200)
  .expect("Content-Type", /json/)
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
  .patch(`${baseApiUrl}/users/${userCreatedByApi.id}`)
  .send({
    email: "updated-email@test.com",
  })
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(200)
  .expect("Content-Type", /json/)
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
  .get(`${baseApiUrl}/users?where[email][operator]=EQUALS&where[email][value]=updated-email@test.com`)
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(200)
  .expect("Content-Type", /json/)
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
  .delete(`${baseApiUrl}/users/${userCreatedByApi.id}`)
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(204)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }

    t.end();
  });

});

test.serial("check deleted user using mongoose", async(t) => {
  const newUser = await User.findOne({
    _id: userCreatedByApi.id,
  }).exec();

  t.is(newUser, null);
});

test.cb.serial("create user using CSV comma", (t) => {
  supertest(app)
  .post(`${baseApiUrl}/users/csv`)
  .attach("file", path.join(__dirname, "user.csv"))
  .field("delimeter", ",")
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(204)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }

    t.end();
  });
});

test.serial("check CSV user comma", async(t) => {
  const admin = await User.findOne({
    userlogin: "csv-admin",
  }).exec();

  t.not(admin, null);
  t.is(admin.email, "csv-admin@tecnofor.es");
  t.is(admin.roleId.toString(), "000000000000000000000001");

  await admin.remove();

  const user = await User.findOne({
    userlogin: "csv-user",
  }).exec();

  t.not(user, null);
  t.is(user.email, "csv-user@tecnofor.es");
  t.is(user.roleId.toString(), "000000000000000000000002");

  await user.remove();
});


test.cb.serial("create user using CSV semicolon", (t) => {
  supertest(app)
  .post(`${baseApiUrl}/users/csv`)
  .attach("file", path.join(__dirname, "user2.csv"))
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(204)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }

    t.end();
  });
});

test.serial("check CSV user semicolon", async(t) => {
  const admin = await User.findOne({
    userlogin: "csv-admin",
  }).exec();

  t.not(admin, null);
  t.is(admin.email, "csv-admin@tecnofor.es");
  t.is(admin.roleId.toString(), "000000000000000000000001");

  const user = await User.findOne({
    userlogin: "csv-user",
  }).exec();

  t.not(user, null);
  t.is(user.email, "csv-user@tecnofor.es");
  t.is(user.roleId.toString(), "000000000000000000000002");
});


test.cb.serial("create user using XML EXCEL", (t) => {
  supertest(app)
  .post(`${baseApiUrl}/users/csv`)
  .attach("file", path.join(__dirname, "users.xml"))
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(204)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }

    t.end();
  });
});

test.serial("check XML EXCEL users", async(t) => {
  const admin = await User.findOne({
    userlogin: "xxxx@xxxx.xxx",
  }).exec();


  t.not(admin, null);
  t.is(admin.email, "xxxx@xxxx.xxx");
  t.is(admin.roleId.toString(), "000000000000000000000002");

  const user = await User.findOne({
    userlogin: "yyyy@xxxx.xxx",
  }).exec();

  t.not(user, null);
  t.is(user.email, "yyyy@xxxx.xxx");
  t.is(user.roleId.toString(), "000000000000000000000002");
});


test.cb.serial("error while importing XML EXCEL", (t) => {
  supertest(app)
  .post(`${baseApiUrl}/users/csv`)
  .attach("file", path.join(__dirname, "users-err.xml"))
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(404)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }

    t.is(response.body.message, "User validation failed: name: Path `name` (`ABCDEFGHIJKLMNÑOPQRSTUVWXYZABCDEFGHIJKLMNÑOPQRSTUVWXYZ`) is longer than the maximum allowed length (32).");

    t.end();
  });
});

test.serial("check XML EXCEL users", async(t) => {
  const admin = await User.findOne({
    userlogin: "xxxx@xxxx.xxx",
  }).exec();


  t.not(admin, null);
  t.is(admin.email, "xxxx@xxxx.xxx");
  t.is(admin.roleId.toString(), "000000000000000000000002");

  const user = await User.findOne({
    userlogin: "yyyy@xxxx.xxx",
  }).exec();

  t.not(user, null);
  t.is(user.email, "yyyy@xxxx.xxx");
  t.is(user.roleId.toString(), "000000000000000000000002");
});

test.cb.serial("test user pagination I", (t) => {
  supertest(app)
  .get(`${baseApiUrl}/users`)
   .query(
     new ListQueryParams(2, 0, { name: Order.ASC }, null, null, ["userlogin", "name"]),
   )
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(200)
  .expect("Content-Type", /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }
    const body: Pagination<IUser> = response.body;

    body.list = _.map(body.list, _.partial(_.omit, _, ["id"]));

    t.deepEqual(body, { list:
   [ { userlogin: "yyyy@xxxx.xxx",
       name: "xmluser2" },
     { userlogin: "xxxx@xxxx.xxx",
       name: "xmluser1" } ],
                        count: 8,
                        offset: 0,
                        limit: 2 });

    t.end();
  });
});

test.cb.serial("test user pagination II", (t) => {
  supertest(app)
  .get(`${baseApiUrl}/users`)
   .query(
     new ListQueryParams(2, 2, { name: Order.ASC }, null, null, ["userlogin", "name"]),
   )
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(200)
  .expect("Content-Type", /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }
    const body: Pagination<IUser> = response.body;

    body.list = _.map(body.list, _.partial(_.omit, _, ["id"]));

    t.deepEqual(body, { list:
   [ { userlogin: "mongoose-user",
       name: "mongoose-user-name" },
     { userlogin: "csv-user",
       name: "csv-user-name" } ],
                        count: 8,
                        offset: 2,
                        limit: 2 });

    t.end();
  });
});

test.cb.serial("test user pagination III", (t) => {
  console.log(new ListQueryParams(1, 0, { name: Order.ASC }, null, ["roleId"]));
  supertest(app)
  .get(`${baseApiUrl}/users`)
   .query(
      qs.stringify(
        new ListQueryParams(1, 0, { name: Order.ASC }, null, ["roleId"], ["userlogin", "name", "roleId"]),
      ),
   )
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(200)
  .expect("Content-Type", /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }
    const body: Pagination<IUser> = response.body;

    body.list = _.map(body.list, _.partial(_.omit, _, ["id"]));

    t.deepEqual(body as any, { list:
   [ { userlogin: "yyyy@xxxx.xxx",
       name: "xmluser2",
       roleId: {
  __v: 0,
  _id: "000000000000000000000002",
  label: "User",
}} ],
                               count: 8,
                               offset: 0,
                               limit: 1 });

    t.end();
  });
});

test.cb.serial("test user pagination IV", (t) => {
  console.log(new ListQueryParams(1, 0, { name: Order.ASC }, null, ["roleId"]));
  supertest(app)
  .get(`${baseApiUrl}/users`)
   .query(
      qs.stringify(
        new ListQueryParams(0, 0, null, {
          "testsDoneIds": new WhereQuery(Operators.IN, "000000000000000000000002")
        },
        null,
        ["userlogin", "name","roleId"]
      )),
   )
  .set("Authorization", bearer)
  .set("Accept", "application/json")
  .expect(200)
  .expect("Content-Type", /json/)
  .end(function(err, response) {
    if (err) {
      t.fail(err);
    }
    const body: Pagination<IUser> = response.body;

    body.list = _.map(body.list, _.partial(_.omit, _, ["id"]));

    t.deepEqual(body as any, { list:
   [ { userlogin: "admin",
       name: "admin",
       roleId: "000000000000000000000001",
     } ],
                               count: 1,
                               offset: 0,
                               limit: 0 });

    t.end();
  });
});
