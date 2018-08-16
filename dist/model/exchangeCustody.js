"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var document = new Schema({
  branches: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'branches'
  },
  branches_name: { type: String, required: true },
  signature: String,
  signature_date: Date,
  is_active: { type: Boolean, default: true },
  billDate: { type: Date, default: Date.now },
  state: {
    id: Number,
    disc: String
  }
});

exports.default = _mongoose2.default.model("ExchangeCustody", document);
//# sourceMappingURL=exchangeCustody.js.map