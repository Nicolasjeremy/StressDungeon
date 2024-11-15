// Backend API URL
const BACKEND_URL = "https://stressdungeon.onrender.com";

// Global coin management
let userCoins = 0;

// Fetch user progress from backend
async function fetchUserProgress(userId) {
    try {
        const response = await fetch(`${BACKEND_URL}/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user progress");

        const data = await response.json();
        console.log("User progress fetched:", data);
        return data;
    } catch (error) {
        console.error("Error fetching user progress:", error);
        return { coins: 0, level: 1 }; // Default data on error
    }
}

// Save user data to backend
async function saveUserToBackend(userId, coins, level) {
    try {
        const response = await fetch(`${BACKEND_URL}/user/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ coins, level }),
        });
        if (!response.ok) throw new Error("Failed to save user progress");

        console.log("User data saved successfully");
    } catch (error) {
        console.error("Error saving user data to backend:", error);
    }
}

// Get coins from memory
function getCoins() {
    return userCoins;
}

// Add coins and save to backend
async function addCoins(amount) {
    userCoins += amount;
    const user = firebase.auth().currentUser;
    if (user) {
        await saveUserToBackend(user.uid, userCoins, 1);
    }
    updateCoinDisplay();
}

// Update coin display
function updateCoinDisplay() {
    const coinDisplay = document.getElementById("coin-display");
    if (coinDisplay) {
        coinDisplay.textContent = `Coins: ${getCoins()}`;
    }
}

// Visualize collision
function visualizeCollision(mass1, velocity1, mass2, velocity2, collisionType) {
    const canvas = document.getElementById("collisionCanvas");
    const ctx = canvas.getContext("2d");

    // Canvas settings
    const width = canvas.width;
    const height = canvas.height;
    const objectRadius = 20;

    // Positions
    let position1 = objectRadius + 50; // Initial position of object 1
    let position2 = width - objectRadius - 50; // Initial position of object 2

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw initial positions
    function drawObjects() {
        ctx.clearRect(0, 0, width, height);

        // Object 1
        ctx.beginPath();
        ctx.arc(position1, height / 2, objectRadius, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.closePath();

        // Object 2
        ctx.beginPath();
        ctx.arc(position2, height / 2, objectRadius, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }

    // Calculate velocities after collision
    let velocity1After, velocity2After;
    if (collisionType === "elastic") {
        velocity1After =
            ((mass1 - mass2) * velocity1 + 2 * mass2 * velocity2) / (mass1 + mass2);
        velocity2After =
            ((mass2 - mass1) * velocity2 + 2 * mass1 * velocity1) / (mass1 + mass2);
    } else {
        const finalVelocity =
            (mass1 * velocity1 + mass2 * velocity2) / (mass1 + mass2);
        velocity1After = finalVelocity;
        velocity2After = finalVelocity;
    }

    // Animate collision
    function animate() {
        position1 += velocity1;
        position2 += velocity2;

        // Detect collision
        if (position2 - position1 <= objectRadius * 2) {
            velocity1 = velocity1After;
            velocity2 = velocity2After;
        }

        // Stop animation if objects move out of bounds
        if (position1 > width || position2 < 0) {
            return;
        }

        drawObjects();
        requestAnimationFrame(animate);
    }

    drawObjects();
    animate();
}

// Simulate collision
document.getElementById("simulate").addEventListener("click", async () => {
    const mass1 = parseFloat(document.getElementById("mass1").value);
    const velocity1 = parseFloat(document.getElementById("velocity1").value);
    const mass2 = parseFloat(document.getElementById("mass2").value);
    const velocity2 = parseFloat(document.getElementById("velocity2").value);
    const collisionType = document.getElementById("collision-type").value;

    // Calculate momentum and energy
    const momentumBefore = mass1 * velocity1 + mass2 * velocity2;
    const energyBefore = 0.5 * mass1 * velocity1 ** 2 + 0.5 * mass2 * velocity2 ** 2;

    let velocity1After, velocity2After, energyAfter;

    if (collisionType === "elastic") {
        velocity1After =
            ((mass1 - mass2) * velocity1 + 2 * mass2 * velocity2) / (mass1 + mass2);
        velocity2After =
            ((mass2 - mass1) * velocity2 + 2 * mass1 * velocity1) / (mass1 + mass2);
    } else {
        const finalVelocity =
            (mass1 * velocity1 + mass2 * velocity2) / (mass1 + mass2);
        velocity1After = finalVelocity;
        velocity2After = finalVelocity;
    }

    const momentumAfter = mass1 * velocity1After + mass2 * velocity2After;
    energyAfter = 0.5 * mass1 * velocity1After ** 2 + 0.5 * mass2 * velocity2After ** 2;

    // Update results
    document.getElementById("momentum-before").textContent = momentumBefore.toFixed(2);
    document.getElementById("momentum-after").textContent = momentumAfter.toFixed(2);
    document.getElementById("energy-before").textContent = energyBefore.toFixed(2);
    document.getElementById("energy-after").textContent = energyAfter.toFixed(2);

    // Reward coins if momentum conservation holds
    if (Math.abs(momentumBefore - momentumAfter) < 0.1) {
        alert("Momentum conserved! 5 coins added!");
        await addCoins(5);
    }

    // Visualize collision
    visualizeCollision(mass1, velocity1, mass2, velocity2, collisionType);
});

// Back to hero selection
document.getElementById("back-to-selection").addEventListener("click", () => {
    window.location.href = "/StressDungeon/frontend/hero-selection/hero.html";
});
