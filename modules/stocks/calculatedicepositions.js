define([
], function () {

    var dicepositions = {
        1: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        2: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        3: [18, 19, 20, 21, 22, 23, 24, 25, 26],
        4: [27, 28, 29, 30, 31, 32, 33, 34, 35],
        5: [36, 37, 38, 39, 40, 41, 42, 43, 44],
        6: [45, 46, 47, 48, 49, 50, 51, 52, 53]
    };

    var random = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }    

    var calculateDicePositions = function (dice) {
        var copy = JSON.parse(JSON.stringify(dicepositions));
        var coordinates = [];
        for (var i = 0; i < dice.length; i++) {
            var possiblePositions = copy[dice[i].value];
            var position = random(0, possiblePositions.length);
            var coord = possiblePositions[position];
            possiblePositions.splice(position, 1);
            coordinates.push(coord);
        }
        return coordinates;
    };

    return calculateDicePositions;
});