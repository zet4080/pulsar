define([
], function () {
    var factory = function (properties) {

        var elements = {};
        var image = properties.image;
        var x = properties.x;
        var y = properties.y;

        var draw = function (context) {
            context.drawImage(image, x, y);
        };

        var that = {
            draw: draw
        };
        
        return that;
    };
    return factory;    
});