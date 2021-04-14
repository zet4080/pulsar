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
            "tokengreen": [5484, 2412, 52, 52],
            "tokenblue": [5484, 2464, 52, 52], 
            "tokenred": [5484, 2516, 52, 52],
            "tokenyellow": [5484, 2568, 52, 52],
            "timemarker": [5156, 2550, 153, 96],
            "shipblue": [5369, 2412, 115, 91],
            "shipgreen": [5369, 2503, 115, 91],
            "shipyellow": [5369, 2594, 115, 91],
            "shipred": [5369, 2685, 115, 91],
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
            "ringred": [5054, 2254, 158, 158],
            "ringgreen": [5212, 2254, 158, 158],
            "ringyellow": [5370, 2254, 158, 158],
            "ringblue": [5528, 2254, 158, 158],
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
            "system0": [0, 2837, 354, 260],
            "system1": [0, 3191, 354, 260],
            "system2": [0, 3545, 354, 260],
            "system3": [0, 3899, 354, 260],
            "system4": [0, 4253, 354, 260],
            "system5": [0, 4607, 354, 260],
            "system6": [0, 4961, 354, 260],
            "system7": [0, 5315, 354, 260],
            "system8": [0, 5669, 354, 260],
            "system9": [0, 6023, 354, 260],
            "system10": [0, 6377, 354, 260],
            "system11": [0, 6731, 354, 260],
            "system12": [0, 7085, 354, 260],
            "system13": [0, 7439, 354, 260],
            "system14": [0, 7793, 354, 260],
            "system15": [0, 8147, 354, 260],
            "system16": [0, 8501, 354, 260],
            "system17": [0, 8855, 354, 260],
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
            "transmitterb1a": [0, 2640, 420, 197],
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
            "transmitterc6b": [4620, 2640, 420, 197]            
        });

        return imageloader.loadImages().then(function (imagelist) {
            const list = imagelist.alltokens;
            const board = gametile();

            // ================================================================
            // Tokens
            // ================================================================
            
            tokentray(token(list["tokenblue"], 'token', "0000ff"));
            tokentray(token(list["tokengreen"], 'token', "008000"));
            tokentray(token(list["tokenyellow"], 'token', "ffa500"));
            tokentray(token(list["tokenred"], 'token', "ff0000"));
            
            tokentray(token(list["shipblue"], 'ship', "0000ff"));
            tokentray(token(list["shipgreen"], 'ship', "008000"));
            tokentray(token(list["shipyellow"], 'ship', "ffa500"));
            tokentray(token(list["shipred"], 'ship', "ff0000"));
            
            tokentray(token(list["ringblue"], 'ring', "0000ff"));
            tokentray(token(list["ringgreen"], 'ring', "008000"));
            tokentray(token(list["ringyellow"], 'ring', "ffa500"));
            tokentray(token(list["ringred"], 'ring', "ff0000"));            

            // ================================================================
            // Diceboard
            // ================================================================            

            tokentray(gametile('diceboard', list["diceboard4Player"]));
            board.addGameTile(tokentray('diceboard'), 780, 229, { x: 1678, y: 1856, r: -90 });

            tokentray('diceboard').createOverlay('ships').addInsertPositions([
                [], [320, 173, 120], [373, 155, 120], [436, 136, 120], [485, 117, 120]
            ]);            

            // ================================================================
            // Gyrondyne Board
            // ================================================================              

            tokentray(gametile('gyrodyneboard', list["gyrodyneboard"]));
            board.addGameTile(tokentray('gyrodyneboard'), 1103, 300, { x: 1678, y: 1856, r: -26.5 });            

            // ================================================================
            // Modifier Board
            // ================================================================              
            
            tokentray(gametile('modifierboard', list["modifierboard"]));
            board.addGameTile(tokentray('modifierboard'), 1398, 540, { x: 1678, y: 1856, r: 12 });                

            // ================================================================
            // Goal Tiles
            // ================================================================            

            tokentray(gametile('goaltile-1', list["goaltile2b"]));
            tokentray(gametile('goaltile-2', list["goaltile6a"]));
            tokentray(gametile('goaltile-3', list["goaltile1a"]));

            board.addGameTile(tokentray('goaltile-1'), 1532, 122, { x: 1678, y: 1856, r: 32 });
            board.addGameTile(tokentray('goaltile-2'), 1532, 122, { x: 1678, y: 1856, r: 39 });
            board.addGameTile(tokentray('goaltile-3'), 1532, 122, { x: 1678, y: 1856, r: 46 });

            // ================================================================
            // Tech Boards
            // ================================================================            

            tokentray(gametile('tech-1', list["tech-AI"]));
            tokentray(gametile('tech-2', list["tech-AII"]));
            tokentray(gametile('tech-3', list["tech-AIII"]));

            board.addGameTile(tokentray('tech-1'), 1138, 420, { x: 1678, y: 1856, r: 90 });
            board.addGameTile(tokentray('tech-2'), 1241, -50, { x: 1678, y: 1856, r: 90 });
            board.addGameTile(tokentray('tech-3'), 1275, -350, { x: 1678, y: 1856, r: 90 });

            // ================================================================
            // Starcluster
            // ================================================================
            
            tokentray(gametile("starcluster", list["starcluster1"]));
            board.addGameTile(tokentray('starcluster'), 555, 733);
            
            addStarclusterTokenPositions(tokentray('starcluster').createOverlay('tokens'), 1093);



            return board;
        });
    }

    return createPulsarBoard;

});