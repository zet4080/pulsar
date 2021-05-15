define([
    "bgagame/modules/board/imageloader",
    "bgagame/modules/board/gametile",
    "bgagame/modules/board/token",
    "bgagame/modules/board/tray",
    "bgagame/modules/board/rotation"
], function (imageloader, gametile, token, tray, rotation) {

    const addAllPos = function (overlay, column, x, y) {
        overlay.addInsertPosition(column +  '-1', x, y -33);
        overlay.addInsertPosition(column +  '-2', x, y - 22);
        overlay.addInsertPosition(column +  '-3', x, y - 11);
        overlay.addInsertPosition(column +  '-4', x, y);
    };

    const addEngineerTokenPositions = function (overlay) {
        addAllPos(overlay, 1, 462, 212); addAllPos(overlay, 2, 519, 162); addAllPos(overlay, 3, 576, 184); addAllPos(overlay, 4, 633, 173); addAllPos(overlay, 5, 691, 165);
        addAllPos(overlay, 6, 749, 159); addAllPos(overlay, 7, 808, 156); addAllPos(overlay, 8, 868, 155); addAllPos(overlay, 9, 926, 156); addAllPos(overlay, 10, 983, 160);
        addAllPos(overlay, 11, 1041, 166); addAllPos(overlay, 12, 1098, 174); addAllPos(overlay, 13, 1155, 184); addAllPos(overlay, 14, 1215, 198); addAllPos(overlay, 15, 1272, 213);
    };

    const addInitiativeTokenPositions = function (overlay) {
        addAllPos(overlay, 1, 462, 90); addAllPos(overlay, 2, 519, 76); addAllPos(overlay, 3, 576, 63); addAllPos(overlay, 4, 634, 54); addAllPos(overlay, 5, 691, 46);
        addAllPos(overlay, 6, 749, 41); addAllPos(overlay, 7, 808, 37); addAllPos(overlay, 8, 868, 38); addAllPos(overlay, 9, 927, 37); addAllPos(overlay, 10, 983, 41);
        addAllPos(overlay, 11, 1041, 46); addAllPos(overlay, 12, 1098, 54); addAllPos(overlay, 13, 1156, 63); addAllPos(overlay, 14, 1215, 76); addAllPos(overlay, 15, 1273, 90);
    };    

    const addStarclusterTokenPositions = function (starcluster, radius) {
        let full = 2 * Math.PI;
        let step = (2 * Math.PI / 101);
        let offset = Math.PI - 0.63 * step;
        for (let i = 1; i < 100; i++) {
            let sin = Math.sin(full - (i * step) + offset);
            let cos = Math.cos(full - (i * step) + offset);
            let x = Math.floor((radius  * sin) + 1123 - 30);
            let y = Math.floor((radius  * cos) + 1123 - 30);
            starcluster.addInsertPosition(i, x, y);
        }
        let sin = Math.sin(full + offset + 0.03);
        let cos = Math.cos(full + offset + 0.03);
        let x = Math.floor((radius  * sin) + 1123 - 30);
        let y = Math.floor((radius  * cos) + 1123 - 30);
        starcluster.addInsertPosition(0, x, y);
    };

    const createPulsarBoard = function (players) {
        
        imageloader.addImage('alltokens', 'img/CompleteGraphics.webp', {
            "starcluster1": [0, 0, 2246, 2246],
            "starcluster2": [2247, 0, 2246, 2246],
            "diceboard3Player": [4494, 0, 1785, 763],
            "diceboard4Player": [4494, 764, 1785, 763],
            "tech-AI": [6279, 0, 1080, 418],
            "tech-BI": [6279, 418, 1080, 418],
            "tech-CI": [6279, 836, 1080, 418],
            "tech-DI": [6279, 1254, 1080, 418],
            "tech-AII": [7360, 0, 873, 525],
            "tech-BII": [7360, 525, 873, 525],
            "tech-CII": [7360, 1050, 873, 525],
            "tech-DII": [7360, 1575, 873, 525],
            "tech-AIII": [8233, 0, 805, 507],
            "tech-BIII": [8233, 505, 805, 507],
            "tech-CIII": [8233, 1012, 805, 507],
            "tech-DIII": [8233, 1520, 805, 507],
            "modifierboard": [4494, 1527, 560, 236],
            "gyrodyneboard": [5054, 1527, 1150, 570],
            "HQ-A1": [0, 3097, 875, 453],
            "HQ-A2": [875, 3097, 875, 453],
            "HQ-B1": [1750, 3097, 875, 453],
            "HQ-B2": [2625, 3097, 875, 453],
            "HQ-C1": [3500, 3097, 875, 453],
            "HQ-C2": [4375, 3097, 875, 453],
            "HQ-D1": [5250, 3097, 875, 453],
            "HQ-D2": [6125, 3097, 875, 453],
            "dicemarker": [6043, 2247, 54, 79],
            "constructionaward4": [4674, 1763, 190, 121],
            "constructionaward7": [4864, 1763, 190, 121],
            "engineeringcube": [5685, 2375, 30, 30],
            "engineeringcubes4": [5054, 2550, 102, 107],
            "reddie1": [5684, 2314, 60, 60],
            "reddie2": [5744, 2314, 60, 60],
            "reddie3": [5804, 2314, 60, 60],
            "reddie4": [5864, 2314, 60, 60],
            "reddie5": [5924, 2314, 60, 60],
            "reddie6": [5984, 2314, 60, 60],
            "silverdie1": [5684, 2254, 60, 60],
            "silverdie2": [5744, 2254, 60, 60],
            "silverdie3": [5804, 2254, 60, 60],
            "silverdie4": [5864, 2254, 60, 60],
            "silverdie5": [5924, 2254, 60, 60],
            "silverdie6": [5984, 2254, 60, 60],
            "smalldie1": [5715, 2374, 45, 45],
            "smalldie2": [5760, 2374, 45, 45],
            "smalldie3": [5805, 2374, 45, 45],
            "smalldie4": [5850, 2374, 45, 45],
            "smalldie5": [5895, 2374, 45, 45],
            "smalldie6": [5940, 2374, 45, 45],
            "tokengreen": [5484, 2412, 52, 52],
            "tokenblue": [5484, 2464, 52, 52], 
            "tokenred": [5484, 2516, 52, 52],
            "tokenyellow": [5484, 2568, 52, 52],
            "timemarker": [5156, 2550, 153, 96],
            "shipblue": [5369, 2412, 80, 63],
            "shipgreen": [5369, 2475, 80, 63],
            "shipyellow": [5369, 2538, 80, 63],
            "shipred": [5369, 2601, 80, 63],
            "goaltile1a": [7000, 2101, 194, 611],
            "goaltile1b": [7194, 2101, 194, 611],
            "goaltile2a": [7388, 2101, 194, 611],
            "goaltile2b": [7582, 2101, 194, 611],
            "goaltile3a": [7776, 2101, 194, 611],
            "goaltile3b": [7970, 2101, 194, 611],
            "goaltile4a": [7000, 2712, 194, 611],
            "goaltile4b": [7194, 2712, 194, 611],
            "goaltile5a": [7388, 2712, 194, 611],
            "goaltile5b": [7582, 2712, 194, 611],
            "goaltile6a": [7776, 2712, 194, 611],
            "goaltile6b": [7970, 2712, 194, 611],
            "100pointsyellow": [5054, 2412, 79, 138],
            "100pointsblue": [5133, 2412, 79, 138],
            "100pointsgreen": [5212, 2412, 79, 138],
            "100pointsred": [5291, 2412, 79, 138],
            "ringred": [5054, 2254, 105, 105],
            "ringgreen": [5159, 2254, 105, 105],
            "ringyellow": [5264, 2254, 105, 105],
            "ringblue": [5369, 2254, 105, 105],
            "bonusback": [5211, 2097, 157, 157],
            "bonuscubes": [5368, 2097, 157, 157],
            "bonussystems": [5525, 2097, 157, 157],
            "bonusmodifier": [5682, 2097, 157, 157],
            "bonus4points": [5839, 2097, 157, 157],
            "bonus5points": [5996, 2097, 157, 157],
            "modifikator1": [4584, 1763, 90, 90],
            "modifikator2": [4584, 1853, 90, 90],
            "gyordyne1a": [4700, 1884, 118, 118],
            "gyordyne2a": [4818, 1884, 118, 118],
            "gyordyne3a": [4936, 1884, 118, 118],
            "gyordyne1b": [4700, 2002, 118, 118],
            "gyordyne2b": [4818, 2002, 118, 118],
            "gyordyne3b": [4936, 2002, 118, 118],
            "system0": [0, 2837, 236, 173],
            "system1": [236, 2837, 236, 173],
            "system2": [472, 2837, 236, 173],
            "system3": [708, 2837, 236, 173],
            "system4": [944, 2837, 236, 173],
            "system5": [1180, 2837, 236, 173],
            "system6": [1416, 2837, 236, 173],
            "system7": [1652, 2837, 236, 173],
            "system8": [1888, 2837, 236, 173],
            "system9": [2124, 2837, 236, 173],
            "system10": [2360, 2837, 236, 173],
            "system11": [2596, 2837, 236, 173],
            "system12": [2832, 2837, 236, 173],
            "system13": [3068, 2837, 236, 173],
            "system14": [3304, 2837, 236, 173],
            "system15": [3540, 2837, 236, 173],
            "system16": [3776, 2837, 236, 173],
            "system17": [4012, 2837, 236, 173],
            "transmittera1a": [0, 2246, 420, 197],
            "transmittera1b": [420, 2246, 420, 197],
            "transmittera2a": [840, 2246, 420, 197],
            "transmittera2b": [1260, 2246, 420, 197],
            "transmittera3a": [1680, 2246, 420, 197],
            "transmittera3b": [2100, 2246, 420, 197],
            "transmittera4a": [2520, 2246, 420, 197],
            "transmittera4b": [2940, 2246, 420, 197],
            "transmittera5a": [3360, 2246, 420, 197],
            "transmittera5b": [3780, 2246, 420, 197],
            "transmittera6a": [4200, 2246, 420, 197],
            "transmittera6b": [4620, 2246, 420, 197],
            "transmitterb1a": [0, 2443, 420, 197],
            "transmitterb1b": [420, 2443, 420, 197],
            "transmitterb2a": [840, 2443, 420, 197],
            "transmitterb2b": [1260, 2443, 420, 197],
            "transmitterb3a": [1680, 2443, 420, 197],
            "transmitterb3b": [2100, 2443, 420, 197],
            "transmitterb4a": [2520, 2443, 420, 197],
            "transmitterb4b": [2940, 2443, 420, 197],
            "transmitterb5a": [3360, 2443, 420, 197],
            "transmitterb5b": [3780, 2443, 420, 197],
            "transmitterb6a": [4200, 2443, 420, 197],
            "transmitterb6b": [4620, 2443, 420, 197],
            "transmitterc1a": [0, 2640, 420, 197],
            "transmitterc1b": [420, 2640, 420, 197],
            "transmitterc2a": [840, 2640, 420, 197],
            "transmitterc2b": [1260, 2640, 420, 197],
            "transmitterc3a": [1680, 2640, 420, 197],
            "transmitterc3b": [2100, 2640, 420, 197],
            "transmitterc4a": [2520, 2640, 420, 197],
            "transmitterc4b": [2940, 2640, 420, 197],
            "transmitterc5a": [3360, 2640, 420, 197],
            "transmitterc5b": [3780, 2640, 420, 197],
            "transmitterc6a": [4200, 2640, 420, 197],
            "transmitterc6b": [4620, 2640, 420, 197],
            "minusone": [4464, 1763, 60, 60],
            "plusone": [4524, 1763, 60, 60], 
            "number1": [5536, 2419, 55, 56],           
            "number2": [5591, 2419, 55, 56],
            "number3": [5564, 2419, 55, 56],
            "number4": [5701, 2419, 55, 56],
            "number5": [5756, 2419, 55, 56],
            "number6": [5811, 2419, 55, 56],
            "number7": [5866, 2419, 55, 56],
            "number8": [5921, 2419, 55, 56],
            "number9": [5976, 2419, 55, 56],
            "number10": [6031, 2419, 55, 56],
            "number11": [6086, 2419, 55, 56],
            "number12": [6141, 2419, 55, 56],
            "number13": [6196, 2419, 55, 56],
            "number14": [6251, 2419, 55, 56],
            "number15": [6306, 2419, 55, 56],
            "number16": [6361, 2419, 55, 56],
            "number17": [6416, 2419, 55, 56],
            "number18": [6471, 2419, 55, 56],
            "number19": [6526, 2419, 55, 56],
            "number20": [6581, 2419, 55, 56]
        });

        return imageloader.loadImages().then(function (imagelist) {
            const list = imagelist.alltokens;
            
            const board = gametile('board');

            // ================================================================
            // Tokens
            // ================================================================
            
            tray(token(list.tokenblue), 'token', "0000ff");
            tray(token(list.tokengreen), 'token', "008000");
            tray(token(list.tokenyellow), 'token', "ffa500");
            tray(token(list.tokenred), 'token', "ff0000");
            
            tray(token(list.shipblue, "ship", "0000ff"), 'ship', "0000ff");
            tray(token(list.shipgreen, "ship", "008000"), 'ship', "008000");
            tray(token(list.shipyellow, "ship", "ffa500"), 'ship', "ffa500");
            tray(token(list.shipred, "ship", "ff0000"), 'ship', "ff0000");
            
            tray(token(list.ringblue), 'ring', "0000ff");
            tray(token(list.ringgreen), 'ring', "008000");
            tray(token(list.ringyellow), 'ring', "ffa500");
            tray(token(list.ringred), 'ring', "ff0000");    
 
            tray(token(list["100pointsblue"]), '100points', "0000ff");
            tray(token(list["100pointsgreen"]), '100points', "008000");
            tray(token(list["100pointsyellow"]), '100points', "ffa500");
            tray(token(list["100pointsred"]), '100points', "ff0000");    
            
            tray(token(list.dicemarker), "marker");

            tray(token(list.smalldie1, "die", 1), "smalldice", 1);
            tray(token(list.smalldie2, "die", 2), "smalldice", 2);
            tray(token(list.smalldie3, "die", 3), "smalldice", 3);
            tray(token(list.smalldie4, "die", 4), "smalldice", 4);
            tray(token(list.smalldie5, "die", 5), "smalldice", 5);
            tray(token(list.smalldie6, "die", 6), "smalldice", 6);

            tray(token(list.silverdie1, "die", 1), "dice", 1);
            tray(token(list.silverdie2, "die", 2),"dice", 2);
            tray(token(list.silverdie3, "die", 3),"dice", 3);
            tray(token(list.silverdie4, "die", 4), "dice", 4);
            tray(token(list.silverdie5, "die", 5), "dice", 5);
            tray(token(list.silverdie6, "die", 6), "dice", 6);    

            tray(token(list.reddie1, "die", 1), "reddice", 1);
            tray(token(list.reddie2, "die", 2), "reddice", 2);
            tray(token(list.reddie3, "die", 3), "reddice", 3);
            tray(token(list.reddie4, "die", 4), "reddice", 4);
            tray(token(list.reddie5, "die", 5), "reddice", 5);
            tray(token(list.reddie6, "die", 6), "reddice", 6);    
            
            tray(token(list.constructionaward4, 4), "constructionaward", 4);
            tray(token(list.constructionaward7, 7), "constructionaward", 7);

            tray(token(list.engineeringcube, 1), "engineeringcube", 1);
            tray(token(list.engineeringcubes4, 4), "engineeringcube", 4);

            tray(token(list.plusone, "plusone"), "plusone");
            tray(token(list.minusone, "minusone"), "minusone");

            tray(token(list.number1), "number", 1);
            tray(token(list.number2), "number", 2);
            tray(token(list.number3), "number", 3);
            tray(token(list.number4), "number", 4);
            tray(token(list.number5), "number", 5);
            tray(token(list.number6), "number", 6);
            tray(token(list.number7), "number", 7);
            tray(token(list.number8), "number", 8);
            tray(token(list.number9), "number", 9);
            tray(token(list.number10), "number", 10);
            tray(token(list.number11), "number", 11);
            tray(token(list.number12), "number", 12);
            tray(token(list.number13), "number", 13);
            tray(token(list.number14), "number", 14);
            tray(token(list.number15), "number", 15);
            tray(token(list.number16), "number", 16);
            tray(token(list.number17), "number", 17);
            tray(token(list.number18), "number", 18);
            tray(token(list.number19), "number", 19);
            tray(token(list.number20), "number", 20);

            tray(token(list.timemarker, "timemarker"));

            tray(token(list.bonusback), "bonus", "back");
            tray(token(list.bonuscubes), "bonus", "cubes");
            tray(token(list.bonussystems), "bonus", "systems");
            tray(token(list.bonusmodifier), "bonus", "modifier");
            tray(token(list.bonus4points), "bonus", "4points");
            tray(token(list.bonus5points), "bonus", "5points");

            tray(token(list.modifikator1, "modifier", 1), "modifier", "1");
            tray(token(list.modifikator2, "modifier", 2), "modifier", "2");

            tray(token(list.gyordyne1a), "gyrodyne", "active", "1");
            tray(token(list.gyordyne2a), "gyrodyne", "active", "2");
            tray(token(list.gyordyne3a), "gyrodyne", "active", "3");
            tray(token(list.gyordyne1b), "gyrodyne", "inactive", "1");
            tray(token(list.gyordyne2b), "gyrodyne", "inactive", "2");
            tray(token(list.gyordyne3b), "gyrodyne", "inactive", "3");

            tray(gametile(list.transmittera1a), "transmitter", "A1", "inactive");
            tray(gametile(list.transmittera1b), "transmitter", "A1", "active");
            tray(gametile(list.transmittera2a), "transmitter", "A2", "inactive");
            tray(gametile(list.transmittera2b), "transmitter", "A2", "active");
            tray(gametile(list.transmittera3a), "transmitter", "A3", "inactive");
            tray(gametile(list.transmittera3b), "transmitter", "A3", "active");
            tray(gametile(list.transmittera4a), "transmitter", "A4", "inactive");
            tray(gametile(list.transmittera4b), "transmitter", "A4", "active");
            tray(gametile(list.transmittera5a), "transmitter", "A5", "inactive");
            tray(gametile(list.transmittera5b), "transmitter", "A5", "active");
            tray(gametile(list.transmittera6a), "transmitter", "A6", "inactive");
            tray(gametile(list.transmittera6b), "transmitter", "A6", "active");

            tray(gametile(list.transmitterb1a), "transmitter", "B1", "inactive");
            tray(gametile(list.transmitterb1b), "transmitter", "B1", "active");
            tray(gametile(list.transmitterb2a), "transmitter", "B2", "inactive");
            tray(gametile(list.transmitterb2b), "transmitter", "B2", "active");
            tray(gametile(list.transmitterb3a), "transmitter", "B3", "inactive");
            tray(gametile(list.transmitterb3b), "transmitter", "B3", "active");
            tray(gametile(list.transmitterb4a), "transmitter", "B4", "inactive");
            tray(gametile(list.transmitterb4b), "transmitter", "B4", "active");
            tray(gametile(list.transmitterb5a), "transmitter", "B5", "inactive");
            tray(gametile(list.transmitterb5b), "transmitter", "B5", "active");
            tray(gametile(list.transmitterb6a), "transmitter", "B6", "inactive");
            tray(gametile(list.transmitterb6b), "transmitter", "B6", "active");

            tray(gametile(list.transmitterc1a), "transmitter", "C1", "inactive");
            tray(gametile(list.transmitterc1b), "transmitter", "C1", "active");
            tray(gametile(list.transmitterc2a), "transmitter", "C2", "inactive");
            tray(gametile(list.transmitterc2b), "transmitter", "C2", "active");
            tray(gametile(list.transmitterc3a), "transmitter", "C3", "inactive");
            tray(gametile(list.transmitterc3b), "transmitter", "C3", "active");
            tray(gametile(list.transmitterc4a), "transmitter", "C4", "inactive");
            tray(gametile(list.transmitterc4b), "transmitter", "C4", "active");
            tray(gametile(list.transmitterc5a), "transmitter", "C5", "inactive");
            tray(gametile(list.transmitterc5b), "transmitter", "C5", "active");
            tray(gametile(list.transmitterc6a), "transmitter", "C6", "inactive");
            tray(gametile(list.transmitterc6b), "transmitter", "C6", "active");
            
            // ================================================================
            // Planetary Systems
            // ================================================================             

            tray(gametile(list.system1), 'system', 1);
            tray(gametile(list.system2), 'system', 2);
            tray(gametile(list.system3), 'system', 3);
            tray(gametile(list.system4), 'system', 4);
            tray(gametile(list.system5), 'system', 5);
            tray(gametile(list.system6), 'system', 6);
            tray(gametile(list.system7), 'system', 7);
            tray(gametile(list.system8), 'system', 8);
            tray(gametile(list.system9), 'system', 9);
            tray(gametile(list.system10), 'system', 10);
            tray(gametile(list.system11), 'system', 11);
            tray(gametile(list.system12), 'system', 12);
            tray(gametile(list.system13), 'system', 13);
            tray(gametile(list.system14), 'system', 14);
            tray(gametile(list.system15), 'system', 15);
            tray(gametile(list.system16), 'system', 16);
            tray(gametile(list.system17), 'system', 17);

            // ================================================================
            // Diceboard
            // ================================================================            

            tray(gametile(list.diceboard4Player), 'diceboard');
            board.addGameTile(tray('diceboard'), 780, 229, rotation(1678, 1856, -90));

            tray('diceboard').createOverlay('ships').addInsertPositions([
                [], [320, 153, 120], [373, 135, 120], [436, 116, 120], [485, 97, 120]
            ]);            
            
            tray('diceboard').createOverlay('marker').addInsertPositions([
                [], [210, 607, -31], [332, 541, -25], [464, 484, -16], [592, 444, -11], [734, 415, -3], [867, 409],
                [1008, 410, 8], [1145, 432, 21], [1280, 469, 26], [1414, 518, 36], [1536, 582, 40]
            ]);             

            tray('diceboard').createOverlay('dice').addInsertPositions([
                [76, 535], [121, 482], [187, 468], [238, 423], [144, 557], [208, 536], [257, 488], [173, 617], [278, 554],
                [536, 440], [530, 373], [519, 308], [466, 352], [470, 417], [391, 354], [400, 424], [393, 490], [334, 403],
                [623, 283], [693, 296], [753, 259], [813, 290], [633, 346], [703, 367], [767, 344], [652, 419], [814, 400],
                [928, 273], [1001, 266], [1116, 283], [921, 340], [990, 331], [1056, 317], [962, 394], [1053, 400], [1107, 361],
                [1235, 312], [1295, 344], [1361, 349], [1423, 380], [1224, 378], [1289, 410], [1365, 415], [1228, 445], [1319, 473],
                [1515, 426], [1495, 490], [1580, 469], [1482, 557], [1551, 537], [1621, 541], [1688, 533], [1563, 606], [1630, 609]
            ]).makeTokensClickable();
            
            addEngineerTokenPositions(tray('diceboard').createOverlay('engineerTokens'));
            addInitiativeTokenPositions(tray('diceboard').createOverlay('initiativeTokens'));

            tray('diceboard').addClickArea('engineeringtrack', [[455, 218], [893, 79, 1274, 194, 1328, 225], [1326, 276], [1275, 270, 902, 140, 462, 272]]);
            tray('diceboard').addClickArea('initiativetrack', [[443, 94], [736, 27, 967, 3, 1340, 94], [1331, 158], [893, 24, 483, 154, 364, 154]]);            

            // ================================================================
            // Gyrondyne Board
            // ================================================================              

            tray(gametile(list.gyrodyneboard), 'gyrodyneboard');
            board.addGameTile(tray('gyrodyneboard'), 1103, 300, rotation(1678, 1856, -26.5));            

            // ================================================================
            // Modifier Board
            // ================================================================              
            
            tray(gametile(list.modifierboard), 'modifierboard');
            board.addGameTile(tray('modifierboard'), 1398, 540, rotation(1678, 1856, 12));                

            // ================================================================
            // Goal Tiles
            // ================================================================            

            tray(gametile(list.goaltile2b), 'goaltile-1');
            tray(gametile(list.goaltile6a), 'goaltile-2');
            tray(gametile(list.goaltile1a), 'goaltile-3');
            
            board.addGameTile(tray('goaltile-1'), 1532, 122, rotation(1678, 1856, 32));
            board.addGameTile(tray('goaltile-2'), 1532, 122, rotation(1678, 1856, 39));
            board.addGameTile(tray('goaltile-3'), 1532, 122, rotation(1678, 1856, 46));

            // ================================================================
            // Tech Boards
            // ================================================================            

            tray(gametile(list["tech-AI"]), 'tech1');
            tray(gametile(list["tech-AII"]), 'tech2');
            tray(gametile(list["tech-AIII"]), 'tech3');

            board.addGameTile(tray('tech1'), 1138, 420, rotation(1678, 1856, 90));
            board.addGameTile(tray('tech2'), 1241, -50, rotation(1678, 1856, 90));
            board.addGameTile(tray('tech3'), 1275, -350, rotation(1678, 1856, 90));

            board.createOverlay('timemarker').addInsertPositions([
                [], [2667, 1234], [2845, 1248], [3038, 1339], [3211, 1354], [3380, 1364], [3544, 1376], [3703, 1387], [3865, 1397] 
            ]);

            tray('tech1').addClickArea('tech', [[168, 359], [151, 362, 296, 306, 431, 300], [418, 185], [283, 195, 142, 241, 129, 247]], { variantId: 1 });
            tray('tech1').addClickArea('tech', [[455, 298], [537, 284, 655, 296, 719, 309], [739, 195], [716, 193, 603, 165, 445, 183]], { variantId: 2 });            
            tray('tech1').addClickArea('tech', [[744, 313], [879, 333, 970, 377, 1005, 394], [1053, 287], [1001, 267, 971, 241, 764, 198]], { variantId: 3 }); 
            tray('tech1').addClickArea('tech', [[165, 193], [271, 155, 389, 142, 433, 141], [423, 26], [208, 44, 133, 79, 130, 81]], { variantId: 4 });                        
            tray('tech1').addClickArea('tech', [[453, 141], [567, 129, 737, 152, 722, 151], [739, 36], [637, 7, 447, 19, 444, 23]], { variantId: 5 }); 
            tray('tech1').addClickArea('tech', [[746, 154], [731, 150, 837, 162, 1009, 223], [1053, 118], [1009, 91, 771, 33, 764, 41]], { variantId: 6 });              

            tray('tech2').addClickArea('tech', [[154, 484], [301, 453, 439, 456, 424, 457], [424, 343], [297, 337, 151, 364, 129, 370]], { variantId: 7 });              
            tray('tech2').addClickArea('tech', [[447, 456], [610, 456, 733, 487, 718, 485], [741, 373], [736, 368, 606, 342, 448, 340]], { variantId: 8 });              
            tray('tech2').addClickArea('tech', [[161, 324], [299, 295, 447, 298, 432, 299], [436, 185], [384, 182, 246, 187, 141, 209]], { variantId: 9 });              
            tray('tech2').addClickArea('tech', [[457, 301], [600, 296, 746, 328, 731, 327], [752, 214], [603, 183, 488, 185, 460, 184]], { variantId: 10 });              
            tray('tech2').addClickArea('tech', [[169, 162], [355, 137, 436, 145, 446, 144], [448, 24], [242, 18, 148, 48, 150, 45]], { variantId: 11 });              
            tray('tech2').addClickArea('tech', [[467, 144], [586, 136, 756, 170, 741, 169], [763, 56], [760, 53, 659, 31, 470, 27]], { variantId: 12 });              

            tray('tech3').addClickArea('tech', [[145, 474], [130, 475, 234, 454, 421, 457], [423, 343], [238, 338, 145, 359, 130, 358]], { variantId: 13 });
            tray('tech3').addClickArea('tech', [[444, 456], [429, 455, 599, 460, 719, 482], [736, 369], [633, 345, 462, 339, 447, 341]], { variantId: 14 });
            tray('tech3').addClickArea('tech', [[154, 313], [139, 314, 343, 293, 432, 300], [434, 185], [420, 181, 281, 181, 140, 199]], { variantId: 15 });
            tray('tech3').addClickArea('tech', [[453, 299], [634, 304, 745, 326, 730, 325], [749, 211], [682, 196, 473, 182, 458, 183]], { variantId: 16 });
            tray('tech3').addClickArea('tech', [[164, 155], [310, 136, 458, 142, 443, 143], [444, 26], [250, 22, 168, 37, 151, 40]], { variantId: 17 });

            tray('tech1').createOverlay("1").addInsertPositions([[144, 240], [160, 291]]);
            tray('tech1').createOverlay("2").addInsertPositions([[452, 185], [455, 239]]);
            tray('tech1').createOverlay("3").addInsertPositions([[762, 209], [751, 261]]);
            tray('tech1').createOverlay("4").addInsertPositions([[143, 76], [158, 128]]);
            tray('tech1').createOverlay("5").addInsertPositions([[453, 27], [454, 81]]);
            tray('tech1').createOverlay("6").addInsertPositions([[763, 47], [754, 101]]);

            tray('tech2').createOverlay("7").addInsertPositions([[143, 368], [152, 422]]);
            tray('tech2').createOverlay("8").addInsertPositions([[454, 345], [452, 400]]);
            tray('tech2').createOverlay("9").addInsertPositions([[152, 206], [161, 260]]);
            tray('tech2').createOverlay("10").addInsertPositions([[464, 188], [462, 243]]);
            tray('tech2').createOverlay("11").addInsertPositions([[163, 46], [170, 100]]);
            tray('tech2').createOverlay("12").addInsertPositions([[475, 31], [473, 85]]);

            tray('tech3').createOverlay("13").addInsertPositions([[138, 358], [145, 412]]);
            tray('tech3').createOverlay("14").addInsertPositions([[451, 345], [448, 399]]);
            tray('tech3').createOverlay("15").addInsertPositions([[149, 198], [155, 252]]);
            tray('tech3').createOverlay("16").addInsertPositions([[462, 189], [460, 243]]);
            tray('tech3').createOverlay("17").addInsertPositions([[160, 40], [165, 93]]);

            // ================================================================
            // Player Boards
            // ================================================================  
            
            let plpos = [50, 1050, 2050, 3050];
            let i = 0;
            for (let key in players) {

                tray(gametile(list["HQ-A1"]), key);
    
                board.addGameTile(tray(key), plpos[i], 3167);
                
                let overlay = tray(key).createOverlay('dice');
                overlay.addInsertPosition("0", 7, 7);
                overlay.addInsertPosition("1", 93, 7);
                overlay.makeTokensClickable();

                overlay = tray(key).createOverlay('modifierone');
                overlay.addInsertPosition("0", 7, 93);
                overlay.makeTokensClickable();

                overlay = tray(key).createOverlay('modifiertwo');
                overlay.addInsertPosition("0", 7, 187);
                overlay.makeTokensClickable();

                overlay = tray(key).createOverlay("gyrodyne");
                overlay.addInsertPosition("1", 775, 7);
                overlay.addInsertPosition("2", 775, 116);
                overlay.addInsertPosition("3", 775, 226);
                overlay.makeTokensClickable();

                overlay = tray(key).createOverlay("pulsarrings");
                overlay.addInsertPosition("0", 595, 7);

                i++;
            }

            // ================================================================
            // Starcluster
            // ================================================================
            
            tray(gametile(list.starcluster1), "starcluster");
            board.addGameTile(tray('starcluster'), 555, 733);
            
            addStarclusterTokenPositions(tray('starcluster').createOverlay('tokens'), 1093);

            const nodes = [
                [0,0], [121,720], [215,748], [397,551], [540,429], [563,251], [746,351], [770,189], [847,108], [1062,132], [1222,199], [1359,163], [1471,217], [1400,332],
                [1671,284], [1571,393], [1572,604], [1682,555], [1798,587], [1913,670], [1781,808], [1742,956], [1919,958], [1807,1084], [2033,1091], [1857,1212], [1851,1367],
                [1833,1502], [1684,1536], [1797,1654], [1690,1802], [1590,1929], [1380,2013], [1010,2053], [962,1898], [846,1838], [822,1973], [618,1977], [674,1878], 
                [483,1817], [626,1710], [481,1572], [349,1606], [333,1434], [212,1275], [235,1122], [156,1026], [144,894], [308,906], [404,1299], [539,1376], [611,1248], [775,1131],
                [756,1403], [728,1547], [839,1646], [1008,1725], [1074,1825], [1163,1926], [1246,1726], [1412,1710], [1430,1590], [1266,1420], [1087,1306], [888,1256], [936,1412],
                [1059,1488], [1408,1238], [1479,1038], [1651,1136], [1616,1292], [1583,852], [1411,910], [1324,712], [1386,495], [1188,560], [1171,395], [1126,734], [1160,890], [1004,866],
                [835,904], [691,875], [646,992], [467,1024], [521,838], [671,600], [954,433], [875,600]
            ];
            tray('starcluster').addClickAreas(nodes, 80, 67);
            tray('starcluster').createOverlay('ships').addInsertPositions(nodes).makeTokensClickable();              

            tray('starcluster').createOverlay('dice').addInsertPositions([
                [995, 968], [959, 1074], [1000, 1183], [1116, 1242], [1231, 1260], [1339, 1216], [1344, 1127], [1327, 1039], [1295, 966]
            ]);   
            
            let blackhole = tray('starcluster').createOverlay('blackhole');
            blackhole.addInsertPosition("die", 1056, 1067);
            blackhole.addInsertPosition("modifier", 1182, 1067);
            blackhole.addInsertPosition("plus", 1243, 1054);
            blackhole.addInsertPosition("minus", 1243, 1116);
            blackhole.makeTokensClickable(); 

            const systems = tray('starcluster').createOverlay('planetarysystems');
            systems.addInsertPosition(3, 328, 501); systems.addInsertPosition(6, 677, 292); systems.addInsertPosition(9, 991, 86);
            systems.addInsertPosition(15, 1503, 350); systems.addInsertPosition(19, 1843, 615); systems.addInsertPosition(25, 1780, 1160);
            systems.addInsertPosition(30, 1619, 1751); systems.addInsertPosition(32, 1308, 1958); systems.addInsertPosition(39, 413, 1767);
            systems.addInsertPosition(44, 143, 1224); systems.addInsertPosition(52, 693, 1079); systems.addInsertPosition(54, 665, 1500);
            systems.addInsertPosition(62, 1200, 1371); systems.addInsertPosition(68, 1413, 986); systems.addInsertPosition(75, 1131, 508);
            systems.addInsertPosition(84, 451, 780); 

            let rings = tray('starcluster').createOverlay('rings');
            rings.addInsertPosition(5, 554, 229); rings.addInsertPosition(11, 1348, 144); rings.addInsertPosition(16, 1560, 584);
            rings.addInsertPosition(22, 1906, 931); rings.addInsertPosition(28, 1675, 1512); rings.addInsertPosition(35, 840, 1822);
            rings.addInsertPosition(42, 339, 1586); rings.addInsertPosition(47, 145, 871); rings.addInsertPosition(50, 535, 1357);            
            rings.addInsertPosition(61, 1418, 1565); rings.addInsertPosition(66, 1047, 1470); rings.addInsertPosition(70, 1610, 1268); 
            rings.addInsertPosition(71, 1586, 835); rings.addInsertPosition(76, 1160, 372); rings.addInsertPosition(78, 1155, 872);
            rings.addInsertPosition(87, 870, 576);   

            // ================================================================
            // Planetary Systems
            // ================================================================
            
            tray('system', 1).createOverlay('blue').addInsertPositions([[16, 64], [63, 17], [125, 17], [174, 64]]);
            tray('system', 1).createOverlay('stone').addInsertPositions([]);

            tray('system', 2).createOverlay('blue').addInsertPositions([[16, 64], [63, 17], [174, 64]]);
            tray('system', 2).createOverlay('stone').addInsertPositions([]);

            tray('system', 3).createOverlay('blue').addInsertPositions([[63, 17], [174, 64]]);
            tray('system', 3).createOverlay('stone').addInsertPositions([[16, 64]]);

            tray('system', 4).createOverlay('blue').addInsertPositions([[125, 17]]);
            tray('system', 4).createOverlay('stone').addInsertPositions([[16, 64]]);

            tray('system', 5).createOverlay('blue').addInsertPositions([[63, 17]]);
            tray('system', 5).createOverlay('stone').addInsertPositions([[16, 64], [174, 64]]);

            tray('system', 6).createOverlay('blue').addInsertPositions([[63, 17]]);
            tray('system', 6).createOverlay('stone').addInsertPositions([[16, 64], [174, 64]]);

            tray('system', 7).createOverlay('blue').addInsertPositions([[63, 17], [125, 17]]);
            tray('system', 7).createOverlay('stone').addInsertPositions([[16, 64]]);

            tray('system', 8).createOverlay('blue').addInsertPositions([[63, 17], [125, 17]]);
            tray('system', 8).createOverlay('stone').addInsertPositions([[16, 64]]);

            tray('system', 9).createOverlay('blue').addInsertPositions([[63, 17], [125, 17]]);
            tray('system', 9).createOverlay('stone').addInsertPositions([[16, 64], [174, 64]]);

            tray('system', 10).createOverlay('blue').addInsertPositions([[63, 17], [125, 17]]);
            tray('system', 10).createOverlay('stone').addInsertPositions([[174, 64]]);

            tray('system', 11).createOverlay('blue').addInsertPositions([[63, 17]]);
            tray('system', 11).createOverlay('stone').addInsertPositions([[16, 64], [174, 64]]);

            tray('system', 12).createOverlay('blue').addInsertPositions([[125, 17]]);
            tray('system', 12).createOverlay('stone').addInsertPositions([[16, 64]]);

            tray('system', 13).createOverlay('blue').addInsertPositions([[63, 17]]);
            tray('system', 13).createOverlay('stone').addInsertPositions([[16, 64], [174, 64]]);

            tray('system', 14).createOverlay('blue').addInsertPositions([[63, 17], [125, 17]]);
            tray('system', 14).createOverlay('stone').addInsertPositions([]);

            tray('system', 15).createOverlay('blue').addInsertPositions([[63, 17], [125, 17]]);
            tray('system', 15).createOverlay('stone').addInsertPositions([[16, 64], [174, 64]]);

            tray('system', 16).createOverlay('blue').addInsertPositions([[63, 17], [125, 17]]);
            tray('system', 16).createOverlay('stone').addInsertPositions([[174, 64]]);

            tray('system', 17).createOverlay('blue').addInsertPositions([[63, 17], [125, 17]]);
            tray('system', 17).createOverlay('stone').addInsertPositions([]);            

            return board;
        });
    };

    return createPulsarBoard;

});