/**
 * Patrick Moy
 * TCSS 491
 * Assignment 2
 */

const AssetHandler = new AssetManager();
AssetHandler.queueImage("./res/img/chief.png");
AssetHandler.queueImage("./res/img/explode.png");
AssetHandler.startDownload()
    .then(() => {
            const gameCanvas = document.getElementById("gameWorld");
            const gameContext = gameCanvas.getContext("2d");
            const myGame = new GameEngine(gameContext, AssetHandler.assets);
            myGame.init();
            for (let i = 0; i < 300; i++) {
                const newX = myGame.BASE_RADIUS + Math.random() * (myGame.surfaceWidth - myGame.BASE_RADIUS * 2);
                const newY = myGame.BASE_RADIUS + Math.random() * (myGame.surfaceWidth - myGame.BASE_RADIUS * 2);
                const circle = new Circle(myGame, newX, newY, myGame.BASE_RADIUS);
                myGame.entities.push(circle);
            }
            myGame.run();
    });