const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Path to the JSON file
const DATA_FILE = "./data.json";

// Helper function to read JSON file
function readDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "{}"); // Create the file if it doesn't exist
  }
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

// Helper function to write JSON file
function writeDataFile(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Routes

// Root route to check backend status
app.get("/", (req, res) => {
  res.send("Game Backend is Running!");
});

// Get user data by userId
app.get("/user/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const data = readDataFile();

    if (!data[userId]) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(data[userId]);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add or update user data
app.post("/user/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const { coins, level } = req.body;
    const data = readDataFile();

    // Update or create user data
    data[userId] = {
      coins: coins ?? data[userId]?.coins ?? 0, // Use coins from request or fallback
      level: level ?? data[userId]?.level ?? 1, // Use level from request or fallback
    };

    writeDataFile(data);
    res.json({ message: "User data updated successfully", data: data[userId] });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a user by userId
app.delete("/user/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const data = readDataFile();

    if (!data[userId]) {
      return res.status(404).json({ message: "User not found" });
    }

    delete data[userId];
    writeDataFile(data);
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
