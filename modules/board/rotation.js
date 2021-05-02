define([
], function () {
    return function (x, y, rotation) {
        return Object.freeze({
            x: x, 
            y: y,
            r:  rotation * Math.PI / 180
        });
    };
})