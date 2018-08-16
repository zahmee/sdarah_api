"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _people = require("../model/people");

var _people2 = _interopRequireDefault(_people);

var _authMiddleware = require("../middleware/authMiddleware");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // v1/peoples/add
  api.post("/add", _authMiddleware.authenticate, function (req, res) {
    var newRow = new _people2.default();
    newRow.name = req.body.name;
    newRow.cat_id = req.body.cat_id;
    if (req.body.cat_id === "1") {
      newRow.cat_dis = "عميل";
    } else {
      newRow.cat_dis = "مورد";
    }
    newRow.manager = req.body.manager;
    newRow.mobile = req.body.mobile;
    newRow.address = req.body.address;
    newRow.bankname = req.body.bankname;
    newRow.accountno = req.body.accountno;
    newRow.memo = req.body.memo;
    newRow.tel = req.body.tel;
    newRow.is_active = req.body.is_active;
    newRow.maxOrder = req.body.maxOrder;
    newRow.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.json({ message: "saved", _id: newRow._id });
      }
    });
  });

  // v1/peoples/   -> get all data
  api.get("/", function (req, res) {
    var size = 20;
    var page = 0;
    var colum = "";
    var text = "";
    req.query.page ? page = parseInt(req.query.page) : page = 0;
    req.query.size ? size = parseInt(req.query.size) : size = 20;
    req.query.colum ? colum = req.query.colum : colum = "";
    req.query.text ? text = req.query.text : text = "";

    if (colum && text) {
      var sst = '{ "' + colum + '": { "$regex": "' + text + '" , "$options": "i" } }';
      _people2.default.count(JSON.parse(sst), function (err, countrow) {
        _people2.default.find(JSON.parse(sst), function (err, data) {
          if (err) {
            res.send(err);
          }
          data.push({
            'row_count': countrow
          });
          res.json(data);
        }).limit(size).skip(size * page);
      });
    } else {
      _people2.default.count(function (err, countrow) {
        _people2.default.find(function (err, data) {
          if (err) {
            res.send(err);
          }
          data.push({
            'row_count': countrow
          });
          res.json(data);
        }).limit(size).skip(size * page);
      });
    }
  });

  // /v1/peoples/:id    -- put
  api.put("/:id", _authMiddleware.authenticate, function (req, res) {
    _people2.default.findById(req.params.id, function (err, editRow) {
      if (err) {
        res.send(err);
      } else {
        editRow.name = req.body.name;
        editRow.cat_id = req.body.cat_id;
        if (req.body.cat_id === "1") {
          editRow.cat_dis = "عميل";
        } else {
          editRow.cat_dis = "مورد";
        }
        editRow.manager = req.body.manager;
        editRow.mobile = req.body.mobile;
        editRow.address = req.body.address;
        editRow.bankname = req.body.bankname;
        editRow.accountno = req.body.accountno;
        editRow.memo = req.body.memo;
        editRow.tel = req.body.tel;
        editRow.is_active = req.body.is_active;
        editRow.maxOrder = req.body.maxOrder;
        editRow.save(function (err) {
          if (err) {
            res.send(err);
          } else {
            res.json({ message: "update" });
          }
        });
      }
    });
  });

  // /v1/Peoples/:id    -- delete
  api.delete("/:id", _authMiddleware.authenticate, function (req, res) {
    _people2.default.remove({ _id: req.params.id }, function (err, row) {
      if (err) {
        res.send(err);
      }
      res.json({ message: "remove" });
    });
  });
  //====================================================

  return api;
};
//# sourceMappingURL=people.js.map