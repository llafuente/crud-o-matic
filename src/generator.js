const EventEmitter = require('events');
const path = require('path');
const fs = require('fs');
const jsYAMl = require('js-yaml');
const readFileSync = require('fs').readFileSync;
const _ = require('lodash');
const Schema = require('./schema.js');
const userSchemaOverride = require('./models/user.model.js');
const formGenerator = require('./form.generator.js');
const angularGenerator = require('./angular.generator.js');
const expressGenerator = require('./express.generator.js');
const eachSeries = require('async/eachSeries');
const eachOfSeries = require('async/eachOfSeries');

module.exports = class Generator extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.schemas = {};

    this.mongoose = config.mongoose;
    //this.models = this.mongoose.models;

    if (!this.config.generationPath) {
      throw new Error('generationPath is required in config');
    }

    this.mongoose.model('autoincrements', new this.mongoose.Schema({
      _id: {
        type: 'String'
      },
      autoinc: {
        type: 'Number'
      }
    }, {
      collection: 'autoincrements'
    }));


    this.schemaFile(path.join(__dirname, 'models', 'permissions.model.yml'));
    this.schemaFile(path.join(__dirname, 'models', 'roles.model.yml'));
    this.schemaFile(path.join(__dirname, 'models', 'user.model.yml'));
    userSchemaOverride(this, this.schemas.user);
  }

  schemaFile(pathToModel) {
    let schemaObj;
    switch (path.extname(pathToModel)) {
    case '.yml':
      schemaObj = jsYAMl.load(readFileSync(pathToModel, 'utf8'));
      break;
    case '.json':
      schemaObj = _.cloneDeep(require(pathToModel));
      break;
    default:
      throw new Error('Invalid file extension');
    }

    return this.schema(schemaObj);
  }

  schema(schemaObj) {
    const schema = new Schema(this, schemaObj);
    this.schemas[schema.getName()] = schema;
    return schema;
  }
  /**
   * this is the process to convert mongoose schema into models
   */
  finalize() {
    this.emit('finalize:start');
    // permissions need to be finalized first!
    this.schemas.permission.finalize();

    eachSeries(this.schemas, function(schema, next) {
      schema.finalize();

      // now add permissions
      const perm = this.schemas.permission.getModel();

      eachOfSeries(schema.permissions, function(value, key, next2) {
        $log.info('permission', value, key);

        return perm.update({
          _id: value
        }, {
          _id: value,
          label: schema.schema.backend.permissions[key]
        }, {
          upsert: true,
          setDefaultsOnInsert: true
        }, function(err, data) {
          $log.info(err, data);
          next2(err);
        });
      }, next);
    }.bind(this), function(err) {
      if (err) {
        throw err;
      }

      this.emit('finalize:end');
    }.bind(this));
  }

  forEachSchema(cb) {
    for (const schemaName in this.schemas) { // eslint-disable-line guard-for-in
      cb.call(this, this.schemas[schemaName], schemaName);
    }
  }

  generateAll(cb) {
    const next = _.after(4, cb);

    this.generateFormAll(next);
    this.generateAngularAll(next);
    this.generateServerAll(next);
    this.generateDependencies(next);
  }

  generateDependencies(next) {
    eachSeries([
      path.join(__dirname, '..', 'angular', 'st-date-range.js'),
      path.join(__dirname, '..', 'angular', 'st-date-range.tpl.html'),
      path.join(__dirname, '..', 'angular', 'st-select.js'),
      path.join(__dirname, '..', 'server', 'authorization.js'),
      path.join(__dirname, '..', 'server', 'clean-body.js'),
      path.join(__dirname, '..', 'server', 'error-handler.js'),
      path.join(__dirname, '..', 'server', 'http-error.js'),
    ], function(file, next2) {
      const content = fs.readFileSync(file, 'utf-8');
      fs.writeFileSync(path.join(this.config.generationPath, path.basename(file)), content, 'utf-8');
      next2();
    }.bind(this), next);
  }

  generateAngularAll(cb) {
    eachSeries(this.schemas, function(schema, next) {
      this.generateAngular(schema, next);
    }.bind(this), function(err) {
      cb(err);
    });
  }

  generateAngular(schema, cb) {
    const generatorOptions = {
      formPath: 'form',
      basePath: 'entity',
    };

    angularGenerator(this, schema, generatorOptions, cb);
  }

  generateFormAll(cb) {
    eachSeries(this.schemas, function(schema, next) {
      const partialNext = _.after(2, next);

      this.generateForm(schema, 'create', partialNext);
      this.generateForm(schema, 'update', partialNext);
    }.bind(this), function(err) {
      cb(err);
    });
  }

  generateForm(schema, formAction, cb) {
    const generatorOptions = {
      action: formAction,
      formPath: 'form',
      basePath: 'entity',
      layout: 'horizontal'
    };

    formGenerator(this, schema, generatorOptions, cb);
  }

  generateServerAll(cb) {
    eachSeries(this.schemas, function(schema, next) {
      this.generateServer(schema, next);
    }.bind(this), function(err) {
      cb(err);
    });
  }
  generateServer(schema, cb) {
    const generatorOptions = {
      componentsPath: path.join(__dirname, '..', 'server')
    };

    expressGenerator(this, schema, generatorOptions, cb);
  }
};
