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

    reset() {
        this.y = 0;
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
        const topLeft = { x: bicycle.x, y: bicycle.y };
        const topRight = { x: bicycle.x + bicycle.width, y: bicycle.y };
        const bottomLeft = { x: bicycle.x, y: bicycle.y + bicycle.height };
        const bottomRight = { x: bicycle.x + bicycle.width, y: bicycle.y + bicycle.height };
    
        const corners = [topLeft, topRight, bottomLeft, bottomRight];
    
        if (this.y <= bicycle.y && this.y + this.height >= bicycle.y) {
            for (const corner of corners) {
                if (corner.x < this.entranceX || corner.x > this.entranceX + this.entranceWidth) {
                    return true;
                }
            }
        }
    
        return false;
    }
    
}

