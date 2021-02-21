define([

], function () {

    var gui = {};

    var register = function (ctx) {
        gui = ctx;
    };

    return {
        register: register,
        get context() {
            return gui;
        }
    }
});