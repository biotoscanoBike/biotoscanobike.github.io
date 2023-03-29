class Bicycle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = 0;
    }

    draw(ctx) {
        ctx.fillStyle = this.getColor();
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    getColor() {
        const yPos = 2 * canvas.height / 3; // Use a fixed Y position for calculations
        const [laneLeftEdge, laneRightEdge] = lane.getLaneEdgesAtY(yPos);

        if (this.x + this.width < laneLeftEdge) {
            return 'blue';
        } else if (this.x > laneRightEdge) {
            return 'red';
        } else {
            return 'yellow';
        }
    }

    updatePosition(accel, laneLeftEdge, laneRightEdge) {
        const outsideLeft = this.x < laneLeftEdge;
        const outsideRight = this.x + this.width > laneRightEdge;

        if (outsideLeft) {
            this.speedX += rightForce; // Accelerate to the right
        } else if (outsideRight) {
            this.speedX += leftForce; // Accelerate to the left
        } else { }

        this.x -= this.speedX;
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.speedX = 0;
    }
}