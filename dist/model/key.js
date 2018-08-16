"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var key = new Schema({
  cat: {
    id: {
      type: Number, required: true
    },
    cat_name: {
      type: String, required: true
    }
  },
  disc: { type: String, required: true },
  is_active: { type: Boolean, default: true }
});

module.exports = _mongoose2.default.model("Key", key);
//# sourceMappingURL=key.js.map