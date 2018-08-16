"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _key = require("../model/key");

var _key2 = _interopRequireDefault(_key);

var _authMiddleware = require("../middleware/authMiddleware");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import bodyParser from 'body-parser' ;

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  // v1/key/add
  api.post("/add", _authMiddleware.authenticate, _authMiddleware.IsAdmin, function (req, res) {

    var newKey = new _key2.default();
    newKey.cat.id = req.body.cat.id;
    newKey.cat.cat_name = req.body.cat.cat_name;
    newKey.disc = req.body.disc;
    newKey.is_active = req.body.is_active;
    newKey.save(function (err) {
      if (err) {
        return res.send(err);
      }
      return res.json({ message: "saved", _id: newKey._id });
    });
  });
  //************************* */
  api.get("/t", function (req, res) {

    var newKey = new _key2.default();
    newKey.cat.id = 1;
    newKey.cat.cat_name = 'ahmed ';
    newKey.disc = 'zahmah';
    newKey.is_active = true;
    newKey.save(function (err) {
      if (err) {
        return res.send(err);
      }
      return res.json({ message: "saved" });
    });
  });
  // v1/key/   -> get all data
  api.get("/", function (req, res) {
    _key2.default.find({}, function (err, key) {
      if (err) {
        return res.send(err);
      }
      return res.json(key);
    });
  });
  // /v1/key/:id
  api.get("/:id", function (req, res) {
    _key2.default.findById(req.params.id, function (err, key) {
      if (err) {
        return res.send(err);
      }
      return res.json(key);
    });
  });
  // /v1/key/:id    -- put
  api.put("/:id", _authMiddleware.authenticate, function (req, res) {
    _key2.default.findById(req.params.id, function (err, key) {
      if (err) {
        res.send(err);
      }
      key.disc = req.body.disc;
      key.is_active = req.body.is_active;
      key.save(function (err) {
        if (err) {
          return res.send(err);
        }
        return res.json({ message: "update" });
      });
    });
  });
  // /v1/key/:id    -- delete
  api.delete("/:id", _authMiddleware.authenticate, function (req, res) {
    _key2.default.remove({ _id: req.params.id }, function (err, key) {
      if (err) {
        return res.send(err);
      }
      return res.json({ message: "remove" });
    });
  });
  //====================================================
  return api;
};
//# sourceMappingURL=key.js.map