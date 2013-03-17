var ejsLatexBackend = require('..'),
    StringStream = require('string-stream');
require('should');
function Application() {
  this._cache = {};
}
Application.prototype.register = function (key, scope) {
  this._cache[key] = scope;
};
Application.prototype.require = function (key) {
  return this._cache[key];
};
function Mistore() {
  this.backend = {};
}
Mistore.prototype.render = function (doc, stream, arg, next) {
  var b = this.backend[doc.type];
  b = new b();
  b.start(doc, stream, arg, next);
};
describe('EJS Backend', function () {
  var app,
      mistore;
  before(function (done) {
    app = new Application();
    app.register('mistore', new Mistore());
    mistore = app.require('mistore');
    ejsLatexBackend(app, done);
  });
  it('should render correctly', function (done) {
    var stream = new StringStream();
    mistore.render(
      {
        type: 'ejs-latex',
        template: 'Hello <%= name %>'
      },
      stream,
      {
        name: 'Tester%^'
      },
      function (error) {
        if (error) {
          done(error);
        } else {
          stream.toString().should.equal('Hello Tester\\%\\textasciicircum{}');
          done();
        }
      }
    );
  });
});
