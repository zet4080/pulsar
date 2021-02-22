define([
    "bgagame/modules/table/diceboard",
    "bgagame/modules/table/playerboard"
], function (diceboard, playerboard) {

    var playerboards = {};

    var create = function (gamedata) {
        diceboard.create();
        diceboard.placeDiceOnBoard(gamedata.diceboard);

        for (var id in gamedata.players) {
            playerboards[id] = playerboard.create(id);
            playerboards[id].placeDiceOnBoard(gamedata['player' + id].dices);
        }        
    };

    return {
        create: create
    };
});