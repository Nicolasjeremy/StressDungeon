const BASE_URL = "https://stressdungeon.onrender.com"; // Replace with your actual backend URL
const userID = localStorage.getItem("userID");
// Get user data (coins, etc.) from the backend
async function getUserData(userId) {
    try {
        const response = await fetch(`${BASE_URL}/user/${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }
        return await response.json(); // Returns the user object from MongoDB
    } catch (error) {
        console.error("Error getting user data:", error);
        return { coins: 0 }; // Fallback to default if there's an error
    }
}

// Update user data (coins, etc.) in the backend
async function updateUserData(userId, coins, level) {
    try {
        const response = await fetch(`${BASE_URL}/user/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ coins, level }),
        });
        if (!response.ok) {
            throw new Error("Failed to update user data");
        }
        console.log("User data updated successfully");
    } catch (error) {
        console.error("Error updating user data:", error);
    }
}

async function getCoins(userId) {
    const userData = await getUserData(userId);
    return userData.coins || 0; // Return coins or 0 if not found
}

async function addCoins(userId, amount) {
    const currentCoins = await getCoins(userId);
    const newCoins = currentCoins + amount;
    await updateUserData(userId, newCoins, 1); // Update coins in backend; level hardcoded for now
    return newCoins;
}


function updateCoinDisplay(coins) {
    const coinDisplay = document.getElementById("coin-display");
    if (coinDisplay) {
        coinDisplay.textContent = `Coins: ${coins}`;
    }
}


// Generate random target distance
function generateRandomTarget(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize game
document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userID");
    console.log("User ID:", userId);
    const coins = await getCoins(userId); // Fetch coins from MongoDB
    updateCoinDisplay(coins); // Update display

    // Generate and display random target distance
    const targetDistance = generateRandomTarget(20, 100); // Example range: 20 to 100 meters
    const targetDistanceDisplay = document.getElementById("target-distance-display");
    if (targetDistanceDisplay) {
        targetDistanceDisplay.textContent = targetDistance;
    }

    const simulateButton = document.getElementById("simulate");
    if (simulateButton) {
        simulateButton.dataset.targetDistance = targetDistance; // Store target in button dataset
        simulateButton.dataset.userId = userId; // Store userId for use in the simulation
    }
});


document.getElementById("simulate").addEventListener("click", async () => {
    const velocity = parseFloat(document.getElementById("velocity").value);
    const angle = parseFloat(document.getElementById("angle").value);
    const gravity = parseFloat(document.getElementById("gravity").value);

    if (isNaN(velocity) || isNaN(angle) || isNaN(gravity)) {
        alert("Please enter valid numbers for velocity, angle, and gravity.");
        return;
    }

    const targetDistance = parseFloat(document.getElementById("simulate").dataset.targetDistance);
    const userId = document.getElementById("simulate").dataset.userId;

    // Convert angle to radians
    const angleRadians = (angle * Math.PI) / 180;

    // Calculate trajectory
    const totalTime = (2 * velocity * Math.sin(angleRadians)) / gravity;
    const maxDistance = (velocity * Math.cos(angleRadians)) * totalTime;
    const maxHeight = (Math.pow(velocity * Math.sin(angleRadians), 2)) / (2 * gravity);

    // Update results
    document.getElementById("max-distance").textContent = maxDistance.toFixed(2);
    document.getElementById("total-time").textContent = totalTime.toFixed(2);
    document.getElementById("max-height").textContent = maxHeight.toFixed(2);

    // Check if the target distance is achieved
    if (Math.abs(maxDistance - targetDistance) <= 5) { // Allow a small margin of error
        const updatedCoins = await addCoins(userId, 10); // Update coins in MongoDB
        updateCoinDisplay(updatedCoins); // Update display with new coin total
    }

    // Draw trajectory on canvas
    drawTrajectory(velocity, angleRadians, gravity, totalTime, maxDistance);
});


document.getElementById("back-to-selection").addEventListener("click", () => {
    window.location.href = "/StressDungeon/frontend/hero-selection/hero.html"; // Update to your hero selection HTML path
});

// Draw trajectory on canvas
function drawTrajectory(velocity, angleRadians, gravity, totalTime, maxDistance) {
    const canvas = document.getElementById("simulationCanvas");
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale the canvas for better visualization
    const scaleX = canvas.width / maxDistance;
    const scaleY = canvas.height / maxDistance;

    ctx.beginPath();
    ctx.moveTo(0, canvas.height); // Start at bottom left

    const steps = 100; // Number of points in the trajectory
    for (let t = 0; t <= totalTime; t += totalTime / steps) {
        const x = velocity * Math.cos(angleRadians) * t;
        const y = velocity * Math.sin(angleRadians) * t - 0.5 * gravity * t * t;

        // Only draw points that fit within the canvas
        if (x * scaleX <= canvas.width && canvas.height - y * scaleY >= 0) {
            ctx.lineTo(x * scaleX, canvas.height - y * scaleY);
        }
    }

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Mark target distance
    const targetDistance = parseFloat(document.getElementById("simulate").dataset.targetDistance);
    ctx.beginPath();
    ctx.moveTo(targetDistance * scaleX, canvas.height);
    ctx.lineTo(targetDistance * scaleX, canvas.height - 10); // Draw a small marker
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();
}
