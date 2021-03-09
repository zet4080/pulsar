define([
], function () {
    var factory = function (properties) {

        var spriteTemplates = {};
        
        var sprites = {};
        var positions = {};
        var variants = {};

        var image = properties.image;
        var x = properties.x || 0;
        var y = properties.y || 0;
        var rotation = properties.rotation || 0;

        var sx = properties.sx;
        var sy = properties.sy;
        var swidth = properties.swidth;
        var sheight = properties.sheight;

        var drawImage = function (context, image) {
            if (sx == undefined || sx == null) {
                context.drawImage(image, 0, 0);
            } else {
                context.drawImage(image, sx, sy, swidth, sheight, 0, 0, swidth, sheight);                
            }
        };

        var draw = function (context) {
            context.save();
            context.translate(x, y);
            context.rotate(rotation);
            drawImage(context, image);
            for (var key in sprites) {
                for (var i = 0; i < sprites[key].length; i++) {
                    sprites[key][i].draw(context);
                }
            }
            context.restore();
        };

        var addSprite = function (id, posid, varid) {
            var template = spriteTemplates[id];
            var pos = template.getPosition(posid);
            var variant = template.getVariant(varid) || {};
            var sprite = factory({
                image: template.getImage(),
                x: pos.x,
                y: pos.y,
                rotation: pos.rotation,
                sx: variant.x,
                sy: variant.y,
                swidth: variant.width,
                sheight: variant.height
            });
            if (!sprites[id]) {
                sprites[id] = [];
            }
            sprites[id].push(sprite);
        };

        var addSpriteTemplate = function (id, image) {
            spriteTemplates[id] = factory({
                image: image
            });
            return spriteTemplates[id];
        }    
        
        var getSpriteTemplate = function (id) {
            return spriteTemplates[id];
        };

        var addPosition = function (id, x, y, rotation) {
            rotation = rotation || 0;
            positions[id] = {
                x: x || 0,
                y: y || 0, 
                rotation: rotation * Math.PI / 180
            };
        };

        var addVariant = function (id, x, y, width, height) {
            variants[id] = {
                x: x, 
                y: y,
                width: width,
                height: height
            }
        };

        var getVariant = function (id) {
            return variants[id];
        };

        var getPosition = function (id) {
            return positions[id];
        };

        var getImage = function () {
            return image;
        };

        var that = {
            draw: draw, 
            addSprite: addSprite,
            addSpriteTemplate: addSpriteTemplate,
            getSpriteTemplate: getSpriteTemplate,
            addPosition: addPosition,
            addVariant: addVariant,
            getVariant: getVariant,
            getPosition: getPosition,
            getImage: getImage
        };
        return that;
    };
    return factory;    
});