/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function (global) {

    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        playerImages = [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
        ],
        levels = [level1, level2, level3, level4],
        currentLevel = 1,
        selectedPlayer = 0,
        countDownFontSize = 20;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    //load a certain level of the game
    function loadLevel(level) {
        Map = level.map;
        canvas.width = Map.col * Map.colWidth;
        canvas.height = Map.row * Map.rowHeight + 108;
        resetLevel(level);
    }

    //setup or reset the initial position of game entities
    function resetLevel(level) {
        var enemyNumber = level.enemies ? level.enemies.number : 0,
            rockNumber = level.rocks ? level.rocks.length : 0,
            rock,
            gemNumber = level.gems? level.gems.length : 0,
            levelCompleteTileNumber = level.levelCompleteTiles? level.levelCompleteTiles.length : 0;

        allRocks = [];
        allEdgeRocks = [];
        for (var i = 0; i < rockNumber; i++) {
            rock = new Rock(level.rocks[i][0], level.rocks[i][1]);
            allRocks.push(rock);
            if(level.rocks[i][2]){
                allEdgeRocks.push(rock);
            }
        }
        allEnemies = [];
        for (var i = 0; i < enemyNumber; i++) {
            allEnemies.push(new Enemy());
        }
        allGems = [];
        for(var i=0; i<gemNumber; i++){
            allGems.push(new Gem(level.gems[i].initCol, level.gems[i].initRow));
        }
        allLevelCompleteTiles = [];
        for (var i=0; i < levelCompleteTileNumber; i++){
            allLevelCompleteTiles.push(new LevelCompleteTile(level.levelCompleteTiles[i][0], level.levelCompleteTiles[i][1]));
        }
        if(player) {
            player.reset(level.player.initCol, level.player.initRow);
        }else{
            player = new Player(level.player.initCol, level.player.initRow);
        }
        key = level.key? new Key(level.key.initCol, level.key.initRow) : null;
        star = new Star(level.star.initCol, level.star.initRow);
        levelTitle = new LevelTitle(level.title.number, level.title.content);
        levelTimer = new LevelTimer(level.countDownTime);
        foundStar = false;
    }

    //game manager handles different stages of the game
    var gameManager = {
        //load text and the first level of the game
        boot: function () {
            initGameText();
            loadLevel(levels[currentLevel-1]);
            this.state = "title";
        },
        //render title
        title: function () {
            renderMap();
            renderTitleText();
        },
        //allow player to select a charactor
        selectCharactor: function () {
            renderMap();
            renderAllCharactors(selectedPlayer);
        },
        //Introduction to the story of the game
        gameIntro: function(dt) {
            renderPrincess();
            allIntroTexts.forEach(function(text){
                text.update(dt);
                text.render();
            });
            if(allIntroTexts[allIntroTexts.length - 1].y <= 400){
                this.state = "levelStart";
            }
        },
        //Title of the level
        levelStart: function (dt) {
            levelTitle.render(canvas.width, canvas.height);
            if (levelTitle.renderEnds(dt)) {
                document.addEventListener('keyup', keyListener, false);
                this.state = "inGame";
            }
        },
        //Play a certain level
        //On each frame, update all the game entities, check collision, timer, winning and losing conditions
        inGame: function (dt) {
            update(dt);
            renderMap();
            renderEntities([allGems, allLevelCompleteTiles, allRocks, star, key, player, allEnemies, levelTimer]);
            checkCollisions();
            checkTimer();
            if (!player.isAlive) {
                document.removeEventListener('keyup', keyListener, false);
                this.state = "playerDie";
            } else if (playerHasWon()) {
                document.removeEventListener('keyup', keyListener, false);
                if(currentLevel < levels.length){
                    currentLevel++;
                    loadLevel(levels[currentLevel-1]);
                    this.state = "levelStart";
                }else{
                    canvas.width = 505;
                    canvas.height = 606;
                    this.state = "endGame";
                }
            } else {
                if (playerFoundKey()){
                    allRocks = [];
                    allEdgeRocks = [];
                    key = null;
                }
                var gemNumber = allGems.length;
                for(var i=0; i<gemNumber; i++){
                    if(playerGotGem(allGems[i])){
                        allGems[i].needRespawn = true;
                    }
                }
            }
        },
        //render the pausing effect when player dies and reset level
        playerDie: function () {
            renderMap();
            renderEntities([allRocks, allEnemies, player]);
            if (player.deathRenderEnd()) {//end of rendering collision
                resetLevel(levels[currentLevel-1]);
                this.state = "levelStart";
            }
        },
        //render the ending text when player completes all of the levels
        endGame: function (dt) {
            renderPrincess();
            allEndTexts.forEach(function(text){
                text.update(dt);
                text.render();
            });
            if(allEndTexts[allEndTexts.length - 1].y <= 350){
                reset();
                this.state = "boot";
            }
        },
        //handle keyboard inputs for entering game and selecting charactors
        handleInput: function (key) {
            if (key === "enter" && this.state === "title") {
                this.state = "selectCharactor";
            }else if (key === "enter" && this.state === "selectCharactor") {
                player.sprite = playerImages[selectedPlayer];
                this.state = "gameIntro";
            }else if (key === "enter" && this.state === "gameIntro") {
                player.sprite = playerImages[selectedPlayer];
                this.state = "levelStart";
            }else if (key === "left" && this.state === "selectCharactor") {
                if (selectedPlayer === 0) { return;}
                selectedPlayer--;
            }else if (key === "right" && this.state === "selectCharactor") {
                if (selectedPlayer === 3) { return; }
                selectedPlayer++;
            }
        },
        execute: function (dt) {
            this[this.state](dt);
        },
        state: "boot",
    };

    function main() {
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        gameManager.execute(dt);
        lastTime = now;

        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        main();
    }

    function update(dt) {
        levelTimer.update(dt);
        allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
        allGems.forEach(function (gem) {
            gem.update(dt);
        });
        allLevelCompleteTiles.forEach(function(tile){
            tile.update(dt);
        });
    }

    //check collision among enemies, stones and player
    function checkCollisions() {
        var playerRow = player.getRow();
        for (var enemy of allEnemies) {
            //check collision between enemies and stones
            for(var rock of allEdgeRocks){
                if(enemy.speed < 0 || enemy.y !== rock.y){
                    continue;
                }
                if(rock.x - enemy.x < 85 && rock.x - enemy.x > -85){
                    enemy.sprite = "images/enemy-bug-reverse.png";
                    enemy.speed *= -1;
                }
            }
            //check collision between enemies and player
            if (enemy.getRow() !== playerRow) {
                continue;
            }
            if (player.x - enemy.x < 81 && player.x - enemy.x > -81) {
                player.isAlive = false;
            }
        }
    }

    //If there is no time left for the level, the player dies
    function checkTimer() {
        if (levelTimer.time <= 0){
            player.isAlive = false;
        }
    }

    //If player find the star, activate the ending tiles
    function playerFoundStar() {
        if (star && player.getRow() === star.getRow() && player.getCol() === star.getCol()) {
            allLevelCompleteTiles.forEach(function(tile){
                tile.isActive = true;
                tile.sprite = "images/arrow.png";
            });
            star = null;
            foundStar = true;
        }
        return foundStar;
    }

    //After player has found the star, check if player has reached the ending tile
    function playerHasWon() {
        if(playerFoundStar()){
            var i, length = allLevelCompleteTiles.length;
            for(i = 0 ; i < length; i++){
                if(player.getRow() === allLevelCompleteTiles[i].getRow() && player.getCol() === allLevelCompleteTiles[i].getCol()){
                    return true;
                }
            }
        }
        return false;
    }

    //Check if player has found the key
    function playerFoundKey(){
        if (key && player.getRow() === key.getRow() && player.getCol() === key.getCol()) {
            return true;
        }
        return false;
    }

    //Check if player has found the gem
    function playerGotGem(gem){
        if(gem && !gem.needRespawn && player.getRow() === gem.getRow() && player.getCol() === gem.getCol()){
            gem.needRespawn = true;
            levelTimer.extend(10);
            return true;
        }
        return false;
    }

    function renderMap() {
        var rowImages = {
            "water": "images/water-block.png",   // a row of water
            "paved": "images/stone-block.png",   // a row of stone
            "grass": "images/grass-block.png",   // a row of grass
        },
           numRows = Map.row,
           numCols = Map.col,
           row, col;

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[Map.rowContent[row]]), col * 101, row * 83);
            }
        }
    }

    //render all the entities of the game
    //if passed in an array of entity, then render every entity of the array
    function renderEntities(entityArray){
        if (entityArray instanceof Array){
            var entityArrayLength = entityArray.length;
            for(var i=0; i<entityArrayLength; i++){
                if(entityArray[i] instanceof Array){
                    var entityCount = entityArray[i].length;
                    for(var j = 0; j <entityCount; j++){
                        entityArray[i][j].render();
                    }
                }else if(entityArray[i]){
                    entityArray[i].render();
                }
            }
        }
    }

    //Render the title of the game
    function renderTitleText() {
        var centerX = Math.floor(canvas.width / 2);
        ctx.font = "60pt Impact";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText("FROGGER", centerX, 250);
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 2;
        ctx.strokeText("FROGGER", centerX, 250);
        ctx.font = "30pt Impact";
        ctx.fillText("Press Enter to Start", centerX, 450);
        ctx.strokeText("Press Enter to Start", centerX, 450);
    }

    //Render all seletable charactor and highlight the currently selected one
    function renderAllCharactors(selected) {
        var length = playerImages.length,
            centerX = Math.floor(canvas.width / 2);
        ctx.font = "30pt Impact";
        ctx.textAlign = "center";
        ctx.fillText("Select Charactor", centerX, 100);
        //highlight selected charactor
        ctx.drawImage(Resources.get("images/Selector.png"), centerX + 101 * (selected - 2), 200);
        for (var i = 0; i < length; i++) {
            ctx.drawImage(Resources.get(playerImages[i]), centerX + 101 * (i - 2), 200);
        }
    }

    //prepare all the texts for rendering
    function initGameText(){
        var centerX = Math.floor(canvas.width / 2),
            introTextContent = [
                "The princess summoned you",
                "And assigned you an important task",
                "There are four stars around the world",
                "You need to collect all of them",
            ],
            introLength = introTextContent.length;
            endTextContent = [
                "You collected all of the stars",
                "And brought them back to the princess",
                "She used the stars",
                "to open the gate to a secret world",
                "",
                "She handed you a pokeball",
                "And said:",
                "Now it's time to catch them all",
                "",
                "",
                "",
                "THE END",
            ],
            endLength = endTextContent.length;

        for(var i=0; i<endLength; i++){
            allEndTexts.push(new Text(centerX, 450 + 50 * i, endTextContent[i]));
        }
        for(var i=0; i<introLength; i++){
            allIntroTexts.push(new Text(centerX, 450 + 50 * i, introTextContent[i]));
        }
    }

    //render the image of the princess
    function renderPrincess(){
        var centerX = Math.floor(canvas.width / 2);
        ctx.fillStyle = "white";
        ctx.fillRect(0,0, canvas.width, canvas.height);
        ctx.drawImage(Resources.get("images/char-princess-girl.png"), centerX - 50, 0);
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        currentLevel = 1;
        selectedPlayer = 0;
        countDownFontSize = 20;
        Map = {};
        allRocks = [];
        allEdgeRocks = [];
        allEnemies = [];
        player = null;
        star = null;
        key = null;
        allGems = [];
        levelTitle = "";
        levelTimer = 0;
        allEndTexts = [];
        allIntroTexts = [];
        allLevelCompleteTiles = [];
        foundStar = false;
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/Star.png',
        'images/Rock.png',
        'images/Key.png',
        'images/arrow.png',
        'images/arrow-gray.png',
        'images/enemy-bug-reverse.png',
        "images/Gem-blue.png",
        "images/Gem-green.png",
        "images/Gem-orange.png",
        "images/char-princess-girl.png",
        "images/Selector.png",
    ]);
    Resources.onReady(init);

    document.addEventListener('keyup', function (e) {
        var handleKeys = {
            13: 'enter',
            37: 'left',
            39: 'right',
        };
        gameManager.handleInput(handleKeys[e.keyCode]);
    });

    function keyListener(e) {
        var playingKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        player.handleInput(playingKeys[e.keyCode]);
    }

    global.ctx = ctx;
})(this);
