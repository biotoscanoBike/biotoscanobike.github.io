/*

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
*/

class Bicycle {
    constructor(canvas, ctx, y_bicycle, z_near, f) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.y_bicycle = y_bicycle;
        this.z_bicycle = (z_near * canvas.height) / y_bicycle;
        this.x_bicycle_world = 0;
        this.x_bicycle_screen = canvas.width / 2;
        this.width = 30;
        this.height = 50;
    }

    update(delta, lane) {
        this.x_bicycle_world += delta;
        this.x_bicycle_screen = this.canvas.width / 2 + lane.f * this.x_bicycle_world / this.z_bicycle;
    }

    draw() {
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(this.x_bicycle_screen - this.width / 2, this.y_bicycle - this.height / 2, this.width, this.height);
    }
}