define([

], function () {

    const factory = function () {
        let args = Array.from(arguments);
        let image = args.shift();
        let id = args.join("/");
        return {
            image, id
        }
    };

    return factory;

});