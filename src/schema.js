const timestamps = require('mongoose-timestamp');
const eachOf = require('async/eachOf');
const _ = require('lodash');
const pluralize = require('pluralize');

module.exports = class Schema {
  constructor(generator, schemaObj) {
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
    this.mongooseSchema.pre('save', function(next) {
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
  }
  getName() {
    return this.schema.singular;
  }

  getPlural() {
    return this.schema.singular;
  }
  getModel() {
    if (!this.mongooseModel) {
      throw new Error('finalize first');
    }
    return this.mongooseModel; // TODO
  }
  finalize() {
    this.mongooseModel = this.generator.mongoose.model(this.getPlural(), this.mongooseSchema);
  }
};


function simplifySchema(obj, prop, value) {
  if (!prop) {
    for (const i in obj) {
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
