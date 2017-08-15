import test from "ava";
import { join } from "path";

import { Generator } from "../";
import { Schema, SchemaBack, SchemaFront, Field, FieldType, FrontControls, FieldPermissions } from "../Schema";

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
    new Field("Userlogin", FieldType.String)
      .setFrontControl(FrontControls.TEXT)
      .setUnique(true)
      .setMaxlength(32)
      .setRequired(true)
  );

  schema.addField(
    "password",
    new Field("Password", FieldType.String)
      .setFrontControl(FrontControls.PASSWORD)
      .setPermissions(
        new FieldPermissions(
          false, //read
          false, //list
          true, //create
          true //update
        )
      )
      .setRequired(true)
  );

  schema.addField(
    "email",
    new Field("Email", FieldType.String).setFrontControl(FrontControls.EMAIL).setMaxlength(255).setRequired(true)
  );

  schema.addField(
    "salt",
    new Field("Salt", FieldType.String).setPermissions(
      new FieldPermissions(
        false, //read
        false, //list
        false, //create
        false //update
      )
    )
  );

  schema.addField(
    "roles",
    new Field("Roles", FieldType.Array)
      .setHTTPDropdown("http://localhost:3004/roles", "roles", "id", "label")
      .setItems(new Field("Role", FieldType.String).setRefTo("Role"))
  );

  schema.addField(
    "state",
    new Field("State", FieldType.String)
      .setFrontControl(FrontControls.ENUM_DROPDOWN)
      .setEnumConstraint(["active", "banned"], ["Active", "Banned"])
      .setDefault("active")
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
  t.true(gen.schemas[0].backend instanceof SchemaBack);
  t.true(gen.schemas[0].frontend instanceof SchemaFront);
  t.not(gen.schemas[0].backend.apiAccess, null);
  t.not(gen.schemas[0].root, null);

  t.not(gen.schemas[0].root.properties.userlogin, null);
  t.not(gen.schemas[0].root.properties.password, null);
  t.not(gen.schemas[0].root.properties.salt, null);
  t.not(gen.schemas[0].root.properties.roles, null);
  t.not(gen.schemas[0].root.properties.permissions, null);
  t.not(gen.schemas[0].root.properties.state, null);
  t.not(gen.schemas[0].root.properties.data, null);

  //t.is(gen.schemas[0].backend.apiAccess.read.allowed, true);
  //t.is(gen.schemas[0].backend.apiAccess.create.allowed, false);
});

test.serial("role schema", t => {
  const schema: Schema = new Schema("role", gen);
  schema.domain = "http://localhost:3004";
  schema.baseApiUrl = "";

  schema.addField("label", new Field("Etiqueta", FieldType.String).setFrontControl(FrontControls.TEXT));

  // TODO add permissions

  gen.addSchema(schema);

  t.is(gen.schemas[1].singular, "role");
});

test.serial("voucher schema", t => {
  const schema: Schema = new Schema("voucher", gen);
  schema.domain = "http://localhost:3004";
  schema.baseApiUrl = "";

  schema.addField("startAt", new Field("Fecha de inicio", FieldType.Date).setFrontControl(FrontControls.DATE));
  schema.addField("endAt", new Field("Fecha de fin", FieldType.Date).setFrontControl(FrontControls.DATE));
  schema.addField(
    "canDownload",
    new Field("Permitir descargar manuales", FieldType.Boolean).setFrontControl(FrontControls.CHECKBOX)
  );
  schema.addField("maxUses", new Field("Máximos usos", FieldType.Number).setFrontControl(FrontControls.INTEGER));
  schema.addField("currentUses", new Field("Usos", FieldType.Number).setFrontControl(FrontControls.STATIC));

  gen.addSchema(schema);

  t.is(gen.schemas[2].singular, "voucher");
});

test.serial("test schema", t => {
  const schema: Schema = new Schema("test", gen);
  schema.domain = "http://localhost:3004";
  schema.baseApiUrl = "";

  schema.addField(
    "label",
    new Field("Nombre del examén", FieldType.String).setMaxlength(255).setFrontControl(FrontControls.TEXT)
  );
  schema.addField("instructions", new Field("Instrucciones", FieldType.String).setFrontControl(FrontControls.BIGTEXT));
  schema.addField(
    "randomizeAnwers",
    new Field("Aleatorizar respuestas", FieldType.Boolean).setFrontControl(FrontControls.CHECKBOX)
  );
  schema.addField(
    "blocks",
    new Field("Bloques de conocimiento", FieldType.Array)
      .setFrontControl(FrontControls.ARRAY)
      .setItems(
        new Field("Bloque de conocimiento", FieldType.Object)
          .addProperty(
            "name",
            new Field("Nombre del bloque", FieldType.String).setMaxlength(255).setFrontControl(FrontControls.TEXT)
          )
          .addProperty(
            "questions",
            new Field("Preguntas", FieldType.Array)
              .setFrontControl(FrontControls.ARRAY)
              .setItems(
                new Field("Pregunta", FieldType.Object)
                  .addProperty(
                    "questions",
                    new Field("Preguntas", FieldType.String).setFrontControl(FrontControls.TEXT)
                  )
                  .addProperty(
                    "answers",
                    new Field("Respuestas", FieldType.Array)
                      .setFrontControl(FrontControls.ARRAY)
                      .setItems(new Field("Respuesta", FieldType.String).setFrontControl(FrontControls.TEXT))
                  )
                  .addProperty(
                    "correcAnswerIndex",
                    new Field("Pregunta correcta", FieldType.Number).setFrontControl(FrontControls.INTEGER)
                  )
              )
          )
      )
  );

  schema.addField(
    "maxTime",
    new Field("Tiempo máximo (minutos)", FieldType.Number).setFrontControl(FrontControls.INTEGER)
  );

  schema.addField(
    "usersSubscribed",
    new Field("Usuarios inscritos", FieldType.Number).setFrontControl(FrontControls.STATIC)
  );

  schema.addField(
    "usersDone",
    new Field("Usuarios que realizaron el examen", FieldType.Number).setFrontControl(FrontControls.STATIC)
  );

  gen.addSchema(schema);

  t.is(gen.schemas[2].singular, "voucher");
});

test.serial("santity checks", t => {
  gen.schemas[0].eachField((fieldName, field) => {
    console.log(field);
    t.not(field.name, null);
  });
});

test.serial("generation", t => {
  gen.generateAll(
    generatedPath,
    join(generatedPath, "server"),
    join(__dirname, "..", "..", "angular", "src", "generated")
  );

  t.pass();
});
