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

    reset() {
        this.laneOffsetY = 0;
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
        const borderWidth = 3; // Add this line to set the border width
    
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
    
        // Draw the border
        this.offscreenCtx.strokeStyle = 'lightyellow'; // Set the border color
        this.offscreenCtx.lineWidth = borderWidth; // Set the border width
    
        // Draw the left border
        this.offscreenCtx.beginPath();
        this.offscreenCtx.moveTo((this.canvas.width / 2 - this.laneWidth / 2) + amplitude * Math.sin(frequency * 0), 0);
        for (let y = 1; y <= laneHeight; y++) {
            const x = (this.canvas.width / 2 - this.laneWidth / 2) + amplitude * Math.sin(frequency * y);
            this.offscreenCtx.lineTo(x, y);
        }
        this.offscreenCtx.stroke();
    
        // Draw the right border
        this.offscreenCtx.beginPath();
        this.offscreenCtx.moveTo((this.canvas.width / 2 + this.laneWidth / 2) + amplitude * Math.sin(frequency * 0), 0);
        for (let y = 1; y <= laneHeight; y++) {
            const x = (this.canvas.width / 2 + this.laneWidth / 2) + amplitude * Math.sin(frequency * y);
            this.offscreenCtx.lineTo(x, y);
        }
        this.offscreenCtx.stroke();
    }
    

    draw() {
        this.ctx.drawImage(this.offscreenCanvas, 0, this.laneOffsetY);
        this.ctx.drawImage(this.offscreenCanvas, 0, this.laneOffsetY - this.canvas.height);
    }
}