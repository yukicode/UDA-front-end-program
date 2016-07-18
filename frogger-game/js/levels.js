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
}

level1.enemies = {
    "type": "bug",
    "number": 4,
}

level1.player = {
    "iniCol": 3,
    "iniRow": 5,
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