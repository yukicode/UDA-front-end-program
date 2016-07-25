//initialize in loadLevel
var Map = {},
    allRocks,
    allEdgeRocks,
    allEnemies,
    player,
    star,
    key,
    allGems,
    levelTitle = "",
    levelTimer = 0,
    allEndTexts = [];

var GameEntity = function(sprite, x, y){
    this.sprite = sprite;
    this.x = (x && (x === x >> 0)) ? x : 0; 
    this.y = (y && (y === y >> 0)) ? y : 0;
};

GameEntity.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

GameEntity.prototype.getRow = function(){
    return Math.floor((this.y + 110) / Map.rowHeight);
};

GameEntity.prototype.getCol = function(){
    return Math.ceil((this.x + Map.colWidth / 2) / Map.colWidth);
};

var Enemy = function() {
    GameEntity.call(this, "images/enemy-bug.png", this.randomColCoor(), this.randomRowCoor());
    this.speed = this.randomSpeed();
};

Enemy.prototype = Object.create(GameEntity.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.randomColCoor = function () {
    return Math.floor(Math.random() * Map.col) * Map.colWidth;
};

Enemy.prototype.randomRowCoor = function () {
    return Map.enemySpawningRows[Math.floor(Math.random() * Map.enemySpawningRows.length)] * Map.rowHeight - 110;
};

Enemy.prototype.randomSpeed = function () {
    return Math.floor((Math.random() * 15) + 5) * 20;
};

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

var Player = function(col, row){
    this.countDown = 40;
    this.isAlive = true;
    GameEntity.call(this, "images/char-boy.png", (col-1) * Map.colWidth, row * Map.rowHeight - 110);
};

Player.prototype = Object.create(GameEntity.prototype);
Player.prototype.constructor = Player;

//renders player image
//when player dies, render the "pausing" effect
Player.prototype.render = function () {
    if (this.isAlive) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }else{
        if (this.countDown % 10 > 4) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
        this.countDown --;
    }
};

Player.prototype.deathRenderEnd = function(){
    return this.countDown < 0;
}

//reset player's position to initional location of the level
Player.prototype.reset = function (col, row) {
    this.countDown = 40;
    this.isAlive = true;
    this.x = (col-1) * Map.colWidth;
    this.y = row * Map.rowHeight - 110;
};

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
};

//Star marks the goal of a level
//star can either be set to a certain block or a random column in the second row.
var Star = function(col, row){
    GameEntity.call(this, "images/Star.png");
    this.x = col ? (col-1) * Map.colWidth : this.randomColCoor();
    this.y = row ? row * Map.rowHeight - 110 : 56;
};

Star.prototype = Object.create(GameEntity.prototype);
Star.prototype.constructor = Star;

Star.prototype.randomColCoor = function () {
    return Math.floor(Math.random() * Map.col) * Map.colWidth;
};

//Rock are obstacles that can't be passed
//Bug will turn around when hitting a rock
var Rock = function(col, row){
    GameEntity.call(this, "images/Rock.png", (col-1) * Map.colWidth, row * Map.rowHeight - 110);
};

Rock.prototype = Object.create(GameEntity.prototype);
Rock.prototype.constructor = Rock;

var Key = function(col, row){
    GameEntity.call(this, "images/Key.png", (col-1) * Map.colWidth, row * Map.rowHeight - 110);
};

Key.prototype = Object.create(GameEntity.prototype);
Key.prototype.constructor = Key;

var Gem = function(col, row){
    GameEntity.call(this, this.randomColor(), (col-1) * Map.colWidth, row * Map.rowHeight - 110);
    this.respawnTimer = 9;
    this.needRespawn = false;
};

Gem.prototype = Object.create(GameEntity.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.randomColor = function(){
    var images = [
        "images/Gem-blue.png",
        "images/Gem-green.png",
        "images/Gem-orange.png",
    ];
    return images[Math.floor(Math.random() * 3)];
};

Gem.prototype.update = function(dt){
    if(this.needRespawn){
        this.respawnTimer -= dt;
        if(this.respawnTimer <= 0){
            this.needRespawn = false;
            this.respawnTimer = 9;
        }
    }
};

Gem.prototype.render = function(){
    if(!this.needRespawn){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

var LevelTitle = function (number, content) {
    this.number = number;
    this.content = content;
    this.timecount = 0;
    this.x = Map.col * Map.colWidth / 2;
    this.y = Map.row * Map.rowHeight / 2;
};

LevelTitle.prototype.render = function (width, height) {
    var title = this.number + " " + this.content;
    ctx.fillStyle = "white";
    ctx.fillRect(0,0, width, height);
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.font = "30pt Impact";
    ctx.fillText(title, this.x, this.y);
};

LevelTitle.prototype.renderEnds = function (dt) {
    this.timecount += dt;
    if (this.timecount > 2) {
        this.timecount = 0;
        return true;
    }
    return false;
};

var LevelTimer = function(countDownTime){
    this.time = countDownTime;
};

LevelTimer.prototype.update = function(dt){
    this.time -= dt;
};

LevelTimer.prototype.render = function(){
    if(this.time < 5){
        ctx.fillStyle = "yellow";
        if(countDownFontSize < 20){
            renderTimerMultiplier = 1;
        }
        if(countDownFontSize > 30){
            renderTimerMultiplier = -1;
        }
        countDownFontSize += 0.2 * renderTimerMultiplier;
    }else{
        ctx.fillStyle = "black";
        countDownFontSize = 20;
    }
    ctx.font = countDownFontSize.toString() + "pt Impact";
    ctx.fillText(Math.ceil(this.time), Map.col * Map.colWidth/2 , 100);
};

LevelTimer.prototype.extend = function(extendTime){
    this.time += extendTime;
};

var EndText = function(x, y, content){
    this.x = x;
    this.y = y;
    this.content = content;
    this.speed = 20;
}

EndText.prototype.update = function(dt) {
    this.y -= dt * this.speed;
}

EndText.prototype.render = function(){
    if(this.renderOnScreen()){
        ctx.fillStyle = "black";
        ctx.font = "20pt Impact";
        ctx.fillText(this.content, this.x, this.y);
    }
}

EndText.prototype.renderOnScreen = function() {
    return this.y < 500 && this.y > 200;
}