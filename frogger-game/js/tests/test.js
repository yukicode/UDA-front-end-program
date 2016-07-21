/// <reference path="../jasmine/jasmine.js" />
/// <reference path="../resources.js" />
/// <reference path="../levels.js" />
/// <reference path="../engine.js" />
/// <reference path="../app.js" />

describe("test GameEntity class", function () {
    
    it("should accept three parameters: image_src, x, y", function () {
        var gameEntity1 = new GameEntity("images/enemy-bug.png", 10, 20);
        expect(gameEntity1.x).toBe(10);
        expect(gameEntity1.y).toBe(20);
        expect(gameEntity1.sprite).toBe("images/enemy-bug.png");
    });
    
    it("will initialize to 0 if x and y are not integers", function () {
        var gameEntity2 = new GameEntity("image", 2.2, 2.2);
        expect(gameEntity2.x).toBe(0);
        expect(gameEntity2.y).toBe(0);
        expect(gameEntity2.sprite).toBe("image");
    });
    
    it("will initialize to 0 if x and y are not numbers", function () {
        var gameEntity3 = new GameEntity("image", "x", "y");
        expect(gameEntity3.x).toBe(0);
        expect(gameEntity3.y).toBe(0);
        expect(gameEntity3.sprite).toBe("image");
    });

    it("renders the image of the entity", function () {
        //to be implemented
    });

    it("gets the row and column of the entity", function () {
        var gameEntity4 = new GameEntity("images/enemy-bug.png", 0, 0);
        expect(gameEntity4.x).toBe(0);
        expect(gameEntity4.y).toBe(0);
        expect(gameEntity4.getRow()).toBe(1);
        expect(gameEntity4.getCol()).toBe(1);

        var gameEntity5 = new GameEntity("images/enemy-bug.png", 200, 200);
        expect(gameEntity5.x).toBe(200);
        expect(gameEntity5.y).toBe(200);
        expect(gameEntity5.getRow()).toBe(3);
        expect(gameEntity5.getCol()).toBe(3);
    });
});