define([
    "bgagame/modules/diceboard"
], function (diceboard) {

    var playerChooseDice = function (args) {
        var board = diceboard.create(this, args.args.diceboard);
    }

    return {
        playerChooseDice: playerChooseDice
    }

});