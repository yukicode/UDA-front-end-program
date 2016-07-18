var Level = function () {
    this.map;
    this.countDownTime;
    this.enemies;
    this.player;
    this.star;
    this.title;
}

var level1 = new Level();
level1.map = {
    "col": 5,
    "row": 6,
    "colWidth": 101,
    "rowHeight": 83,
    "rowContent": ["water", "paved", "paved", "paved", "grass", "grass", ],
    "pavedRows": [2,3,4],
}

level1.enemies = {
    "type": "bug",
    "number": 4,
}

level1.player = {
    "initCol": 3,
    "initRow": 5,
}

level1.star = {
    "iniCol": 0,
    "iniRow": 2,
}

level1.title = {
    "number": 1,
    "content": "The Star",
}

level1.countDownTime = 30;