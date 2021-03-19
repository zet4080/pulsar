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


    var addAllPos = function (diceboard, type, column, x, y) {
        diceboard.addTokenPosition(type, column +  '-1', x, y, 0);
        diceboard.addTokenPosition(type, column +  '-2', x, y + 11, 0);
        diceboard.addTokenPosition(type, column +  '-3', x, y + 22, 0);
        diceboard.addTokenPosition(type, column +  '-4', x, y + 33, 0);
    };

    var addEngineerTokenPositions = function (diceboard) {
        addAllPos(diceboard, 'engineerToken', 1, 369, 163); addAllPos(diceboard, 'engineerToken', 2, 413, 151); addAllPos(diceboard, 'engineerToken', 3, 460, 142); addAllPos(diceboard, 'engineerToken', 4, 504, 134); addAllPos(diceboard, 'engineerToken', 5, 550, 127);
        addAllPos(diceboard, 'engineerToken', 6, 595, 123); addAllPos(diceboard, 'engineerToken', 7, 641, 119); addAllPos(diceboard, 'engineerToken', 8, 688, 119); addAllPos(diceboard, 'engineerToken', 9, 733, 119); addAllPos(diceboard, 'engineerToken', 10, 779, 122);
        addAllPos(diceboard, 'engineerToken', 11, 823, 126); addAllPos(diceboard, 'engineerToken', 12, 868, 133); addAllPos(diceboard, 'engineerToken', 13, 915, 139); addAllPos(diceboard, 'engineerToken', 14, 960, 150); addAllPos(diceboard, 'engineerToken', 15, 1006, 163);
    };

    var addInitiativeTokenPositions = function (diceboard) {
        addAllPos(diceboard, 'initiativeToken', 1, 369, 65); addAllPos(diceboard, 'initiativeToken', 2, 413, 49); addAllPos(diceboard, 'initiativeToken', 3, 460, 40); addAllPos(diceboard, 'initiativeToken', 4, 504, 32); addAllPos(diceboard, 'initiativeToken', 5, 550, 25);
        addAllPos(diceboard, 'initiativeToken', 6, 595, 21); addAllPos(diceboard, 'initiativeToken', 7, 641, 17); addAllPos(diceboard, 'initiativeToken', 8, 688, 17); addAllPos(diceboard, 'initiativeToken', 9, 733, 17); addAllPos(diceboard, 'initiativeToken', 10, 779, 20);
        addAllPos(diceboard, 'initiativeToken', 11, 823, 24); addAllPos(diceboard, 'initiativeToken', 12, 868, 31); addAllPos(diceboard, 'initiativeToken', 13, 915, 37); addAllPos(diceboard, 'initiativeToken', 14, 960, 48); addAllPos(diceboard, 'initiativeToken', 15, 1006, 61);
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
        imageloader.addImage('colorstone', 'img/colorstone.webp');

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
        imageloader.addImage('token', 'img/token.webp');
        
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
            
            var engineertoken = diceboard.addToken('engineerToken', imagelist['colorstone']);
            engineertoken.addTokenVariant("0000ff", 0, 22, 27, 11);
            engineertoken.addTokenVariant("008000", 0, 0, 27, 11);
            engineertoken.addTokenVariant("ffa500", 0, 35, 27, 11);
            engineertoken.addTokenVariant("ff0000", 0, 11, 27, 11);
            addEngineerTokenPositions(diceboard);

            var initiativetoken = diceboard.addToken('initiativeToken', imagelist['colorstone']);
            initiativetoken.addTokenVariant("008000", 0, 0, 27, 11);
            initiativetoken.addTokenVariant("ff0000", 0, 11, 27, 11);
            initiativetoken.addTokenVariant("0000ff", 0, 22, 27, 11);
            initiativetoken.addTokenVariant("ffa500", 0, 35, 27, 11);
            addInitiativeTokenPositions(diceboard);

            diceboard.addClickArea('engineeringtrack', [[357, 171], [701, 62, 1000, 152, 1043, 177], [1041, 217], [1001, 212, 708, 110, 363, 214]]);
            diceboard.addClickArea('initiativetrack', [[348, 74], [578, 21, 759, 2, 1052, 74], [1045, 124], [701, 19, 379, 121, 364, 121]]);

            var starcluster = board.getGameTile('starcluster');
            var token = starcluster.addToken('token', imagelist['token']);
            token.addTokenVariant("008000", 0, 0, 35, 35);
            token.addTokenVariant("ff0000", 0, 35, 35, 35);
            token.addTokenVariant("ffa500", 35, 0, 35, 35);
            token.addTokenVariant("0000ff", 35, 35, 35, 35);

            var tech1 = board.getGameTile('tech1');
            var token = tech1.addToken('token', imagelist['token']);
            token.addTokenVariant("008000", 0, 0, 35, 35);
            token.addTokenVariant("ff0000", 0, 35, 35, 35);
            token.addTokenVariant("ffa500", 35, 0, 35, 35);
            token.addTokenVariant("0000ff", 35, 35, 35, 35);

            tech1.addTokenPosition('token', '1-1-1', 94, 109);
            tech1.addTokenPosition('token', '1-1-2', 55, 121);
            tech1.addClickArea('t_1_1', [[143, 150], [140, 135, 168, 237, 173, 308], [89, 316], [78, 236, 60, 158, 56, 172]]);

            return board;            
        });
    };

    return {
        createPulsarBoard: createPulsarBoard
    };

});