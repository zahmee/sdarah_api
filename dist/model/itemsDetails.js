'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var schema = new Schema({
  csBills: {
    type: Schema.Types.ObjectId,
    ref: 'CSBills'
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: 'Item'
  },
  count: { type: Number, required: true },
  buy: { type: Number, required: true },
  sell: { type: Number, required: true },
  sell_count: Number,
  return_count: Number,
  real_count: Number,
  last_date_sell: Date,
  expiration_date: Date,
  item_detail_id: { type: Number, unique: true },
  is_active: { type: Boolean, default: true }
});

module.exports = _mongoose2.default.model("ItemDetails", schema);
//# sourceMappingURL=itemsDetails.js.map