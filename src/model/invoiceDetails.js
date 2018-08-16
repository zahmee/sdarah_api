import mongoose from "mongoose";
const Schema = mongoose.Schema;

let document = new Schema({
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'invoice',
    index: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'item',
    index: true
  },
  item_id: {
    type: String ,
    index: true
  },
  sell: Number,
  count: { type: Number, required: true },
  total: { type: Number, required: true },
  vat: { type: Number, default: 0 },
  net: { type: Number, required: true },
});

module.exports = mongoose.model("invoiceDetails", document);
