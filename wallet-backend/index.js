const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const walletRoutes = require("./routes/wallet");
const adminRoutes = require("./routes/admin");
require("./jobs/scheduler"); // run cron jobs
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
// Enable CORS for all routes
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
