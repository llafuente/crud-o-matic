const pug = require('pug');
const join = require('path').join;
const eachSeries = require('async/eachSeries');

// TODO use in prod: https://www.npmjs.com/package/cachedfs
const fs = require('fs');

const handlers = {
  text: generateDefaultControl,
  number: generateDefaultControl,
  email: generateDefaultControl,
  password: generateDefaultControl,
  //date: generateDefaultControl,
  select: generateDefaultControl,
  checklist: generateDefaultControl,
  static: generateDefaultControl,
  textarea: generateDefaultControl,
  richtext: generateDefaultControl,
  list: generateList,
};

const templates = {
  form: fs.readFileSync(join(__dirname, 'templates', 'form.pug'), 'utf-8'),
  list: fs.readFileSync(join(__dirname, 'templates', 'list.pug'), 'utf-8'),
};

const controlTpls = {
};

for (const controlName in handlers) { // eslint-disable-line guard-for-in
  const file = join(__dirname, 'controls', `control-${controlName}.pug`);
  controlTpls[controlName] = fs.readFileSync(file, 'utf-8');
}

function generateDefaultControl(control, schema, generatorOptions, cb) {
  const template = controlTpls[control.frontField.type];
  //const layout = join(__dirname, 'layouts', `layout-${generatorOptions.layout}.pug`);
  const layout = `./layouts/layout-${generatorOptions.layout}.pug`;
  const templateFinal = `extends ${layout}\n\n${template}`;
  const compiled = pug.compile(templateFinal, {
    basedir: __dirname,
    filename: join(__dirname, `${control.frontField.type}.pug`),
    pretty: generatorOptions.pretty === undefined ? true : generatorOptions.pretty,
  });

  let html;
  try {
    html = compiled({
      //debug: true,
      render: pug.render,

      generatorOptions: generatorOptions,
      control: control
    });
  } catch (e) {
    /* istanbul ignore next */
    return cb(e, null);
  }

  return cb(null, html);
}

function generateList(control, schema, generatorOptions, cb) {
  $log.debug(`generateList ${control.backField.name}`);

  generateControls(control.subControls, schema, generatorOptions, function(err, controlsHTML) {
    if (err) {
      return cb(err);
    }

    const template = controlTpls[control.frontField.type];

    const compiled = pug.compile(template, {
      basedir: __dirname,
      filename: join(__dirname, 'templates', 'list.pug'),
      pretty: generatorOptions.pretty === undefined ? true : generatorOptions.pretty,
    });

    let html;
    try {
      html = compiled({
        //debug: true,
        render: pug.render,

        generatorOptions: generatorOptions,
        control: control,
        subControls: controlsHTML,
      });
    } catch (e) {
      /* istanbul ignore next */
      return cb(e, null);
    }

    return cb(null, html);
  });
}
//*
function generateControls(controls, schema, generatorOptions, cb) {
  const controlsHTML = [];

  eachSeries(controls, function(control, next) {
    const handler = handlers[control.frontField.type];
    if (!handler) {
      throw new Error(`can't find handler for ${control.frontField.type}`);
    }

    $log.info(`control found: ${control.path} ${control.realpath} ${control.frontField.type} using ${handler.name}`);

    schema.applyGeneratorOptions(control, generatorOptions);

    // TODO REVIEW
    // unsused: control.container applied @ div.control-container

    // TODO DEBUG REMOVE
    delete control.parent;
    $log.silly('control.backField', control.backField);

    // choose a generator
    return handler(control, schema, generatorOptions, function(err, html) {
      /* istanbul ignore next */ if (err) {
        return next(err);
      }

      controlsHTML.push(html);

      return next();
    });
  }, function(err) {
    if (err) {
      return cb(err);
    }

    return cb(null, controlsHTML);
  });
}

module.exports = function(generator, schema, generatorOptions, cb) {
  $log.info(schema.getName(), generatorOptions);

  const controls = schema.getFrontForm(generatorOptions.action);

  generateControls(controls, schema, generatorOptions, function(err, controlsHTML) {
    /* istanbul ignore next */ if (err) {
      return cb(err, null);
    }

    $log.info(`all controls rendered: ${controlsHTML.length}`);

    const compiled = pug.compile(templates.form, {
      basedir: __dirname,
      filename: join(__dirname, 'form.pug'),
      pretty: generatorOptions.pretty === undefined ? true : generatorOptions.pretty,
    });

    let html;
    try {
      html = compiled({
        schema: schema,
        generatorOptions: generatorOptions,

        controls: controlsHTML,
        render: pug.render
      });
    } catch (e) {
        /* istanbul ignore next */
      return cb(e, null);
    }

    const targetFilename = join(
      generator.config.angularPath,
      `${schema.getName()}.${generatorOptions.action}.tpl.html`
    );

    fs.writeFileSync(targetFilename, html, {encoding: 'utf-8'});
    $log.info(`written: ${targetFilename}`);

    return cb(null, html);
  });
};
