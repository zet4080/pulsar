define([
], function () {
    var factory = function (properties) {

        var sprites = {};
        var image = properties.image;
        var x = properties.x || 0;
        var y = properties.y || 0;
        var rotation = properties.rotation || 0;

        var positions = {};

        var draw = function (context) {
            context.save();
            context.translate(x, y);
            context.rotate(rotation);
            context.drawImage(image, 0, 0);
            for (var key in sprites) {
                sprites[key].draw(context);
            }
            context.restore();
        };

        var addSprite = function (id, image) {
            var tile = factory({
                image: image
            });
            sprites[id] = tile;
            return tile;
        }

        var addPosition = function (id, x, y, rotation) {
            rotation = rotation || 0;
            positions[id] = {
                x: x || 0,
                y: y || 0, 
                rotation: rotation * Math.PI / 180
            };
        };

        var setPosition = function (id) {
            x = positions[id].x;
            y = positions[id].y;
            rotation = positions[id].rotation;
        };

        var that = {
            draw: draw, 
            addSprite: addSprite,
            addPosition: addPosition,
            setPosition: setPosition
        };

        return that;
    };
    return factory;    
});