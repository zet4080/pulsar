define([

], function () {
    
    var createCamera = function (ctxId, image) {
        
        var settings;
        var distance = 0;
        var lookAt = [0, 0];
        var context;
        var fieldOfView;
        var viewport = {
            x: 0,
            y: 0,
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            scale: [1.0, 1.0],
            rotate: {
                x: 0,
                y: 0,
                angle: 0
            },
            center: {
                left: 0,
                top: 0
            }
        };
        
        var background = {

        };

        var sprites = {
        };

        var draw = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.save();
            context.scale(viewport.scale[0], viewport.scale[1]);
            context.translate(viewport.center.left, viewport.center.top);
            context.translate(-viewport.left, -viewport.top);            
            context.rotate(viewport.rotate.angle);
            if (background.img) {
                context.drawImage(background.img, background.left - viewport.center.left, background.top - viewport.center.top);
            }
            for (var key in sprites) {
                context.drawImage(sprites[key].img, sprites[key].left - viewport.center.left, sprites[key].top - viewport.center.top);
            }
            context.restore();
        };
    
        var updateViewport = function () {
            aspectRatio = context.canvas.width / context.canvas.height;
            viewport.width = distance * Math.tan(fieldOfView);
            viewport.height = viewport.width / aspectRatio;
            viewport.left = lookAt[0] // - (viewport.width / 2.0);
            viewport.top = lookAt[1] // - (viewport.height / 2.0);
            viewport.scale[0] = context.canvas.width / viewport.width;
            viewport.scale[1] = context.canvas.height / viewport.height;
        }

        var setCenter = function (left, top) {
            viewport.center = {
                left: left,
                top: top,
            };
        };
    
        var zoomTo = function (z) {
            distance = z;
            updateViewport();
            draw();
        }
    
        var moveTo = function (x, y) {
            lookAt[0] = x;
            lookAt[1] = y;
            updateViewport();
            draw();
        }
    
        var screenToWorld = function (x, y, obj) {
            obj = obj || {};
            obj.x = (x / viewport.scale[0]) + viewport.left;
            obj.y = (y / viewport.scale[1]) + viewport.top;
            return obj;
        }
    
        var worldToScreen = function (x, y, obj) {
            obj = obj || {};
            obj.x = (x - viewport.left) * (viewport.scale[0]);
            obj.y = (y - viewport.top) * (viewport.scale[1]);
            return obj;
        }

        var rotate = function (deg, x, y) {
            viewport.rotate.angle = deg * Math.PI / 180;
            viewport.rotate.x = x;
            viewport.rotate.y = y;
            draw();
        }
    
        var loadSprite = function (id, url, left, top, rotate) {
            var img = new Image();
            img.addEventListener('load', function() {
                sprites[id] = {
                    img: img,
                    top: top || 0,
                    left: left || 0,
                    rotate: rotate || 0
                };                
                draw();
            }, false);
            img.src = g_gamethemeurl + url;
        };

        var loadBackground = function (url, left, top) {
            background.left = left || 0;
            background.top = top || 0;
            background.img = new Image();
            background.img.addEventListener('load', function() {
                context.canvas.width  = canvas.parentNode.clientWidth;
                context.canvas.height = canvas.parentNode.clientHeight;                 
                draw();
            }, false);
            background.img.src = g_gamethemeurl + url;
        };

        var canvas = document.getElementById(ctxId);
        context = canvas.getContext('2d');
        settings = settings || {};
        fieldOfView = settings.fieldOfView || Math.PI / 4.0;
        updateViewport();
        draw();

        return {
            draw: draw,
            updateViewport: updateViewport,
            zoomTo: zoomTo,
            moveTo: moveTo,
            screenToWorld: screenToWorld,
            worldToScreen: worldToScreen,
            rotate: rotate,
            loadSprite: loadSprite,
            loadBackground: loadBackground,
            setCenter: setCenter
        }

    };

    return function (ctxId, image) {
        return createCamera(ctxId);
    };

});