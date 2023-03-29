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

const laneWidth = 50; // Add this line

let elapsedTime = 0;
let gameInterval;
let timerInterval;

function startGame() {
    gameInterval = setInterval(updateGame, 20);
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    elapsedTime++;
}

function updateBicyclePosition() {
    const yPos = 2 * canvas.height / 3;
    const [laneLeftEdge, laneRightEdge] = lane.getLaneEdgesAtY(yPos);

    const outsideLeft = bicycleX < laneLeftEdge;
    const outsideRight = bicycleX + bicycleWidth > laneRightEdge;

    if (outsideLeft) {
        speedX += rightForce; // Accelerate to the right
    } else if (outsideRight) {
        speedX += leftForce; // Accelerate to the left
    } else { }

    bicycleX += -speedX;
}


function checkCollision() {
    if (bicycleX <= 0 || bicycleX + bicycleWidth >= canvas.width) {
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
    startGame();
});

function gameOver() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    const gameOverModal = document.getElementById('gameOverModal');
    const gameOverMessage = document.getElementById('gameOverMessage');
    gameOverMessage.innerText = `You lasted ${elapsedTime} seconds.`;
    gameOverModal.style.display = 'block';
    elapsedTime = 0;
}

let laneOffsetY = 0;

class Lane {
    constructor(canvas, ctx, laneWidth) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.laneWidth = laneWidth;
        this.laneOffsetY = 0;

        this.amplitude = 70;
        this.numPeriods = 2;
        this.frequency = (2 * Math.PI) / (canvas.height / this.numPeriods);

        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = canvas.width;
        this.offscreenCanvas.height = canvas.height;
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');

        this.createLaneImage();
    }

    translateY(dy) {
        this.laneOffsetY += dy;
        if (this.laneOffsetY >= this.canvas.height) {
            this.laneOffsetY -= this.canvas.height;
        }
    }

    getLaneEdgesAtY(y) {
        const yPos = (y - this.laneOffsetY) % this.canvas.height;
        const leftEdgeX = (this.canvas.width / 2 - this.laneWidth / 2) + this.amplitude * Math.sin(this.frequency * yPos);
        const rightEdgeX = (this.canvas.width / 2 + this.laneWidth / 2) + this.amplitude * Math.sin(this.frequency * yPos);
        return [leftEdgeX, rightEdgeX];
    }

    createLaneImage() {
        const amplitude = 70;
        const numPeriods = 2; // Add this line to set the number of periods
        const frequency = (2 * Math.PI) / (canvas.height / numPeriods); // Update this line to calculate the frequency
        const laneHeight = canvas.height;

        this.offscreenCtx.fillStyle = '#ffffff';

        this.offscreenCtx.beginPath();

        // Left side of the lane
        this.offscreenCtx.moveTo(0, 0);
        for (let y = 0; y <= laneHeight; y++) {
            const x = (this.canvas.width / 2 - this.laneWidth / 2) + amplitude * Math.sin(frequency * y);
            this.offscreenCtx.lineTo(x, y);
        }

        // Right side of the lane
        for (let y = laneHeight; y >= 0; y--) {
            const x = (this.canvas.width / 2 + this.laneWidth / 2) + amplitude * Math.sin(frequency * y);
            this.offscreenCtx.lineTo(x, y);
        }

        this.offscreenCtx.lineTo(this.canvas.width, 0);
        this.offscreenCtx.closePath();
        this.offscreenCtx.fill();
    }

    draw() {
        this.ctx.drawImage(this.offscreenCanvas, 0, this.laneOffsetY);
        this.ctx.drawImage(this.offscreenCanvas, 0, this.laneOffsetY - this.canvas.height);
    }
}

class Fence {
    constructor(canvas, ctx, lane, entranceWidth, entranceOffset) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.lane = lane;
        this.entranceWidth = entranceWidth;
        this.entranceOffset = entranceOffset;

        this.height = 10; // The height of the fence
        this.y = 0; // The initial Y position of the fence, at the end of the Lane instance

        this.calculateEntrancePosition();
    }

    calculateEntrancePosition() {
        const yPos = this.canvas.height;
        const [laneLeftEdge, laneRightEdge] = this.lane.getLaneEdgesAtY(yPos);

        const minEntranceX = laneLeftEdge + this.entranceOffset;
        const maxEntranceX = laneRightEdge - this.entranceWidth - this.entranceOffset;

        this.entranceX = Math.random() * (maxEntranceX - minEntranceX) + minEntranceX;
    }

    draw() {
        this.ctx.fillStyle = 'black';

        // Draw left fence wall
        this.ctx.fillRect(0, this.y, this.entranceX, this.height);

        // Draw right fence wall
        const rightFenceStartX = this.entranceX + this.entranceWidth;
        this.ctx.fillRect(rightFenceStartX, this.y, this.canvas.width - rightFenceStartX, this.height);
    }

    moveDown(dy) {
        this.y += dy;
        if (this.y > this.canvas.height) {
            this.y = 0;
            this.calculateEntrancePosition();
        }
    }

    checkCollision(bicycle) {
        const bicycleCenterX = bicycle.x + bicycle.width / 2;
        const bicycleCenterY = bicycle.y + bicycle.height / 2;

        if (bicycleCenterY >= this.y && bicycleCenterY <= this.y + this.height) {
            if (bicycleCenterX < this.entranceX || bicycleCenterX > this.entranceX + this.entranceWidth) {
                return true;
            }
        }

        return false;
    }
}


const lane = new Lane(canvas, ctx, laneWidth);

// Create a Fence instance
const entranceWidth = 200;
const entranceOffset = 100;
const 0fence = new Fence(canvas, ctx, lane, entranceWidth, entranceOffset);

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lane.translateY(2); // Change this value to control the lane scrolling speed
    lane.draw();
    
    // Move and draw the fence
    fence.moveDown(2);
    fence.draw();
    
    updateBicyclePosition();
    checkCollision();
    
    // Check for collision with the fence
    if (fence.checkCollision({ x: bicycleX, y: bicycleY, width: bicycleWidth, height: bicycleHeight })) {
        gameOver();
    }
    
    drawBicycle();
    drawScore(); // Add this line
}

function getBicycleColor() {
    const yPos = 2 * canvas.height / 3; // Use a fixed Y position for calculations
    const [laneLeftEdge, laneRightEdge] = lane.getLaneEdgesAtY(yPos);

    if (bicycleX + bicycleWidth < laneLeftEdge) {
        return 'blue';
    } else if (bicycleX > laneRightEdge) {
        return 'red';
    } else {
        return 'yellow';
    }
}





function drawBicycle() {
    ctx.fillStyle = getBicycleColor();
    ctx.fillRect(bicycleX, bicycleY, bicycleWidth, bicycleHeight);
}


const accel = 1;

function handleInput(direction) {
    if (direction === 'right') {
        speedX -= accel;
    } else if (direction === 'left') {
        speedX += accel;
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


startGame();
