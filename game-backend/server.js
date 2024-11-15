const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();



// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const MONGO_URI =process.env.URI;
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define User schema
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  coins: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
});

// Create User model
const User = mongoose.model("User", userSchema);

// Routes

// Root route to check backend status
app.get("/", (req, res) => {
  res.send("Game Backend is Running with MongoDB!");
});

// Get user data by userId
app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add or update user data
app.post("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { coins, level } = req.body;

    const user = await User.findOneAndUpdate(
      { userId },
      { $set: { coins, level } },
      { new: true, upsert: true } // Create the document if it doesn't exist
    );

    res.json({ message: "User data updated successfully", user });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a user by userId
app.delete("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOneAndDelete({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
