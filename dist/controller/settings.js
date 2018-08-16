"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _settings = require("../model/settings");

var _settings2 = _interopRequireDefault(_settings);

var _authMiddleware = require("../middleware/authMiddleware");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    //   v1/settings/              ->   git settings
    // authenticate, IsAdmin,
    api.get("/", function (req, res) {
        _settings2.default.countDocuments({}, function (err, c) {
            if (err) {
                res.send(err);
            } else {
                // res.json(allusers);
                if (c === 0) {
                    var newSetting = new _settings2.default();
                    newSetting.name = 'اسم الفرع ';
                    newSetting.save(function (err) {
                        if (err) {
                            res.send(err);
                        }
                        res.json(newSetting);
                    });
                } else {
                    _settings2.default.findOne({}, function (err, doc) {
                        res.json(doc);
                    });
                }
            }
        });
    });

    // /v1/users/:id    --> edit user data
    api.put("/", _authMiddleware.authenticate, _authMiddleware.IsAdmin, function (req, res) {
        _settings2.default.findOne({}, function (err, general) {
            if (err) {
                res.send(err);
            }
            general.name = req.body.name;
            general.vat = req.body.vat;
            general.tel = req.body.tel;
            general.memo = req.body.memo;
            general.address = req.body.address;
            general.branch_no = req.body.branch_no;
            general.main_branch = req.body.main_branch;
            general.vat_ok = req.body.vat_ok;
            general.vat_rate = req.body.vat_rate;
            general.vat_for_all = req.body.vat_for_all;
            general.expiration_date_required = req.body.expiration_date_required;
            general.direct_sale = req.body.direct_sale;
            general.has_discount = req.body.has_discount;
            general.discount_rate = req.body.discount_rate;
            general.sell_old_first = req.body.sell_old_first;
            general.short_invoice = req.body.short_invoice;

            general.save(function (err) {
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
//# sourceMappingURL=settings.js.map