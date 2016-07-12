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
        gameManager;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    gameManager = {
        boot: function () {
            this.state = "title";
        },
        title: function () {
            renderTitlePage();
        },
        start: function (dt) {
            update(dt);
            render();
        },
        handleInput: function (key) {
            if (key === "space" && this.state === "title") {
                this.state = "start";
                console.log(this.state);
            }
        },
        execute: function(dt){
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
        updateEntities(dt);
        checkCollisions();
    }

    function checkCollisions() {
        var playerRow = player.getRow();
        for (var e of allEnemies) {
            if (e.getRow() !== playerRow) { continue; }
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

    function renderTitlePage() {
        renderMap();
        ctx.font = "60pt Impact";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText("FROGGER", 250, 250);
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 2;
        ctx.strokeText("FROGGER", 250, 250);
        ctx.font = "30pt Impact";
        ctx.fillText("Press Space to Start", 250, 450);
        ctx.strokeText("Press Space to Start", 250, 450);
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
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    document.addEventListener('keyup', function (e) {
        if (e.keyCode === 32) {
            gameManager.handleInput("space");
        }
    })

    global.ctx = ctx;
})(this);
