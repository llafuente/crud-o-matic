import test from "ava";
import { join } from "path";

import { Generator } from "../";
import { Schema, SchemaBack, SchemaFront, Field, FieldType, FrontControls, FieldPermissions } from "../Schema";

const generatedPath = join(__dirname, "..", "..");
const domain = "http://localhost:3004";
//const domain = "http://34.229.180.92:3004";
/*
const fn = async () => Promise.resolve('foo');

test(async (t) => {
  t.is(await fn(), 'foo');
});
*/

const gen = new Generator(domain, "/api/v1");

test.serial("user schema", t => {
  const schema: Schema = new Schema("user", gen);
  schema.frontend.listHeader = "Listado de usuarios";
  schema.frontend.createHeader = "Crear usuario";
  schema.frontend.updateHeader = "Editar usuario";

  schema.addField(
    "userlogin",
    new Field("Userlogin", FieldType.String)
      .setFrontControl(FrontControls.TEXT)
      .setUnique(true)
      .setMaxlength(32)
      .setRequired(true),
  );

  let f = schema.addField(
    "name",
    new Field("Nombre", FieldType.String).setFrontControl(FrontControls.TEXT).setMaxlength(32).setRequired(true),
  );
  f.getFrontList().enableFiltering();

  schema.addField(
    "surname",
    new Field("Apellidos", FieldType.String).setFrontControl(FrontControls.TEXT).setMaxlength(32).setRequired(true),
  );

  schema.addField(
    "identifier",
    new Field("DNI/Nº Empleado", FieldType.String).setFrontControl(FrontControls.TEXT).setMaxlength(32),
  );

  schema.addField(
    "email",
    new Field("Email", FieldType.String).setFrontControl(FrontControls.EMAIL).setMaxlength(255).setRequired(true),
  );

  schema.addField("group", new Field("Grupo/Empresa", FieldType.String).setFrontControl(FrontControls.TEXT));

  f = schema.addField(
    "password",
    new Field("Password", FieldType.String)
      .setFrontControl(FrontControls.PASSWORD)
      .setPermissions(
        new FieldPermissions(
          false, //read
          false, //list
          true, //create
          true, //update
        ),
      )
  );

  t.is(schema.root.properties.password.required, false);
  t.is(schema.root.properties.password.getFrontCreate().required, false);
  t.is(schema.root.properties.password.getFrontUpdate().required, false);

  f.setRequired(true);

  t.is(schema.root.properties.password.required, true);
  t.is(schema.root.properties.password.getFrontCreate().required, true);
  t.is(schema.root.properties.password.getFrontUpdate().required, true);

  f.getFrontUpdate().setRequired(false);

  t.is(schema.root.properties.password.required, true);
  t.is(schema.root.properties.password.getFrontCreate().required, true);
  t.is(schema.root.properties.password.getFrontUpdate().required, false);

  schema.addField(
    "salt",
    new Field("Salt", FieldType.String).setPermissions(
      new FieldPermissions(
        false, //read
        false, //list
        false, //create
        false, //update
      ),
    ),
  );

  schema.addField(
    "forceResetPassword",
    new Field("Forzar resetar contraseña", FieldType.Boolean)
      .setPermissions(new FieldPermissions(true, false, true, true))
      .setFrontControl(FrontControls.CHECKBOX),
  );

  schema.addField(
    "roleId",
    new Field("Rol", FieldType.ObjectId).setRefTo("Role").setHTTPDropdown(`${gen.baseApiUrl}/roles`, "roles", "id", "label"),
  );

  t.is(schema.root.properties.roleId.frontData.srcUrl, `\${this.domain}${gen.baseApiUrl}/roles`);

  schema.addField(
    "voucherId",
    new Field("Voucher", FieldType.String)
      .setRefTo("Voucher")
      .setPermissions(new FieldPermissions(true, false, false, false))
      .setDefault(null)
      //.setHTTPDropdown(`${gen.baseApiUrl}/vouchers`, "vouchers", "id", "label"),
  );

  schema.addField(
    "testId",
    new Field("Test", FieldType.ObjectId)
      .setRefTo("Test")
      .setPermissions(new FieldPermissions(true, false, false, false))
      .setDefault(null)
      //.setHTTPDropdown(`${gen.baseApiUrl}/tests`, "tests", "id", "label"),
  );

  schema.addField(
    "testsDoneIds",
    new Field("Tests hechos", FieldType.Array)
      .setItems(new Field("Tests hechos", FieldType.ObjectId))
      .setRefTo("Test")
      .setPermissions(new FieldPermissions(true, false, true, true))
      .setFrontControl(FrontControls.JSON),
  );

  schema.addField(
    "state",
    new Field("State", FieldType.String)
      .setFrontControl(FrontControls.ENUM_DROPDOWN)
      .setEnumConstraint(["active", "banned"], ["Active", "Banned"])
      .setDefault("active"),
  );

  schema.addField(
    "stats",
    new Field("Stats", FieldType.Array)
      //.setFrontControl(FrontControls.ARRAY)
      .setFrontControl(FrontControls.JSON)
      .setPermissions(new FieldPermissions(true, false, true, true))
      .setItems(
        new Field("Estadísticas", FieldType.Object)
          .addProperty("testId", new Field("Test", FieldType.String))
          .addProperty("questionId", new Field("Pregunta", FieldType.String))
          .addProperty("startAt", new Field("Inicio", FieldType.Date).setFrontControl(FrontControls.DATETIME))
          .addProperty("startAt", new Field("Inicio", FieldType.Date).setFrontControl(FrontControls.DATETIME))
          .addProperty("endAt", new Field("Fin", FieldType.Date).setFrontControl(FrontControls.DATETIME))
          // TODO enum
          .addProperty("type", new Field("Tipo", FieldType.String).setFrontControl(FrontControls.TEXT))
          // TODO enum
          .addProperty(
            "answers",
            new Field("Respuestas", FieldType.Array)
              .setItems(new Field("Respuestas", FieldType.Number))
              .setFrontControl(FrontControls.TEXT),
          ),
      ),
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
  t.is(gen.schemas[0].root.properties.userlogin.name, "userlogin");
  t.is(gen.schemas[0].root.properties.userlogin.getPath().join("."), "entity.userlogin");
  t.not(gen.schemas[0].root.properties.password, null);
  t.is(gen.schemas[0].root.properties.password.name, "password");
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
  schema.frontend.listHeader = "Listado de roles";
  schema.frontend.createHeader = "Crear Rol";
  schema.frontend.updateHeader = "Editar Rol";

  schema.addField("label", new Field("Etiqueta", FieldType.String).setFrontControl(FrontControls.TEXT));

  // TODO add permissions

  gen.addSchema(schema);

  t.is(schema.singular, "role");
});

test.serial("voucher schema", t => {
  const schema: Schema = new Schema("voucher", gen);
  schema.frontend.listHeader = "Listado de vouchers";
  schema.frontend.createHeader = "Crear voucher";
  schema.frontend.updateHeader = "Editar voucher";

  schema.addField("label", new Field("Etiqueta", FieldType.String).setFrontControl(FrontControls.TEXT));
  schema.addField("key", new Field("Código", FieldType.String).setFrontControl(FrontControls.TEXT));
  schema.addField("startAt", new Field("Fecha de inicio", FieldType.Date).setFrontControl(FrontControls.DATE));
  schema.addField("endAt", new Field("Fecha de fin", FieldType.Date).setFrontControl(FrontControls.DATE));
  schema.addField(
    "canDownload",
    new Field("Permitir descargar manuales", FieldType.Boolean).setFrontControl(FrontControls.CHECKBOX),
  );
  schema.addField("maxUses", new Field("Máximos usos", FieldType.Number).setFrontControl(FrontControls.INTEGER));
  schema.addField(
    "currentUses",
    new Field("Usos", FieldType.Number).setFrontControl(FrontControls.STATIC).setDefault(0),
  );
  schema.addField(
    "testId",
    new Field("Test", FieldType.ObjectId).setRefTo("Test").setHTTPDropdown(`${gen.baseApiUrl}/tests`, "tests", "id", "label"),
  );

  gen.addSchema(schema);

  t.is(schema.singular, "voucher");
});

test.serial("test schema", t => {
  const schema: Schema = new Schema("test", gen);
  schema.frontend.listHeader = "Listado de exámenes";
  schema.frontend.createHeader = "Crear examen";
  schema.frontend.updateHeader = "Editar examen";

  schema.addField(
    "label",
    new Field("Nombre del examén", FieldType.String).setMaxlength(255).setFrontControl(FrontControls.TEXT),
  );
  schema.addField("instructions", new Field("Instrucciones", FieldType.String).setFrontControl(FrontControls.BIGTEXT));
  schema.addField(
    "randomizeAnwers",
    new Field("Aleatorizar respuestas", FieldType.Boolean).setFrontControl(FrontControls.CHECKBOX),
  );
  schema.addField(
    "blocks",
    new Field("Bloques de conocimiento", FieldType.Array)
      .setFrontControl(FrontControls.ARRAY)
      .setItems(
        new Field("Bloque de conocimiento", FieldType.Object)
          .addProperty(
            "name",
            new Field("Nombre del bloque", FieldType.String).setMaxlength(255).setFrontControl(FrontControls.TEXT),
          )
          .addProperty(
            "questions",
            new Field("Preguntas", FieldType.Array)
              .setFrontControl(FrontControls.ARRAY)
              .setItems(
                new Field("Pregunta", FieldType.Object)
                  .addProperty(
                    "questionLabel",
                    new Field("Pregunta", FieldType.String).setFrontControl(FrontControls.TEXT),
                  )
                  .addProperty(
                    "answers",
                    new Field("Respuestas", FieldType.Array)
                      .setFrontControl(FrontControls.ARRAY)
                      .setItems(
                        new Field("Respuesta", FieldType.Object).addProperty(
                          "answerLabel",
                          new Field("Respuesta", FieldType.String).setFrontControl(FrontControls.TEXT),
                        ),
                      ),
                  )
                  .addProperty(
                    "correcAnswerIndex",
                    new Field("Índice de la respuesta correcta", FieldType.Number).setFrontControl(
                      FrontControls.INTEGER,
                    ),
                  ),
              ),
          ),
      ),
  );

  schema.addField(
    "maxTime",
    new Field("Tiempo máximo (minutos)", FieldType.Number).setFrontControl(FrontControls.INTEGER),
  );

  schema.addField(
    "usersSubscribed",
    new Field("Usuarios inscritos", FieldType.Number).setFrontControl(FrontControls.STATIC),
  );

  schema.addField(
    "usersDone",
    new Field("Usuarios que realizaron el examen", FieldType.Number).setFrontControl(FrontControls.STATIC),
  );

  gen.addSchema(schema);

  t.is(schema.singular, "test");
  t.is(schema.root.properties.blocks.getPath().join("."), "entity.blocks");
  t.is(schema.root.properties.blocks.items.getPath().join("."), "entity.blocks[blocksId]");
});

test.serial("santity smoke checks", t => {
  gen.schemas.forEach(schema => {
    schema.eachField((fieldName, field) => {
      if (field.parentField != null && field.parentField.type != FieldType.Array) {
        t.not(field.name, null);
      }

      t.is(field.getPath().join(".").indexOf("undefined"), -1);
      t.is(field.getPath().join(".").indexOf("null"), -1);
    });
  });
});

test.serial("generation", t => {
  gen.generateAll(
    generatedPath,
    join(generatedPath, "server"),
    join(__dirname, "..", "..", "angular", "src", "generated"),
  );

  t.pass();
});
