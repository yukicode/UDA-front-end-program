//initialize in loadLevel
var Map = {},
    allRocks,
    allEdgeRocks,
    allEnemies,
    player,
    star,
    levelTitle = "",
    levelTimer = 0;

var helper = {
    "randomColCoor": function () {
        return Math.floor(Math.random() * Map.col) * Map.colWidth;
    },
    "randomRowCoor": function () {
        return Map.enemySpawningRows[Math.floor(Math.random() * Map.enemySpawningRows.length)] * Map.rowHeight -110;
    },
    "randomSpeed": function() {
        return Math.floor((Math.random() * 15) + 5) * 20;
    },
    "getRow": function (y) {
        return (y + 110) / Map.rowHeight;
    },
    "getCol": function (x) {
        return Math.ceil((x + Map.colWidth / 2) / Map.colWidth);
    },
}

// Enemies our player must avoid
var Enemy = function () {
    this.sprite = "images/enemy-bug.png";
    this.x = helper.randomColCoor();
    this.y = helper.randomRowCoor();
    this.speed = helper.randomSpeed();
};

Enemy.prototype.update = function(dt) {
    this.x += dt * this.speed;
    //reset enemy if it is out of the canvas
    if (this.x > 101 * 5 || this.x < -Map.colWidth * 1.2) {
        this.sprite = "images/enemy-bug.png";
        this.x = -Map.colWidth * 1.2;
        this.y = helper.randomRowCoor();
        this.speed = helper.randomSpeed();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.getRow = function () {
    return helper.getRow(this.y);
}

Enemy.prototype.getCol = function () {
    return helper.getCol(this.x);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (row, col) {
    this.startX = (col-1) * Map.colWidth;
    this.startY = row * Map.rowHeight - 110;
    this.sprite = "images/char-boy.png";
    this.x = this.startX;
    this.y = this.startY;
    this.countDown = 40;
}

Player.prototype.update = function () {
}

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
    switch (move) {
        case 'up':
            this.y = this.y - Map.rowHeight;
            if(this.outOfBoundary() || this.hitRock()){
                this.y = this.y + Map.rowHeight;
            }
            break;
        case 'down':
            this.y = this.y + Map.rowHeight;
            if(this.outOfBoundary() || this.hitRock()){
                this.y = this.y - Map.rowHeight;
            }
            break;
        case 'left':
            this.x = this.x - Map.colWidth;
            if(this.outOfBoundary() || this.hitRock()){
                this.x = this.x + Map.colWidth;
            }
            break;
        case 'right':
            this.x = this.x + Map.colWidth;
            if(this.outOfBoundary() || this.hitRock()){
                this.x = this.x - Map.colWidth;
            }
            break;
    }
}

Player.prototype.hitRock = function(){
    for(rock of allRocks){
        if(rock.x === this.x && rock.y === this.y){
            return true;
        }
    }
    return false;
}

Player.prototype.outOfBoundary = function(){
    if(this.y < 0 || this.x < 0 || this.getRow() > Map.row || this.getCol() > Map.col){
        return true;
    }
    return false;
}

Player.prototype.getRow = function () {
    return helper.getRow(this.y);
}

Player.prototype.getCol = function () {
    return helper.getCol(this.x);
}

var Star = function (col, row) {
    this.sprite = "images/Star.png";
    this.x =  col ? (col-1) * Map.colWidth : helper.randomColCoor();
    this.y = row * Map.rowHeight - 110;
}

Star.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Star.prototype.getRow = function () {
    return helper.getRow(this.y);
}

Star.prototype.getCol = function () {
    return helper.getCol(this.x);
}

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

var Rock = function(col, row){
    this.sprite = "images/Rock.png";
    this.x = (col-1) * Map.colWidth;
    this.y = row * Map.rowHeight - 110;
}

Rock.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
