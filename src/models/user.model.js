const crypto = require('crypto');

function makeSalt() {
  return crypto.randomBytes(16).toString('base64');
}

function encryptPassword(password, salt) {
  if (!password || !salt) {
    return null;
  }

  const saltBuff = new Buffer(salt, 'base64');
  return crypto.pbkdf2Sync(password, saltBuff, 10000, 64).toString('base64');
}

module.exports = function(generator, schema) {
  const secret = generator.config.auth.secret;
  if (!secret) {
    throw new Error('Generator config missing auth.secret');
  }

  schema.mongooseSchema.pre('save', function savePasswordHash(next) {
    if (this.isModified('password')) {
      this.salt = makeSalt();
      this.password = encryptPassword(this.password, this.salt);
    }

    next();
  });

  schema.mongooseSchema.pre('update', function updatePasswordHash(next) {
    const pwd = this._update.$set.password;
    if (pwd) {
      const salt = makeSalt();
      this.update({}, { $set: {
        salt: salt,
        password: encryptPassword(pwd, salt) } });
    }

    next();
  });

  /**
   * Authenticate - check if the passwords are the same
   */
  schema.mongooseSchema.methods.authenticate = function authenticate(plainText) {
    return encryptPassword(plainText, this.salt) === this.password;
  };

  schema.mongooseSchema.methods.hasPermission = function hasPermission(perm) {
    if (this.permissions.indexOf(perm) === -1) {
      // look at roles
      let found = false;
      let i;

      for (i = 0; i < this.roles.length; ++i) {
        if (this.roles[i].permissions.indexOf(perm) !== -1) {
          found = true;
        }
      }

      return found;
    }
    return true;
  };

  // TODO do it!
  /* istanbul ignore next */
  schema.mongooseSchema.methods.filterQuery = function filterQuery(query, cb) {
    if (!this.populated('roles')) {
      this.populate('roles', function(err, user) {
        if (err) {
          return cb(err);
        }

        user.filterQuery(query, cb);
      });
    }
    /*
    if (!this.populated('groups')) {
      this.populate('groups', function(err, user) {
        if (err) {
          return cb(err);
        }

        user.filterQuery(query, cb)
      })
    }
    */

    //var roles = this.populated('roles');
    //query.in(groups, this.populated('groups'));

    return cb(null, query);
  };
};
