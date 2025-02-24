/*

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

*/

class Fence {
    constructor(z_fence, entranceWidth_world, lane) {
        this.z_fence = z_fence;
        this.entranceWidth_world = entranceWidth_world;
        this.lane = lane;
    }

    draw(ctx, z_offset, z_near, f, canvas) {
        const z_relative = this.z_fence - z_offset;
        if (z_relative < z_near) return;
        const y_screen = (z_near * canvas.height) / z_relative;
        if (y_screen > 0 && y_screen < canvas.height) {
            const x_center_world = this.lane.amplitude * Math.sin(this.lane.frequency * z_relative);
            const x_left_entrance = x_center_world - this.entranceWidth_world / 2;
            const x_right_entrance = x_center_world + this.entranceWidth_world / 2;
            const x_left_screen = canvas.width / 2 + f * x_left_entrance / z_relative;
            const x_right_screen = canvas.width / 2 + f * x_right_entrance / z_relative;
            ctx.beginPath();
            ctx.moveTo(0, y_screen);
            ctx.lineTo(x_left_screen, y_screen);
            ctx.moveTo(x_right_screen, y_screen);
            ctx.lineTo(canvas.width, y_screen);
            ctx.strokeStyle = 'brown';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    checkCollision(bicycle, z_offset, z_near, canvas) {
        const z_relative = this.z_fence - z_offset;
        const y_screen = (z_near * canvas.height) / z_relative;
        if (Math.abs(y_screen - bicycle.y_bicycle) < 10) {
            const x_center_world = this.lane.amplitude * Math.sin(this.lane.frequency * z_relative);
            const x_left_entrance = x_center_world - this.entranceWidth_world / 2;
            const x_right_entrance = x_center_world + this.entranceWidth_world / 2;
            if (bicycle.x_bicycle_world < x_left_entrance || bicycle.x_bicycle_world > x_right_entrance) {
                return true;
            }
        }
        return false;
    }
}

