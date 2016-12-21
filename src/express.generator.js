const join = require('path').join;
const eachSeries = require('async/eachSeries');
const ejs = require('ejs');
const _ = require('lodash');

// TODO use in prod: https://www.npmjs.com/package/cachedfs
const fs = require('fs');

function load(filename) {
  const compiled = ejs.compile(fs.readFileSync(filename, 'utf-8'));

  return compiled;
}

const templates = {
  router: load(join(__dirname, 'express', 'router.js')),
  create: load(join(__dirname, 'express', 'create.js')),
  destroy: load(join(__dirname, 'express', 'destroy.js')),
  list: load(join(__dirname, 'express', 'list.js')),
  read: load(join(__dirname, 'express', 'read.js')),
  update: load(join(__dirname, 'express', 'update.js')),
  authentication: load(join(__dirname, 'express', 'authentication.js')),
  app: load(join(__dirname, 'express', 'app.js')),
};

module.exports = function(generator, schema, generatorOptions, cb) {
  const todo = [
    useDefault('router'),
    useDefault('create'),
    useDefault('destroy'),
    useDefault('list'),
    useDefault('read'),
    useDefault('update'),
  ];

  if (schema.getName() === 'user') {
    todo.push(useDefault('authentication'));
  }

  eachSeries(todo, function(func, next) {
    func(generator, schema, generatorOptions, next);
  }, cb);
};


function useDefault(key) {
  return function(generator, schema, generatorOptions, cb) {
    $log.silly(`generating express ${key}`);
    const routesJS = templates[key]({
      _: _,
      config: generator.config,
      schema: schema,
      generatorOptions: generatorOptions,
    });
    const routeFile = join(
      generator.config.expressPath,
      `${schema.getName()}.express.${key}.js`
    );

    fs.writeFileSync(routeFile, routesJS, {encoding: 'utf-8'});

    cb();
  };
}

module.exports.app = function(generator, generatorOptions, cb) {
  $log.silly('generating express app');

  const permissions = {};
  _.each(generator.schemas, function(schema) {
    _.each(schema.permissions, function(idPermission, key) {
      permissions[idPermission] = schema.schema.backend.permissions[key];
    });
  });

  const routesJS = templates.app({
    _: _,
    schemas: generator.schemas,
    config: generator.config,
    generatorOptions: generatorOptions,
    permissions: permissions,
  });
  const routeFile = join(generator.config.expressPath, 'app.js');

  fs.writeFileSync(routeFile, routesJS, {encoding: 'utf-8'});

  cb();
};
