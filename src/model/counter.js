import mongoose from "mongoose";
const Schema = mongoose.Schema;

let counter = new Schema({
  seq_name: { type: String, required: true },
  sequence_value: { type: Number, required: true },
});

module.exports = mongoose.model("counter", counter);
