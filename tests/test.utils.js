const mongoose = require('mongoose');

module.exports = {
  start: start,
  finish: finish,
};


function start(test) {
  test('test start', function(t) {
    t.end();
  });
}

function finish(test) {
  test('close mongoose', function(t) {
    mongoose.disconnect();
    t.end();
  });
}
