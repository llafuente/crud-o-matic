const EventEmitter = require('events');
const path = require('path');
const fs = require('fs');
const jsYAMl = require('js-yaml');
const readFileSync = require('fs').readFileSync;
const _ = require('lodash');
const Schema = require('./schema.js');
const formGenerator = require('./form.generator.js');
const angularGenerator = require('./angular.generator.js');
const expressGenerator = require('./express.generator.js');
const eachSeries = require('async/eachSeries');
const mkdirp = require('mkdirp').sync;

module.exports = class Generator extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.schemas = {};

    this.mongoose = config.mongoose;
    //this.models = this.mongoose.models;

    if (!this.config.angularPath) {
      throw new Error('config.angularPath is required in config');
    }
    if (!this.config.expressPath) {
      throw new Error('config.expressPath is required in config');
    }

    mkdirp(this.config.angularPath);
    mkdirp(this.config.expressPath);

    this.schemaFile(path.join(__dirname, 'models', 'permissions.model.yml'));
    this.schemaFile(path.join(__dirname, 'models', 'roles.model.yml'));
    this.schemaFile(path.join(__dirname, 'models', 'user.model.yml'));
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

  forEachSchema(cb) {
    for (const schemaName in this.schemas) { // eslint-disable-line guard-for-in
      cb.call(this, this.schemas[schemaName], schemaName);
    }
  }

  generateAll(cb) {
    const next = _.after(5, cb);

    this.generateSchemas(next);
    this.generateFormAll(next);
    this.generateAngularAll(next);
    this.generateServerAll(next);
    this.generateDependencies(next);
  }

  generateSchemas(cb) {
    eachSeries(this.schemas, function(schema, next) {
      schema.saveToJSON(next);
    }, function(err) {
      cb(err);
    });
  }
  generateDependencies(cb) {
    const next = _.after(4, cb);

    expressGenerator.app(this, {}, next);
    angularGenerator.app(this, {}, next);

    eachSeries([
      path.join(__dirname, '..', 'angular', 'st-date-range.js'),
      path.join(__dirname, '..', 'angular', 'st-date-range.tpl.html'),
      path.join(__dirname, '..', 'angular', 'st-select.js'),
    ], function(file, next2) {
      const content = fs.readFileSync(file, 'utf-8');
      fs.writeFileSync(path.join(this.config.angularPath, path.basename(file)), content, 'utf-8');
      next2();
    }.bind(this), next);

    eachSeries([
      path.join(__dirname, '..', 'server', 'authorization.js'),
      path.join(__dirname, '..', 'server', 'clean-body.js'),
      path.join(__dirname, '..', 'server', 'error-handler.js'),
      path.join(__dirname, '..', 'server', 'http-error.js'),
      path.join(__dirname, '..', 'server', 'user.model.override.js'),
    ], function(file, next2) {
      const content = fs.readFileSync(file, 'utf-8');
      fs.writeFileSync(path.join(this.config.expressPath, path.basename(file)), content, 'utf-8');
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
    };

    expressGenerator(this, schema, generatorOptions, cb);
  }
};
