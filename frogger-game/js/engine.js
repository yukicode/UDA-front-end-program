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
        gameManager,
        playerImages = [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
        ];

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    gameManager = {
        boot: function () {
            this.state = "title";
        },
        title: function () {
            renderMap();
            renderTitleText();
        },
        selectCharactor: function () {
            renderMap();
            renderCharactor(this.selectedPlayer);
        },
        start: function (dt) {
            update(dt);
            render();
        },
        playerDie: function () {

        },
        endGame: function () {

        },
        handleInput: function (key) {
            if (key === "enter" && this.state === "title") {
                this.state = "selectCharactor";
            }else if (key === "enter" && this.state === "selectCharactor") {
                player.sprite = playerImages[this.selectedPlayer];
                addListenerForControl();
                this.state = "start";
            }else if (key === "left" && this.state === "selectCharactor") {
                if (this.selectedPlayer === 0) { return;}
                this.selectedPlayer--;
            }else if (key === "right" && this.state === "selectCharactor") {
                if (this.selectedPlayer === 3) { return; }
                this.selectedPlayer++;
            }
        },
        execute: function (dt) {
            this[this.state](dt);
        },
        state: "boot",
        selectedPlayer: 0,
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
        updateEntities(dt);
        checkCollisions();
    }

    function checkCollisions() {
        var playerRow = player.getRow();
        for (var e of allEnemies) {
            if (e.getRow() !== playerRow) {
                continue;
            }
            if (player.x - e.x < 81 && player.x - e.x > -81) {
                player.collided = true;
            }
        }
    }

    function updateEntities(dt) {
        allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    function render() {
        renderMap();
        renderEntities();
    }

    function renderMap() {
        var rowImages = [
               'images/water-block.png',   // Top row is water
               'images/stone-block.png',   // Row 1 of 3 of stone
               'images/stone-block.png',   // Row 2 of 3 of stone
               'images/stone-block.png',   // Row 3 of 3 of stone
               'images/grass-block.png',   // Row 1 of 2 of grass
               'images/grass-block.png'    // Row 2 of 2 of grass
        ],
           numRows = 6,
           numCols = 5,
           row, col;

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
    }

    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function (enemy) {
            enemy.render();
        });

        player.render();
    }

    function renderTitleText() {
        ctx.font = "60pt Impact";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText("FROGGER", 250, 250);
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 2;
        ctx.strokeText("FROGGER", 250, 250);
        ctx.font = "30pt Impact";
        ctx.fillText("Press Enter to Start", 250, 450);
        ctx.strokeText("Press Enter to Start", 250, 450);
    }

    function renderCharactor(selected) {
        var length = playerImages.length,
        centerX = Math.floor(canvas.width / 2);

        for (var i = 0; i < length; i++) {
            ctx.drawImage(Resources.get(playerImages[i]), centerX + 101 * (i - 2), 200);
        }
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX + 101 * (selected - 2), 200, 101, 171);
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
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
    ]);
    Resources.onReady(init);

    document.addEventListener('keyup', function (e) {
        handleKeys = {
            13: 'enter',
            37: 'left',
            39: 'right',
        }
        gameManager.handleInput(handleKeys[e.keyCode]);
    })

    function addListenerForControl() {
        // This listens for key presses and sends the keys to your
        // Player.handleInput() method. You don't need to modify this.
        document.addEventListener('keyup', function (e) {
            var playingKeys = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            };

            player.handleInput(playingKeys[e.keyCode]);
        });
    }

    global.ctx = ctx;
})(this);
