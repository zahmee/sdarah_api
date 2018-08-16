import mongoose from "mongoose";
const { Schema } = mongoose ;
import passportLocalMongoose from "passport-local-mongoose";
const Account = new Schema({
  username: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  mobile: { type: String, unique: true },
  admin: Boolean ,
  superadmin: Boolean 
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model("Account", Account);
