"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _itemsDetails = require("../model/itemsDetails");

var _itemsDetails2 = _interopRequireDefault(_itemsDetails);

var _authMiddleware = require("../middleware/authMiddleware");

var _randomId = require("random-id");

var _randomId2 = _interopRequireDefault(_randomId);

var _item = require("../model/item");

var _item2 = _interopRequireDefault(_item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const moment = require('moment-timezone');

var id = (0, _randomId2.default)(13, "0");

var check_id = function check_id(req, res, next) {
  _itemsDetails2.default.findOne({ item_detail_id: id }).exec(function (err, date) {
    if (err) {
      return res.status(401).send(err);
    }
    if (!date) {
      next();
    } else {
      id = (0, _randomId2.default)(13, "0");
      next();
    }
  });
};

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;


  var api = (0, _express.Router)();

  // v1/itemsDetails/add
  api.post("/add", _authMiddleware.authenticate, check_id, function (req, res) {
    var newRow = new _itemsDetails2.default();
    newRow.csBills = req.body.csBills;
    newRow.item = req.body.item;
    newRow.count = req.body.count;
    newRow.buy = req.body.buy;
    newRow.sell = req.body.sell;
    newRow.sell_count = 0;
    newRow.return_count = 0;
    newRow.real_count = req.body.count;
    newRow.item_detail_id = id;
    newRow.last_date_sell = new Date();
    if (req.body.expiration_date) {
      var temp_date = req.body.expiration_date;
      newRow.expiration_date = temp_date.year + '-' + temp_date.month + '-' + temp_date.day;
    }
    newRow.save(function (err) {
      if (err) {
        return res.send(err);
      } else {
        return res.json({ message: "saved", _id: newRow._id });
      }
    });
  });

  // ======================   invoce   ==============================
  // v1/itemsDetails/invoc
  api.get("/invoc", function (req, res) {
    var size = 20;
    var page = 0;
    var colum = "";
    var text = "";
    req.query.page ? page = parseInt(req.query.page) : page = 0;
    req.query.size ? size = parseInt(req.query.size) : size = 20;
    req.query.colum ? colum = req.query.colum : colum = "";
    req.query.text ? text = req.query.text : text = "";
    var g = Number(text);
    if (Number.isInteger(g)) {
      var query = _itemsDetails2.default.findOne({ 'is_active': true, 'item_detail_id': parseInt(text), 'real_count': { $gt: 0 } }).populate({
        path: 'csBills',
        select: 'billNo'
      }).populate({
        path: 'item',
        select: 'name vat'
      }).populate({
        path: 'Key',
        select: 'disc -_id'
      });
      query.exec(function (err, data) {
        if (err) {
          return res.send(err);
        }
        if (data) {
          var s = data.toJSON();
          s.add_dirct = true;
          return res.json(s);
        } else {
          //<========================>  البحث بحلول أخرى 
          _item2.default.find().where('id').equals(text).exec(function (err, data) {
            if (data[0]) {

              // s.add_dirct = false ;
              // <-->   اذا حصل رقم الصنف يحضر جميع الوحدات المدخلة له  <==>
              // console.log(data);
              _itemsDetails2.default.find({ 'is_active': true, 'item': data[0]._id, 'real_count': { $gt: 0 } }).populate({
                path: 'csBills',
                select: 'billNo'
              }).populate({
                path: 'item',
                select: 'name vat'
              }).populate({
                path: 'Key',
                select: 'disc -_id'
              }).exec(function (err, itm_data) {
                // console.log(itm_data);
                if (itm_data.length === 1) {
                  var _s = itm_data[0].toJSON();
                  _s.add_dirct = true;
                  return res.json(_s);
                } else {
                  return res.json(itm_data);
                }
              });
              //==================================================================>><<
            } else {
              var arr = text.split(" ");
              if (arr.length === 1) {
                _item2.default.find().or([{ name: { $regex: text, $options: 'i' } }, { id: { $regex: text, $options: 'i' } }]).limit(size).skip(size * page).exec(function (err, data) {
                  return res.json(data);
                });
              } else if (arr.length > 1) {
                var serch_arr = [];
                arr.forEach(function (element) {
                  serch_arr.push({ name: { $regex: element, $options: 'i' } });
                });
                _item2.default.find().and(serch_arr).limit(size).skip(size * page).exec(function (err, data) {
                  return res.json(data);
                });
              }
            }
          });
          //<==========================================================>
          // return res.json(data);
        }
      });
    } else {
      _item2.default.find().where('id').equals(text).exec(function (err, data) {
        if (data[0]) {
          // s.add_dirct = false ;
          // <-->   اذا حصل رقم الصنف يحضر جميع الوحدات المدخلة له  <==>
          console.log(data);
          _itemsDetails2.default.find({ 'is_active': true, 'item': data[0]._id, 'real_count': { $gt: 0 } }).populate({
            path: 'csBills',
            select: 'billNo'
          }).populate({
            path: 'item',
            select: 'name vat'
          }).populate({
            path: 'Key',
            select: 'disc -_id'
          }).exec(function (err, itm_data) {
            console.log(itm_data);
            if (itm_data.length === 1) {
              var s = itm_data[0].toJSON();
              s.add_dirct = true;
              return res.json(s);
            } else {
              return res.json(itm_data);
            }
          });
          //==================================================================>><<
        } else {
          var arr = text.split(" ");
          if (arr.length === 1) {
            _item2.default.find().or([{ name: { $regex: text, $options: 'i' } }, { id: { $regex: text, $options: 'i' } }]).limit(size).skip(size * page).exec(function (err, data) {
              return res.json(data);
            });
          } else if (arr.length > 1) {
            var serch_arr = [];
            arr.forEach(function (element) {
              serch_arr.push({ name: { $regex: element, $options: 'i' } });
            });
            _item2.default.find().and(serch_arr).limit(size).skip(size * page).exec(function (err, data) {
              return res.json(data);
            });
          }
        }
      });
    }
  });

  // v1/itemsDetails/:id   -> get all data
  api.get("/:id", function (req, res) {
    _itemsDetails2.default.find({ csBills: req.params.id }).populate({
      path: 'item',
      select: 'name _id'
    }).exec(function (err, data) {
      if (err) {
        return res.send(err);
      }
      return res.json(data);
    });
  });

  // /v1/itemsDetails/:id    -- put
  api.put("/:id", _authMiddleware.authenticate, function (req, res) {
    _itemsDetails2.default.findById(req.params.id, function (err, editRow) {
      if (err) {
        return res.send(err);
      } else {
        editRow.csBills = req.body.csBills;
        editRow.item = req.body.item._id;
        editRow.count = req.body.count;
        editRow.buy = req.body.buy;
        editRow.sell = req.body.sell;
        editRow.real_count = req.body.count;
        editRow.last_date_sell = new Date();
        var temp_date = req.body.expiration_date;
        editRow.expiration_date = temp_date.year + '-' + temp_date.month + '-' + temp_date.day;
        editRow.save(function (err) {
          if (err) {
            return res.send(err);
          } else {
            return res.json({ message: "update" });
          }
        });
      }
    });
  });

  // /v1/itemsDetails/:id    -- delete
  api.delete("/:id", _authMiddleware.authenticate, function (req, res) {
    _itemsDetails2.default.remove({ _id: req.params.id }, function (err, key) {
      if (err) {
        return res.send(err);
      }
      return res.json({ message: "remove" });
    });
  });

  return api;
};
//# sourceMappingURL=itemsDetails.js.map