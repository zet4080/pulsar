define([
    "bgagame/modules/board/gametile"
], function (gametile) {

    var factory = function () {
    
        var tableElements = {};

        var addGameTile = function (tileId, image, x, y, rotation) {
            rotation = rotation || 0;
            var tile = gametile({
                tileId: tileId,
                image: image,
                x: x,
                y: y,
                rotation: rotation * Math.PI / 180
            });
            tableElements[tileId] = tile;
            return tile;
        };

        var getGameTile = function (tileId) {
            return tableElements[tileId];
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