import mongoose from "mongoose";
const Schema = mongoose.Schema;

let document = new Schema({
  exchangeCustody: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExchangeCustody',
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
  item_name: String,
  count: { type: Number, required: true },
});

export default mongoose.model("ExchangeCustodyDetails", document);
