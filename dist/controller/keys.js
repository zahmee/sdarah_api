"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _key = require("../model/key");

var _key2 = _interopRequireDefault(_key);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import mongoose from "mongoose";
//import bodyParser from 'body-parser' ;

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();
    // v1/keys/   -> get all data
    api.get("/", function (req, res) {
        _key2.default.find({}, function (err, key) {
            if (err) {
                res.send(err);
            }
            res.json(key);
        });
    });
    // /v1/keys/:id
    api.get("/:id", function (req, res) {
        _key2.default.find({ "cat.id": req.params.id }, function (err, key) {
            if (err) {
                res.send(err);
            }
            res.json(key);
        });
    });
    //====================================================
    return api;
};
//# sourceMappingURL=keys.js.map