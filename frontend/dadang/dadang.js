const BASE_URL = "https://stressdungeon.onrender.com"; // Replace with your actual backend URL

// Fetch user data (coins, etc.) from the backend
async function getUserData(userId) {
    try {
        const response = await fetch(`${BASE_URL}/user/${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }
        return await response.json(); // Returns the user object
    } catch (error) {
        console.error("Error fetching user data:", error);
        return { coins: 0 }; // Default fallback
    }
}

// Update user data (coins, etc.) in the backend
async function updateUserData(userId, coins) {
    try {
        const response = await fetch(`${BASE_URL}/user/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ coins }),
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
    await updateUserData(userId, newCoins); // Update coins in the backend
    return newCoins;
}


function updateCoinDisplay(coins) {
    document.getElementById("coin-display").textContent = `Coins: ${coins}`;
}

// Visualize collision
function visualizeCollision(mass1, velocity1, mass2, velocity2, collisionType) {
    const canvas = document.getElementById("collisionCanvas");
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;
    const objectRadius = 20;

    let position1 = objectRadius + 50; 
    let position2 = width - objectRadius - 50; 

    ctx.clearRect(0, 0, width, height);

    function drawObjects() {
        ctx.clearRect(0, 0, width, height);

        ctx.beginPath();
        ctx.arc(position1, height / 2, objectRadius, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(position2, height / 2, objectRadius, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }

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

    function animate() {
        position1 += velocity1;
        position2 += velocity2;

        if (position2 - position1 <= objectRadius * 2) {
            velocity1 = velocity1After;
            velocity2 = velocity2After;
        }

        if (position1 > width || position2 < 0) {
            return;
        }

        drawObjects();
        requestAnimationFrame(animate);
    }

    drawObjects();
    animate();
}


document.getElementById("back-to-selection").addEventListener("click", () => {
    window.location.href = "/StressDungeon/frontend/hero-selection/hero.html"; // Ganti dengan path file HTML pemilihan hero
});

document.getElementById("simulate").addEventListener("click", async () => {
    const mass1 = parseFloat(document.getElementById("mass1").value);
    const velocity1 = parseFloat(document.getElementById("velocity1").value);
    const mass2 = parseFloat(document.getElementById("mass2").value);
    const velocity2 = parseFloat(document.getElementById("velocity2").value);
    const collisionType = document.getElementById("collision-type").value;

    const userId = "exampleUserId"; // Replace with the logged-in user's ID from Firebase Auth

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
        const updatedCoins = await addCoins(userId, 5); // Add coins via MongoDB
        updateCoinDisplay(updatedCoins); // Update display with new coin total
    }

    // Visualize collision
    visualizeCollision(mass1, velocity1, mass2, velocity2, collisionType);
});


document.addEventListener("DOMContentLoaded", async () => {
    const userId = "exampleUserId"; // Replace with the logged-in user's ID from Firebase Auth
    const coins = await getCoins(userId); // Fetch coins from MongoDB
    updateCoinDisplay(coins); // Update display
});
