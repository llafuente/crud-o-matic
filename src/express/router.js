const express = require('express');

const create = require('./<%= schema.getName() %>.express.create.js');
const destroy = require('./<%= schema.getName() %>.express.destroy.js');
const list = require('./<%= schema.getName() %>.express.list.js');

const errorHandler = require('<%= generatorOptions.componentsPath %>/error-handler.js');
const auth = require('<%= generatorOptions.componentsPath %>/authorization.js');

module.exports = function(generator, schema) {
  const r = express.Router();

  function show(status_code, storedAt) {
    return function(req, res/*, next*/) {
      res.status(status_code);

      if (status_code !== 204) {
        res.json(req[storedAt]);
      } else {
        res.json();
      }
    };
  }


  <% if (schema.permissions.list) { %>
    list(generator, schema);
    r.get('<%= schema.apiUrls.list %>', [
      //auth.authorization(),
      //auth.hasPermission('<%= schema.permissions.list %>'),
      list.middleware,
      list.csvListQuery, // if accept.indexOf('text/csv'
      list.xmlListQuery,
      list.jsonListQuery('entities'),
      //format('entities', 'entities'),
      show(200, 'entities')
    ]);
  <% } %>

  /*
  <% if (schema.permissions.read) { %>
    r.get('<%= schema.apiUrls.read %>', [
      auth.authorization(),
      auth.hasPermission('<%= schema.permissions.read %>'),
      read('entity'),
      format('entity', 'entity'),
      show(200, 'entity')
    ]);
  <% } %>
  */
  <% if (schema.permissions.create) { %>
    r.post('<%= schema.apiUrls.create %>', [
      //auth.authorization(),
      //auth.hasPermission('<%= schema.permissions.create %>'),
      create.middleware('entity'),
      //format('entity', 'entity'),
      show(201, 'entity')
    ]);
  <% } %>
  /*
  <% if (schema.permissions.update) { %>
    r.patch('<%= schema.apiUrls.update %>', [
      auth.authorization(),
      auth.hasPermission('<%= schema.permissions.update %>'),
      read('entity'),
      update('entity'),
      format('entity'),
      show(200, 'entity')
    ]);
  <% } %>
  */
  <% if (schema.permissions.delete) { %>
    r.delete('<%= schema.apiUrls.delete %>', [
      //auth.authorization(),
      //auth.hasPermission('<%= schema.permissions.delete %>'),
      destroy.middleware,
      show(204)
    ]);
  <% } %>

  // error-handler
  r.use(errorHandler);

  return r;
}
