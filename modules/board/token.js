define([

], function () {

    const factory = function (image, componentId, variantId, posid) {
        return {
            componentId, variantId, posid, image
        }
    };

    return factory;

});