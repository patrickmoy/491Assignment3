// Derived from Seth Ladd's game engine model/talk from Google I/O circa 2011.

// var soundEffect;
// var backgroundMusic;
// var explosionSound = new Howl({src: ['./res/sound/something.mp3'], loop: true, volume: 0.25});

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

class GameEngine {
    constructor(gameContext, assets) {
        this.ASSETS_LIST = assets;
        this.GAME_CONTEXT = gameContext;
        this.entities = [];
        this.TIMER;



    }

    init() {
        this.TIMER = new GameTimer();

        console.log("Game initialized");
    }

    run() {
        const self = this;

        console.log("Game running now");

        function gameLoop() {
            self.loop();
            window.requestAnimFrame(gameLoop, self.GAME_CONTEXT.canvas);
        }
        gameLoop();
    }

    loop() {
        this.clockTick = this.TIMER.tick();
        this.update();
        this.draw();
    }

    update() {
        console.log(this.clockTick);
    }

    draw() {

    }

}

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