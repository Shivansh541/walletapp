const express = require("express");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const router = express.Router();

// Deposit money into main wallet
router.post("/deposit", async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ msg: "User not found" });

    user.walletBalance += amount;
    await user.save();

    // Log transaction
    await Transaction.create({
      userId,
      type: "deposit",
      amount,
    });

    res.json({ msg: "Deposit successful", walletBalance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Withdraw money from wallet
router.post("/withdraw", async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.rewardWallet < amount) {
      return res.status(400).json({ msg: "Insufficient reward balance" });
    }

    user.rewardWallet -= amount;
    await user.save();

    // Log transaction
    await Transaction.create({
      userId,
      type: "withdraw",
      amount,
      status: "pending", // since payment takes 5 days
    });

    res.json({
      msg: "Withdrawal request submitted. Payment within 5 working days.",
      rewardWallet: user.rewardWallet,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get wallet balance
router.get("/balance/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      walletBalance: user.walletBalance,
      rewardWallet: user.rewardWallet,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.get("/transactions/:userId", async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
module.exports = router;
