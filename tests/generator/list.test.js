const path = require('path');
const mongoose = require('mongoose');
const _ = require('lodash');
const test = require('tap').test;
const testUtils = require('../test.utils.js');
const theGenerator = require('../../index.js');
const rmrf = require('rimraf').sync;

testUtils.start(test);

const angularPath = path.join(__dirname, 'tmp', 'angular');
const expressPath = path.join(__dirname, 'tmp', 'express');

rmrf(path.join(__dirname, 'tmp'));

let g;
test('instance theGenerator', function(t) {
  //require("fs").mkdirSync(generationPath);
  g = theGenerator({
    auth: {
      secret: 'xxx'
    },
    apiBasePath: '/api',
    mongoose: mongoose,
    angularPath: angularPath,
    expressPath: expressPath,
  });

  g.schemaFile(path.join(__dirname, 'list.yml'));

  t.end();
});

test('check list mongoose:schema/model', function(t) {
  t.ok(!!g.schemas.list);
  t.ok(!!g.schemas.list.mongooseSchema);

  t.end();
});

test('check list mongoose:schema/model', function(t) {
  const controls = g.schemas.list.getFrontForm('create');
  $log.debug(controls);
  let names = _.map(controls, 'realpath');
  t.deepEqual(names, [
    'label',
    'thelist',
    'text',
  ]);

  names = _.map(controls[1].subControls, 'realpath');
  t.deepEqual(names, [
    'thelist[thelist_id].label',
    'thelist[thelist_id].unit',
  ]);

  t.end();
});

test('g.generateAll', function(t) {
  g.generateAll(function(err) {
    t.error(err);
    t.end();
  });
});


testUtils.finish(test);
