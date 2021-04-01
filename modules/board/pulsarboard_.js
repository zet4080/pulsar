define([
    "bgagame/modules/board/gameboard",
    "bgagame/modules/board/imageloader"
], function (gameboard, imageloader) {

    var addDiceVariants = function (dice) {
        dice.addVariant(1, 0, 0, 35, 35);
        dice.addVariant(2, 35, 0, 35, 35);
        dice.addVariant(3, 70, 0, 35, 35);
        dice.addVariant(4, 105, 0, 35, 35);
        dice.addVariant(5, 140, 0, 35, 35);
        dice.addVariant(6, 175, 0, 35, 35);
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

    var addStarclusterTokenPositions = function (starcluster, radius) {
        let full = 2 * Math.PI;
        let step = (2 * Math.PI / 101);
        let offset = Math.PI - 0.5 * step;
        for (let i = 1; i < 100; i++) {
            let sin = Math.sin(full - (i * step) + offset);
            let cos = Math.cos(full - (i * step) + offset);
            let x = Math.floor((radius  * sin) + 842 - 17);
            let y = Math.floor((radius  * cos) + 842 - 17);
            starcluster.addTokenPosition('token', i, x, y);
        }
        let sin = Math.sin(full + offset + 0.03);
        let cos = Math.cos(full + offset + 0.03);
        let x = Math.floor((radius  * sin) + 842 - 17);
        let y = Math.floor((radius  * cos) + 842 - 17);
        starcluster.addTokenPosition('token', 0, x, y);
    }

    var playerboards = {
        1: { x: 72, y: 2070 },
        2: { x: 2690, y: 1710 },
        3: { x: 2010, y: 2070 },
        4: { x: 2690, y: 2070 }
    };

    var createPulsarBoard = function (players) {
        imageloader.addImage('starcluster', 'img/starcluster-normal.webp');
        imageloader.addImage('planetarysystems', 'img/planetarysystems.webp');

        imageloader.addImage('marker', 'img/marker.webp');
        imageloader.addImage('ships', 'img/shipsprites.webp');
        imageloader.addImage('dice', 'img/dice.webp');
        imageloader.addImage('colorstone', 'img/colorstone.webp');
        imageloader.addImage('token', 'img/token.webp');
        imageloader.addImage('rings', 'img/pulsarrings.webp');
        
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

        
        return imageloader.loadImages().then(function (imagelist) {
            
            let board = gameboard ();

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

            ships.addVariant("0000ff", 0, 0, 60, 48);
            ships.addVariant("008000", 0, 48, 60, 48);
            ships.addVariant("ffa500", 0, 96, 60, 48);
            ships.addVariant("ff0000", 0, 144, 60, 48);

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
                playerboard.makeTokensClickable('dice');
            }
            
            var engineertoken = diceboard.addToken('engineerToken', imagelist['colorstone']);
            engineertoken.addVariant("0000ff", 0, 22, 27, 11);
            engineertoken.addVariant("008000", 0, 0, 27, 11);
            engineertoken.addVariant("ffa500", 0, 35, 27, 11);
            engineertoken.addVariant("ff0000", 0, 11, 27, 11);
            addEngineerTokenPositions(diceboard);

            var initiativetoken = diceboard.addToken('initiativeToken', imagelist['colorstone']);
            initiativetoken.addVariant("008000", 0, 0, 27, 11);
            initiativetoken.addVariant("ff0000", 0, 11, 27, 11);
            initiativetoken.addVariant("0000ff", 0, 22, 27, 11);
            initiativetoken.addVariant("ffa500", 0, 35, 27, 11);
            addInitiativeTokenPositions(diceboard);

            diceboard.addClickArea('engineeringtrack', [[357, 171], [701, 62, 1000, 152, 1043, 177], [1041, 217], [1001, 212, 708, 110, 363, 214]]);
            diceboard.addClickArea('initiativetrack', [[348, 74], [578, 21, 759, 2, 1052, 74], [1045, 124], [701, 19, 379, 121, 364, 121]]);

            // ====================================================================================
            // Starcluster
            // ====================================================================================

            var starcluster = board.getGameTile('starcluster');

            // Points

            var token = starcluster.addToken('token', imagelist['token']);
            token.addVariant("008000", 0, 0, 35, 35);
            token.addVariant("ff0000", 0, 35, 35, 35);
            token.addVariant("ffa500", 35, 0, 35, 35);
            token.addVariant("0000ff", 35, 35, 35, 35);
            addStarclusterTokenPositions(starcluster, 820);

            // dice in black hole

            dice = starcluster.addToken('dice', imagelist['dice']);
            addDiceVariants(dice);
            starcluster.addTokenPositions('dice', [
                [753, 744], [898, 758], [867, 706], [751, 873], [818, 883], [900, 818], [874, 874], [800, 694]
            ]);

            // ships
            var ships = starcluster.addToken('ship', imagelist['ships']);
            ships.addVariant("0000ff", 0, 0, 60, 48);
            ships.addVariant("008000", 0, 48, 60, 48);
            ships.addVariant("ffa500", 0, 96, 60, 48);
            ships.addVariant("ff0000", 0, 144, 60, 48);            

            let positions = [
                [0,0], [91, 540], [161, 561], [298, 413], [405, 322], [422, 188], [559, 263], [577, 142], [635, 81], [796, 99], [916, 149],
                [1019, 122], [1103, 163], [1050, 249], [1253, 213], [1178, 295], [1179, 453], [1261, 416], [1348, 440], [1434, 502], [1335, 606],
                [1306, 717], [1439, 718], [1355, 813], [1524, 818], [1392, 909], [1388, 1025], [1374, 1126], [1263, 1152], [1347, 1240], [1267, 1351],
                [1192, 1446], [1035, 1509], [757, 1539], [721, 1423], [634, 1378], [616, 1479], [463, 1482], [505, 1408], [362, 1362], [469, 1282],
                [361, 1179], [262, 1204], [250, 1075], [159, 956], [176, 841], [117, 769], [108, 670], [231, 679], [303, 974], [404, 1032],
                [458, 936], [581, 848], [567, 1052], [546, 1160], [629, 1234], [756, 1293], [805, 1368], [872, 1444], [934, 1294], [1059, 1282],
                [1072, 1192], [949, 1065], [815, 979], [666, 942], [702, 1059], [794, 1116], [1056, 928], [1109, 778], [1238, 852], [1212, 969],
                [1187, 639], [1058, 682], [993, 534], [1039, 371], [891, 420], [878, 296], [844, 550], [870, 667], [753, 649], [626, 678],
                [518, 656], [484, 744], [350, 768], [391, 628], [503, 450], [715, 325], [656, 450]             
            ];
            starcluster.addTokenPositions('ship', positions);
            starcluster.makeTokensClickable('ship');
            for (let i = 1; i < positions.length; i++) {
                starcluster.addClickArea(i, [positions[i][0], positions[i][1], 60, 50]);
            };

            // pulsar rings

            var rings = starcluster.addToken('ring', imagelist['rings']);
            rings.addVariant("008000", 0, 0, 85, 85);
            rings.addVariant("ffa500", 85, 0, 85, 85);
            rings.addVariant("0000ff", 170, 0, 85, 85);
            rings.addVariant("ff0000", 255, 0, 85, 85);

            starcluster.addTokenPosition('ring', 5, 416, 172);
            starcluster.addTokenPosition('ring', 11, 1011, 108);
            starcluster.addTokenPosition('ring', 16, 1170, 438);
            starcluster.addTokenPosition('ring', 22, 1429, 698);
            starcluster.addTokenPosition('ring', 28, 1256, 1134);
            starcluster.addTokenPosition('ring', 35, 630, 1366);
            starcluster.addTokenPosition('ring', 42, 254, 1189);
            starcluster.addTokenPosition('ring', 47, 109, 653);
            starcluster.addTokenPosition('ring', 50, 401, 1018);            
            starcluster.addTokenPosition('ring', 61, 1063, 1174);
            starcluster.addTokenPosition('ring', 66, 785, 1102);
            starcluster.addTokenPosition('ring', 70, 1207, 951);            
            starcluster.addTokenPosition('ring', 71, 1189, 626);
            starcluster.addTokenPosition('ring', 76, 870, 279);
            starcluster.addTokenPosition('ring', 78, 866, 654);
            starcluster.addTokenPosition('ring', 87, 652, 432);

            // ====================================================================================
            // Techboards
            // ====================================================================================

            var tech1 = board.getGameTile('tech1');
            var token = tech1.addToken('token', imagelist['token']);
            token.addVariant("008000", 0, 0, 35, 35);
            token.addVariant("ff0000", 0, 35, 35, 35);
            token.addVariant("ffa500", 35, 0, 35, 35);
            token.addVariant("0000ff", 35, 35, 35, 35);

            tech1.addTokenPosition('token', 'A-1-1-1', 94, 109);
            tech1.addTokenPosition('token', 'A-1-1-2', 55, 121);
            tech1.addClickArea('A_1_1', [[143, 150], [140, 135, 168, 237, 173, 308], [89, 316], [78, 236, 60, 158, 56, 172]]);

            return board;            
        });
    };

    return {
        createPulsarBoard: createPulsarBoard
    };

});