define([
    "bgagame/modules/table/stock",
], function (stock) {

    var url = g_gamethemeurl + 'img/dice.png';
    var factory = function (container) {
        
        var dice = stock.create(container, 60, 60, 6);    
        
        for (var i = 1; i < 7; i++) {
            dice.addItemType(i, i, url, i - 1);                
        }

        return dice;
    }

    return factory;
});