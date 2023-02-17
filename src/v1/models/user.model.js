const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    total: { type: Number, default: 0 },
    avatar: {
      type: String,
      default:
        "https://64.media.tumblr.com/b21486111f59fc337d5aacffb69fd3ad/3e4b9bffcc0b93d5-2b/s640x960/287eadc3a74b892b1d438253fa2a8188e6d6ee49.jpg",
    },
    roles: {
      type: [String],
      enum: ["admin", "root", "user"],
      default: ["user"],
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
