define([
    "bgagame/modules/board/nextid"
], function (nextid) {

    const factory = function (image, value) {
        let id = nextid();
        return {
            id, image, value
        }
    };

    return factory;

});