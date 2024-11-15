// Global coin management
function getCoins() {
    return parseInt(localStorage.getItem("coins")) || 0;
}

function addCoins(amount) {
    const currentCoins = getCoins();
    localStorage.setItem("coins", currentCoins + amount);
}

function updateCoinDisplay() {
    const coinDisplay = document.getElementById("coin-display");
    if (coinDisplay) {
        coinDisplay.textContent = `Coins: ${getCoins()}`;
    }
}

// Generate random target distance
function generateRandomTarget(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize game
document.addEventListener("DOMContentLoaded", () => {
    updateCoinDisplay();

    // Generate and display random target distance
    const targetDistance = generateRandomTarget(20, 100); // Example range: 20 to 100 meters
    const targetDistanceDisplay = document.getElementById("target-distance-display");
    if (targetDistanceDisplay) {
        targetDistanceDisplay.textContent = targetDistance;
    }

    const simulateButton = document.getElementById("simulate");
    if (simulateButton) {
        simulateButton.dataset.targetDistance = targetDistance; // Store target in button dataset
    }
});

document.getElementById("simulate").addEventListener("click", () => {
    const velocity = parseFloat(document.getElementById("velocity").value);
    const angle = parseFloat(document.getElementById("angle").value);
    const gravity = parseFloat(document.getElementById("gravity").value);

    if (isNaN(velocity) || isNaN(angle) || isNaN(gravity)) {
        alert("Please enter valid numbers for velocity, angle, and gravity.");
        return;
    }

    const targetDistance = parseFloat(document.getElementById("simulate").dataset.targetDistance);

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
        alert(`🎉 Target achieved! You earned 10 coins!`);
        addCoins(10);
    } else {
        alert(`❌ Target missed! Try again.`);
    }

    // Update coin display
    updateCoinDisplay();

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
