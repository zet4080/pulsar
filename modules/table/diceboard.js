define([
    "dojo/_base/connect",
    "bgagame/modules/put-selector/put",
    "bgagame/modules/table/dicestock",
    "bgagame/modules/util/backend"
], function (connect, put, dicestock, backend) {

    var table = $("game_play_area");

    var dicestocks = {};

    var changeselection = function (id) {
        var params = { id: id };
        backend
            .call("chooseDice", params);        
    };

    var create = function () {
        var board = put(table, "div.diceboard#diceboard");
        
        put(board, "div.dice_one#dice_one");
        put(board, "div.dice_two#dice_two");
        put(board, "div.dice_three#dice_three");
        put(board, "div.dice_four#dice_four");
        put(board, "div.dice_five#dice_five");
        put(board, "div.dice_six#dice_six");

        dicestocks[1] = dicestock("dice_one");
        dicestocks[2] = dicestock("dice_two");
        dicestocks[3] = dicestock("dice_three");
        dicestocks[4] = dicestock("dice_four");
        dicestocks[5] = dicestock("dice_five");
        dicestocks[6] = dicestock("dice_six");

        connect.subscribe("changeselection/dice_one", changeselection);
        connect.subscribe("changeselection/dice_two", changeselection);
        connect.subscribe("changeselection/dice_three", changeselection);
        connect.subscribe("changeselection/dice_four", changeselection);
        connect.subscribe("changeselection/dice_five", changeselection);
        connect.subscribe("changeselection/dice_six", changeselection);        
    };

    var placeDiceOnBoard = function (roll) {
        debugger;
        for (var nr in dicestocks) {
            dicestocks[nr].removeAll();
        }
        for (var die in roll) {
            dicestocks[roll[die].value].addToStockWithId(roll[die].value, roll[die].id);
        }
    }

    connect.subscribe("enterstate/startround", function () {
        backend.call("rollDice");
    });
    
    connect.subscribe("server/diceboard", function (args) {
        placeDiceOnBoard(args.args.diceboard);
    });

    connect.subscribe("server/dicechoosen", function (args) {
        dicestocks[args.args.dice.value].removeFromStockById(args.args.dice.id);
    });

    return {
        create: create,
        placeDiceOnBoard: placeDiceOnBoard
    }
});