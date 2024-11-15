// Global variables
let canvas, ctx, position, velocity;

// Initialize simulation
document.getElementById("simulate").addEventListener("click", () => {
    const force = parseFloat(document.getElementById("force").value);
    const mass = parseFloat(document.getElementById("mass").value);
    const frictionCoefficient = parseFloat(document.getElementById("surface").value);

    // Calculate acceleration
    const frictionForce = frictionCoefficient * mass * 9.8; // F_f = μ * m * g
    const netForce = force - frictionForce;
    const acceleration = netForce / mass; // F = ma

    if (netForce <= 0) {
        alert("Gaya dorong terlalu kecil untuk mengatasi gesekan!");
        return;
    }

    // Initialize visualization
    initializeCanvas();
    simulateMotion(acceleration);
});

// Initialize canvas and draw initial state
function initializeCanvas() {
    canvas = document.getElementById("shieldCanvas");
    ctx = canvas.getContext("2d");
    position = 0; // Starting position
    velocity = 0; // Initial velocity
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShield(position);
}

// Draw the shield at a given position
function drawShield(x) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw shield
    ctx.fillStyle = "blue";
    ctx.fillRect(x, canvas.height / 2 - 20, 50, 40); // Shield dimensions

    // Draw ground
    ctx.fillStyle = "gray";
    ctx.fillRect(0, canvas.height / 2 + 20, canvas.width, 10);
}

// Simulate motion
function simulateMotion(acceleration) {
    const timeStep = 0.1; // Time step in seconds

    function updatePosition() {
        velocity += acceleration * timeStep; // Update velocity
        position += velocity * timeStep; // Update position

        if (position > canvas.width) {
            alert("Simulasi selesai! Perisai mencapai ujung arena.");
            return;
        }

        drawShield(position); 
        requestAnimationFrame(updatePosition);
    }

    updatePosition();
}

// Back to hero selection
document.getElementById("back-to-selection").addEventListener("click", () => {
    window.location.href = "/StressDungeon/frontend/hero-selection/hero.html"; // Replace with your hero selection page
});
