const mongoose = require('mongoose');
const fs = require('fs');
const acornParse = require('acorn').parse;

module.exports = {
  start: start,
  finish: finish,
  checkHTML: checkHTML,
  checkJS: checkJS,
};


function start(test) {
  test('test start', function(t) {
    mongoose.connect('mongodb://localhost/generator_test');
    mongoose.connection.once('open', function () {
      t.end();
    });
  });
}

function finish(test) {
  test('close mongoose', function(t) {
    mongoose.disconnect();
    t.end();
  });
}

function checkHTML(t, filename) {
  t.ok(fs.existsSync(filename), `${filename} exist`);

  const html = fs.readFileSync(filename, 'utf-8');
  t.equal(html.indexOf('undefined'), -1);

  return html;
}

function checkJS(t, filename) {
  t.ok(fs.existsSync(filename), `${filename} exist`);

  const src = fs.readFileSync(filename, 'utf-8');
  t.equal(src.indexOf('undefined'), -1);

  try {
    acornParse(src, {
      ecmaVersion: 6,
      allowHashBang: true,
      sourceType: 'module',
    });
  } catch (err) {
    err.message = err.message + ` on ${filename}`;
    t.error(err);
  }

  return src;
}
