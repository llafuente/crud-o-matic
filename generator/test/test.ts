import test from 'ava';
import { join } from 'path';

import { Generator } from '../';
import { Schema, BackEndSchema, PrimiteType, PrimiteTypes, FrontControls } from '../Schema';

const generatedPath = join(__dirname, "..", "..", "generated");

/*
const fn = async () => Promise.resolve('foo');

test(async (t) => {
  t.is(await fn(), 'foo');
});
*/

test((t) => {
  const gen = new Generator();

  //*"required": true,
  //*"maxlength": 254,
  //*"restricted": false,
  const userlogin = new PrimiteType(
    "Userlogin",
    PrimiteTypes.String,
    FrontControls.TEXT
  );
  userlogin.unique = true;

  const schema: Schema = Schema.fromJSON({
    singular: "user",
    backend: {
      permissions: {
        read: {allowed: true}
      },
      "schema": {
        /*
        "id": {
          "label": "ID",
          "type": "AutoPrimaryKey",
          //*"restricted": false
        },
        */
        "userlogin": userlogin,
        "password": {
          "label": "Password",
          "type": "String",
          //*"required": true,
          //*"restricted": true
        },
        "email": {
          "label": "email",
          "type": "String",
          //*"restricted": false
        },
        "salt": {
          "label": "",
          "type": "String",
          //*"restricted": {
          //*  "create": true,
          //*  "update": true,
          //*  "read": true
          //*}
        },
        "roles": {
          "type": "Array",
          "label": "Roles",
          "items": {
            "type": "String",
            "label": "Roles",
            //*"ref": "role",
            //*"restricted": false
          }
        },
        "permissions": {
          "type": "Array",
          "label": "Permissions",
          "items": {
            "type": "String",
            "label": "Permissions",
            //*"ref": "permissions",
            //*"restricted": false
          }
        },
        "state": {
          "label": "Estado",
          "type": "String",
          "enum": [
            "active",
            "banned"
          ],
          "labels": [
            "Active",
            "Banned"
          ],
          "default": "active",
          "restricted": {
            "create": true,
            "update": false,
            "read": false
          }
        },
        "data": {
          "type": "Object",
          "properties": {
            "first_name": {
              "label": "First name",
              "type": "String",
              //*"restricted": false
            },
            "last_name": {
              "label": "Last name",
              "type": "String",
              //*"restricted": false
            }
          }
        }
      }
    }
  }, gen);

  schema.domain = "http://localhost:3004";
  schema.baseApiUrl = "";

  t.is(gen.schemas.length, 0);
  gen.addSchema(schema);
  t.is(gen.schemas.length, 1);

  t.not(gen.schemas[0], null);
  t.true(gen.schemas[0] instanceof Schema, null);

  t.is(gen.schemas[0].singular, "user");
  t.is(gen.schemas[0].plural, "users");
  t.is(gen.schemas[0].singularUc, "User");
  t.is(gen.schemas[0].interfaceName, "IUser");
  t.true(gen.schemas[0].backend instanceof BackEndSchema);
  t.not(gen.schemas[0].backend.permissions, null);
  t.not(gen.schemas[0].backend.schema, null);

  t.not(gen.schemas[0].backend.schema.userlogin, null);
  t.not(gen.schemas[0].backend.schema.password, null);
  t.not(gen.schemas[0].backend.schema.salt, null);
  t.not(gen.schemas[0].backend.schema.roles, null);
  t.not(gen.schemas[0].backend.schema.permissions, null);
  t.not(gen.schemas[0].backend.schema.state, null);
  t.not(gen.schemas[0].backend.schema.data, null);

  t.is(gen.schemas[0].backend.permissions.read.allowed, true);
  t.is(gen.schemas[0].backend.permissions.create.allowed, false);

  //console.dir(gen.schemas[0].backend);

  gen.generateAll(
    generatedPath,
    join(generatedPath, "server"),
    join(generatedPath, "client"),
  );


  // generate inside Angular 2 project
  gen.generateClientAt(gen.schemas[0], join(__dirname, "..", "..", "angular", "src", "generated"));

});
