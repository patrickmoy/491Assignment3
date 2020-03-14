/**
 * Patrick Moy
 * TCSS 491
 * Assignment 3
 */

function distance(a, b) {
    let difX = a.x - b.x;
    let difY = a.y - b.y;
    return Math.sqrt(difX * difX + difY * difY)
}

function circleArea(radius) {
    return Math.PI * radius * radius;
}

function deriveRadius(area) {
    return Math.sqrt(area / Math.PI);
}

/**
 * Derived partially from class code for circles.
 */
class Entity {

    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.removeFromWorld = false;
    }

    update() {
    }

    draw() {
    }

}

class Circle extends Entity {

    constructor(game, x, y, radius) {
        super(game, x, y);
        this.radius = radius;
        this.colors = ["Red", "Green", "Blue", "White"];
        this.color = Math.floor(Math.random() * 4);
        this.velocity = {
            x: Math.random() * 100,
            y: Math.random() * 100
        };
        this.canFuse = true;
        this.fuseCounter = 0;
    }

    hitRightWall() {
        return this.x + this.radius > this.game.surfaceWidth;
    }

    hitLeftWall() {
        return this.x - this.radius < 0;
    }

    hitTopWall() {
        return this.y + this.radius > this.game.surfaceHeight;
    }

    hitBottomWall() {
        return this.y - this.radius < 0;
    }

    collidedWith(other) {
        return distance(this, other) < this.radius + other.radius;
    }

    update() {
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;

        // Changing direction upon hitting wall.
        if (this.hitLeftWall() || this.hitRightWall()) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.hitTopWall()|| this.hitBottomWall()) {
            this.velocity.y = -this.velocity.y;
        }

        // Changing velocity upon colliding with another object (elastic collision).
        for (let i = 0 ; i < this.game.entities.length; i++) {
            const ent = this.game.entities[i];
            if (this !== ent && this.collidedWith(ent)) {
                if (this.color !== ent.color || !this.canFuse || !ent.canFuse) {
                    let temp = this.velocity;
                    this.velocity = ent.velocity;
                    ent.velocity = temp;


                } else if (this.canFuse && ent.canFuse && this.color === ent.color) {
                   // Fuses circles of the same color, provided they haven't just exploded.
                        this.fuse(ent);
                }
            }
        }

        // Accelerates circles towards each other.
        for (let i = 0; i < this.game.entities.length; i++) {
            const ent = this.game.entities[i];
            if (this !== ent) {
                const dist = distance(this, ent);
                const difX = (ent.x - this.x) / dist;
                const difY = (ent.y - this.y) / dist;
                this.velocity.x += difX / (dist * dist) * this.game.ACCELERATION;
                this.velocity.y += difY / (dist * dist) * this.game.ACCELERATION;

                const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                if (speed > this.game.MAX_SPEED) {
                    const ratio = this.game.MAX_SPEED / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
        }

        this.velocity.x -= (1 - this.game.FRICTION) * this.game.clockTick * this.velocity.x;
        this.velocity.y -= (1 - this.game.FRICTION) * this.game.clockTick * this.velocity.y;

        // Splits circles that have gotten too big.
        if (this.radius > this.game.MAX_RADIUS) {
            this.split();
        }
    }

    draw() {
        this.game.GAME_CONTEXT.beginPath();
        this.game.GAME_CONTEXT.fillStyle = this.colors[this.color];
        this.game.GAME_CONTEXT.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.GAME_CONTEXT.fill();
        this.game.GAME_CONTEXT.closePath();
    }

    // Fuses with another circle.
    fuse(other) {
        const newX = (this.x + other.x) / 2;
        const newY = (this.y + other.y) / 2;
        this.removeFromWorld = true;
        other.removeFromWorld = true;

        // New circle has an area equal to sum of combining circles.
        let newCircle = new Circle(this.game, newX, newY, deriveRadius(circleArea(this.radius) + circleArea(other.radius)));
        // New circle matches in color.
        newCircle.color = other.color;
        newCircle.velocity.x = this.velocity.x + other.velocity.x;
        newCircle.velocity.y = this.velocity.y + other.velocity.y;
        this.game.newCircles.push(newCircle);
    }

    /**
     * Splits a circle into many smaller ones based on the original circle size.
     */
    split() {
        const area = circleArea(this.radius);
        const newArea = circleArea(this.game.BASE_RADIUS);
        const newCircleCount = Math.ceil(area / newArea);
        console.log(newCircleCount);
        this.removeFromWorld = true;
        for (let i = 0; i < newCircleCount; i++) {
            const newX = this.game.BASE_RADIUS + Math.random() * (this.game.surfaceWidth - this.game.BASE_RADIUS * 2);
            const newY = this.game.BASE_RADIUS + Math.random() * (this.game.surfaceHeight - this.game.BASE_RADIUS * 2);
            const circle = new Circle(this.game, newX, newY, this.game.BASE_RADIUS);
            circle.color = this.color;
            circle.canFuse = false;
            circle.fuseCounter = 2;
            this.game.newCircles.push(circle);
        }

    }
}
