define([

], function () {


    var random = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    var dist = function (x, y, x2, y2) {
        return Math.sqrt((Math.pow(x - x2, 2))+(Math.pow(y - y2, 2)));
    }

    var calculateArray = function (radius, width, height, nrOfObjects) {
        var placedObjects = [];
        var protection = 0;
        var overlapping = false;

        while (placedObjects.length < nrOfObjects && protection < 10000) {
            var circle = {
                x: random(0, width),
                y: random(0, height),
                r: radius
            };
            overlapping = false;

            for (var i = 0; i < placedObjects.length; i++) {
                var existing = placedObjects[i];
                var d = dist(circle.x, circle.y, existing.x, existing.y)
                if (d < circle.r + existing.r) {
                    overlapping = true;
                    break;
                }
            }
    
            if (!overlapping) {
                placedObjects.push(circle);      
            }      
            protection++;      
        }
        return placedObjects;
    };

    return calculateArray;
});