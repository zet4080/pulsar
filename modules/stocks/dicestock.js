define([
], function () {

    var dicepositions = {
        1: [[60, 420], [95, 378], [147, 367], [187, 332], [113, 437], [163, 421], [202, 383], [136, 484], [218, 435]],
        2: [[421, 345], [416, 293], [407, 242], [366, 276], [369, 327], [307, 278], [314, 333], [308, 385], [262, 316]],
        3: [[489, 222], [544, 232], [591, 203], [638, 228], [497, 272], [552, 288], [602, 270], [512, 329], [639, 314]],
        4: [[728, 214], [786, 209], [876, 222], [723, 267], [777, 260], [829, 249], [755, 309], [827, 314], [869, 283]],
        5: [[969, 245], [1016, 270], [1068, 274], [1117, 298], [961, 297], [1012, 322], [1071, 326], [964, 349], [1035, 371]],
        6: [[1189, 334], [1173, 385], [1240, 368], [1163, 437], [1218, 422], [1272, 425], [1325, 418], [1227, 476], [1279, 478]]
    };

    var random = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }    

    var calculateDicePositions = function (dice) {
        debugger;
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