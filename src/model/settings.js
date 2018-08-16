import mongoose from "mongoose";
const Schema = mongoose.Schema;

let Settings = new Schema({
  name: String,
  tel: String,
  address: String,
  vat: String ,
  memo: String ,
  branch_no: String ,
  vat_ok: { type: Boolean, default: true },
  main_branch: { type: Boolean, default: true },
  vat_for_all: { type: Boolean, default: true },
  expiration_date_required: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true } ,
  vat_rate: { type: Number , default: 0.05 }, 
  direct_sale: { type: Boolean, default: true } ,
  has_discount: { type: Boolean, default: true } ,
  discount_rate: { type: Number, default: 0.05 } ,
  sell_old_first: { type: Boolean, default: true } ,
  short_invoice: { type: Boolean, default: true } ,
});

module.exports = mongoose.model("Settings", Settings);
