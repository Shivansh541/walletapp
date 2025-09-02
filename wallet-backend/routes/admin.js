const express = require("express");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const router = express.Router();

// Get all pending withdrawals
router.get("/withdrawals/pending", async (req, res) => {
  try {
    const pending = await Transaction.find({ type: "withdraw", status: "pending" })
      .populate("userId", "email rewardWallet");
    res.json(pending);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Mark withdrawal as completed or failed
router.put("/withdrawals/:id", async (req, res) => {
  try {
    const { status } = req.body; // "completed" or "failed"

    if (!["completed", "failed"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const txn = await Transaction.findById(req.params.id).populate("userId");
    if (!txn) return res.status(404).json({ msg: "Transaction not found" });

    if (txn.type !== "withdraw") {
      return res.status(400).json({ msg: "Not a withdrawal transaction" });
    }

    // ✅ Refund if failed
    if (status === "failed") {
      txn.userId.rewardWallet += txn.amount;
      await txn.userId.save();
    }

    txn.status = status;
    await txn.save();

    res.json({ msg: `Withdrawal marked as ${status}`, txn });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
