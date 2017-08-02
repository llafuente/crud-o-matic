import test from 'ava';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { Generator } from '../';
import { Schema, BackEndSchema } from '../Schema';

var mkdirp = require('mkdirp');

const generatedPath = join(__dirname, "..", "..", "generated");
try {
  mkdirSync(join(generatedPath, "server"));
  mkdirSync(join(generatedPath, "client"));
} catch(e) {};

/*
const fn = async () => Promise.resolve('foo');

test(async (t) => {
  t.is(await fn(), 'foo');
});
*/

test((t) => {
  const gen = new Generator();
  t.is(gen.schema, null);

  gen.fromObject({
    entitySingular: "user",
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
        "userlogin": {
          "label": "userlogin",
          "type": "String",
          //*"required": true,
          //*"maxlength": 254,
          //*"restricted": false,
          //*"unique": true
        },
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
  });

  t.not(gen.schema, null);
  t.true(gen.schema instanceof Schema, null);

  t.is(gen.schema.entitySingular, "user");
  t.is(gen.schema.entityPlural, "users");
  t.is(gen.schema.entitySingularUc, "User");
  t.is(gen.schema.interfaceName, "IUser");
  t.true(gen.schema.backend instanceof BackEndSchema);
  t.not(gen.schema.backend.permissions, null);
  t.not(gen.schema.backend.schema, null);

  t.not(gen.schema.backend.schema.userlogin, null);
  t.not(gen.schema.backend.schema.password, null);
  t.not(gen.schema.backend.schema.salt, null);
  t.not(gen.schema.backend.schema.roles, null);
  t.not(gen.schema.backend.schema.permissions, null);
  t.not(gen.schema.backend.schema.state, null);
  t.not(gen.schema.backend.schema.data, null);

  t.is(gen.schema.backend.permissions.read.allowed, true);
  t.is(gen.schema.backend.permissions.create.allowed, false);

  //console.dir(gen.schema.backend);

  gen.generateServerAt(join(generatedPath, "server"));

});
