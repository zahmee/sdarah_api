import mongoose from "mongoose";
const Schema = mongoose.Schema;

let item = new Schema({
  id: { type: String, unique: true } ,
  name: { type: String, index: true } ,
  cat: {
    type: Schema.Types.ObjectId,
    ref: 'Key'
   },
   unit:{
     type: Schema.Types.ObjectId,
     ref: 'Key'
   } ,
  place: String,
  sell: Number ,
  buy: Number ,
  max_order: Number ,
  reorder: Number ,
  vat:Number ,
  sell_count: Number,
  return_count: Number,
  real_count: Number ,
  is_active: { type: Boolean, default:true },
  last_date_sell: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Item", item);
