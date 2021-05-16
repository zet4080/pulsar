define([
    "bgagame/modules/util/redux",
], function (redux) {

    const initialState = {
        tray: {},
        board: {},
        clickareas: {},
        overlays: {},
        clickable: {},
        tokens: {}
    };

    const addComponent = function (state, payload) {
        const { id, component } = payload;
        let newState = { ...state };
        newState.tray = { ...state.tray };
        newState.tray[id] = component;
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
        newState.clickareas[source] = newState.clickareas[source] ? [ ...newState.clickareas[source] ] : [];
        newState.clickareas[source].push({ path, info });
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
    
    const slotTokenInPosition = function (state, payload) {
        const { tileId, name, posid, token } = payload;

        let newToken = { ...token };
        newToken.pos = { ...state.overlays[tileId][name][posid] };

        let newState = { ...state };
        newState.tokens = { ...state.tokens };
        newState.tokens[tileId] = newState.tokens[tileId] ? { ...state.tokens[tileId] } : {};
        newState.tokens[tileId][name] = newState.tokens[tileId][name] ? { ...state.tokens[tileId][name] } : {};
        newState.tokens[tileId][name][posid] = newToken;
        
        return newState;
    }; 

    const slotGameTileInPosition = function (state, payload) {
        const { tileId, name, posid, gametile } = payload;

        let pos = state.overlays[tileId][name][posid];

        let newGameTile = { ...gametile };
        newGameTile.parent = tileId;
        newGameTile.x = pos.x;
        newGameTile.y = pos.y;
        newGameTile.r = pos.r;

        let newState = { ...state };
        newState.board = { ...state.board };
        newState.board[gametile.id] = newGameTile;

        return newState;
    };     
    
    const removeAllTokens = function (state, payload) {
        const { tileId, overlay } = payload;
        let newState = { ...state };
        newState.tokens = { ...state.tokens };
        newState.tokens[tileId] = newState.tokens[tileId] ? { ...state.tokens[tileId] } : {};
        newState.tokens[tileId][overlay] = {};

        return newState;
    }

    const removeTokenFromPosition = function (state, payload) {
        const { tileId, overlay, position } = payload;
        let newState = { ...state };
        newState.tokens = { ...state.tokens };
        newState.tokens[tileId] = { ...state.tokens[tileId] };
        newState.tokens[tileId][overlay] = { ...state.tokens[tileId][overlay] };
        delete newState.tokens[tileId][overlay][position];
        return newState;
    }

    const makeTokensClickable = function (state, payload) {
        const { tileId, overlay } = payload;
        let newState = { ...state };
        newState.clickable = { ...state.clickable };
        newState.clickable[tileId] = newState.clickable[tileId] ? { ...state.clickable[tileId] } : {};
        newState.clickable[tileId][overlay] = true;
        return newState;
    }    

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
            case "overlay/slottokeninposition":
                return slotTokenInPosition(state, action.payload);    
            case "overlay/slotgametileinposition":
                return slotGameTileInPosition(state, action.payload);                                              
            case "overlay/removealltokens":
                return removeAllTokens(state, action.payload);   
            case "overlay/removetokenfromposition":
                return removeTokenFromPosition(state, action.payload);
            case "overlay/maketokensclickable":
                return makeTokensClickable(state, action.payload);
            default:
              return state
        }
    };

    const store = redux.createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

    return store;

});