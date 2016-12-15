const assert = require('assert');
const jade = require('pug');
const join = require('path').join;
const eachSeries = require('async/eachSeries');

// TODO use in prod: https://www.npmjs.com/package/cachedfs
const fs = require('fs');

const handlers = {
  text: generateDefaultControl,
  //number: generateDefaultControl,
  //email: generateDefaultControl,
  //password: generateDefaultControl,
  //date: generateDefaultControl,
  //select: generateDefaultControl,
  checklist: generateDefaultControl,
  static: generateDefaultControl,
  //textarea: generateDefaultControl,
  //list: generateList,
};

const templates = {
  form: fs.readFileSync(join(__dirname, 'templates', 'form.pug'), 'utf-8'),
  list: fs.readFileSync(join(__dirname, 'templates', 'list.pug'), 'utf-8'),
};

const controlTpls = {
};

for (const controlName in handlers) {
  const file = join(__dirname, 'controls', `control-${controlName}.pug`);
  controlTpls[controlName] = fs.readFileSync(file, 'utf-8');
}

function generateDefaultControl(control, generatorOptions, cb) {
  const template = controlTpls[control.frontField.type];
  //const layout = join(__dirname, 'layouts', `layout-${generatorOptions.layout}.pug`);
  const layout = `./layouts/layout-${generatorOptions.layout}.pug`;
  const templateFinal = `extends ${layout}\n\n${template}`;
  const compiled = jade.compile(templateFinal, {
    basedir: __dirname,
    filename: join(__dirname, `${control.frontField.type}.pug`),
    pretty: generatorOptions.pretty === undefined ? true : generatorOptions.pretty,
  });

  // TODO!
  control.errors = [];
  let html;
  try {
    html = compiled({
      //debug: true,
      render: jade.render,

      generatorOptions: generatorOptions,
      control: control
    });
  } catch (e) {
    /* istanbul ignore next */
    return cb(e, null);
  }

  return cb(null, html);
}

module.exports = function(generator, schema, generatorOptions, cb) {
  $log.info(schema.getName(), generatorOptions);

  const controls = [];
  const controlsHTML = [];
  schema.eachFrontForm(generatorOptions.action, function(obj) {
    controls.push(obj);
  });

  eachSeries(controls, function(control, next) {
    const handler = handlers[control.frontField.type];
    $log.info(`control found: ${control.path} ${control.realpath} ${control.frontField.type} using ${generator.name}`);

    // ng-model
    control.model = `${generatorOptions.basePath}.${control.realpath}`;
    // controller will store data here for the control
    const safeName = control.realpath.replace(/\./g, '_');
    control.cfgModel = `controls.${safeName}`;
    control.formModel = `${generatorOptions.formPath}.${safeName}`;

    // TODO REVIEW
    // unsused: control.container applied @ div.control-container

    // TODO DEBUG REMOVE
    delete control.parent;
    $log.debug(control.backField);

    // choose a generator
    return handler(control, generatorOptions, function(err, html) {
      /* istanbul ignore next */ if (err) {
        return next(err);
      }

      controlsHTML.push(html);

      return next();
    });
  }, function(err) {
    /* istanbul ignore next */ if (err) {
      return cb(err, null);
    }

    $log.info(`all controls rendered: ${controlsHTML.length}`);

    const compiled = jade.compile(templates.form, {
      basedir: __dirname,
      filename: join(__dirname, 'form.pug'),
      pretty: generatorOptions.pretty === undefined ? true : generatorOptions.pretty,
    });

    let html;
    try {
      html = compiled({
        name: generatorOptions.formPath,
        button: {},
        controls: controlsHTML,
        render: jade.render
      });
    } catch (e) {
        /* istanbul ignore next */
      return cb(e, null);
    }

    const targetFilename = join(
      generator.config.generationPath,
      `${schema.getName()}.${generatorOptions.action}.tpl.html`
    );

    fs.writeFileSync(targetFilename, html, {encoding: 'utf-8'});
    $log.info(`written: ${targetFilename}`);

    return cb(null, html);
  });
};
