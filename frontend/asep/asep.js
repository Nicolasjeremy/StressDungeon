const BASE_URL = "https://stressdungeon.onrender.com";
const userID = localStorage.getItem("userID");

async function getUserData(userId) {
    try {
        const response = await fetch(`${BASE_URL}/user/${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }
        return await response.json();
    } catch (error) {
        console.error("Error getting user data:", error);
        return { coins: 0 };
    }
}


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
    return userData.coins || 0;
}

async function addCoins(userId, amount) {
    const currentCoins = await getCoins(userId);
    const newCoins = currentCoins + amount;
    await updateUserData(userId, newCoins, 1);
    return newCoins;
}


function updateCoinDisplay(coins) {
    const coinDisplay = document.getElementById("coin-display");
    if (coinDisplay) {
        coinDisplay.textContent = `Coins: ${coins}`;
    }
}


function generateRandomTarget(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userID");
    console.log("User ID:", userId);
    const coins = await getCoins(userId); 
    updateCoinDisplay(coins); 

    const targetDistance = generateRandomTarget(20, 100);
    const targetDistanceDisplay = document.getElementById("target-distance-display");
    if (targetDistanceDisplay) {
        targetDistanceDisplay.textContent = targetDistance;
    }

    const simulateButton = document.getElementById("simulate");
    if (simulateButton) {
        simulateButton.dataset.targetDistance = targetDistance;
        simulateButton.dataset.userId = userId;
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

    const angleRadians = (angle * Math.PI) / 180;

    const totalTime = (2 * velocity * Math.sin(angleRadians)) / gravity;
    const maxDistance = (velocity * Math.cos(angleRadians)) * totalTime;
    const maxHeight = (Math.pow(velocity * Math.sin(angleRadians), 2)) / (2 * gravity);

    document.getElementById("max-distance").textContent = maxDistance.toFixed(2);
    document.getElementById("total-time").textContent = totalTime.toFixed(2);
    document.getElementById("max-height").textContent = maxHeight.toFixed(2);

    if (Math.abs(maxDistance - targetDistance) <= 5) {
        const updatedCoins = await addCoins(userId, 10);
        updateCoinDisplay(updatedCoins);
    }

    drawTrajectory(velocity, angleRadians, gravity, totalTime, maxDistance);
});


document.getElementById("back-to-selection").addEventListener("click", () => {
    window.location.href = "/StressDungeon/frontend/hero-selection/hero.html";
});

function drawTrajectory(velocity, angleRadians, gravity, totalTime, maxDistance) {
    const canvas = document.getElementById("simulationCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / maxDistance;
    const scaleY = canvas.height / maxDistance;

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);

    for (let t = 0; t <= totalTime; t += totalTime / steps) {
        const x = velocity * Math.cos(angleRadians) * t;
        const y = velocity * Math.sin(angleRadians) * t - 0.5 * gravity * t * t;

        if (x * scaleX <= canvas.width && canvas.height - y * scaleY >= 0) {
            ctx.lineTo(x * scaleX, canvas.height - y * scaleY);
        }
    }

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();

    const targetDistance = parseFloat(document.getElementById("simulate").dataset.targetDistance);
    ctx.beginPath();
    ctx.moveTo(targetDistance * scaleX, canvas.height);
    ctx.lineTo(targetDistance * scaleX, canvas.height - 10);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();
}
