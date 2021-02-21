define([
    "dojo/_base/connect",
    "bgagame/modules/put-selector/put",    
    "bgagame/modules/table/dicestock",
    "bgagame/modules/util/gamegui"
], function(connect, put, dicestock, gui) {
    
    var table = $("game_play_area");

    var create = function (player_id) {

        var placedices = function (playerdices) {
            for (var id in playerdices) {
                dices.addToStockWithId(playerdices[id].type_arg, id);
            }
        }

        connect.subscribe("server/dicechoosen", function (args) {
            var dice = args.args.dice;
            var id = args.args.player_id;
            if (player_id == id) {
                dices.addToStockWithId(dice.type_arg, dice.id);
            }
        });

        put(table, "div.playerboard#playerboard" + player_id);
        var dices = dicestock('playerboard' + player_id);

        return {
            placedices: placedices
        }
    }

    return {
        create: create
    }    
});