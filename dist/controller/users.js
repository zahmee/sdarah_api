"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _account = require("../model/account");

var _account2 = _interopRequireDefault(_account);

var _authMiddleware = require("../middleware/authMiddleware");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    //   v1/users/              ->   git all users
    api.get("/", _authMiddleware.authenticate, _authMiddleware.IsAdmin, function (req, res) {
        _account2.default.find({}, function (err, allusers) {
            if (err) {
                res.send(err);
            }
            res.json(allusers);
        });
    });

    // v1/users/:id            -> delete user by id
    api.delete("/:id", _authMiddleware.authenticate, _authMiddleware.IsAdmin, function (req, res) {
        _account2.default.remove({ _id: req.params.id }, function (err, user) {
            if (err) {
                res.send(err);
            }
            res.json({ message: "remove" });
        });
    });

    // /v1/users/:id    --> edit user data
    api.put("/:id", _authMiddleware.authenticate, _authMiddleware.IsAdmin, function (req, res) {
        _account2.default.findById(req.params.id, function (err, user) {
            if (err) {
                res.send(err);
            }
            user.name = req.body.name;
            user.username = req.body.username;
            user.mobile = req.body.mobile;
            user.admin = req.body.admin;
            user.superadmin = req.body.superadmin;
            user.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: "update" });
            });
        });
    });
    // <========================================================> \\
    return api;
};
// import passport from "passport";
// import config from "../config/";
//# sourceMappingURL=users.js.map