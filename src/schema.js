const timestamps = require('mongoose-timestamp');
const join = require('path').join;
const _ = require('lodash');
const pluralize = require('pluralize');

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
    const mongooseSchema = _.cloneDeep(schemaObj.backend.schema);
    simplifySchema(mongooseSchema);
    $log.silly('simplified mongoose schema', mongooseSchema);

    // cleanup
    delete mongooseSchema.created_at;
    delete mongooseSchema.updated_at;

    this.mongooseSchema = new generator.mongoose.Schema(mongooseSchema, schemaObj.backend.options);
    this.mongooseSchema.plugin(timestamps, {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });

    // TODO is this really necessary?
    /*
    this.mongooseSchema.methods.setRequest = function(req) {
      this.$req = req;
    };
    */

    // autoincrements id
    this.mongooseSchema.set('autoIndex', true);
    this.mongooseSchema.pre('save', function(next) {
      $log.debug('fetch a readble id');
      const self = this;
      if (this.isNew) {
        return generator.mongoose.models.autoincrements.findOneAndUpdate({
          _id: schemaObj.plural
        }, {
          $inc: {
            autoinc: 1
          },
          $setOnInsert: {
            _id: schemaObj.plural,
            //autoinc: 1
          }
        }, {
          'new': true,
          upsert: true,
        }, function (err, res) {
          if (!err) {
            self.id = res.autoinc;
            //self.update('id', res.autoinc);
          }

          next(err);
        });
      }

      return next(null);
    });
    /*
    this.mongooseSchema.pre('save', function(next) {
      // search for a user!
      // request must be set!
      if (!this.$req) {
        $log.warn('setRequest should be called');
        //throw new Error('setRequest must be called before save');
      }

      next();
    });
    */

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
  getModel() {
    if (!this.mongooseModel) {
      throw new Error(`${this.getName()} need to be finalized first`);
    }
    return this.mongooseModel; // TODO
  }
  finalize() {
    if (!this.mongooseModel) {
      this.mongooseModel = this.generator.mongoose.model(this.getPlural(), this.mongooseSchema);
    }
  }

  // TODO
  isPathRestricted() {
    return false;
  }

  getField(fieldPath) {
    $log.debug(`getField(${fieldPath})`);
    let ret = null;

    this.eachBack(function(control) {
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

    this.eachBack(function(data) {
      if (
        list[data.realpath] // path in the list
        &&
        (!data.backField.restricted || data.backField.restricted.read === false)
      ) {
        data.frontField = list[data.realpath];
        cb(data);
      }
    });
  }

  eachFrontForm(action, cb) {
    const list = this.schema.frontend.forms;

    this.eachBack(function(data) {
      if (
        list[data.realpath]
      // TODO ignoreRestrictions: true
      // STUDY id is static should be sent...
      //  &&
      //  (!data.backField.restricted || data.backField.restricted[action] === false)
      ) {
        data.frontField = list[data.realpath];

        if (data.frontField[action] !== false) {
          cb(data);
        }
      }
    });
  }

  applyGeneratorOptions(control, generatorOptions) {
    // ng-model
    control.model = `${generatorOptions.basePath}.${control.realpath}`;
    // controller will store data here for the control
    const safeName = control.realpath.replace(/\./g, '_');
    control.cfgModel = `control_${safeName}`;
    control.formModel = `${generatorOptions.formPath}.${safeName}`;
    control.searchModel = `query.${safeName}`;
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
    this.eachBack(function(control) {
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


// cb(value, path, parent, prop_in_parent, realpath)
function traverse(obj, cb, prop, value, path, realpath) {
  const path2 = path || [];
  const realpath2 = realpath || [];

  if (!value) {
    for (const i in obj) { // eslint-disable-line guard-for-in
      traverse(obj, cb, i, obj[i], path2, realpath2);
    }
  } else {
    if (!prop) {throw new Error('??');}

    path2.push(prop);

    if (value.type === 'Array') {
      realpath2.push(prop);
    } else if (obj.type !== 'Array') {
      realpath2.push(prop);
    }

    cb({
      backField: value,
      path: path2.join('.').replace(/\.\[/g, '['),
      parent: obj,
      property: prop,
      realpath: realpath2.join('.').replace(/\.\[/g, '[')
    });
    //console.log("value.type", value.type, "items", value.items);
    switch (value.type) {
    case 'Object':
      traverse(value.properties, cb, 'properties', null, path2, realpath2);
      break;
    case 'Array':
      realpath2.push(`[${prop}_id]`);
      traverse(value, cb, 'items', value.items, path2, realpath2);
      realpath2.pop();
      break;
    }

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
  traverse(schemaObj.backend.schema, function(data) {
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
}
