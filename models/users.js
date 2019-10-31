const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  username: { type: String, required: true },
  fullname: { type: String, required: true },
  avatar: { type: String, required: false },
  email: { type: String, required: false },
  password: { type: String, default: true }
});
module.exports = mongoose.model("Users", UsersSchema);
