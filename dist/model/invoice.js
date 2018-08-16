'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var invoice = new Schema({
  cash_sales: { type: Boolean, default: true },
  people: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'People'
  },
  method: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'Key',
    required: true
  },
  total: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  vat: { type: Number, default: 0 },
  net: { type: Number, required: true },
  is_active: { type: Boolean, default: true },
  billDate: { type: Date, default: Date.now },
  assignedTo: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'Account'
  },
  items: [{}]
});

module.exports = _mongoose2.default.model("Invoice", invoice);
//# sourceMappingURL=invoice.js.map