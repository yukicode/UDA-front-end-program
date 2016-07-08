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
    "randomCol": function() {
        return Math.floor(Math.random() * Map.col) * Map.colWidth;
    },
    "randomRow": function() {
        return Math.floor((Math.random() * (Map.pavedRow.upperLimit - Map.pavedRow.lowerLimit + 1)) + Map.pavedRow.lowerLimit) * Map.rowHeight - 110;
    },
    "randomSpeed": function() {
        return Math.floor((Math.random() * 15) + 5) * 20;
    },
}

// Enemies our player must avoid
var Enemy = function () {

    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = helper.randomCol();
    this.y = helper.randomRow();
    this.speed = helper.randomSpeed();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;
    if (this.x > 101 * 5) {
        this.x = -Map.colWidth * 1.5;
        this.y = helper.randomRow();
        this.speed = helper.randomSpeed();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i = 0; i < 4; i++){
    allEnemies.push(new Enemy());
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    //player.handleInput(allowedKeys[e.keyCode]);
});
