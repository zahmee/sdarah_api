'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var item = new Schema({
  id: { type: String, unique: true },
  name: { type: String, index: true },
  cat: {
    type: Schema.Types.ObjectId,
    ref: 'Key'
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: 'Key'
  },
  place: String,
  sell: Number,
  buy: Number,
  max_order: Number,
  reorder: Number,
  vat: Number,
  sell_count: Number,
  return_count: Number,
  real_count: Number,
  is_active: { type: Boolean, default: true },
  last_date_sell: { type: Date, default: Date.now }
});

module.exports = _mongoose2.default.model("Item", item);
//# sourceMappingURL=item.js.map