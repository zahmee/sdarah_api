'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalStrategy = require("passport-local").Strategy;


var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);
_mongoose2.default.Promise = Promise;
//   middleware
//   parse application/json
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json({
    limit: _config2.default.bodyLimit
}));

//   passport config <----------  important
app.use(_passport2.default.initialize());
var Account = require("./model/account");
_passport2.default.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
}, Account.authenticate()));
_passport2.default.serializeUser(Account.serializeUser());
_passport2.default.deserializeUser(Account.deserializeUser());

//   api rounes v1
app.use('/v1', _routes2.default);
app.server.listen(_config2.default.port);
console.log('Start on port ' + app.server.address().port);

exports.default = app;
//# sourceMappingURL=index.js.map