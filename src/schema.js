const join = require('path').join;
const _ = require('lodash');
const pluralize = require('pluralize');
const fs = require('fs');

const ajv = require('ajv')({
  allErrors: true
});
const schema = require('./validation/schema.json');
const validate = ajv.compile(schema);

module.exports = class Schema {
  constructor(generator, schemaObj) {
    applyDefaults(schemaObj);
    // validate
    const valid = validate(schemaObj);
    if (!valid) {
      $log.error(validate.errors);
      $log.error(schemaObj);
      throw new Error('invalid schema');
    }

    this.generator = generator;
    this.schema = schemaObj;

    // duplicate the Schema
    this.mongooseSchema = _.cloneDeep(schemaObj.backend.schema);
    simplifySchema(this.mongooseSchema);
    $log.silly('simplified mongoose schema', this.mongooseSchema);

    // cleanup
    delete this.mongooseSchema.created_at;
    delete this.mongooseSchema.updated_at;

    this.schema.plural = this.schema.plural || pluralize(this.getName());
    $log.silly('plural ${this.schema.plural}');


    this.apiIdParam = `${this.schema.singular}_id`;
    const list = join('/', this.generator.config.apiBasePath, this.schema.plural);
    this.apiUrls = {
      list: list,
      create: list,
      read: join(list, '/:' + this.apiIdParam),
      update: join(list, '/:' + this.apiIdParam),
      delete: join(list, '/:' + this.apiIdParam),
    };
    this.permissions = {
      list: `permission-${this.schema.plural}-list`,
      create: `permission-${this.schema.plural}-create`,
      read: `permission-${this.schema.plural}-read`,
      update: `permission-${this.schema.plural}-update`,
      delete: `permission-${this.schema.plural}-delete`,
    };

    const root = this.getPlural();
    this.states = {
      root: root,
      list: `${root}.list`,
      create: `${root}.create`,
      update: `${root}.update`,
    };
  }
  getName() {
    return this.schema.singular;
  }

  getPlural() {
    return this.schema.singular;
  }

  saveToJSON(cb) {
    // save
    const JSONFile = join(this.generator.config.expressPath, `${this.getName()}.schema.json`);
    fs.writeFileSync(JSONFile, JSON.stringify({
      plural: this.getPlural(),
      schema: this.mongooseSchema,
      options: this.schema.backend.options, // TODO maybe cloneDeep at start...
    }, null, 2), 'utf-8');

    cb();
  }

  // TODO
  isPathRestricted() {
    return false;
  }

  getField(fieldPath) {
    $log.debug(`getField(${fieldPath})`);
    let ret = null;

    this.eachBack(function(control/*, entering*/) {
      if (control.path === fieldPath) {
        ret = control;
      }
    });

    return ret;
  }

  eachBack(cb) {
    traverse(this.schema.backend.schema, cb);
  }

  eachFrontList(cb) {
    const list = this.schema.frontend.list;

    this.eachBack(function(data, entering) {
      if (!entering) {return;}

      if (
        list[data.realpath] // path in the list
        &&
        (!data.backField.restricted || data.backField.restricted.read === false)
      ) {
        data.frontField = list[data.realpath];
        cb(data);
      }

      return;
    });
  }

  eachFrontForm(action, cb) {
    const list = this.schema.frontend.forms;

    this.eachBack(function(data, entering) {
      if (
        list[data.realpath]
      // TODO ignoreRestrictions: true
      // STUDY id is static should be sent...
      //  &&
      //  (!data.backField.restricted || data.backField.restricted[action] === false)
      ) {
        data.frontField = list[data.realpath];

        if (data.frontField[action] !== false) {
          cb(data, entering);
        }
      } else {
        $log.silly(`ignore control: ${data.realpath}`);
      }
    });
  }

  /*
   * @returns {Array}
   */
  getFrontForm(action) {
    const controls = [];
    const listControls = [];

    this.eachFrontForm(action, function(control, entering) {
      $log.silly(`field: ${control.backField.name} entering? ${entering} lists ${listControls.length}`);

      if (control.frontField.type === 'list') {
        if (entering) { // entering in a list. push!
          listControls.push([]);
        } else { // leaving a list. pop!
          control.subControls = listControls.pop();
          controls.push(control);
        }
      } else if (entering) {
        // entering a control, push in a list if any
        if (listControls.length) {
          listControls[listControls.length - 1].push(control);
        } else {
          controls.push(control);
        }
      }
    });

    return controls;
  }

  applyGeneratorOptions(control, generatorOptions) {
    // ng-model
    control.model = `${generatorOptions.basePath}.${control.realpath}`;
    // controller will store data here for the control
    const safeName = control.realpath
      .replace(/\./g, '_')
      .replace(/\[(.*)\]/g, '_');
      //.replace(/\[/g, '{{')
      //.replace(/\]/g, '}}');
    control.cfgModel = `control_${safeName}`;
    control.formModel = `${generatorOptions.formPath}.${safeName}`;
    control.searchModel = `query.${safeName}`;
    const safeUniqueName = control.realpath
      .replace(/\./g, '_')
      .replace(/\[/g, '{{')
      .replace(/\]/g, '}}');
    control.formName = `${safeUniqueName}`;
    control.formModelExpr = `${generatorOptions.formPath}['${safeUniqueName}']`;

    control.errors = {};
    const name = control.frontField.label || control.backField.label;
    // TODO some of these could be a expr, required should add an *, found how
    if (control.frontField.type === 'email') {
      control.errors.email = `${name} no es un email válido`;
    }

    if (control.frontField.type === 'number') {
      control.errors.number = `${name} no es un número válido`;
    }

    if (control.frontField.attributes) {
      if (control.frontField.attributes['ng-required'] !== undefined) {
        control.errors.required = `${name} es obligatorio`;
      }
      if (control.frontField.attributes['ng-minlength'] !== undefined) {
        control.errors.minlength = `${name} demasiado corto, debe tener al menos ${control.frontField.attributes.minlength} caracteres`;
      }
      if (control.frontField.attributes['ng-maxlength'] !== undefined) {
        control.errors.maxlength = `${name} demasiado largo, debe tener cómo máximo ${control.frontField.attributes.maxlength} caracteres`;
      }
      if (control.frontField.attributes['ng-min'] !== undefined) {
        control.errors.min = `${name} demasiado pequeño, el mínimo es: ${control.frontField.attributes['ng-min']}`;
      }
      if (control.frontField.attributes['ng-max'] !== undefined) {
        control.errors.max = `${name} demasiado grande, el máximo es: ${control.frontField.attributes['ng-max']}`;
      }
      if (control.frontField.attributes['ng-pattern'] !== undefined) {
        control.errors['ng-pattern'] = `${name} no cumple el patrón: ${control.frontField.attributes['ng-pattern']}`;
      }
    }

    // perf: remove some unused watchers
    if (!Object.keys(control.errors).length) {
      control.errors = false;
    }
  }

  getButton(name) {
    const b = this.schema.frontend.buttons[name];
    if (!b) {
      throw new Error(`Button not found: ${name}`);
    }
    return b;
  }

  getSelects() {
    const list = [];
    this.eachBack(function(control, entering) {
      if (!entering) {
        return;
      }

      if (control.backField.enum) {
        const values = [];

        control.backField.enum.forEach(function(v, k) {
          values.push({_id: v, label: control.backField.labels[k]});
        });

        list.push({
          name: control.backField.name,
          values: values
        });
      }
    });

    return list;
  }
};


function simplifySchema(obj, prop, value) {
  if (!prop) {
    for (const i in obj) { // eslint-disable-line guard-for-in
      simplifySchema(obj, i, obj[i]);
    }
  } else {
    switch (value.type) {
    case 'Object':
      obj[prop] = value.properties;
      simplifySchema(obj[prop]);
      break;
    case 'Array':
      obj[prop] = [value.items];
      simplifySchema(obj[prop]);
    }
  }
}

// cb(control, entering)
// control object is the same for entering/leaving
// you can store information there if needed...
function traverse(obj, cb, prop, value, path, realpath) {
  const path2 = path || [];
  const realpath2 = realpath || [];

  if (!value) {
    for (const i in obj) { // eslint-disable-line guard-for-in
      traverse(obj, cb, i, obj[i], path2, realpath2);
    }
  } else {
    if (!prop) {throw new Error('??');}
    let idArray = null;

    path2.push(prop);

    if (value.type === 'Array') {
      realpath2.push(prop);
      idArray = `${prop}_id`;
    } else if (obj.type !== 'Array') {
      realpath2.push(prop);
    }

    const thePath = path2.join('.').replace(/\.\[/g, '[');
    const theRealPath = realpath2.join('.').replace(/\.\[/g, '[');
    const control = {
      backField: value,
      path: thePath,
      parent: obj,
      property: prop,
      idArray: idArray,
      realpath: theRealPath
    };

    const goDeeper = cb(control, true);
    if (goDeeper !== false) {
      //console.log("value.type", value.type, "items", value.items);
      switch (value.type) {
      case 'Object':
        traverse(value.properties, cb, 'properties', null, path2, realpath2);
        break;
      case 'Array':
        realpath2.push(`[${idArray}]`);
        traverse(value, cb, 'items', value.items, path2, realpath2);
        realpath2.pop();
        break;
      }
    }

    cb(control, false);

    path2.pop();
    realpath2.pop();
  }
}

const defaultBackField = {
  restricted: {
    create: false,
    update: false,
    read: false
  }
};

function applyDefaults(schemaObj) {
  //
  // backend
  //

  traverse(schemaObj.backend.schema, function(data, entering) {
    if (!entering) {return;}

    data.backField.name = data.realpath.replace(/(\.|\[|\])/g, '_');

    switch (data.backField.type) {
    case 'String':
    case 'Number':
    case 'ObjectId':
    case 'Mixed':
      _.defaults(data.backField, defaultBackField);
      break;
    default:
      return;
    }

    // shortcut: can update/create cant read
    if (data.backField.restricted === true) {
      data.backField.restricted = {
        create: false,
        update: false,
        read: true
      };
    }

    // shortcut: can update/create/read
    if (data.backField.restricted === false) {
      data.backField.restricted = {
        create: false,
        update: false,
        read: false
      };
    }
  });

  if (!schemaObj.backend.schema._id) {
    schemaObj.backend.schema._id = {
      type: 'ObjectId',
      name: '_id',
      label: 'DB.Id',
      auto: true,
      restricted: {read: false, create: true, update: true}
    };
  }

  schemaObj.backend.schema.id = {
    type: 'Number',
    name: 'id',
    label: 'Id',
    restricted: {read: false, create: true, update: true}
  };

  schemaObj.backend.schema.created_at = {
    type: 'Date',
    name: 'created_at',
    label: 'Created at',
    restricted: {read: false, create: true, update: true}
  };

  schemaObj.backend.schema.updated_at = {
    type: 'Date',
    name: 'updated_at',
    label: 'Updated at',
    restricted: {read: false, create: true, update: true}
  };

  // NOTE __v need to be manually declared, or wont be in the paths
  schemaObj.backend.schema.__v = {
    type: 'Number',
    name: '__v',
    label: 'Version',
    //select: false,
    restricted: {read: true, create: true, update: true}
  };

  //
  // frontend
  //


  _.each(schemaObj.frontend.list, function(frontField) {
    frontField.type = frontField.type || 'text';
  });

  _.each(schemaObj.frontend.forms, function(frontField) {
    frontField.type = frontField.type || 'text';
  });
}
