const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GamesSchema = new Schema({
  user_id: { type: String, required: true },
  user2_id: { type: String, required: false },
  type: { type: String, required: true },
  history: { type: Array, required: false },
  status: { type: String, required: false }
});
module.exports = mongoose.model("Games", GamesSchema);
