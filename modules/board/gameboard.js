define([
    "bgagame/modules/board/gametile"
], function (gametile) {

    var factory = function (element) {
    
        var tableElements = {};
        var viewport = {
            scale: 1.0,
            offset: {
                x: 0,
                y: 0
            }
        };

        var createCanvas = function (element) {
            var parent = $(element);
            var canvas = document.createElement("canvas");
            canvas.style = "border: solid yellow 3px";
            parent.appendChild(canvas);
            var context = canvas.getContext('2d');
            context.canvas.width = parent.clientWidth;
            context.canvas.height = parent.clientHeight;
            return context;
        };

        var addTableElement = function (id, image, x, y) {
            var tile = gametile({
                image: image,
                x: x,
                y: y
            });
            tableElements[id] = tile;
            return tile;
        };

        var getTableElement = function (id) {
            return tableElements[id];
        };

        var drawScene = function () {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            context.save();            
            context.scale(viewport.scale, viewport.scale);
            for (elem in tableElements) {
                tableElements[elem].draw(context);
            }
            context.restore();
        };

        var setScale = function (scale) {
            viewport.scale = scale;
        };

        var context = createCanvas(element);

        return {
            addTableElement: addTableElement,
            getTableElement: getTableElement,            
            drawScene: drawScene,
            setScale: setScale
        };
    };

    return factory;

});