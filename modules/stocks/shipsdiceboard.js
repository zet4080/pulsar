// This might be overkill for placing the ships on the diceboard, but I am too lazy
// to build my own structures - just copy and paste dicestock for now :-)

define([
    "dojo/dom-style",
    "dojo/dom-construct",
    "bgagame/modules/stocks/stock"
], function (style, construct, stockfactory) {

    var url = g_gamethemeurl + 'img/shipssprites.png';

    var shipPos = {
        1:  { top:  88, left: 111, deg: 44 },
        2:  { top:  76, left: 138, deg: 44 },
        3:  { top:  66, left: 166, deg: 44 },
        4:  { top:  56, left: 193, deg: 44 },
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

    var createGhostObject = function (pos) {
        var tmp = construct.place("<div></div>", $("diceboard")); 
        style.set(tmp, {
            position: "absolute",
            left: shipPos[pos].left + "px",
            top: shipPos[pos].top + "px",
            height: "28px",
            width: "35px",
            zIndex: -999
        });
        return tmp;
    };

    var factory = function () {
        construct.place("<div id='shipsdiceboard' style='position:absolute; width: 100%; height: 100%;'></div>", "diceboard"); 
        var stock = stockfactory.create("shipsdiceboard", 30, 24, 1);   
        stock.setSelectionMode = 0; 
        for (var i = 0; i < 4; i++) {
            stock.addItemType(i + 1, i, url, i);                
        }

        var ghostobjects = {};

        var updateDisplay = stock.updateDisplay;
        stock.updateDisplay = function (from) {
            from = from || stockfactory.container_div;
            deleteGhostObject(ghostobjects);
            for (var i = 0; i < stock.items.length; i++) {
                var gd = createGhostObject(stock.items[i].type);
                ghostobjects[i] = stock.items[i].loc = gd;
                updateDisplay.call(stock, from);
                gameui.rotateTo(stock.getItemDivId(stock.items[i].id), shipPos[stock.items[i].type].deg);
            }
        };
        return stock;
    }

    return factory;
});