const assert = require('assert');
const _ = require('lodash');
const join = require('path').join;
const eachSeries = require('async/eachSeries');

const fs = require('fs');

function load(filename) {
  const compiled = _.template(fs.readFileSync(filename, 'utf-8'));

  return compiled;
}

const templates = {
  create: load(join(__dirname, 'angular', 'create.controller.js')),
  update: load(join(__dirname, 'angular', 'update.controller.js')),
  module: load(join(__dirname, 'angular', 'module.js')),
};

module.exports = function(generator, schema, generatorOptions, cb) {
  eachSeries([
    createControler,
    updateControler,
    moduleInit,
  ], function(func, next) {
    func(generator, schema, generatorOptions, next);
  }, cb);
};

function listControler(generator, schema, generatorOptions, cb) {

}

function createControler(generator, schema, generatorOptions, cb) {
  const opt = _.cloneDeep(generatorOptions);
  opt.action = 'create';

  getControlsController(schema, opt, function(err, controlsJS) {
    if (err) {
      return cb(err);
    }

    const createHTML = templates.create({
      schema: schema,
      generatorOptions: generatorOptions,
      controlsJS: controlsJS,
    });
    const createFile = join(
      generator.config.generationPath,
      `${schema.getName()}.create.controller.js`
    );

    fs.writeFileSync(createFile, createHTML, {encoding: 'utf-8'});

    return cb();
  });
}

function updateControler(generator, schema, generatorOptions, cb) {
  const opt = _.cloneDeep(generatorOptions);
  opt.action = 'update';

  getControlsController(schema, opt, function(err, controlsJS) {
    if (err) {
      return cb(err);
    }

    const updateHTML = templates.update({
      schema: schema,
      generatorOptions: generatorOptions,
      controlsJS: controlsJS,
    });
    const updateFile = join(
      generator.config.generationPath,
      `${schema.getName()}.update.controller.js`
    );

    fs.writeFileSync(updateFile, updateHTML, {encoding: 'utf-8'});

    return cb();
  });
}

function moduleInit(generator, schema, generatorOptions, cb) {
  // MODULE
  const moduleHTML = templates.module({
    schema: schema,
    generatorOptions: generatorOptions
  });
  const moduleFile = join(
    generator.config.generationPath,
    `${schema.getName()}.module.controller.js`
  );

  fs.writeFileSync(moduleFile, moduleHTML, {encoding: 'utf-8'});

  cb();
}

const controlControllers = {
  checklist: load(join(__dirname, 'controls', 'control-checklist.js')),
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
