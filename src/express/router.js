const express = require('express');

const create = require('./<%= schema.getName() %>.express.create.js');
const destroy = require('./<%= schema.getName() %>.express.destroy.js');
const list = require('./<%= schema.getName() %>.express.list.js');
const read = require('./<%= schema.getName() %>.express.read.js');
const update = require('./<%= schema.getName() %>.express.update.js');

const errorHandler = require('./error-handler.js');
const auth = require('./authorization.js');

module.exports = function(mongoose) {
  const r = express.Router(); // eslint-disable-line new-cap
  r.use(function(req, res, next) {
    // used by error-handler.js
    req.model = mongoose.model.<%= schema.getName() %>;
    req.schema = mongoose.modelSchemas.<%= schema.getName() %>;

    next();
  });

  function show(statusCode, storedAt) {
    return function(req, res/*, next*/) {
      res.status(statusCode);

      if (statusCode !== 204) {
        res.json(req[storedAt]);
      } else {
        res.json();
      }
    };
  }


  <% if (schema.permissions.list) { %>
    list(mongoose);

    r.get('<%= schema.apiUrls.list %>', [
      auth.authorization(),
      auth.hasPermission('<%= schema.permissions.list %>'),
      list.middleware,
      list.csvListQuery, // if accept.indexOf('text/csv'
      list.xmlListQuery,
      list.jsonListQuery('entities'),
      //format('entities', 'entities'),
      show(200, 'entities')
    ]);
  <% } %>

  <% if (schema.permissions.read) { %>
    read(mongoose);

    r.get('<%= schema.apiUrls.read %>', [
      auth.authorization(),
      auth.hasPermission('<%= schema.permissions.read %>'),
      read.middleware('entity'),
      //format('entity', 'entity'),
      show(200, 'entity')
    ]);
  <% } %>

  <% if (schema.permissions.create) { %>
    create(mongoose);

    r.post('<%= schema.apiUrls.create %>', [
      auth.authorization(),
      auth.hasPermission('<%= schema.permissions.create %>'),
      create.middleware('entity'),
      //format('entity', 'entity'),
      show(201, 'entity')
    ]);
  <% } %>

  <% if (schema.permissions.update) { %>
    r.patch('<%= schema.apiUrls.update %>', [
      auth.authorization(),
      auth.hasPermission('<%= schema.permissions.update %>'),
      read.middleware('entity'),
      update.middleware('entity', 'entity2'),
      //format('entity2'),
      show(200, 'entity2')
    ]);
  <% } %>

  <% if (schema.permissions.delete) { %>
    destroy(mongoose);

    r.delete('<%= schema.apiUrls.delete %>', [
      auth.authorization(),
      auth.hasPermission('<%= schema.permissions.delete %>'),
      destroy.middleware,
      show(204)
    ]);
  <% } %>

  // error-handler
  r.use(errorHandler);

  return r;
}
