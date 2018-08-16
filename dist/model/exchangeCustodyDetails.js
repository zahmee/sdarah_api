'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var document = new Schema({
  exchangeCustody: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'ExchangeCustody',
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
  item_name: String,
  count: { type: Number, required: true }
});

exports.default = _mongoose2.default.model("ExchangeCustodyDetails", document);
//# sourceMappingURL=exchangeCustodyDetails.js.map