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
    "enemySpawningRows": [2,3,4],
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

level1.countDownTime = 20;

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

var level3 = new Level();
level3.map = {
    "col": 7,
    "row": 8,
    "colWidth": 101,
    "rowHeight": 83,
    "rowContent": ["water", "paved", "paved", "paved", "paved", "paved", "paved", "grass", ],
    "enemySpawningRows": [2,3,4,5,6,7],
};
level3.enemies = {
    "type": "bug",
    "number": 6,
};

level3.player = {
    "initCol": 4,
    "initRow": 8,
};

level3.star = {
    "initCol": 3,
    "initRow": 2,
};

level3.key = {
    "initCol": 5,
    "initRow": 5,
};

level3.rocks = [[2, 2, true], [4, 2], [3, 3, true], [5, 4, true], [2, 5, true], [4, 5], [5, 6, true],
                [6, 7, true], [7, 8, true]];

level3.title = {
    "number": 3,
    "content": "The Key",
};

level3.countDownTime = 30;

var level4 = new Level();
level4.map = {
    "col": 7,
    "row": 8,
    "colWidth": 101,
    "rowHeight": 83,
    "rowContent": ["water", "paved", "paved", "paved", "paved", "paved", "paved", "grass", ],
    "enemySpawningRows": [2,3,4,5,6],
};
level4.enemies = {
    "type": "bug",
    "number": 8,
};

level4.player = {
    "initCol": 7,
    "initRow": 8,
};

level4.star = {
    "initCol": 1,
    "initRow": 8,
};
level4.gems = [
    {
        "initCol": 2,
        "initRow": 7,
    },
    {
        "initCol": 3,
        "initRow": 3,
    },
];

level4.key = {
    "initCol": 7,
    "initRow": 2,
};

level4.rocks = [[6, 2, true], [2, 3, true],[4, 3], [6, 3], [4, 4, true], [6, 4], [4, 5, true], [6, 5],
                [4, 6, true], [1, 7, true],　[4, 7],  [5, 7], [6, 7], [7, 7], [2, 8, true]];

level4.title = {
    "number": 4,
    "content": "The Time Gem",
};

level4.countDownTime = 10;