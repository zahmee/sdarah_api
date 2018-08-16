import mongoose from "mongoose";
const { Schema } = mongoose ;
const key = new Schema({
  cat: {
    id: {
      type: Number, required: true
    },
    cat_name: {
      type: String, required: true
    }
  },
  disc: { type: String, required: true },
  is_active: { type: Boolean, default: true }
});
export default mongoose.model("Key", key);
