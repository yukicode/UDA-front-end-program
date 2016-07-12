//store the set up of the map
var Map = {
    "col": 5,
    "row": 6,
    "colWidth": 101,
    "rowHeight": 83,
    "waterRow": {
        "lowerLimit": 1,
        "upperLimit": 1,
    },
    "pavedRow": {
        "lowerLimit": 2,
        "upperLimit": 4,
    },
    "grassRow": {
        "lowerLimit": 5,
        "upperLimit": 6,
    },
};

var helper = {
    "randomColCoor": function () {
        return Math.floor(Math.random() * Map.col) * Map.colWidth;
    },
    "randomRowCoor": function () {
        return Math.floor((Math.random() * (Map.pavedRow.upperLimit - Map.pavedRow.lowerLimit + 1)) + Map.pavedRow.lowerLimit) * Map.rowHeight -110;
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

    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = helper.randomColCoor();
    this.y = helper.randomRowCoor();
    this.speed = helper.randomSpeed();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;
    //reset enemy if it is out of the canvas
    if (this.x > 101 * 5) {
        this.x = -Map.colWidth * 1.5;
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
var Player = function () {
    this.sprite = "images/char-boy.png";
    this.x = (Map.col / 2 - 0.5) * Map.colWidth;
    this.y = Map.grassRow.lowerLimit * Map.rowHeight - 110;
}

Player.prototype.update = function () {
    //console.log(helper.getCol(this.x), helper.getRow(this.y));
}

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.reset = function () {
    this.x = (Map.col / 2 - 0.5) * Map.colWidth;
    this.y = Map.grassRow.lowerLimit * Map.rowHeight - 110;
}

Player.prototype.handleInput = function (move) {
    switch (move) {
        case 'up':
            this.y = this.y - Map.rowHeight < 0 ? this.y : this.y - Map.rowHeight;
            break;
        case 'down':
            this.y = this.y + Map.rowHeight > Map.row * Map.rowHeight - 110 ? this.y : this.y + Map.rowHeight;
            break;
        case 'left':
            this.x = this.x - Map.colWidth < 0 ? this.x : this.x - Map.colWidth;
            break;
        case 'right':
            this.x = this.x + Map.colWidth > (Map.col-1) * Map.colWidth ? this.x : this.x + Map.colWidth;
            break;
    }
}

Player.prototype.getRow = function () {
    return helper.getRow(this.y);
}

Player.prototype.getCol = function () {
    return helper.getCol(this.x);
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i = 0; i < 4; i++){
    allEnemies.push(new Enemy());
}

var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
