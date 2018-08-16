"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var document = new Schema({
  name: { type: String, index: true, required: true },
  cat_id: { type: Number, required: true },
  cat_dis: { type: String, required: true },
  manager: String,
  mobile: String,
  address: String,
  bankname: String,
  accountno: String,
  memo: String,
  tel: String,
  is_active: { type: Boolean, default: true },
  maxOrder: { type: Number, default: 0 }
});

module.exports = _mongoose2.default.model("People", document);
//# sourceMappingURL=people.js.map