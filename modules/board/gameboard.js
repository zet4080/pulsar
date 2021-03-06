define([
    "dojo/Deferred",
    "dojo/promise/all"
], function (Deferred, all) {

    var factory = function (element) {
    
        var context;
        var boardelements = {};
        var loader = [];

        var viewport = {
            scale: 1.0,
            offset: {
                x: 0,
                y: 0
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
            return all(loader).then(function (results) {
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
                boardelements[results[i].id] = {
                    x: results[i].x,
                    y: results[i].y,
                    image: results[i].image,
                    rotation: {x: 0, y: 0, angle: 0}
                };
            }
        };

        var drawScene = function () {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            context.save();            
            context.scale(viewport.scale, viewport.scale);
            for (elem in boardelements) {
                context.save();
                var e = boardelements[elem];
                context.translate(e.rotation.x - viewport.offset.x, e.rotation.y - viewport.offset.y);
                context.rotate(e.rotation.angle);
                context.drawImage(e.image, e.x - e.rotation.x, e.y - e.rotation.y);
                context.restore();
            }
            context.restore();
        };

        var setScale = function (scale) {
            viewport.scale = scale;
        };

        var moveTo = function (x, y) {
            viewport.offset = {
                x: x,
                y: y
            };
        };

        var rotate = function (angle, x, y, elements) {
            for (var i = 0; i < elements.length; i++) {
                var elem = elements[i];
                boardelements[elem].rotation = {
                    x: x,
                    y: y,
                    angle: angle * Math.PI / 180
                };
            }
        };
    
        return {
            addElement: addElement,
            start: start,
            setScale: setScale,
            moveTo: moveTo,
            rotate: rotate,
            drawScene: drawScene
        };

    };

    return factory;

});