"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _branches = require("../model/branches");

var _branches2 = _interopRequireDefault(_branches);

var _authMiddleware = require("../middleware/authMiddleware");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import bodyParser from 'body-parser' ;

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  // v1/branches/add
  api.post("/add", _authMiddleware.authenticate, _authMiddleware.IsAdmin, function (req, res) {

    var newbranches = new _branches2.default();
    newbranches.name = req.body.name;
    newbranches.url = req.body.url;
    newbranches.tokin = req.body.tokin;
    newbranches.is_active = req.body.is_active;
    newbranches.save(function (err) {
      if (err) {
        return res.send(err);
      }
      return res.json({ message: "saved", _id: newbranches._id });
    });
  });
  //************************* */
  // v1/branches/   -> get all data
  // v1/item/   -> get all data
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
      if (colum === '*') {
        _branches2.default.find().where('id').equals(text).exec(function (err, data) {
          if (data[0]) {
            var s = data[0].toJSON();
            s.add_dirct = true;
            return res.json(s);
          } else {
            var arr = text.split(" ");
            if (arr.length === 1) {
              _branches2.default.find().or([{ name: { $regex: text, $options: 'i' } }, { id: { $regex: text, $options: 'i' } }]).limit(size).skip(size * page).exec(function (err, data) {
                return res.json(data);
              });
            } else if (arr.length > 1) {
              var serch_arr = [];
              arr.forEach(function (element) {
                serch_arr.push({ name: { $regex: element, $options: 'i' } });
              });
              _branches2.default.find().and(serch_arr).limit(size).skip(size * page).exec(function (err, data) {
                return res.json(data);
              });
            }
          }
        });
      } else {
        var sst = '{ "' + colum + '": { "$regex": "' + text + '" , "$options": "i" } }';
        _branches2.default.count(JSON.parse(sst), function (err, countrow) {
          _branches2.default.find(JSON.parse(sst)).limit(size).skip(size * page).exec(function (err, data) {
            if (err) {
              return res.send(err);
            }
            data.push({
              'row_count': countrow
            });
            return res.json(data);
          });
        });
      }
    } else {
      _branches2.default.count(function (err, countrow) {
        _branches2.default.find().skip(size * page).limit(size).exec(function (err, data) {
          if (err) {
            return res.send(err);
          }
          data.push({
            'row_count': countrow
          });
          return res.json(data);
          return res.json(data);
        });
      });
    }
  });
  // /v1/branches/:id
  api.get("/:id", function (req, res) {
    _branches2.default.findById(req.params.id, function (err, branches) {
      if (err) {
        return res.send(err);
      }
      return res.json(branches);
    });
  });
  // /v1/branches/:id    -- put
  api.put("/:id", _authMiddleware.authenticate, function (req, res) {
    _branches2.default.findById(req.params.id, function (err, branches) {
      if (err) {
        res.send(err);
      }
      branches.name = req.body.name;
      branches.url = req.body.url;
      branches.tokin = req.body.tokin;
      branches.is_active = req.body.is_active;
      branches.save(function (err) {
        if (err) {
          return res.send(err);
        }
        return res.json({ message: "update" });
      });
    });
  });
  // /v1/branches/:id    -- delete
  api.delete("/:id", _authMiddleware.authenticate, function (req, res) {
    _branches2.default.remove({ _id: req.params.id }, function (err, branches) {
      if (err) {
        return res.send(err);
      }
      return res.json({ message: "remove" });
    });
  });
  //====================================================
  return api;
};
//# sourceMappingURL=branches.js.map