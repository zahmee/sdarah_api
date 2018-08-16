"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var doc = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  tokin: { type: String, required: true },
  is_active: { type: Boolean, default: true }
});

exports.default = _mongoose2.default.model("branches", doc);
//# sourceMappingURL=branches.js.map