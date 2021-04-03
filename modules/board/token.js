define([

], function () {

    const factory = function (image, componentId, variantId) {
        return {
            componentId, variantId, image
        }
    };

    return factory;

});