"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var Settings = new Schema({
  name: String,
  tel: String,
  address: String,
  vat: String,
  memo: String,
  branch_no: String,
  vat_ok: { type: Boolean, default: true },
  main_branch: { type: Boolean, default: true },
  vat_for_all: { type: Boolean, default: true },
  expiration_date_required: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  vat_rate: { type: Number, default: 0.05 },
  direct_sale: { type: Boolean, default: true },
  has_discount: { type: Boolean, default: true },
  discount_rate: { type: Number, default: 0.05 },
  sell_old_first: { type: Boolean, default: true },
  short_invoice: { type: Boolean, default: true }
});

module.exports = _mongoose2.default.model("Settings", Settings);
//# sourceMappingURL=settings.js.map