"use strict";

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _expressJwt = require("express-jwt");

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _account = require("../model/account");

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TOKENTIME = 60 * 60 * 24 * 356;
var SECRET = "ZaHmEe!1@2 AfMnIsH 1243b";

var authenticate = (0, _expressJwt2.default)({ secret: SECRET });

var IsAdmin = function IsAdmin(req, res, next) {
    _account2.default.findById(req.user.id, '-__v', function (err, user) {
        if (err) {
            return res.status(401).send(err);
        }
        if (user.admin === true) {
            next();
        } else {
            res.end();
        }
    });
};
var generateAccessToken = function generateAccessToken(req, res, next) {
    req.token = req.token || {};
    req.token = _jsonwebtoken2.default.sign({
        id: req.user.id
    }, SECRET, {
        expiresIn: TOKENTIME
    });
    next();
};

var onlyToken = function onlyToken(id) {
    return _jsonwebtoken2.default.sign({
        id: id
    }, SECRET, {
        expiresIn: TOKENTIME
    });
};

var respond = function respond(req, res) {
    res.status(200).json({
        user: req.user.username,
        token: req.token
    });
};

module.exports = {
    authenticate: authenticate,
    generateAccessToken: generateAccessToken,
    respond: respond,
    onlyToken: onlyToken,
    IsAdmin: IsAdmin
};
//# sourceMappingURL=authMiddleware.js.map