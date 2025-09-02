const cron = require("node-cron");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// Run at 12 AM every day
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily reward job...");

  const users = await User.find();

  for (let user of users) {
    const reward = user.walletBalance * 0.005; // 0.5%
    user.rewardWallet += reward;
    await user.save();

    // Log reward
    await Transaction.create({
      userId: user._id,
      type: "reward",
      amount: reward,
    });
  }

  console.log("Daily reward job completed.");
});
