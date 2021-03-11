define([
    "bgagame/modules/board/gametile"
], function (gametile) {

    var factory = function () {
    
        var tableElements = {};

        var addGameTile = function (id, image, x, y, rotation) {
            rotation = rotation || 0;
            var tile = gametile({
                image: image,
                x: x,
                y: y,
                rotation: rotation * Math.PI / 180
            });
            tableElements[id] = tile;
            return tile;
        };

        var getGameTile = function (id) {
            return tableElements[id];
        };

        var getAllGameTiles = function () {
            return tableElements;
        };

        return {
            addGameTile: addGameTile,
            getGameTile: getGameTile,   
            getAllGameTiles: getAllGameTiles         
        };
    };
    return factory;
});