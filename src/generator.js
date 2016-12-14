const EventEmitter = require('events');
const path = require('path');
const jsYAMl = require('js-yaml');
const readFileSync = require('fs').readFileSync;
const _ = require('lodash');
const Schema = require('./schema.js');
const userSchemaOverride = require('./models/user.model.js');

module.exports = class Generator extends EventEmitter {
  constructor(config, mongoose) {
    super();
    this.config = config;
    this.mongoose = mongoose;
    this.schemas = {};
    this.models = mongoose.models;

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
      cb(this.schemas[schemaName], schemaName);
    }
  }
};
