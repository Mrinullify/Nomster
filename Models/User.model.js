const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  // confirmPassword: { type: String, required: true },
  savedRecipes: [{ type: Number }],
  avatarPic: { type: String },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
