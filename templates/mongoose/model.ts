import mongoose = require("mongoose");

import { <%= interfaceName %> } from './<%= interfaceName %>';
export * from './<%= interfaceName %>';

export interface <%= interfaceName %>Model extends <%= interfaceName %>, mongoose.Document { }

export const <%= schemaName %> = new mongoose.Schema({
  <% forEachBackEndField((key, PrimiteType) => { %>
    <%= key %>: <%= PrimiteType.getMongooseType() %>,
  <% }) %>
}, <%= JSON.stringify(backend.options, null, 2) %>);

<% if (schemaName == "UserSchema") { %>
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

UserSchema.pre('save', function savePasswordHash(next) {
  if (this.isModified('password')) {
    this.salt = makeSalt();
    this.password = encryptPassword(this.password, this.salt);
  }

  next();
});

UserSchema.pre('update', function updatePasswordHash(next) {
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
UserSchema.methods.authenticate = function authenticate(plainText) {
  return encryptPassword(plainText, this.salt) === this.password;
};

UserSchema.methods.hasPermission = function hasPermission(perm) {
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


<% } %>


export const <%= singularUc %> = mongoose.model<<%= interfaceName %>Model>("User", <%= schemaName %>);
