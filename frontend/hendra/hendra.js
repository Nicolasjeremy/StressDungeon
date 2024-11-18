let canvas, ctx, position, velocity;

document.getElementById("simulate").addEventListener("click", () => {
    const force = parseFloat(document.getElementById("force").value);
    const mass = parseFloat(document.getElementById("mass").value);
    const frictionCoefficient = parseFloat(document.getElementById("surface").value);

    const frictionForce = frictionCoefficient * mass * 9.8;
    const netForce = force - frictionForce;
    const acceleration = netForce / mass;

    if (netForce <= 0) {
        alert("Gaya dorong terlalu kecil untuk mengatasi gesekan!");
        return;
    }

    initializeCanvas();
    simulateMotion(acceleration);
});

function initializeCanvas() {
    canvas = document.getElementById("shieldCanvas");
    ctx = canvas.getContext("2d");
    position = 0;
    velocity = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShield(position);
}

function drawShield(x) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "blue";
    ctx.fillRect(x, canvas.height / 2 - 20, 50, 40);

    ctx.fillStyle = "gray";
    ctx.fillRect(0, canvas.height / 2 + 20, canvas.width, 10);
}

function simulateMotion(acceleration) {
    const timeStep = 0.1;

    function updatePosition() {
        velocity += acceleration * timeStep;
        position += velocity * timeStep;

        if (position > canvas.width) {
            return;
        }

        drawShield(position); 
        requestAnimationFrame(updatePosition);
    }

    updatePosition();
}

document.getElementById("back-to-selection").addEventListener("click", () => {
    window.location.href = "/StressDungeon/frontend/hero-selection/hero.html";
});
