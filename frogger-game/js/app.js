//initialize in loadLevel
var Map = {},
    allRocks, //all of the rocks
    allEdgeRocks, //all the rocks that need to check collision with enemies (the left most one of each row)
    allEnemies,
    player,
    star, //collectables of each level
    key, //disable all of the rocks
    allGems, //gems can extend the time of the level
    levelTitle = "",
    levelTimer = 0,
    allEndTexts = [],
    allIntroTexts = [],
    allLevelCompleteTiles = [],
    foundStar = false;

//superclass for all game entities
var GameEntity = function(sprite, x, y) {
    this.sprite = sprite;
    this.x = (x && (x === x >> 0)) ? x : 0; //check if x is passed in and is integer, if not then default to zero
    this.y = (y && (y === y >> 0)) ? y : 0;
};

//render the image of the entity
GameEntity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//return the row of the entity
GameEntity.prototype.getRow = function() {
    return Math.floor((this.y + 110) / Map.rowHeight);
};

//return the column of the entity
GameEntity.prototype.getCol = function() {
    return Math.ceil((this.x + Map.colWidth / 2) / Map.colWidth);
};

//Enemy class
var Enemy = function() {
    GameEntity.call(this, "images/enemy-bug.png", this.randomColCoor(), this.randomRowCoor());
    this.speed = this.randomSpeed();
};

Enemy.prototype = Object.create(GameEntity.prototype);
Enemy.prototype.constructor = Enemy;

//randomize x coordinate of the enemy
Enemy.prototype.randomColCoor = function() {
    return Math.floor(Math.random() * Map.col) * Map.colWidth;
};

//randomize y coordinate of the enemy
Enemy.prototype.randomRowCoor = function() {
    return Map.enemySpawningRows[Math.floor(Math.random() * Map.enemySpawningRows.length)] * Map.rowHeight - 110;
};

//randomize the speed of the enemy
Enemy.prototype.randomSpeed = function() {
    return Math.floor((Math.random() * 15) + 5) * 20;
};

//update enemy position
Enemy.prototype.update = function(dt) {
    this.x += dt * this.speed;
    //reset enemy if it is out of the canvas
    if (this.x > Map.colWidth * Map.col || this.x < -Map.colWidth * 1.2) {
        this.sprite = "images/enemy-bug.png";
        this.x = -Map.colWidth * 1.2;
        this.y = this.randomRowCoor();
        this.speed = this.randomSpeed();
    }
};

//Player class
var Player = function(col, row) {
    this.countDown = 40;
    this.isAlive = true;
    GameEntity.call(this, "images/char-boy.png", (col - 1) * Map.colWidth, row * Map.rowHeight - 110);
};

Player.prototype = Object.create(GameEntity.prototype);
Player.prototype.constructor = Player;

//renders player image
//when player dies, render the "pausing" effect
Player.prototype.render = function() {
    if (this.isAlive) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    } else {
        if (this.countDown % 10 > 4) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
        this.countDown--;
    }
};

//Check if the "puasing" effect has ended
Player.prototype.deathRenderEnd = function() {
    return this.countDown < 0;
};

//Reset player's position to initional location of the level
Player.prototype.reset = function(col, row) {
    this.countDown = 40;
    this.isAlive = true;
    this.x = (col - 1) * Map.colWidth;
    this.y = row * Map.rowHeight - 110;
};

//player's status is only undated in handleInput (there's no update function)
//player can move towards four directions: up, down, left, right
//player can't move into a rock
//player can't move out of the boundary of the map
Player.prototype.handleInput = function(move) {
    if (!move) {
        return;
    }

    var _player = this,
        rockNumber = allRocks.length;
    //check if player is on a rock
    function hitRock() {
        for (var i = 0; i < rockNumber; i++) {
            if (allRocks[i].x === _player.x && allRocks[i].y === _player.y) {
                return true;
            }
        }
        return false;
    }
    //check if player is out of boundary
    function outOfBoundary() {
        if (_player.y < 0 || _player.x < 0 || _player.getRow() > Map.row || _player.getCol() > Map.col) {
            return true;
        }
        return false;
    }

    switch (move) {
        case "up":
            this.y = this.y - Map.rowHeight;
            if (outOfBoundary() || hitRock()) {
                this.y = this.y + Map.rowHeight;
            }
            break;
        case "down":
            this.y = this.y + Map.rowHeight;
            if (outOfBoundary() || hitRock()) {
                this.y = this.y - Map.rowHeight;
            }
            break;
        case "left":
            this.x = this.x - Map.colWidth;
            if (outOfBoundary() || hitRock()) {
                this.x = this.x + Map.colWidth;
            }
            break;
        case "right":
            this.x = this.x + Map.colWidth;
            if (outOfBoundary() || hitRock()) {
                this.x = this.x - Map.colWidth;
            }
            break;
    }
};

//Star class
var Star = function(col, row) {
    GameEntity.call(this, "images/Star.png");
    this.x = col ? (col - 1) * Map.colWidth : this.randomColCoor();
    this.y = row ? row * Map.rowHeight - 110 : 56;
};

Star.prototype = Object.create(GameEntity.prototype);
Star.prototype.constructor = Star;

//randomize x coordinate of the star
Star.prototype.randomColCoor = function() {
    return Math.floor(Math.random() * Map.col) * Map.colWidth;
};

//Rock class
var Rock = function(col, row) {
    GameEntity.call(this, "images/Rock.png", (col - 1) * Map.colWidth, row * Map.rowHeight - 110);
};

Rock.prototype = Object.create(GameEntity.prototype);
Rock.prototype.constructor = Rock;

//Key class
var Key = function(col, row) {
    GameEntity.call(this, "images/Key.png", (col - 1) * Map.colWidth, row * Map.rowHeight - 110);
};

Key.prototype = Object.create(GameEntity.prototype);
Key.prototype.constructor = Key;

//Gem class
var Gem = function(col, row) {
    GameEntity.call(this, this.randomColor(), (col - 1) * Map.colWidth, row * Map.rowHeight - 110);
    this.respawnTimer = 10;
    this.needRespawn = false;
};

Gem.prototype = Object.create(GameEntity.prototype);
Gem.prototype.constructor = Gem;

//randomize the color of the gem
Gem.prototype.randomColor = function() {
    var images = [
        "images/Gem-blue.png",
        "images/Gem-green.png",
        "images/Gem-orange.png",
    ];
    return images[Math.floor(Math.random() * 3)];
};

//Gem respawns 10 seconds after player gets it
Gem.prototype.update = function(dt) {
    if (this.needRespawn) {
        this.respawnTimer -= dt;
        if (this.respawnTimer <= 0) {
            this.needRespawn = false;
            this.respawnTimer = 10;
        }
    }
};

//Do not render gem when it's comsumed and not resawned yet
Gem.prototype.render = function() {
    if (!this.needRespawn) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

//Level Complete Tile class
//The tiles that player must reach to complete the level
var LevelCompleteTile = function(col, row) {
    this.isActive = false;
    this.multiplier = 1;
    this.deltaY = 0;
    GameEntity.call(this, "images/arrow-gray.png", (col - 1) * Map.colWidth, row * Map.rowHeight - 80);
};

LevelCompleteTile.prototype = Object.create(GameEntity.prototype);
LevelCompleteTile.prototype.constructor = LevelCompleteTile;

//move the arrow up and down when the tile is active
LevelCompleteTile.prototype.update = function(dt) {
    if (this.isActive) {
        this.deltaY -= this.multiplier * dt * 15;
        this.y -= this.multiplier * dt * 15;
        if (this.deltaY < -10) {
            this.multiplier = -1;
        }
        if (this.deltaY > 0) {
            this.multiplier = 1;
        }
    }
};

//Level Title Class
//The title of the level
var LevelTitle = function(number, content) {
    this.number = number;
    this.content = content;
    this.timecount = 0;
    this.x = Map.col * Map.colWidth / 2;
    this.y = Map.row * Map.rowHeight / 2;
};

LevelTitle.prototype.render = function(width, height) {
    var title = this.number + " " + this.content;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.font = "30pt Impact";
    ctx.fillText(title, this.x, this.y);
};

//Check if the title has been rendered for 2 seconds
LevelTitle.prototype.renderEnds = function(dt) {
    this.timecount += dt;
    if (this.timecount > 2) {
        this.timecount = 0;
        return true;
    }
    return false;
};

//Level Timer Class
//Player fails when timer goes to 0
var LevelTimer = function(countDownTime) {
    this.time = countDownTime;
    this.renderTimerMultiplier = 1;
    this.countDownFontSize = 20;
};

//reduce timer by the time passed
LevelTimer.prototype.update = function(dt) {
    this.time -= dt;
};

//Renders the count down timer in seconds
//Renders zoom in zoom out effect when there's les than 5 seconds left
LevelTimer.prototype.render = function() {
    if (this.time < 5) {
        ctx.fillStyle = "yellow";
        if (this.countDownFontSize < 20) {
            this.renderTimerMultiplier = 1;
        }
        if (this.countDownFontSize > 30) {
            this.renderTimerMultiplier = -1;
        }
        this.countDownFontSize += 0.2 * this.renderTimerMultiplier;
    } else {
        ctx.fillStyle = "black";
        this.countDownFontSize = 20;
    }
    ctx.font = this.countDownFontSize.toString() + "pt Impact";
    ctx.fillText(Math.ceil(this.time), Map.col * Map.colWidth / 2, 100);
};

//extend certain amount of time on the timer
LevelTimer.prototype.extend = function(extendTime) {
    this.time += extendTime;
};

//Game Text Class
//Text that move in the canvas
var GameText = function(x, y, content) {
    this.x = x;
    this.y = y;
    this.content = content;
    this.speed = 40;
};

//Text moves up from the bottom of the canvas
GameText.prototype.update = function(dt) {
    this.y -= dt * this.speed;
};

//Render the text when text is at desired position of the canvas
GameText.prototype.render = function() {
    if (this.renderOnScreen()) {
        ctx.fillStyle = "black";
        ctx.font = "20pt Impact";
        ctx.textAlign = "center";
        ctx.fillText(this.content, this.x, this.y);
    }
};

//Check if the text is at the desired position for rendering
GameText.prototype.renderOnScreen = function() {
    return this.y < 450 && this.y > 200;
};