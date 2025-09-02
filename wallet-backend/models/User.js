const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
      role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
    walletBalance: {
      type: Number,
      default: 0, // initial deposit balance
    },
    rewardWallet: {
      type: Number,
      default: 0, // daily 0.5% gets added here
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
