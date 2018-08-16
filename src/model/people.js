import mongoose from "mongoose";
const Schema = mongoose.Schema;

let document = new Schema({
  name: { type: String, index: true, required: true } ,
  cat_id: { type: Number, required: true} ,
  cat_dis: { type: String, required: true} ,
  manager: String,
  mobile: String ,
  address: String ,
  bankname: String ,
  accountno: String ,
  memo: String ,
  tel:String ,
  is_active: { type: Boolean, default:true },
  maxOrder: { type: Number, default: 0 },
});

module.exports = mongoose.model("People", document);
