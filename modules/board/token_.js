define([
], function () {
    var factory = function (image) {

        var variants = {
            0: {
                image: image,
                sx: 0,
                sy: 0,
                swidth: image.width,
                sheight: image.height
            }
        };

        var positions = {};

        var addVariant = function (id, sx, sy, swidth, sheight) {
            variants[id] = {
                image: image,
                sx: sx,
                sy: sy,
                swidth: swidth,
                sheight: sheight
            };
        };

        var getVariant = function (id) {
            return variants[id];
        };

        var addPosition = function (positionId, x, y, rotation) {
            positions[positionId] = {
                x: x,
                y: y,
                rotation: rotation * Math.PI / 180
            };
        };

        var addPositions = function (posarray) {
            for (let i = 0; i < posarray.length; i++) {
                addTokenPosition(i, posarray[i][0], posarray[i][1], posarray[i][2] || 0);
            }
        };        

        var that = {
            addVariant: addVariant,
            getVariant: getVariant,
            addPosition: addPosition,
            addPositions: addPositions
        };

        return that;
    };
    return factory;    
});