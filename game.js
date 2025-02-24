
/*
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bicycleWidth = 30;
const bicycleHeight = 50;
let bicycleX = canvas.width / 2 - bicycleWidth / 2;
let bicycleY = 2 * canvas.height / 3 - bicycleHeight / 2;

const leftForce = -0.075;
const rightForce = 0.075;
let speedX = 0;

const laneWidth = bicycleWidth * 3; // Add this line

let elapsedTime = 0;
let gameInterval;
let timerInterval;

let isGameRunning = false;

function startGame() {
    if (!isGameRunning) {
        document.getElementById('timeStamp').style.display = 'block';
        gameInterval = setInterval(updateGame, 20);
        timerInterval = setInterval(updateTimer, 1000);
        isGameRunning = true;
    }
}

function updateTimer() {
    elapsedTime++;
}

const bicycle = new Bicycle(bicycleX, bicycleY, bicycleWidth, bicycleHeight);

function updateBicyclePosition() {
    const yPos = 2 * canvas.height / 3;
    const [laneLeftEdge, laneRightEdge] = lane.getLaneEdgesAtY(yPos);
    bicycle.updatePosition(accel, laneLeftEdge, laneRightEdge);
}

function checkCollision() {
    if (bicycle.x <= 0 || bicycle.x + bicycle.width >= canvas.width) {
        gameOver();
    }
}

function drawScore() {
    ctx.font = '35px Arial';
    ctx.fillStyle = 'blue';
    ctx.fillText(`Time: ${elapsedTime}s`, canvas.width / 2, 30);
}


document.getElementById('resetButton').addEventListener('click', () => {
    const gameOverModal = document.getElementById('gameOverModal');
    gameOverModal.style.display = 'none';
    bicycleX = canvas.width / 2 - bicycleWidth / 2;
    speedX = 0;
    lane.reset(); // Add this line
    fence.reset(); // Add this line
    elapsedTime = 0; // Add this line
    startGame();
});

function resetGame() {
    const gameOverModal = document.getElementById('gameOverModal');
    gameOverModal.style.display = 'none';
    bicycle.reset(canvas.width / 2 - bicycle.width / 2, 2 * canvas.height / 3 - bicycle.height / 2);
    lane.reset();
    fence.reset();
    elapsedTime = 0;
    startGame();
}

function gameOver() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    const gameOverModal = document.getElementById('gameOverModal');
    const gameOverMessage = document.getElementById('gameOverMessage');
    gameOverMessage.innerText = `You lasted ${elapsedTime} seconds.`;
    gameOverModal.style.display = 'block';
    elapsedTime = 0;
    isGameRunning = false; // Add this line
}

let laneOffsetY = 0;

const lane = new Lane(canvas, ctx, laneWidth);

// Create a Fence instance
const entranceWidth = bicycleWidth * 4.5;
const entranceOffset = 100;
const fence = new Fence(canvas, ctx, lane, entranceWidth, entranceOffset);

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lane.translateY(2); // Change this value to control the lane scrolling speed
    lane.draw();
    updateBicyclePosition();
    checkCollision();
    drawBicycle();
    updateScore(); // Replace drawScore() with updateScore()

    // Add these lines to draw and update the fence
    fence.moveDown(2); // Change this value to control the fence scrolling speed
    fence.draw();

    // Add this line to check for fence collision
    if (fence.checkCollision({ x: bicycle.x, y: bicycle.y, width: bicycle.width, height: bicycle.height })) {
        gameOver();
    }
}

function drawBicycle() {
    bicycle.draw(ctx);
}


const accel = 1;

function handleInput(direction) {
    if (direction === 'right') {
        bicycle.speedX -= accel;
    } else if (direction === 'left') {
        bicycle.speedX += accel;
    }
}

canvas.addEventListener('touchstart', (event) => {
    if (event.touches[0].clientX < canvas.width / 2) {
        handleInput('left');
    } else {
        handleInput('right');
    }
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowLeft') {
        handleInput('left');
    } else if (event.code === 'ArrowRight') {
        handleInput('right');
    }
});

function updateScore() {
    const timeStamp = document.getElementById('timeStamp');
    timeStamp.innerText = `Time: ${elapsedTime}s`;
}

document.getElementById('resetButton').addEventListener('click', resetGame);

document.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
        const gameOverModal = document.getElementById('gameOverModal');
        if (gameOverModal.style.display === 'block') {
            resetGame();
        }
    }
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
        const landingModal = document.getElementById('landingModal');
        if (landingModal.style.display === 'block') {
            hideLandingModal();
            startGame();
        }
    }
});

function showLandingModal() {
    const landingModal = document.getElementById('landingModal');
    landingModal.style.display = 'block';
}

function hideLandingModal() {
    const landingModal = document.getElementById('landingModal');
    landingModal.style.display = 'none';
}

document.getElementById('startButton').addEventListener('click', () => {
    hideLandingModal();
    startGame();
});


showLandingModal();

*/


// game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Constants for perspective projection
const z_near = 10;
const f = 200;
const amplitude = 100;
const frequency = 0.05;
const laneWidth_world = 50;
const speed = 0.5;
const y_bicycle = canvas.height * 0.8;
const z_bicycle = (z_near * canvas.height) / y_bicycle;

// Create lane and bicycle instances
const lane = new Lane(canvas, ctx, laneWidth_world, z_near, f, amplitude, frequency);
const bicycle = new Bicycle(canvas, ctx, y_bicycle, z_near, f);

// Create fences at regular intervals
const fenceInterval = 50; // z-distance between fences
const numFences = 20; // Number of fences to generate
const fences = Array.from({ length: numFences }, (_, i) => new Fence(i * fenceInterval, 40, lane));

// Game state variables
let z_offset = 0;
let elapsedTime = 0;
let gameInterval;
let timerInterval;
let isGameRunning = false;

// Timestamp element
const timeStamp = document.getElementById('timeStamp');

// Modal elements
const gameOverModal = document.getElementById('gameOverModal');
const gameOverMessage = document.getElementById('gameOverMessage');
const landingModal = document.getElementById('landingModal');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

// Input handling
let leftPressed = false;
let rightPressed = false;
const moveSpeed = 1; // Adjust this value to control movement speed

document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowLeft') leftPressed = true;
    else if (event.code === 'ArrowRight') rightPressed = true;
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowLeft') leftPressed = false;
    else if (event.code === 'ArrowRight') rightPressed = false;
});

canvas.addEventListener('touchstart', (event) => {
    const touchX = event.touches[0].clientX;
    if (touchX < canvas.width / 2) leftPressed = true;
    else rightPressed = true;
});

canvas.addEventListener('touchend', () => {
    leftPressed = false;
    rightPressed = false;
});

// Game loop
function updateGame() {
    if (!isGameRunning) return;

    // Update z_offset to simulate forward motion
    z_offset += speed;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw the lane
    lane.update(speed);
    lane.draw();

    // Draw fences that are on screen
    fences.forEach(fence => {
        const z_relative = fence.z_fence - z_offset;
        if (z_relative >= z_near) {
            fence.draw(ctx, z_offset, z_near, f, canvas);
        }
    });

    // Update bicycle position based on input
    let delta = 0;
    if (leftPressed) delta -= moveSpeed;
    if (rightPressed) delta += moveSpeed;
    bicycle.update(delta, lane);

    // Draw the bicycle
    bicycle.draw();

    // Check for collisions
    checkCollisions();

    // Update score display
    timeStamp.innerText = `Time: ${elapsedTime}s`;
}

// Collision detection
function checkCollisions() {
    // Check if bicycle is within lane boundaries at its z position
    const x_center_world = amplitude * Math.sin(frequency * z_bicycle);
    const x_left_world = x_center_world - laneWidth_world / 2;
    const x_right_world = x_center_world + laneWidth_world / 2;
    if (bicycle.x_bicycle_world < x_left_world || bicycle.x_bicycle_world > x_right_world) {
        gameOver();
    }

    // Check for fence collisions
    fences.forEach(fence => {
        if (fence.checkCollision(bicycle, z_offset, z_near, canvas)) {
            gameOver();
        }
    });
}

// Game over function
function gameOver() {
    clearInterval(timerInterval);
    isGameRunning = false;
    gameOverMessage.innerText = `You lasted ${elapsedTime} seconds.`;
    gameOverModal.style.display = 'block';
}

// Start game function
function startGame() {
    if (!isGameRunning) {
        timeStamp.style.display = 'block';
        elapsedTime = 0;
        z_offset = 0;
        bicycle.x_bicycle_world = 0;
        isGameRunning = true;
        timerInterval = setInterval(() => {
            if (isGameRunning) elapsedTime++;
        }, 1000);
        gameLoop();
    }
}

// Reset game function
function resetGame() {
    gameOverModal.style.display = 'none';
    startGame();
}

// Game loop using requestAnimationFrame
function gameLoop() {
    if (isGameRunning) {
        updateGame();
        requestAnimationFrame(gameLoop);
    }
}

// Modal event listeners
startButton.addEventListener('click', () => {
    landingModal.style.display = 'none';
    startGame();
});

resetButton.addEventListener('click', resetGame);

// Show landing modal on load
landingModal.style.display = 'block';
