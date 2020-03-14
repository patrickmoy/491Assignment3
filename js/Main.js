/**
 * Patrick Moy
 * TCSS 491
 * Assignment 3
 */

const AssetHandler = new AssetManager();
AssetHandler.queueImage("./res/img/chief.png");
AssetHandler.queueImage("./res/img/explode.png");
AssetHandler.startDownload()
    .then(() => {
        const gameCanvas = document.getElementById("gameWorld");
        const gameContext = gameCanvas.getContext("2d");
        const myGame = new GameEngine(gameContext, AssetHandler.assets);
        for (let i = 0; i < 300; i++) {
            const newX = myGame.BASE_RADIUS + Math.random() * (myGame.surfaceWidth - myGame.BASE_RADIUS * 2);
            const newY = myGame.BASE_RADIUS + Math.random() * (myGame.surfaceWidth - myGame.BASE_RADIUS * 2);
            const circle = new Circle(myGame, newX, newY, myGame.BASE_RADIUS);
            myGame.entities.push(circle);
        }
        myGame.init();
        myGame.run();

        let socket = io.connect("http://24.16.255.56:8888");

        socket.on("load", function (data) {
            console.log(data);
            myGame.entities = [];
            for (let i = 0; i < data.entityData.length; i++) {
                let ent = data.entityData[i];
                let circle = new Circle(myGame, ent.X, ent.Y, ent.Radius);
                circle.velocity = ent.V;
                circle.color = ent.Color;
                circle.canFuse = ent.Fuse;
                circle.fuseCounter = ent.FuseCounter;
                myGame.entities.push(circle);

            }

        });
        window.onload = () => {
            let label = document.getElementById("label");
            let saveButton = document.getElementById("save");
            let loadButton = document.getElementById("load");

            saveButton.onclick = () => {
                label.innerHTML = "Saved.";
                let entitiesStateArray = [];
                for (let i = 0; i < myGame.entities.length; i++) {
                    let ent = myGame.entities[i];
                    entitiesStateArray.push({
                        X: ent.x,
                        Y: ent.y,
                        V: ent.velocity,
                        Fuse: ent.canFuse,
                        FuseCounter: ent.fuseCounter,
                        Radius: ent.radius,
                        Remove: ent.removeFromWorld,
                        Color: ent.color
                    })
                }

                socket.emit("save", {
                    studentname: "Patrick Moy",
                    statename: "dataState",
                    entityData: entitiesStateArray,
                });
            };

            loadButton.onclick = () => {
                label.innerHTML = "Loaded."
                socket.emit("load", {studentname: "Patrick Moy", statename: "dataState"});
            };
        };
    });