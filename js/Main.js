const AssetHandler = new AssetManager();
AssetHandler.queueImage("./res/img/chief.png");

AssetHandler.startDownload()
    .then(() => {
            const gameCanvas = document.getElementById("gameWorld");
            const gameContext = gameCanvas.getContext("2d");
            const myGame = new GameEngine(gameContext, AssetHandler.assets);
            myGame.init();
            myGame.run();
    });