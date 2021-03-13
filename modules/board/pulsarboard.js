define([
    "bgagame/modules/board/gameboard",
    "bgagame/modules/board/imageloader"
], function (gameboard, imageloader) {

    var addDiceVariants = function (dice) {
        dice.addTokenVariant(1, 0, 0, 35, 35);
        dice.addTokenVariant(2, 35, 0, 35, 35);
        dice.addTokenVariant(3, 70, 0, 35, 35);
        dice.addTokenVariant(4, 105, 0, 35, 35);
        dice.addTokenVariant(5, 140, 0, 35, 35);
        dice.addTokenVariant(6, 175, 0, 35, 35);
    };

    var playerboards = {
        1: { x: 72, y: 2070 },
        2: { x: 2690, y: 1710 },
        3: { x: 2010, y: 2070 },
        4: { x: 2690, y: 2070 }
    };

    var createPulsarBoard = function (players) {
        imageloader.addImage('marker', 'img/marker.webp');
        imageloader.addImage('ships', 'img/shipsprites.webp');
        imageloader.addImage('dice', 'img/dice.webp');

        imageloader.addImage('playerboard1', 'img/playerboardA2.webp');
        imageloader.addImage('playerboard2', 'img/playerboardA2.webp')
        imageloader.addImage('playerboard3', 'img/playerboardA2.webp')
        imageloader.addImage('playerboard4', 'img/playerboardA2.webp')

        imageloader.addImage('diceboard', 'img/diceboard.webp');
        imageloader.addImage('gyrodyne', 'img/gyrodyneboard.webp');
        imageloader.addImage('modifierboard', 'img/modifierboard.webp');

        imageloader.addImage('tech3', 'img/A3.webp');
        imageloader.addImage('tech2', 'img/A2.webp');
        imageloader.addImage('tech1', 'img/A1.webp');
        imageloader.addImage('starcluster', 'img/starcluster.webp');
        
        return imageloader.loadImages().then(function (imagelist) {
            var board = gameboard('table');

            let i = 1;
            for (let player in players) {
                board.addGameTile(player, imagelist['playerboard' + i], playerboards[i].x, playerboards[i].y);
                i++
            };

            board.addGameTile('diceboard', imagelist['diceboard'], 483, 0);
            board.addGameTile('gyrodyne', imagelist['gyrodyne'], 2, 1018);
            board.addGameTile('modifierboard', imagelist['modifierboard'], 238, 610);

            board.addGameTile('tech3', imagelist['tech3'], 2597, 954);
            board.addGameTile('tech2', imagelist['tech2'], 2228, 919);
            board.addGameTile('tech1', imagelist['tech1'], 1962, 849);                   

            board.addGameTile('starcluster', imagelist['starcluster'], 352, 408); 

            var diceboard = board.getGameTile('diceboard');
            diceboard.addToken('marker', imagelist['marker']);
            diceboard.addTokenPositions('marker', [
                [175, 484, -31], [268, 431, -25], [370, 389, -16], [471, 355, -11], [581, 336, -3], [684, 328],
                [793, 332, 8], [898, 350, 21], [1003, 377, 26], [1107, 415, 36], [1201, 466, 40]
            ]);

            var ships = diceboard.addToken('ship', imagelist['ships']);
            diceboard.addTokenPosition('ship', '1', 240, 130, 120);
            diceboard.addTokenPosition('ship', '2', 280, 116, 120);
            diceboard.addTokenPosition('ship', '3', 327, 102, 120);
            diceboard.addTokenPosition('ship', '4', 364, 88, 120);

            ships.addTokenVariant("0000ff", 0, 0, 60, 48);
            ships.addTokenVariant("008000", 0, 48, 60, 48);
            ships.addTokenVariant("ffa500", 0, 96, 60, 48);
            ships.addTokenVariant("ff0000", 0, 144, 60, 48);

            var dice = diceboard.addToken('dice', imagelist['dice']);
            addDiceVariants(dice);
            diceboard.addTokenPositions('dice', [
                [60, 420], [95, 378], [147, 367], [187, 332], [113, 437], [163, 421], [202, 383], [136, 484], [218, 435],
                [421, 345], [416, 293], [407, 242], [366, 276], [369, 327], [307, 278], [314, 333], [308, 385], [262, 316],
                [489, 222], [544, 232], [591, 203], [638, 228], [497, 272], [552, 288], [602, 270], [512, 329], [639, 314],
                [728, 214], [786, 209], [876, 222], [723, 267], [777, 260], [829, 249], [755, 309], [827, 314], [869, 283],
                [969, 245], [1016, 270], [1068, 274], [1117, 298], [961, 297], [1012, 322], [1071, 326], [964, 349], [1035, 371],
                [1189, 334], [1173, 385], [1240, 368], [1163, 437], [1218, 422], [1272, 425], [1325, 418], [1227, 476], [1279, 478]
            ]);
            diceboard.makeTokensClickable('dice');

            for (let player in players) {
                let playerboard = board.getGameTile(player);
                dice = playerboard.addToken('dice', imagelist['dice']);
                addDiceVariants(dice);
                playerboard.addTokenPosition('dice', 0, 25, 20);
                playerboard.addTokenPosition('dice', 1, 70, 20);
            }

            return board;            
        });
    };

    return {
        createPulsarBoard: createPulsarBoard
    };

});