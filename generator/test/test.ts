import test from 'ava';
import { join } from 'path';

import { Generator } from '../';
import { Schema, BackEndSchema } from '../Schema';

const generatedPath = join(__dirname, "..", "..", "generated");

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

  t.is(gen.schema.singular, "user");
  t.is(gen.schema.plural, "users");
  t.is(gen.schema.singularUc, "User");
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

  gen.generateCommonAt(generatedPath);
  gen.generateServerAt(join(generatedPath, "server"));
  gen.generateClientAt(join(generatedPath, "client"));


  // generate inside Angular 2 project
  gen.generateCommonAt(join(__dirname, "..", "..", "angular", "src", "generated"));
  gen.generateClientAt(join(__dirname, "..", "..", "angular", "src", "generated", "client"));

});
