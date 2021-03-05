define([
    "dojo/aspect",
    "dojo/topic",
    "ebg/stock"
], function (aspect, topic, stock)
{
    var stockregistry = {
    };

    var publishSelect = function (container, id) {
        topic.publish("changeselection/" + container, id, container, stockregistry[container]);
    };

    var create = function (container, width, height, itemsperrow) {
        var s = new stock();
        s.create(gameui, $(container), width, height);
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