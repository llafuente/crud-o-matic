const _ = require('lodash');
const ejs = require('ejs');
const join = require('path').join;
const eachSeries = require('async/eachSeries');
const pug = require('pug');

const fs = require('fs');

function load(filename) {
  const compiled = ejs.compile(fs.readFileSync(filename, 'utf-8'));

  return compiled;
}

function loadPug(filename) {
  const html = fs.readFileSync(filename, 'utf8');
  return pug.compile(html, {
    basedir: __dirname,
    filename: filename,
    pretty: true,
  });
}

const templates = {
  create: load(join(__dirname, 'angular', 'create.controller.js')),
  update: load(join(__dirname, 'angular', 'update.controller.js')),
  module: load(join(__dirname, 'angular', 'module.js')),
  routes: load(join(__dirname, 'angular', 'routes.config.js')),
  listHTML: loadPug(join(__dirname, 'templates', 'list.pug')),
  list: load(join(__dirname, 'angular', 'list.controller.js')),
  app: load(join(__dirname, 'angular', 'app.js')),

};


module.exports = function(generator, schema, generatorOptions, cb) {
  eachSeries([
    createController,
    updateController,
    routesConfig,
    listController,
    listHTML,
    moduleInit,
  ], function(func, next) {
    func(generator, schema, generatorOptions, next);
  }, cb);
};
module.exports.app = function(generator, generatorOptions, cb) {
  const routesJS = templates.app({
    schemas: Object.keys(generator.schemas),
    generatorOptions: generatorOptions,
  });

  const routeFile = join(
    generator.config.angularPath,
    `app.js`
  );

  fs.writeFileSync(routeFile, routesJS, {encoding: 'utf-8'});

  cb();
}

function routesConfig(generator, schema, generatorOptions, cb) {
  const routesJS = templates.routes({
    _: _,
    schema: schema,
    generatorOptions: generatorOptions,
  });
  const routeFile = join(
    generator.config.angularPath,
    `${schema.getName()}.routes.config.js`
  );

  fs.writeFileSync(routeFile, routesJS, {encoding: 'utf-8'});

  cb();
}

function listController(generator, schema, generatorOptions, cb) {
  const routesJS = templates.list({
    _: _,
    schema: schema,
    generatorOptions: generatorOptions,
  });

  const routeFile = join(
    generator.config.angularPath,
    `${schema.getName()}.list.controller.js`
  );

  fs.writeFileSync(routeFile, routesJS, {encoding: 'utf-8'});

  cb();
}

function listHTML(generator, schema, generatorOptions, cb) {
  const listableFields = [];
  schema.eachFrontList(function(control) {
    schema.applyGeneratorOptions(control, generatorOptions);
    listableFields.push(control);
  });

  const routesJS = templates.listHTML({
    _: _,
    schema: schema,
    generatorOptions: generatorOptions,
    listableFields: listableFields,
  });
  const routeFile = join(
    generator.config.angularPath,
    `${schema.getName()}.list.tpl.html`
  );

  fs.writeFileSync(routeFile, routesJS, {encoding: 'utf-8'});
  cb();
}

function createController(generator, schema, generatorOptions, cb) {
  const opt = _.cloneDeep(generatorOptions);
  opt.action = 'create';

  getControlsController(schema, opt, function(err, controlsJS) {
    if (err) {
      return cb(err);
    }

    const createHTML = templates.create({
      _: _,
      schema: schema,
      generatorOptions: generatorOptions,
      controlsJS: controlsJS,
    });
    const createFile = join(
      generator.config.angularPath,
      `${schema.getName()}.create.controller.js`
    );

    fs.writeFileSync(createFile, createHTML, {encoding: 'utf-8'});

    return cb();
  });
}

function updateController(generator, schema, generatorOptions, cb) {
  const opt = _.cloneDeep(generatorOptions);
  opt.action = 'update';

  getControlsController(schema, opt, function(err, controlsJS) {
    if (err) {
      return cb(err);
    }

    const updateHTML = templates.update({
      _: _,
      schema: schema,
      generatorOptions: generatorOptions,
      controlsJS: controlsJS,
    });
    const updateFile = join(
      generator.config.angularPath,
      `${schema.getName()}.update.controller.js`
    );

    fs.writeFileSync(updateFile, updateHTML, {encoding: 'utf-8'});

    return cb();
  });
}

function moduleInit(generator, schema, generatorOptions, cb) {
  const moduleJS = templates.module({
    _: _,
    schema: schema,
    generatorOptions: generatorOptions,
  });
  const moduleFile = join(
    generator.config.angularPath,
    `${schema.getName()}.module.js`
  );

  fs.writeFileSync(moduleFile, moduleJS, {encoding: 'utf-8'});

  cb();
}

const controlControllers = {
  checklist: load(join(__dirname, 'controls', 'control-checklist.js')),
  select: load(join(__dirname, 'controls', 'control-select.js')),
  list: load(join(__dirname, 'controls', 'control-list.js')),
};

// specific code that some controls need in the controller
function getControlsController(schema, generatorOptions, cb) {
  const controls = [];
  const controlsJS = [];
  schema.eachFrontForm(generatorOptions.action, function(obj) {
    controls.push(obj);
  });

  eachSeries(controls, function(control, next) {
    if (controlControllers[control.frontField.type]) {
      schema.applyGeneratorOptions(control, generatorOptions);

      try {
        const js = controlControllers[control.frontField.type]({
          generatorOptions: generatorOptions,
          control: control,
        });
        controlsJS.push(js);
      } catch (e) {
        return next(e);
      }
    }

    return next();
  }, function(err) {
    if (err) {
      return cb(err);
    }

    return cb(null, controlsJS.join('\n\n'));
  });
}
