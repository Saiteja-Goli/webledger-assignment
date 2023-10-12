const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: String,
  displayName: String,
  photoURL: String,
});
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
