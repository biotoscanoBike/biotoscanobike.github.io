
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
