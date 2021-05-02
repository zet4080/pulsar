define([
    "bgagame/modules/board/board",
    "bgagame/modules/board/dispatch"
], function (board, dispatch) {

    const addComponent = function (component) {
        dispatch("tray/add", { component });
    };

    const getComponent = function (id) {
        let state = board.getState();
        let component = state.tray[id];
        if (!component) {
            throw Error("Tray: component with id '" + id + "' does not exist!"); 
        }
        return component;
    }

    const tray = function () {
        let args = Array.from(arguments);
        if (typeof args[0] === 'object') {
            addComponent(args[0]);
        } else {
            return getComponent(args.join("/"));
        }
    }
    
    return tray;

});