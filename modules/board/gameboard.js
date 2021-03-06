define([
    "dojo/Deferred",
    "dojo/promise/all"
], function (Deferred, all) {

    var factory = function (element) {
    
        var context;
        var elements = {};
        var loader = [];

        var viewport = {
            scale: 1.0,
            rotation: {
                x: 0,
                y: 0,
                angle: 0
            },
            offset: {
                x: 0,
                y:0
            }
        };

        var addElement = function (id, url, x, y) {
            
            var deferred = new Deferred();
            loader.push(deferred);
            var image = new Image();
            
            image.addEventListener('load', function() {
                deferred.resolve({
                    id: id,
                    x: x,
                    y: y,
                    image: image
                });
                
            }, false);            
            image.src = g_gamethemeurl + url;
        };
    
        var start = function () {
            all(loader).then(function (results) {
                createCanvas();
                addImagesToDictionary(results);
                drawScene();
            });
        };

        var createCanvas = function () {
            var parent = $(element);
            var canvas = document.createElement("canvas");
            canvas.style = "border: solid yellow 3px";
            parent.appendChild(canvas);
            context = canvas.getContext('2d');
            context.canvas.width = parent.clientWidth;
            context.canvas.height = parent.clientHeight;
        };

        var addImagesToDictionary = function (results) {
            for (var i = 0; i < results.length; i++) {
                elements[results[i].id] = {
                    x: results[i].x,
                    y: results[i].y,
                    image: results[i].image
                };
            }
        };

        var drawScene = function () {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            context.save();            
            context.scale(viewport.scale, viewport.scale);
            context.translate(viewport.rotation.x, viewport.rotation.y);
            context.rotate(viewport.rotation.angle);
            context.translate(viewport.offset.x, viewport.offset.y);
            for (elem in elements) {
                var e = elements[elem];
                context.drawImage(e.image, e.x - viewport.rotation.x, e.y - viewport.rotation.y);
            }
            context.restore();
        };

        var setScale = function (scale) {
            viewport.scale = scale;
        };

        var rotate = function (angle, x, y) {
            viewport.rotation = {
                x: x || 0,
                y: y || 0,
                angle: angle * Math.PI / 180
            };
        };

        var moveTo = function (x, y) {
            viewport.offset = {
                x: x,
                y: y
            };
        };

        var createLayer = function (layer) {
            layer = layer || 'base';
            if (!layers[layer]) {
                layers[layer] = {};
            }
        };
    
        return {
            addElement: addElement,
            start: start,
            setScale: setScale,
            rotate: rotate,
            moveTo: moveTo
        };

    };

    return factory;

});