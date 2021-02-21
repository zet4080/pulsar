define([
    "dojo/_base/connect",
    "bgagame/modules/put-selector/put",
    "bgagame/modules/table/dicestock",
    "bgagame/modules/util/backend"
], function (connect, put, dicestock, backend) {

    var table = $("game_play_area");

    var dices;

    var create = function () {
        put(table, "div.diceboard#diceboard");
        dices = dicestock('diceboard');
    }

    var placedices = function (roll) {
        dices.removeAll();
        for (var id in roll) {
            dices.addToStockWithId(roll[id].type_arg, id);
        }
    }

    connect.subscribe("enterstate/startround", function () {
        backend.call("rollDices");
    });
    
    connect.subscribe("server/diceboard", function (args) {
        placedices(args.args.diceboard);
    });

    connect.subscribe("changeselection/diceboard", function (id) {
        var params = { id: id };
        backend
            .call("chooseDice", params);
    });

    connect.subscribe("server/dicechoosen", function (args) {
        dices.removeFromStockById(args.args.dice.id);
    });

    return {
        create: create,
        placedices: placedices
    }
});