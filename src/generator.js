const EventEmitter = require('events');
const path = require('path');
const jsYAMl = require('js-yaml');
const readFileSync = require('fs').readFileSync;
const _ = require('lodash');
const Schema = require('./schema.js');
const userSchemaOverride = require('./models/user.model.js');
const formGenerator = require('./form.generator.js');
const angularGenerator = require('./angular.generator.js');
const eachSeries = require('async/eachSeries');

module.exports = class Generator extends EventEmitter {
  constructor(config, mongoose) {
    super();
    this.config = config;
    this.mongoose = mongoose;
    this.schemas = {};
    this.models = mongoose.models;

    if (!this.config.generationPath) {
      throw new Error('generationPath is required in config');
    }

    mongoose.model('autoincrements', new mongoose.Schema({
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

    this.forEachSchema(function(schema/*, name*/) {
      schema.finalize();
    });


    this.emit('finalize:end');
  }

  forEachSchema(cb) {
    for (const schemaName in this.schemas) {
      cb.call(this, this.schemas[schemaName], schemaName);
    }
  }

  generateAll(cb) {
    const next = _.after(2, cb);

    this.generateFormAll(next);
    this.generateAngularAll(next);
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
};
