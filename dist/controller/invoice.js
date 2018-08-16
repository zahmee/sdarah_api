"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _invoice = require("../model/invoice");

var _invoice2 = _interopRequireDefault(_invoice);

var _invoiceDetails = require("../model/invoiceDetails");

var _invoiceDetails2 = _interopRequireDefault(_invoiceDetails);

var _authMiddleware = require("../middleware/authMiddleware");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;


  var api = (0, _express.Router)();

  // v1/invoice/add
  api.post("/add", _authMiddleware.authenticate, function (req, res) {

    var newRow = new _invoice2.default();

    newRow.cash_sales = req.body.peopelSelected === 100 ? true : false;
    newRow.people = req.body.peopelSelected_id;
    newRow.method = req.body.payway;
    newRow.total = req.body.invTotal;
    newRow.discount = req.body.dicount;
    newRow.vat = req.body.invVAT;
    newRow.net = req.body.invNetTotal;
    newRow.is_active = true;
    newRow.assignedTo = req.user.id;
    newRow.items = req.body.invDataRow;
    newRow.save(function (err) {
      if (err) {
        return res.send(err);
      } else {
        req.body.invDataRow.forEach(function (el) {
          var newDetialRow = new _invoiceDetails2.default();
          newDetialRow.invoice = newRow._id;
          newDetialRow.item = el._id;
          newDetialRow.item_id = el.item_id;
          newDetialRow.sell = el.sell;
          newDetialRow.count = el.count;
          newDetialRow.total = el.total;
          if (el.vat) {
            newDetialRow.vat = el.vat;
            newDetialRow.net = el.total + el.vat * el.total;
          } else {
            newDetialRow.vat = 0;
            newDetialRow.net = el.total + 0.0 * el.total;
          }
          newDetialRow.save(function (err) {
            if (err) {
              return res.send(err);
            }
          });
        });
        return res.json({ message: "saved", _id: newRow._id });
      }
    });
  });

  // ======================   invoce   ==============================
  // v1/itemsDetails/inv   -> get all data
  api.get("/invoc", function (req, res) {
    var query = itemsDetails.findOne({ 'is_active': true, 'item_detail_id': req.query.item_id, 'real_count': { $gt: 0 } }).populate({
      path: 'csBills',
      select: 'billNo'
    }).populate({
      path: 'item',
      select: 'name vat'
    }).populate({
      path: 'Key',
      select: 'disc -_id'
    });
    /*.select({
    "buy": 1,
    "csBills": 1,
    "expiration_date": 1,
    "item": 1,
      "item_detail_id": 1,
      "real_count": 1,
      "sell": 1,
      
    }) ; */
    query.exec(function (err, data) {
      if (err) {
        return res.send(err);
      }
      if (data) {
        var s = data.toJSON();
        s.add_dirct = true;
        return res.json(s);
      } else {
        return res.json(data);
      }
    });
  });

  // v1/itemsDetails/:id   -> get all data
  api.get("/:id", function (req, res) {
    itemsDetails.find({ csBills: req.params.id }).populate({
      path: 'item',
      select: 'name _id'
    }).exec(function (err, data) {
      if (err) {
        return res.send(err);
      }
      return res.json(data);
    });
  });

  return api;
};
//# sourceMappingURL=invoice.js.map