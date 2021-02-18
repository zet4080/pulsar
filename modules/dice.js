define([
    "ebg/stock"
], function (stock) {

    var url = g_gamethemeurl + 'img/dice.png';

    var factory = function (context, area) {
        var dice = new stock();
        dice.create(context, $(area), 60, 60);    
        dice.image_items_per_row = 6;
        
        for (var i = 1; i < 7; i++) {
            dice.addItemType(i, i, url, i - 1);                
        }

        return dice;
    }

    return factory;
});