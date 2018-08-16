import mongoose from "mongoose";
const Schema = mongoose.Schema;

let document = new Schema({
  people: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'People',
    required: true
  },
  method: {
    type: mongoose.Schema.Types.ObjectId,
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
    type: mongoose.Schema.Types.ObjectId,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  memo: String,
  is_active: { type: Boolean, default: true },
  is_open: { type: Boolean, default: true },
});

module.exports = mongoose.model("CSBills", document);
