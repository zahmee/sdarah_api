'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var document = new Schema({
  people: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'People',
    required: true
  },
  method: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'Key',
    required: true
  },
  debit_credit_id: {
    type: Number,
    required: true
  },
  debit_credit_dis: {
    type: String,
    required: true
  },
  billtype: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'Key',
    required: true
  },
  billNo: { type: String, required: true },
  total: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  vat: { type: Number, default: 0 },
  net: { type: Number, required: true },
  billDate: { type: Date, default: Date.now },
  dateOfPayment: { type: Date },
  assignedTo: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'Account'
  },
  memo: String,
  is_active: { type: Boolean, default: true },
  is_open: { type: Boolean, default: true }
});

module.exports = _mongoose2.default.model("CSBills", document);
//# sourceMappingURL=csBills.js.map