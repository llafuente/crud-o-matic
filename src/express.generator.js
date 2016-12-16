const join = require('path').join;
const eachSeries = require('async/eachSeries');
const ejs = require('ejs');

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
};


module.exports = function(generator, schema, generatorOptions, cb) {
  eachSeries([
    useDefault('router'),
    useDefault('create'),
    useDefault('destroy'),
    useDefault('list'),
  ], function(func, next) {
    func(generator, schema, generatorOptions, next);
  }, cb);
};


function useDefault(key) {
  return function(generator, schema, generatorOptions, cb) {
    $log.silly(`generating ${key}`);
    const routesJS = templates[key]({
      schema: schema,
      generatorOptions: generatorOptions,
    });
    const routeFile = join(
      generator.config.generationPath,
      `${schema.getName()}.express.${key}.js`
    );

    fs.writeFileSync(routeFile, routesJS, {encoding: 'utf-8'});

    cb();
  };
}
