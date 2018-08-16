import mongoose from "mongoose";
const Schema = mongoose.Schema;

let invoice = new Schema({
  cash_sales: { type: Boolean, default: true },
  people: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'People',
  },
  method: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Key',
    required: true
  },
  total: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  vat: { type: Number, default: 0 },
  net: { type: Number, required: true },
  is_active: { type: Boolean, default:true },
  billDate: { type: Date, default: Date.now },
  assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  items : [{}] ,
});

module.exports = mongoose.model("Invoice", invoice);
