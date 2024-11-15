const materials = {
    copper: 400,
    aluminum: 205,
    wood: 0.15,
};

// Global simulation variables
let heatGrid;
let canvas, ctx;
let material, timeStep;
const gridSize = 50; // Size of the simulation grid
const cellSize = 10; // Size of each cell in pixels

// Initialize canvas and simulation
document.getElementById("start-simulation").addEventListener("click", () => {
    material = materials[document.getElementById("material").value];
    timeStep = parseFloat(document.getElementById("time-step").value);

    initializeHeatGrid();
    simulateHeatDiffusion();
});

// Initialize the heat grid
function initializeHeatGrid() {
    heatGrid = Array(gridSize)
        .fill(0)
        .map(() => Array(gridSize).fill(0));

    // Center heat source
    const center = Math.floor(gridSize / 2);
    heatGrid[center][center] = 100; // Initial heat source (100 units)

    canvas = document.getElementById("heatCanvas");
    ctx = canvas.getContext("2d");
    drawHeatGrid();
}

// Draw the heat grid
function drawHeatGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const heat = heatGrid[i][j];
            const color = `rgb(${255 - heat * 2.5}, ${255 - heat * 2.5}, 255)`; // Blue to white gradient
            ctx.fillStyle = color;
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}

// Simulate heat diffusion
function simulateHeatDiffusion() {
    const newHeatGrid = JSON.parse(JSON.stringify(heatGrid)); // Deep copy

    for (let i = 1; i < gridSize - 1; i++) {
        for (let j = 1; j < gridSize - 1; j++) {
            const heatTransfer =
                (heatGrid[i - 1][j] +
                    heatGrid[i + 1][j] +
                    heatGrid[i][j - 1] +
                    heatGrid[i][j + 1] -
                    4 * heatGrid[i][j]) *
                material *
                timeStep;

            newHeatGrid[i][j] += heatTransfer;
        }
    }

    heatGrid = newHeatGrid;
    drawHeatGrid();

    // Continue simulation
    requestAnimationFrame(simulateHeatDiffusion);
}

// Back to hero selection
document.getElementById("back-to-selection").addEventListener("click", () => {
    window.location.href = "/StressDungeon/frontend/hero-selection/hero.html"; // Replace with your hero selection page
});
