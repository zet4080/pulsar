define([
    "bgagame/modules/dice"
], function (dicefactory) {

    var dices;

    var create = function(context, roll) {
        dices = dicefactory(context, 'diceboard');
        for (var d in roll) {
            dices.addToStock(roll[d].type_arg);
        }
    }

    return {
        create: create
    }
});