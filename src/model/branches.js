import mongoose from "mongoose";
let Schema = mongoose.Schema;


let doc = new Schema({
  name: { type: String , required: true  },
  url: { type: String , required: true },
  tokin: { type: String , required: true },
  is_active: { type: Boolean , default: true }
});

export default mongoose.model("branches", doc);
