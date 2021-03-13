define([
    "bgagame/modules/board/pulsarboard",
    "bgagame/modules/board/canvas",
    "dojo/_base/lang"
], function (pulsarboard, canvas, lang) {
    
    var placeDiceOnPlayerBoards = function (board) {
        let playerboard = board.getGameTile('playerboard-1');
        playerboard.placeTokenAtPosition('dice', 0, 1);
        playerboard.placeTokenAtPosition('dice', 1, 2);
        
        playerboard = board.getGameTile('playerboard-2');
        playerboard.placeTokenAtPosition('dice', 0, 3);
        playerboard.placeTokenAtPosition('dice', 1, 4);        

        playerboard = board.getGameTile('playerboard-3');
        playerboard.placeTokenAtPosition('dice', 0, 5);
        playerboard.placeTokenAtPosition('dice', 1, 6);        

        playerboard = board.getGameTile('playerboard-4');
        playerboard.placeTokenAtPosition('dice', 0, 1);
        playerboard.placeTokenAtPosition('dice', 1, 6);        

        canvas.drawBoard(board);
    };

    canvas.createTable('table');
    canvas.setScale(0.5);
    pulsarboard.then(lang.hitch(this, function (board) {
        canvas.drawBoard(board);
        placeDiceOnPlayerBoards(board);
    }));    
});