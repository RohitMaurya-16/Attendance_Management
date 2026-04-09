const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    userCode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    department: {
      type: String,
      trim: true
    },
    className: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

