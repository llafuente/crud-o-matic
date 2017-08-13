import test from "ava";
import { join } from "path";

import { Generator } from "../";
import { Schema, BackEndSchema, PrimiteType, PrimiteTypes, FrontControls, FieldPermissions } from "../Schema";

const generatedPath = join(__dirname, "..", "..", "generated");

/*
const fn = async () => Promise.resolve('foo');

test(async (t) => {
  t.is(await fn(), 'foo');
});
*/

const gen = new Generator();

test.serial("user schema", t => {

  const schema: Schema = Schema.fromJSON(
    {
      singular: "user",
      backend: {
        apiAccess: {
          read: { allowed: true },
        },
      },
    },
    gen,
  );

  schema.addField(
    "userlogin",
    new PrimiteType("Userlogin", PrimiteTypes.String, FrontControls.TEXT)
      .setUnique(true)
      .setMaxlength(32)
      .setRequired(true),
  );

  schema.addField(
    "password",
    new PrimiteType("Password", PrimiteTypes.String, FrontControls.PASSWORD)
      .setPermissions(
        new FieldPermissions(
          false, //read
          false, //list
          true, //create
          true, //update
        ),
      )
      .setRequired(true),
  );

  schema.addField(
    "email",
    new PrimiteType("Email", PrimiteTypes.String, FrontControls.EMAIL).setMaxlength(255).setRequired(true),
  );

  schema.addField(
    "salt",
    new PrimiteType("Salt", PrimiteTypes.String, FrontControls.Hidden).setPermissions(
      new FieldPermissions(
        false, //read
        false, //list
        false, //create
        false, //update
      ),
    ),
  );

  schema.addField(
    "roles",
    new PrimiteType(
      "Roles",
      PrimiteTypes.Array,
      FrontControls.HTTP_DROPDOWN, // url: roles
    ).setItems(
      new PrimiteType(
        "Role",
        PrimiteTypes.String,
        FrontControls.Hidden, // TOOD this should not be required...
      ).setRefTo("Role"),
    ),
  );

  schema.addField(
    "state",
    new PrimiteType("State", PrimiteTypes.String, FrontControls.ENUM_DROPDOWN)
      .setEnumConstraint(["active", "banned"], ["Active", "Banned"])
      .setDefault("active"),
  );

  /*
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
*/

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
  t.not(gen.schemas[0].backend.apiAccess, null);
  t.not(gen.schemas[0].fields, null);

  t.not(gen.schemas[0].fields.userlogin, null);
  t.not(gen.schemas[0].fields.password, null);
  t.not(gen.schemas[0].fields.salt, null);
  t.not(gen.schemas[0].fields.roles, null);
  t.not(gen.schemas[0].fields.permissions, null);
  t.not(gen.schemas[0].fields.state, null);
  t.not(gen.schemas[0].fields.data, null);

  t.is(gen.schemas[0].backend.apiAccess.read.allowed, true);
  t.is(gen.schemas[0].backend.apiAccess.create.allowed, false);
});


test.serial("voucher schema",t => {

  const schema: Schema = new Schema("voucher", gen);
  schema.domain = "http://localhost:3004";
  schema.baseApiUrl = "";

  schema.addField(
    "startAt",
    new PrimiteType("Fecha de inicio", PrimiteTypes.Date, FrontControls.DATE),
  );
  schema.addField(
    "endAt",
    new PrimiteType("Fecha de fin", PrimiteTypes.Date, FrontControls.DATE),
  );
  schema.addField(
    "canDownload",
    new PrimiteType("Permitir descargar manuales", PrimiteTypes.Boolean, FrontControls.CHECKBOX),
  );
  schema.addField(
    "maxUses",
    new PrimiteType("Máximos usos", PrimiteTypes.Number, FrontControls.INTEGER),
  );
  schema.addField(
    "currentUses",
    new PrimiteType("Usos", PrimiteTypes.Number, FrontControls.STATIC),
  );


  gen.addSchema(schema);

  t.is(gen.schemas[1].singular, "voucher");
});

test.serial("generation", t => {
  gen.generateAll(generatedPath, join(generatedPath, "server"), join(generatedPath, "client"));

  // generate inside Angular 2 project
  gen.generateClientAt(gen.schemas[0], join(__dirname, "..", "..", "angular", "src", "generated"));
  gen.generateClientAt(gen.schemas[1], join(__dirname, "..", "..", "angular", "src", "generated"));

  t.pass();
});
