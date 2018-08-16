"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _csBills = require("../model/csBills");

var _csBills2 = _interopRequireDefault(_csBills);

var _authMiddleware = require("../middleware/authMiddleware");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moment = require('moment-timezone');

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // v1/csbills/add
  api.post("/add", _authMiddleware.authenticate, function (req, res) {
    var newRow = new _csBills2.default();
    newRow.people = req.body.people;
    newRow.method = req.body.method;
    newRow.billNo = req.body.billNo;
    newRow.total = req.body.total;
    newRow.discount = req.body.discount;
    newRow.net = req.body.net;
    var inv_date = req.body.inv_date_d;
    newRow.billDate = inv_date.year + '-' + inv_date.month + '-' + inv_date.day;
    newRow.dateOfPayment = req.body.dateofpayment;
    newRow.assignedTo = req.body.assignedto;
    newRow.memo = req.body.memo;
    newRow.is_active = req.body.is_active;
    newRow.debit_credit_id = req.body.debit_credit_id;
    newRow.debit_credit_dis = req.body.debit_credit_dis;
    newRow.billtype = req.body.billtype;
    newRow.vat = req.body.vat;
    newRow.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.json({ message: "saved", _id: newRow._id });
      }
    });
  });

  // v1/csbills/   -> get all data
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
      _csBills2.default.count(JSON.parse(sst), function (err, countrow) {
        if (countrow) {
          _csBills2.default.find(JSON.parse(sst)).populate({
            path: 'people',
            select: 'name -_id',
            options: {
              limit: size,
              skip: size * page
            }
          }).select({
            "people": 1,
            "billNo": 1,
            "net": 1
          }).exec(function (err, data) {
            if (err) {
              res.send(err);
            }
            data.push({
              'row_count': countrow ? countrow : 0
            });
            res.json(data);
          });
        } else {
          res.json([{ row_count: 0 }]);
        }
      });
    } else {
      _csBills2.default.count(function (err, countrow) {
        var query = _csBills2.default.find().populate({
          path: 'people',
          select: 'name -_id',
          options: {
            limit: size,
            skip: size * page
          }
        }).select({
          "people": 1,
          "billNo": 1,
          "net": 1
        });
        query.exec(function (err, data) {
          if (err) {
            res.send(err);
          }
          data.push({
            'row_count': countrow
          });
          res.json(data);
        });
      });
    }
  });

  // v1/csbills/   -> get all data
  api.get("/coded", function (req, res) {
    _csBills2.default.count({ 'is_active': true, 'is_open': true }, function (err, countrow) {
      var query = _csBills2.default.find({ 'is_active': true, 'is_open': true }).populate({
        path: 'people',
        select: 'name -_id'
      }).populate({
        path: 'method',
        select: 'disc -_id'
      }).populate({
        path: 'billtype',
        select: 'disc -_id'
      }).select({
        "people": 1,
        "method": 1,
        "billtype": 1,
        "billNo": 1,
        "net": 1,
        "debit_credit_dis": 1
      });
      query.exec(function (err, data) {
        if (err) {
          res.send(err);
        }
        data.push({
          'row_count': countrow
        });
        res.json(data);
      });
    });
  });
  // v1/csbills/:id   -> get one row
  api.get("/coded/:id", function (req, res) {
    var query = _csBills2.default.findById(req.params.id).populate({
      path: 'people',
      select: 'name -_id'
    }).populate({
      path: 'method',
      select: 'disc -_id'
    }).populate({
      path: 'billtype',
      select: 'disc -_id'
    }).select({
      "people": 1,
      "method": 1,
      "billtype": 1,
      "billNo": 1,
      "net": 1,
      "debit_credit_dis": 1
    });
    query.exec(function (err, data) {
      if (err) {
        res.send(err);
      } else {
        res.json(data);
      }
    });
  });
  // v1/csbills/:id    git 1 csBill row
  api.get("/:id", function (req, res) {
    _csBills2.default.findById(req.params.id, function (err, row) {
      if (err) {
        res.send(err);
      } else {
        row.billDate = moment.tz(row.billDate, "Asia/Riyadh");
        res.json(row);
      }
    });
  });

  // /v1/csBills/:id    -- put
  api.put("/:id", _authMiddleware.authenticate, function (req, res) {
    _csBills2.default.findById(req.params.id, function (err, editRow) {
      if (err) {
        res.send(err);
      } else {
        editRow.people = req.body.people;
        editRow.method = req.body.method;
        editRow.billNo = req.body.billNo;
        editRow.total = req.body.total;
        editRow.discount = req.body.discount;
        editRow.net = req.body.net;
        var inv_date = req.body.inv_date_d;
        editRow.billDate = inv_date.year + '-' + inv_date.month + '-' + inv_date.day;
        editRow.dateOfPayment = req.body.dateofpayment;
        editRow.assignedTo = req.body.assignedto;
        editRow.memo = req.body.memo;
        editRow.is_active = req.body.is_active;
        editRow.debit_credit_id = req.body.debit_credit_id;
        editRow.debit_credit_dis = req.body.debit_credit_dis;
        editRow.billtype = req.body.billtype;
        editRow.vat = req.body.vat;
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

  // /v1/csBills/:id    -- put
  api.put("/close/:id", _authMiddleware.authenticate, function (req, res) {
    _csBills2.default.findById(req.params.id, function (err, editRow) {
      if (err) {
        res.send(err);
      } else {
        editRow.is_open = false;
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

  // /v1/csBills/:id    -- delete
  api.delete("/:id", _authMiddleware.authenticate, function (req, res) {
    _csBills2.default.remove({ _id: req.params.id }, function (err, key) {
      if (err) {
        res.send(err);
      }
      res.json({ message: "remove" });
    });
  });
  //====================================================

  return api;
};
//# sourceMappingURL=csBills.js.map