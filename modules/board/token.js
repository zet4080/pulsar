define([
], function () {
    var factory = function (image) {

        var tokenVariants = {
            0: {
                image: image
            }
        };

        var addTokenVariant = function (id, sx, sy, swidth, sheight) {
            tokenVariants[id] = {
                image: image,
                sx: sx,
                sy: sy,
                swidth: swidth,
                sheight: sheight
            };
        };

        var getTokenVariant = function (id) {
            return tokenVariants[id];
        };

        var that = {
            addTokenVariant: addTokenVariant,
            getTokenVariant: getTokenVariant
        };

        return that;
    };
    return factory;    
});