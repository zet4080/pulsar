define([
    "bgagame/modules/board/board",
    "bgagame/modules/board/dispatch"
], function (board, dispatch) {

    const addComponent = function (id, component) {
        component.id = id; // should be removed for production
        dispatch("tray/add", { 
            id, component
        });
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
            let component = args.shift();
            let id = args.join("_");             
            addComponent(id, component);
        } else {
            return getComponent(args.join("_"));
        }
    }
    
    return tray;

});