define([
    "dojo/aspect",
    "dojo/_base/connect",
    "bgagame/modules/util/gamegui",
    "ebg/stock"
], function (aspect, connect, gui, stock)
{
    var stockregistry = {
    };

    var publishSelect = function (container, id) {
        connect.publish("changeselection/" + container, id, container, stockregistry[container]);
    };

    var create = function (container, width, height, itemsperrow) {
        var s = new stock();
        s.create(gui.context, $(container), width, height);
        if (itemsperrow) {
            s.image_items_per_row = itemsperrow;
        }
        stockregistry[container] = s;
        aspect.after(s, "onChangeSelection", publishSelect, true);
        return s;
    }

    return {
        create: create
    }

});