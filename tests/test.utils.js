const mongoose = require('mongoose');
const fs = require('fs');
const acornParse = require('acorn').parse;
const _ = require('lodash');
const tap = require('tap');

module.exports = {
  start: start,
  finish: finish,
  checkHTML: checkHTML,
  checkJS: checkJS,
};

// this removed random/auto data from testing
tap.Test.prototype.addAssert('apiResult', 2, function(a, b, message, extra) {
  message = message || 'should be a Date compatible type';

  const clean = _.cloneDeep(a);

  _.forEach([
    '_id',
    'updated_at',
    'created_at',
    'salt',
    'password',
  ], function(v) {
    // maybe _.unset
    delete clean[v];
  });

  return this.deepEqual(clean, b, message, extra);
});


function start(test) {
  test('test start', function(t) {
    const conn = mongoose.connect('mongodb://localhost/generator_test');

    mongoose.connection.once('open', function () {
      conn.connection.db.dropDatabase(function(err, result) {
        t.end();
      });
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
