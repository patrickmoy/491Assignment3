/**
 * Patrick Moy
 * TCSS 491
 * Assignment 3
 */

// Derived from Seth Ladd's game engine model/talk from Google I/O circa 2011.

// Requests the browser for when animation frame is ready.
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function ( /* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

/**
 * Class-ified version of provided class code for GameEngine.
 */
class GameEngine {

    constructor(gameContext, assets) {
        this.ASSETS_LIST = assets;
        this.GAME_CONTEXT = gameContext;
        this.entities = [];
        this.newCircles = [];
        this.surfaceWidth = this.GAME_CONTEXT.canvas.width;
        this.surfaceHeight = this.GAME_CONTEXT.canvas.height;

        // MESS WITH THESE VARIABLES FOR FUN.
        // WARNING: Simulation will sometimes reach critical mass ( and crash).
        // RNG determines what color circles will revert to after splitting.

        this.ACCELERATION = 5000;
        this.FRICTION = 1;
        this.MAX_SPEED = 1000;

        this.BASE_RADIUS = 5; // Radius of basic circle at default.
        this.MAX_RADIUS = 40; // Radius at which circle will explode.
    }

    /**
     * Initiates timer.
     */
    init() {
        this.TIMER = new GameTimer();
        console.log("Game initialized");

    }

    /**
     * Begins running game engine, and establishes game loop.
     */
    run() {
        const self = this;
        console.log("Game running now");
        function gameLoop() {
            self.loop();
            window.requestAnimFrame(gameLoop, self.GAME_CONTEXT.canvas);
        }
        gameLoop();
    }

    /**
     * Game loop - tick, update, render.
     */
    loop() {
        this.clockTick = this.TIMER.tick();
        this.update();
        this.draw();
    }

    /**
     * Updates all entities.
     */
    update() {
        const entitiesCount = this.entities.length;
        for (let i = 0; i < entitiesCount; i++) {
            const entity = this.entities[i];
            if (entity.fuseCounter > 0) {
                entity.fuseCounter -= this.clockTick;
            }
            if (entity.fuseCounter <= 0 && !entity.canFuse) {
                entity.fuseCounter = 0;
                entity.canFuse = true;
                entity.color = Math.floor(Math.random() * 4);
            }

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }
        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }
        const newLength = this.newCircles.length;
        for (let i = 0; i < newLength; i++) {
            this.entities.push(this.newCircles[i]);
        }
        this.newCircles = [];

    }

    /**
     * Draws all entities.
     */
    draw() {
        this.GAME_CONTEXT.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
        this.GAME_CONTEXT.save();
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.GAME_CONTEXT);
        }
        this.GAME_CONTEXT.restore();
    }
}

/**
 * GameTimer to keep track of game time.
 */
class GameTimer {

    constructor() {
        this.MAX_STEP = 0.05;
        this.gameTime = 0;
        this.lastTimeStamp = 0;
    }

    tick() {
        const currentTime = Date.now();
        const delta = (currentTime - this.lastTimeStamp) / 1000;
        const gameDelta = Math.min(delta, this.MAX_STEP);
        this.lastTimeStamp = currentTime;
        this.gameTime += gameDelta;
        return gameDelta;
    }
}

