level1 = {
    map: {
        "col": 5,
        "row": 6,
        "colWidth": 101,
        "rowHeight": 83,
        "rowContent": ["water", "paved", "paved", "paved", "grass", "grass", ],
        "enemySpawningRows": [2,3,4],
    },
    enemies: {
        "type": "bug",
        "number": 4,
    },
    player: {
        "initCol": 3,
        "initRow": 5,
    },
    star: {
        "initCol": 0,
        "initRow": 3,
    },
    title: {
        "number": 1,
        "content": "The Star",
    },
    countDownTime: 20,
    levelCompleteTiles: [[1,2], [2,2], [3,2], [4,2], [5,2]],
};

level2 = {
    map: {
        "col": 5,
        "row": 6,
        "colWidth": 101,
        "rowHeight": 83,
        "rowContent": ["water", "paved", "paved", "paved", "paved", "grass"],
        "enemySpawningRows": [2,4,5],
    },
    enemies: {
        "type": "bug",
        "number": 4,
    },
    player: {
        "initCol": 3,
        "initRow": 6,
    },
    star: {
        "initCol": 4,
        "initRow": 4,
    },
    rocks: [[1, 3, true], [3, 3], [4, 3], [5, 3]],
    title: {
        "number": 2,
        "content": "The Rock",
    },
    countDownTime: 30,
    levelCompleteTiles: [[4,2]],
};

level3 = {
    map:{
        "col": 7,
        "row": 8,
        "colWidth": 101,
        "rowHeight": 83,
        "rowContent": ["water", "paved", "paved", "paved", "paved", "paved", "paved", "grass", ],
        "enemySpawningRows": [2,3,4,5,6,7],
    },
    enemies: {
        "type": "bug",
        "number": 6,
    },
    player: {
        "initCol": 4,
        "initRow": 8,
    },
    star: {
        "initCol": 3,
        "initRow": 2,
    },
    key: {
        "initCol": 5,
        "initRow": 5,
    },
    rocks: [[2, 2, true], [4, 2], [3, 3, true], [5, 4, true], [2, 5, true], [4, 5], [5, 6, true],
            [6, 7, true], [7, 8, true]],
    title: {
        "number": 3,
        "content": "The Key",
    },
    countDownTime: 30,
    levelCompleteTiles: [[4,2]],
};

level4 = {
    map: {
        "col": 7,
        "row": 8,
        "colWidth": 101,
        "rowHeight": 83,
        "rowContent": ["water", "paved", "paved", "paved", "paved", "paved", "paved", "grass", ],
        "enemySpawningRows": [2,3,4,5,6],
    },
    enemies: {
        "type": "bug",
        "number": 8,
    },
    player: {
        "initCol": 7,
        "initRow": 8,
    },
    star: {
        "initCol": 1,
        "initRow": 8,
    },
    gems: [
        {
            "initCol": 2,
            "initRow": 7,
        },
        {
            "initCol": 3,
            "initRow": 3,
        },
    ],
    key: {
        "initCol": 7,
        "initRow": 2,
    },
    rocks: [[6, 2, true], [2, 3, true],[4, 3], [6, 3], [4, 4, true], [6, 4], [4, 5, true], [6, 5],
            [4, 6, true], [1, 7, true],　[4, 7],  [5, 7], [6, 7], [7, 7], [2, 8, true]],
    title: {
        "number": 4,
        "content": "The Time Gem",
    },
    countDownTime: 10,
    levelCompleteTiles: [[1,2], [2,2], [3,2], [4,2], [5,2], [6,2], [7,2]],
};