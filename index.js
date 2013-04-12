var package = require('./package');
module.exports = {
  name: package.name,
  dependencies: [
    require('mistore')
  ],
  install: require('./lib')
};
