import mongoose from "mongoose";
const Schema = mongoose.Schema;

let document = new Schema({
  branches: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'branches',
  },
  branches_name: { type: String , required: true },
  signature: String ,
  signature_date : Date ,
  is_active: { type: Boolean, default:true },
  billDate: { type: Date, default: Date.now },
  state : {
    id: Number ,
    disc: String 
  },
});

export default mongoose.model("ExchangeCustody", document);
