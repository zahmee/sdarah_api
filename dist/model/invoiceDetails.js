'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var document = new Schema({
  invoice: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'invoice',
    index: true
  },
  item: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'item',
    index: true
  },
  item_id: {
    type: String,
    index: true
  },
  sell: Number,
  count: { type: Number, required: true },
  total: { type: Number, required: true },
  vat: { type: Number, default: 0 },
  net: { type: Number, required: true }
});

module.exports = _mongoose2.default.model("invoiceDetails", document);
//# sourceMappingURL=invoiceDetails.js.map