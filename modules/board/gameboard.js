define([
    "dojo/_base/lang"
], function (lang) {

    const factory = function () {

        let tilePositions = {};
        let gametiles = {};
        
        const addTilePosition = function (position, parent, x, y, width, height) {
            if (!lang.isString(parent)) {
                height = width;
                width = y;
                y = x;
                x = parent;
                parent = null;
            }
            tilePositions[position] = {
                parent: parent,
                x: x,
                y: y,
                width: width,
                height: height,
            }
        };

        const addGameTile = function (gametile, position) {
            gametiles[position] = gametile;
        };

        const getAllGameTiles = function () {
            return gametiles;
        };

        const getGameTile = function (position) {
            return gametiles[position];
        }

        const getTilePosition = function (position) {
            return tilePositions[position];
        }

        return {
            addTilePosition: addTilePosition,
            addGameTile: addGameTile,
            getAllGameTiles: getAllGameTiles,
            getTilePosition: getTilePosition,
            getGameTile: getGameTile
        }

    };

    return factory;

});