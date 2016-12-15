const express = require('express');

const create = require('./<%= schema.getName() %>.express.create.js');
const destroy = require('./<%= schema.getName() %>.express.destroy.js');
/*
const read = require('./<%= schema.getName() %>.express.read.js');
const create = require('./crud/create.js');
const update = require('./crud/update.js');
const destroy = require('./crud/destroy.js');
const show = require('./crud/show.js');
const format = require('./crud/format.js');
const angular = require('<%= generatorOptions.componentsPath %>/.js');
*/
const errorHandler = require('<%= generatorOptions.componentsPath %>/error-handler.js');
const auth = require('<%= generatorOptions.componentsPath %>/authorization.js');

const r = module.exports = express.Router();

function show(status_code, stored_at) {
  return function(req, res/*, next*/) {
    res.status(status_code);

    if (status_code !== 204) {
      res.json(req[stored_at]);
    }
  };
}


/*
<% if (schema.permissions.list) { %>
  r.get('<%= schema.apiUrls.list %>', [
    auth.authorization(),
    auth.hasPermission('<%= schema.permissions.list %>'),
    list('entities'),
    format('entities', 'entities'),
    show(200, 'entities')
  ]);
<% } %>

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
    create('entity'),
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
    destroy
  ]);
<% } %>

// error-handler
r.use(errorHandler);
