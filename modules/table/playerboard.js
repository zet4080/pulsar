define([
    "dojo/_base/connect",
    "bgagame/modules/put-selector/put",    
    "bgagame/modules/table/dicestock",
], function(connect, put, dicestock) {
    
    var table = $("game_play_area");

    var create = function (player_id) {

        var placeDiceOnBoard = function (playerdice) {
            for (var die in playerdice) {
                dice.addToStockWithId(playerdice[die].value, playerdice[die].id);
            }
        }

        connect.subscribe("server/dicechoosen", function (args) {
            var choosenDice = args.args.dice;
            var id = args.args.player_id;
            if (player_id == id) {
                dice.addToStockWithId(choosenDice.value, choosenDice.id);
            }
        });

        put(table, "div.playerboard#playerboard" + player_id);
        var dice = dicestock('playerboard' + player_id);

        return {
            placeDiceOnBoard: placeDiceOnBoard
        }
    }

    return {
        create: create
    }    
});