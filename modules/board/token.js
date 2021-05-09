define([
    "bgagame/modules/board/nextid"
], function (nextid) {

    const factory = function (image, type, value) {
        let id = nextid();
        return {
            id, image, type, value
        }
    };

    return factory;

});