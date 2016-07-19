var Level = function () {
    this.map;
    this.countDownTime;
    this.enemies;
    this.player;
    this.star;
    this.title;
};

var level1 = new Level();
level1.map = {
    "col": 5,
    "row": 6,
    "colWidth": 101,
    "rowHeight": 83,
    "rowContent": ["water", "paved", "paved", "paved", "grass", "grass", ],
    "pavedRows": [2,3,4],
};

level1.enemies = {
    "type": "bug",
    "number": 4,
};

level1.player = {
    "initCol": 3,
    "initRow": 5,
};

level1.star = {
    "initCol": 0,
    "initRow": 2,
};

level1.title = {
    "number": 1,
    "content": "The Star",
};

level1.countDownTime = 30;

var level2 = new Level();
level2.map = {
    "col": 5,
    "row": 6,
    "colWidth": 101,
    "rowHeight": 83,
    "rowContent": ["water", "paved", "paved", "paved", "paved", "grass"],
    "enemySpawningRows": [2,4,5],
};

level2.enemies = {
    "type": "bug",
    "number": 4,
};

level2.player = {
    "initCol": 3,
    "initRow": 6,
};

level2.star = {
    "initCol": 4,
    "initRow": 2,
};

//rocks stores the coordinations of each rock
//if a rock is the left most one of a row, it needs to check against enemies in the game
//format of rock: [col, row, isLeftMostOfRow]
level2.rocks = [[1, 3, true], [3, 3], [4, 3], [5, 3]];

level2.title = {
    "number": 2,
    "content": "The Rock",
};

level2.countDownTime = 30;