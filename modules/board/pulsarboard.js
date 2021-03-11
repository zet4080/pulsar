define([
    "bgagame/modules/board/gameboard",
    "bgagame/modules/board/imageloader"
], function (gameboard, imageloader) {

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

        board.addGameTile('playerboard1', imagelist['playerboard1'], 72, 2070)
        board.addGameTile('playerboard2', imagelist['playerboard2'], 2690, 1710)
        board.addGameTile('playerboard3', imagelist['playerboard3'], 2010, 2070)
        board.addGameTile('playerboard4', imagelist['playerboard4'], 2690, 2070)

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
        diceboard.addClickArea(1, [[32, 430], [205, 317], [280, 455], [128, 550]]);
        diceboard.addClickArea(2, [[242, 300], [437, 232], [480, 380], [308, 443]]);
        diceboard.addClickArea(3, [[475, 221], [680, 200], [688, 356], [508, 377]]);
        diceboard.addClickArea(4, [[717, 195], [923, 223], [894, 380], [712, 359]]);
        diceboard.addClickArea(5, [[962, 228], [1156, 300], [1093, 446], [921, 381]]);
        diceboard.addClickArea(6, [[1193, 316], [1365, 426], [1271, 554], [1119, 456]]);

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
        diceboard.addTokenPositions('dice', [
            [60, 420], [95, 378], [147, 367], [187, 332], [113, 437], [163, 421], [202, 383], [136, 484], [218, 435],
            [421, 345], [416, 293], [407, 242], [366, 276], [369, 327], [307, 278], [314, 333], [308, 385], [262, 316],
            [489, 222], [544, 232], [591, 203], [638, 228], [497, 272], [552, 288], [602, 270], [512, 329], [639, 314],
            [728, 214], [786, 209], [876, 222], [723, 267], [777, 260], [829, 249], [755, 309], [827, 314], [869, 283],
            [969, 245], [1016, 270], [1068, 274], [1117, 298], [961, 297], [1012, 322], [1071, 326], [964, 349], [1035, 371],
            [1189, 334], [1173, 385], [1240, 368], [1163, 437], [1218, 422], [1272, 425], [1325, 418], [1227, 476], [1279, 478]
        ]);
        dice.addTokenVariant(1, 0, 0, 35, 35);
        dice.addTokenVariant(2, 35, 0, 35, 35);
        dice.addTokenVariant(3, 70, 0, 35, 35);
        dice.addTokenVariant(4, 105, 0, 35, 35);
        dice.addTokenVariant(5, 140, 0, 35, 35);
        dice.addTokenVariant(6, 175, 0, 35, 35);

        return board;
    });
});