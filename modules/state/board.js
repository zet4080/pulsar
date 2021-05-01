define([
    "bgagame/modules/util/redux",
], function (redux) {

    /*
        Structure of the state:

        state = {
            "tokens": {
                "ship": {
                    "0000ff": {
                        "componentId": "ship",
                        "variantId": "0000ff"
                        "image": image
                    }
                }
            },
            
        }

    */


    const initialState = {
        tokens: {},
        tiles: {},
        clickareas: {},
        overlays: {}
    };

    const addTokenVariant = function (state, payload) {
        
        const { tokenId, variantId, token } = payload;
        
        let newState = { ...state };
        newState.tokens = { ... state.tokens };
        newState.tokens[tokenId] = state.tokens[tokenId] ? { ...state.tokens[tokenId] } : {};
        newState.tokens[tokenId][variantId] = token;
        return newState;
    };
    
    const addToken = function (state, payload) {
        
        const { tokenId, token } = payload;
    
        let newState = { ...state };
        newState.tokens = { ...state.tokens };
        newState.tokens[tokenId] = token;
        return newState;

    };    

    const reducer = function (state = initialState, action) {
        switch (action.type) {
            case "token/add":
                return addToken(state, action.payload);
            case "token/addVariant":
                return addTokenVariant(state, action.payload);
            default:
              return state
        }
    };

    const store = redux.createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

    return store;

});