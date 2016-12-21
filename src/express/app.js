const timestamps = require('mongoose-timestamp');
const userSchemaOverride = require('./user.model.override.js');
const _ = require('lodash');
const express = require('express');
const eachOfSeries = require('async/eachOfSeries');

// JSON: plural, schema, options
module.exports = function(mongoose, cb/*(router)*/) {
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


  // declare schema/models
  _.each(<%- JSON.stringify(_.keys(schemas)) %>, function(schemaName) {
    const schemaJSON = require(`./${schemaName}.schema.json`);
    const schema = new mongoose.Schema(schemaJSON.schema, schemaJSON.options);

    schema.plugin(timestamps, {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });

    schema.set('autoIndex', true);

    schema.pre('save', function(next) {
      $log.debug('fetch a readble id');
      const self = this;
      if (this.isNew) {
        return mongoose.models.autoincrements.findOneAndUpdate({
          _id: schemaJSON.plural
        }, {
          $inc: {
            autoinc: 1
          },
          $setOnInsert: {
            _id: schemaJSON.plural,
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

    // user require specific schema extensions
    // TODO the user should be able to do something like this...
    if (schemaName === 'user') {
      userSchemaOverride('<%= config.auth.secret %>', schema);
    }

    mongoose.model(schemaJSON.plural, schema);
  });

  // create the router and return it

  const router = express.Router(); // eslint-disable-line new-cap

  router.use(
    require('./user.express.authentication.js')(mongoose)
  );

  _.each(<%- JSON.stringify(_.keys(schemas)) %>, function(schemaName) {
    router.use(
      require(`./${schemaName}.express.router.js`)(mongoose)
    );
  });

  // now add permissions
  const permMdl = mongoose.models.permission;

  eachOfSeries(<%- JSON.stringify(permissions) %>, function(value, key, next2) {
    $log.info('permission', value, key);

    return permMdl.update({
      _id: key
    }, {
      _id: key,
      label: value
    }, {
      upsert: true,
      setDefaultsOnInsert: true
    }, function(err, data) {
      $log.info(err, data);
      next2(err);
    });
  }, function(err) {
    $log.debug('permissions saved');
    cb(err, router);
  });
}
