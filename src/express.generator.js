const assert = require('assert');
const pug = require('pug');
const join = require('path').join;
const eachSeries = require('async/eachSeries');
const _ = require('lodash');

// TODO use in prod: https://www.npmjs.com/package/cachedfs
const fs = require('fs');

function load(filename) {
  const compiled = _.template(fs.readFileSync(filename, 'utf-8'));

  return compiled;
}

const templates = {
  router: load(join(__dirname, 'express', 'router.js')),
  create: load(join(__dirname, 'express', 'create.js')),
  //list: fs.readFileSync(join(__dirname, 'express', 'update.js'), 'utf-8'),
  //list: fs.readFileSync(join(__dirname, 'express', 'delete.js'), 'utf-8'),
  //list: fs.readFileSync(join(__dirname, 'express', 'read.js'), 'utf-8'),
  //list: fs.readFileSync(join(__dirname, 'express', 'list.js'), 'utf-8'),
};


module.exports = function(generator, schema, generatorOptions, cb) {
  eachSeries([
    router,
    create,
  ], function(func, next) {
    func(generator, schema, generatorOptions, next);
  }, cb);
};


function router(generator, schema, generatorOptions, cb) {
  const routesJS = templates.router({
    schema: schema,
    generatorOptions: generatorOptions,
  });
  const routeFile = join(
    generator.config.generationPath,
    `${schema.getName()}.express.router.js`
  );

  fs.writeFileSync(routeFile, routesJS, {encoding: 'utf-8'});

  cb();
}

function create(generator, schema, generatorOptions, cb) {
  const routesJS = templates.create({
    schema: schema,
    generatorOptions: generatorOptions,
  });
  const routeFile = join(
    generator.config.generationPath,
    `${schema.getName()}.express.create.js`
  );

  fs.writeFileSync(routeFile, routesJS, {encoding: 'utf-8'});

  cb();
}
