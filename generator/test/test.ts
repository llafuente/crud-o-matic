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

  const schema: Schema = new Schema("user", gen);

  schema.addField(
    "userlogin",
    new PrimiteType("Userlogin", PrimiteTypes.String).setFrontControl(FrontControls.TEXT)
      .setUnique(true)
      .setMaxlength(32)
      .setRequired(true),
  );

  schema.addField(
    "password",
    new PrimiteType("Password", PrimiteTypes.String).setFrontControl(FrontControls.PASSWORD)
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
    new PrimiteType("Email", PrimiteTypes.String).setFrontControl(FrontControls.EMAIL).setMaxlength(255).setRequired(true),
  );

  schema.addField(
    "salt",
    new PrimiteType("Salt", PrimiteTypes.String).setPermissions(
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
      PrimiteTypes.Array
    ).setHTTPDropdown(
      "http://localhost:3004/roles",
      "roles",
      "id",
      "label",
    ).setItems(
      new PrimiteType(
        "Role",
        PrimiteTypes.String,
      ).setRefTo("Role"),
    ),
  );

  schema.addField(
    "state",
    new PrimiteType("State", PrimiteTypes.String).setFrontControl(FrontControls.ENUM_DROPDOWN)
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

  //t.is(gen.schemas[0].backend.apiAccess.read.allowed, true);
  //t.is(gen.schemas[0].backend.apiAccess.create.allowed, false);
});

test.serial("role schema",t => {

  const schema: Schema = new Schema("role", gen);
  schema.domain = "http://localhost:3004";
  schema.baseApiUrl = "";

  schema.addField(
    "label",
    new PrimiteType("Etiqueta", PrimiteTypes.String).setFrontControl(FrontControls.TEXT),
  );

  // TODO add permissions

  gen.addSchema(schema);

  t.is(gen.schemas[1].singular, "role");
});

test.serial("voucher schema",t => {

  const schema: Schema = new Schema("voucher", gen);
  schema.domain = "http://localhost:3004";
  schema.baseApiUrl = "";

  schema.addField(
    "startAt",
    new PrimiteType("Fecha de inicio", PrimiteTypes.Date).setFrontControl(FrontControls.DATE),
  );
  schema.addField(
    "endAt",
    new PrimiteType("Fecha de fin", PrimiteTypes.Date).setFrontControl(FrontControls.DATE),
  );
  schema.addField(
    "canDownload",
    new PrimiteType("Permitir descargar manuales", PrimiteTypes.Boolean).setFrontControl(FrontControls.CHECKBOX),
  );
  schema.addField(
    "maxUses",
    new PrimiteType("Máximos usos", PrimiteTypes.Number).setFrontControl(FrontControls.INTEGER),
  );
  schema.addField(
    "currentUses",
    new PrimiteType("Usos", PrimiteTypes.Number).setFrontControl(FrontControls.STATIC),
  );


  gen.addSchema(schema);

  t.is(gen.schemas[2].singular, "voucher");
});

test.serial("test schema",t => {

  const schema: Schema = new Schema("test", gen);
  schema.domain = "http://localhost:3004";
  schema.baseApiUrl = "";

  schema.addField(
    "label",
    new PrimiteType("Nombre del examén", PrimiteTypes.String)
    .setMaxlength(255)
    .setFrontControl(FrontControls.TEXT),
  );
  schema.addField(
    "instructions",
    new PrimiteType("Instrucciones", PrimiteTypes.String).setFrontControl(FrontControls.BIGTEXT),
  );
  schema.addField(
    "randomizeAnwers",
    new PrimiteType("Aleatorizar respuestas", PrimiteTypes.Boolean).setFrontControl(FrontControls.CHECKBOX),
  );
  schema.addField(
    "blocks",
    new PrimiteType("Bloques de conocimiento", PrimiteTypes.Array)
    .setFrontControl(FrontControls.ARRAY)
    .setItems(
      new PrimiteType("Bloque de conocimiento", PrimiteTypes.Object)
      .addProperty(
        "name",
        new PrimiteType("Nombre del bloque", PrimiteTypes.String)
        .setMaxlength(255)
        .setFrontControl(FrontControls.TEXT),
      )
      .addProperty(
        "questions",
        new PrimiteType("Preguntas", PrimiteTypes.Array)
        .setFrontControl(FrontControls.ARRAY)
        .setItems(
          new PrimiteType("Pregunta", PrimiteTypes.Object)
          .addProperty(
            "questions",
            new PrimiteType("Preguntas", PrimiteTypes.String)
            .setFrontControl(FrontControls.TEXT),
          )
          .addProperty(
            "answers",
            new PrimiteType("Respuestas", PrimiteTypes.Array)
            .setFrontControl(FrontControls.ARRAY)
            .setItems(
              new PrimiteType("Respuesta", PrimiteTypes.String)
              .setFrontControl(FrontControls.TEXT),
            )
          )
          .addProperty(
            "correcAnswerIndex",
            new PrimiteType("Pregunta correcta", PrimiteTypes.Number)
            .setFrontControl(FrontControls.INTEGER)
          )
        )
      )
    ),
  );

  schema.addField(
    "maxTime",
    new PrimiteType("Tiempo máximo (minutos)", PrimiteTypes.Number).setFrontControl(FrontControls.INTEGER),
  );

  schema.addField(
    "usersSubscribed",
    new PrimiteType("Usuarios inscritos", PrimiteTypes.Number).setFrontControl(FrontControls.STATIC),
  );

  schema.addField(
    "usersDone",
    new PrimiteType("Usuarios que realizaron el examen", PrimiteTypes.Number).setFrontControl(FrontControls.STATIC),
  );

  gen.addSchema(schema);

  t.is(gen.schemas[2].singular, "voucher");
});

test.serial("generation", t => {
  gen.generateAll(generatedPath, join(generatedPath, "server"), join(__dirname, "..", "..", "angular", "src", "generated"));

  t.pass();
});
