require("./src/log.js");
const Generator = require("./src/generator.js");

module.exports = function (config, mongoose) {
  return new Generator(config, mongoose);
};
