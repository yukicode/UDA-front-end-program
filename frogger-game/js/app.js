//initialize in loadLevel
var Map = {},
    colWidth = 101,
    rowHeight = 83,
    allRocks,
    allEdgeRocks,
    allEnemies,
    player,
    star,
    levelTitle = "",
    levelTimer = 0;

var GameEntity = function(sprite, x, y){
    this.sprite = sprite;
    this.x = (x && (x === x >> 0)) ? x : 0; 
    this.y = (y && (y === y >> 0)) ? y : 0;
};

GameEntity.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

GameEntity.prototype.getRow = function(){
    return Math.floor((this.y + 110) / rowHeight);
};

GameEntity.prototype.getCol = function(){
    return Math.ceil((this.x + colWidth / 2) / colWidth);
};

var Enemy = function() {
    GameEntity.call(this, "images/enemy-bug.png", this.randomColCoor(), this.randomRowCoor());
    this.speed = this.randomSpeed();
};

Enemy.prototype = Object.create(GameEntity.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.randomColCoor = function () {
    return Math.floor(Math.random() * Map.col) * colWidth;
};

Enemy.prototype.randomRowCoor = function () {
    return Map.enemySpawningRows[Math.floor(Math.random() * Map.enemySpawningRows.length)] * rowHeight - 110;
};

Enemy.prototype.randomSpeed = function () {
    return Math.floor((Math.random() * 15) + 5) * 20;
};

Enemy.prototype.update = function(dt) {
    this.x += dt * this.speed;
    //reset enemy if it is out of the canvas
    if (this.x > 101 * 5 || this.x < -Map.colWidth * 1.2) {
        this.sprite = "images/enemy-bug.png";
        this.x = -Map.colWidth * 1.2;
        this.y = this.randomRowCoor();
        this.speed = this.randomSpeed();
    }
};

var Player = function(row, col){
    this.startX = (col-1) * Map.colWidth;
    this.startY = row * Map.rowHeight - 110;
    this.countDown = 40;
    GameEntity.call(this, "images/char-boy.png", this.startX, this.startY);
}

Player.prototype = Object.create(GameEntity.prototype);
Player.prototype.constructor = Player;

//set player's starting location at the beginning of a new level
Player.prototype.setStartingLocation = function (row, col) {
    this.startX = (col-1) * Map.colWidth;
    this.startY = row * Map.rowHeight - 110;
    this.x = this.startX;
    this.y = this.startY;
}

//renders the "pausing" effect when player dies
Player.prototype.collisionRender = function () {
    if (this.countDown === 0) {
        this.reset();
        return 0;
    }else if (this.countDown % 10 > 4) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    return this.countDown--;
}

//reset player's position to initional location
Player.prototype.reset = function () {
    this.countDown = 40;
    this.x = this.startX;
    this.y = this.startY;
}

Player.prototype.handleInput = function (move) {
    if (!move) { return;}

    var _player = this;

    function hitRock(){
        for(rock of allRocks){
            if(rock.x === _player.x && rock.y === _player.y){
                return true;
            }
        }
        return false;
    }

    function outOfBoundary(){
        if(_player.y < 0 || _player.x < 0 || _player.getRow() > Map.row || _player.getCol() > Map.col){
            return true;
        }
        return false;
    }

    switch (move) {
        case 'up':
            this.y = this.y - Map.rowHeight;
            if(outOfBoundary() || hitRock()){
                this.y = this.y + Map.rowHeight;
            }
            break;
        case 'down':
            this.y = this.y + Map.rowHeight;
            if(outOfBoundary() || hitRock()){
                this.y = this.y - Map.rowHeight;
            }
            break;
        case 'left':
            this.x = this.x - Map.colWidth;
            if(outOfBoundary() || hitRock()){
                this.x = this.x + Map.colWidth;
            }
            break;
        case 'right':
            this.x = this.x + Map.colWidth;
            if(outOfBoundary() || hitRock()){
                this.x = this.x - Map.colWidth;
            }
            break;
    }
}

//Star marks the goal of a level
//star can either be set to a certain block or a random column in the second row.
var Star = function(col, row){
    GameEntity.call(this, "images/Star.png");
    this.x = col ? (col-1) * Map.colWidth : this.randomColCoor();
    this.y = row ? 56 : row * Map.rowHeight - 110;
}

Star.prototype = Object.create(GameEntity.prototype);
Star.prototype.constructor = Star;

Star.prototype.randomColCoor = function () {
    return Math.floor(Math.random() * Map.col) * colWidth;
};

//Rock are obstacles that can't be passed
//Bug will turn around when hitting a rock
var Rock = function(col, row){
    GameEntity.call(this, "images/Rock.png", (col-1) * Map.colWidth, row * Map.rowHeight - 110);
}

Rock.prototype = Object.create(GameEntity.prototype);
Rock.prototype.constructor = Rock;

var LevelTitle = function (number, content) {
    this.number = number;
    this.content = content;
    this.timecount = 0;
    this.x = Map.col * Map.colWidth / 2;
    this.y = Map.row * Map.rowHeight / 2;
}

LevelTitle.prototype.render = function (width, height) {
    var title = this.number + " " + this.content;
    ctx.fillStyle = "white";
    ctx.fillRect(0,0, width, height);
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.font = "30pt Impact";
    ctx.fillText(title, this.x, this.y);
}

LevelTitle.prototype.renderEnds = function (dt) {
    this.timecount += dt;
    if (this.timecount > 2) {
        this.timecount = 0;
        return true;
    }
    return false;
}