const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    username: String,
    title: String,
    body: String,
    permalink: String,
    tags: Array,
    password: { type: String, default: "" },
    created_at: { type: Date, default: Date.now },
    view: { type: Number, default: 0 },
  },
  {
    collations: "notes",
    timestamps: true,
  }
);

module.exports = mongoose.model("notes", noteSchema);
