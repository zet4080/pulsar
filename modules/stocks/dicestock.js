define([
    "dojo/dom-style",
    "dojo/dom-construct",
    "bgagame/modules/util/donotoverlap",
    "bgagame/modules/stocks/stock"
], function (style, construct, donotoverlap, stockfactory) {

    var url = g_gamethemeurl + 'img/dicesmall.png';

    var areas = {
        1: $("area-one"),
        2: $("area-two"),
        3: $("area-three"),
        4: $("area-four"),
        5: $("area-five"),
        6: $("area-six")
    };

    var random = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    var deleteGhostObject = function (list) {
        for (var div in list) {
          construct.destroy(list[div]);
          delete list[div];
        }        
    };    

    var createGhostObject = function (x, y, height, width, target) {
        var tmp = construct.place("<div></div>", target); 
        style.set(tmp, {
            position: "absolute",
            left: x + "px",
            top: y + "px",
            height: height + "px",
            width: width + "px",
            zIndex: -999
        });
        return tmp;
    };

    var factory = function (container) {
        var stock = stockfactory.create(container, 20, 20, 6);   
        stock.setSelectionMode = 1; 
        for (var i = 1; i <= 6; i++) {
            stock.addItemType(i, i, url, i - 1);                
        }

        var ghostobjects = {};

        var updateDisplay = stock.updateDisplay;
        stock.updateDisplay = function (from) {
            from = from || stockfactory.container_div;
            deleteGhostObject(ghostobjects);
            var dicepos = donotoverlap(14, 100, 80, this.items.length);
            for (var i = 0; i < stock.items.length; i++) {
                var gd = createGhostObject(dicepos[i].x + 14, dicepos[i].y + 14, 20, 20, areas[stock.items[i].type]);
                ghostobjects[i] = stock.items[i].loc = gd;
                updateDisplay.call(stock, from);
                gameui.rotateTo(stock.getItemDivId(stock.items[i].id), random(0, 360));
            }
        };

        return stock;
    }

    return factory;
});