import mongoose from "mongoose";
const Schema = mongoose.Schema;
let schema = new Schema({
  csBills: {
    type: Schema.Types.ObjectId,
    ref: 'CSBills'
  },
  item:{
    type: Schema.Types.ObjectId,
    ref: 'Item'
  } ,
  count: { type: Number, required: true },
  buy: { type: Number, required: true },
  sell: { type: Number, required: true },
  sell_count: Number,
  return_count: Number,
  real_count: Number,
  last_date_sell: Date,
  expiration_date: Date,
  item_detail_id: { type: Number , unique: true },
  is_active: { type: Boolean, default:true },
});

module.exports = mongoose.model("ItemDetails", schema);
