const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userTokenSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  token: { type: String, required: true },
  created_at: { type: Date, default: Date.now, expires: 30 * 86400 },
});

module.exports = mongoose.model("user_tokens", userTokenSchema);
