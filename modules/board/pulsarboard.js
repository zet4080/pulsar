define([
    "bgagame/modules/board/imageloader",
    "bgagame/modules/board/gametile",
    "bgagame/modules/board/token",
    "bgagame/modules/board/tokentray"
], function (imageloader, gametile, token, tokentray) {

    const addAllPos = function (overlay, column, x, y) {
        overlay.addInsertPosition(column +  '-1', x, y, 0);
        overlay.addInsertPosition(column +  '-2', x, y + 11, 0);
        overlay.addInsertPosition(column +  '-3', x, y + 22, 0);
        overlay.addInsertPosition(column +  '-4', x, y + 33, 0);
    };

    const addEngineerTokenPositions = function (overlay) {
        addAllPos(overlay, 1, 365, 140); addAllPos(overlay, 2, 410, 128); addAllPos(overlay, 3, 455, 118); addAllPos(overlay, 4, 500, 110); addAllPos(overlay, 5, 545, 103);
        addAllPos(overlay, 6, 590, 99); addAllPos(overlay, 7, 637, 97); addAllPos(overlay, 8, 683, 95); addAllPos(overlay, 9, 730, 97); addAllPos(overlay, 10, 774, 100);
        addAllPos(overlay, 11, 819, 104); addAllPos(overlay, 12, 863, 111); addAllPos(overlay, 13, 909, 119); addAllPos(overlay, 14, 956, 129); addAllPos(overlay, 15, 1001, 141);
    };

    const addInitiativeTokenPositions = function (overlay) {
        addAllPos(overlay, 1, 364, 50); addAllPos(overlay, 2, 408, 34); addAllPos(overlay, 3, 455, 25); addAllPos(overlay, 4, 499, 17); addAllPos(overlay, 5, 545, 10);
        addAllPos(overlay, 6, 590, 6); addAllPos(overlay, 7, 636, 3); addAllPos(overlay, 8, 683, 3); addAllPos(overlay, 9, 728, 3); addAllPos(overlay, 10, 774, 5);
        addAllPos(overlay, 11, 818, 9); addAllPos(overlay, 12, 863, 16); addAllPos(overlay, 13, 910, 22); addAllPos(overlay, 14, 955, 33); addAllPos(overlay, 15, 1001, 46);
    };    

    const createPulsarBoard = function (players) {
        
        imageloader.addImage('starcluster', 'img/starcluster-normal.webp');

        imageloader.addImage('playerboard', 'img/playerboardA2.webp');

        imageloader.addImage('diceboard', 'img/diceboard.webp');
        imageloader.addImage('gyrodyneboard', 'img/gyrodyneboard.webp');
        imageloader.addImage('modifierboard', 'img/modifierboard.webp');

        imageloader.addImage('tech3', 'img/A3.webp');
        imageloader.addImage('tech2', 'img/A2.webp');
        imageloader.addImage('tech1', 'img/A1.webp');

        imageloader.addImage('marker', 'img/marker.webp');
        imageloader.addImage('ships', 'img/shipsprites.webp', {
            "0000ff": [0, 0, 60, 48],
            "008000": [0, 48, 60, 48],
            "ffa500": [0, 96, 60, 48],
            "ff0000": [0, 144, 60, 48]
        });
        imageloader.addImage('dice', 'img/dice.webp', {
            "1": [0, 0, 35, 35],
            "2": [35, 0, 35, 35],
            "3": [70, 0, 35, 35],
            "4": [105, 0, 35, 35],
            "5": [140, 0, 35, 35],
            "6": [175, 0, 35, 35]
        });
        imageloader.addImage('token', 'img/token.webp', {
            "0000ff": [35, 35, 35, 35],
            "008000": [0, 0, 35, 35],
            "ffa500": [35, 0, 35, 35],
            "ff0000": [0, 35, 35, 35]
        });
        imageloader.addImage('rings', 'img/pulsarrings.webp');
        
        imageloader.addImage('planetarysystems', 'img/planetarysystems.webp', {
             "0": [0, 0, 177, 130],    "1": [177, 0, 177, 130],    "2": [354, 0, 177, 130],
             "3": [0, 130, 177, 130],  "4": [177, 130, 177, 130],  "5": [354, 130, 177, 130],
             "6": [0, 260, 177, 130],  "7": [177, 260, 177, 130],  "8": [354, 260, 177, 130],
             "9": [0, 390, 177, 130], "10": [177, 390, 177, 130], "11": [354, 390, 177, 130],
            "12": [0, 520, 177, 130], "13": [177, 520, 177, 130], "14": [354, 520, 177, 130],
            "15": [0, 650, 177, 130], "16": [177, 650, 177, 130], "17": [354, 650, 177, 130]
        });


        return imageloader.loadImages().then(function (imagelist) {
            tokentray(gametile("starcluster", imagelist.starcluster));
            tokentray(gametile("diceboard", imagelist.diceboard));
            tokentray(gametile("gyrodyneboard", imagelist.gyrodyneboard));
            tokentray(gametile("modifierboard", imagelist.modifierboard));
            
            tokentray(gametile("tech1", imagelist.tech1));
            tokentray(gametile("tech2", imagelist.tech2));
            tokentray(gametile("tech3", imagelist.tech3));

            tokentray(gametile("playerboard1", imagelist.playerboard));
            tokentray(gametile("playerboard2", imagelist.playerboard));
            tokentray(gametile("playerboard3", imagelist.playerboard));
            tokentray(gametile("playerboard4", imagelist.playerboard));

            tokentray(token(imagelist.marker, 'marker'));

            tokentray(token(imagelist["ships"]["0000ff"], 'ship', '0000ff'));
            tokentray(token(imagelist["ships"]["008000"], 'ship', "008000"));
            tokentray(token(imagelist["ships"]["ffa500"], 'ship', "ffa500"));
            tokentray(token(imagelist["ships"]["ff0000"], 'ship', "ff0000"));

            tokentray(token(imagelist["dice"]["1"], 'dice', "1"));
            tokentray(token(imagelist["dice"]["2"], 'dice', "2"));
            tokentray(token(imagelist["dice"]["3"], 'dice', "3"));
            tokentray(token(imagelist["dice"]["4"], 'dice', "4"));
            tokentray(token(imagelist["dice"]["5"], 'dice', "5"));
            tokentray(token(imagelist["dice"]["6"], 'dice', "6"));

            tokentray(token(imagelist["token"]["0000ff"], 'token', "0000ff"));
            tokentray(token(imagelist["token"]["008000"], 'token', "008000"));
            tokentray(token(imagelist["token"]["ffa500"], 'token', "ffa500"));
            tokentray(token(imagelist["token"]["ff0000"], 'token', "ff0000"));

            tokentray(gametile("system-00", imagelist["planetarysystems"]["0"])); tokentray(gametile("system-06", imagelist["planetarysystems"]["6"])); tokentray(gametile("system-12", imagelist["planetarysystems"]["12"]));
            tokentray(gametile("system-01", imagelist["planetarysystems"]["1"])); tokentray(gametile("system-07", imagelist["planetarysystems"]["7"])); tokentray(gametile("system-13", imagelist["planetarysystems"]["13"]));
            tokentray(gametile("system-02", imagelist["planetarysystems"]["2"])); tokentray(gametile("system-08", imagelist["planetarysystems"]["8"])); tokentray(gametile("system-14", imagelist["planetarysystems"]["14"]));
            tokentray(gametile("system-03", imagelist["planetarysystems"]["3"])); tokentray(gametile("system-09", imagelist["planetarysystems"]["9"])); tokentray(gametile("system-15", imagelist["planetarysystems"]["15"]));
            tokentray(gametile("system-04", imagelist["planetarysystems"]["4"])); tokentray(gametile("system-10", imagelist["planetarysystems"]["10"])); tokentray(gametile("system-16", imagelist["planetarysystems"]["16"]));
            tokentray(gametile("system-05", imagelist["planetarysystems"]["5"])); tokentray(gametile("system-11", imagelist["planetarysystems"]["11"])); tokentray(gametile("system-17", imagelist["planetarysystems"]["17"]));
            
        }).then(function () {

            const board = gametile()

            board.addGameTile(tokentray('diceboard'), 483, 0);
            board.addGameTile(tokentray('gyrodyneboard'), 0, 503);
            board.addGameTile(tokentray('modifierboard'), 220, 1471);
            
            board.addGameTile(tokentray('starcluster'), 352, 408);

            board.addGameTile(tokentray('tech1'), 1958, 852);
            board.addGameTile(tokentray('tech2'),  2224, 924);
            board.addGameTile(tokentray('tech3'),  2591, 956);

            board.addGameTile(tokentray('playerboard1'), 37, 2183);
            board.addGameTile(tokentray('playerboard2'), 742, 2183);
            board.addGameTile(tokentray('playerboard3'), 1447, 2183);
            board.addGameTile(tokentray('playerboard4'), 2152, 2183)
            
            // ================================================================
            // Diceboard
            // ================================================================

            tokentray('diceboard').createOverlay('marker').addInsertPositions([
                [], [175, 484, -31], [268, 431, -25], [370, 389, -16], [471, 355, -11], [581, 336, -3], [684, 328],
                [793, 332, 8], [898, 350, 21], [1003, 377, 26], [1107, 415, 36], [1201, 466, 40]
            ]);            

            tokentray('diceboard').createOverlay('ships').addInsertPositions([
                [], [240, 130, 120], [280, 116, 120], [327, 102, 120], [364, 88, 120]
            ]);

            tokentray('diceboard').createOverlay('dice').addInsertPositions([
                [60, 420], [95, 378], [147, 367], [187, 332], [113, 437], [163, 421], [202, 383], [136, 484], [218, 435],
                [421, 345], [416, 293], [407, 242], [366, 276], [369, 327], [307, 278], [314, 333], [308, 385], [262, 316],
                [489, 222], [544, 232], [591, 203], [638, 228], [497, 272], [552, 288], [602, 270], [512, 329], [639, 314],
                [728, 214], [786, 209], [876, 222], [723, 267], [777, 260], [829, 249], [755, 309], [827, 314], [869, 283],
                [969, 245], [1016, 270], [1068, 274], [1117, 298], [961, 297], [1012, 322], [1071, 326], [964, 349], [1035, 371],
                [1189, 334], [1173, 385], [1240, 368], [1163, 437], [1218, 422], [1272, 425], [1325, 418], [1227, 476], [1279, 478]
            ]);
            tokentray('diceboard').getOverlay('dice').makeTokensClickable();
            
            addEngineerTokenPositions(tokentray('diceboard').createOverlay('engineerTokens'));
            addInitiativeTokenPositions(tokentray('diceboard').createOverlay('initiativeTokens'));
            
            // ================================================================
            // Starcluster
            // ================================================================
            
            const nodes = [
                [0, 0], [91, 540], [161, 561], [298, 413], [405, 322], [422, 188], [559, 263], [577, 142], [635, 81], [796, 99], [916, 149],
                [1019, 122], [1103, 163], [1050, 249], [1253, 213], [1178, 295], [1179, 453], [1261, 416], [1348, 440], [1434, 502], [1335, 606],
                [1306, 717], [1439, 718], [1355, 813], [1524, 818], [1392, 909], [1388, 1025], [1374, 1126], [1263, 1152], [1347, 1240], [1267, 1351],
                [1192, 1446], [1035, 1509], [757, 1539], [721, 1423], [634, 1378], [616, 1479], [463, 1482], [505, 1408], [362, 1362], [469, 1282],
                [361, 1179], [262, 1204], [250, 1075], [159, 956], [176, 841], [117, 769], [108, 670], [231, 679], [303, 974], [404, 1032],
                [458, 936], [581, 848], [567, 1052], [546, 1160], [629, 1234], [756, 1293], [805, 1368], [872, 1444], [934, 1294], [1059, 1282],
                [1072, 1192], [949, 1065], [815, 979], [666, 942], [702, 1059], [794, 1116], [1056, 928], [1109, 778], [1238, 852], [1212, 969],
                [1187, 639], [1058, 682], [993, 534], [1039, 371], [891, 420], [878, 296], [844, 550], [870, 667], [753, 649], [626, 678],
                [518, 656], [484, 744], [350, 768], [391, 628], [503, 450], [715, 325], [656, 450]             
            ];
            tokentray('starcluster').addClickAreas(nodes, 60, 50);
            tokentray('starcluster').createOverlay('ships').addInsertPositions(nodes);
            tokentray('starcluster').getOverlay('ships').makeTokensClickable();

            tokentray('starcluster').createOverlay('dice').addInsertPositions([
                [753, 744], [898, 758], [867, 706], [751, 873], [818, 883], [900, 818], [874, 874], [800, 694], [800, 694]
            ]);

            const systems = tokentray('starcluster').createOverlay('planetarysystems');
            systems.addInsertPosition(3, 246, 376); systems.addInsertPosition(6, 508, 219); systems.addInsertPosition(9, 743, 65);
            systems.addInsertPosition(15, 1127, 262); systems.addInsertPosition(19, 1382, 461); systems.addInsertPosition(25, 1335, 870);
            systems.addInsertPosition(30, 1214, 1313); systems.addInsertPosition(32, 981, 1468); systems.addInsertPosition(39, 310, 1325);
            systems.addInsertPosition(44, 107, 918); systems.addInsertPosition(52, 520, 809); systems.addInsertPosition(54, 499, 1124);
            systems.addInsertPosition(62, 899, 1028); systems.addInsertPosition(68, 1060, 739); systems.addInsertPosition(75, 848, 381);
            systems.addInsertPosition(84, 338, 585); systems.addInsertPosition(3, 246, 376);

            return board;
        });
    }

    return createPulsarBoard;

});