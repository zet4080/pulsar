define([
    "bgagame/modules/util/redux",
], function (redux) {

    const initialState = {
        tray: {},
        board: {},
        clickareas: {},
        overlays: {}
    };

    const addComponent = function (state, payload) {
        const { component } = payload;
        let newState = { ...state };
        newState.tray = { ...state.tray };
        newState.tray[component.id] = component;
        return newState;
    };    

    const addGameTile = function (state, payload) {
        const { source, tile, x, y, r } = payload;
        let newState = { ...state };
        newState.board = { ...state.board };
        newState.board[tile.id] = { parent: source, x, y, r };
        return newState;
    }; 
    
    const addClickArea = function (state, payload) {
        const { source, id, path, info } = payload;
        let newState = { ...state };
        newState.clickareas = { ...state.clickareas };
        newState.clickareas[source] = newState.clickareas[source] ? { ...newState.clickareas[source] } : {};
        newState.clickareas[source][id] = { path, info };
        return newState;
    };   
    
    const addOverlay = function (state, payload) {
        const { source, name } = payload;
        let newState = { ...state };
        newState.overlays = { ...state.overlays };
        newState.overlays[source] = newState.overlays[source] ? { ...state.overlays[source] } : {};
        newState.overlays[source][name] = {};
        return newState;
    };   
    
    const addInsertPosition = function (state, payload) {
        const { tileId, name, posid, x, y, r } = payload;
        let newState = { ...state };
        newState.overlays = { ...state.overlays };
        newState.overlays[tileId] = { ...state.overlays[tileId] };
        newState.overlays[tileId][name] = { ...state.overlays[tileId][name] };
        newState.overlays[tileId][name][posid] = { x, y, r};
        return newState;
    };       

    const reducer = function (state = initialState, action) {
        switch (action.type) {
            case "tray/add":
                return addComponent(state, action.payload);
            case "board/addgametile":
                return addGameTile(state, action.payload); 
            case "gametile/addclickarea":
                return addClickArea(state, action.payload); 
            case "gametile/addoverlay":
                return addOverlay(state, action.payload); 
            case "overlay/addinsertposition":
                return addInsertPosition(state, action.payload);                 
            default:
              return state
        }
    };

    const store = redux.createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

    return store;

});