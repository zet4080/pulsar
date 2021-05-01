define([
    "bgagame/modules/state/board"
], function (board) {

    const addTokenVariant = function (tokenId, variantId, token) {
        board.dispatch({
            type: "token/addVariant",
            payload: {
                tokenId, variantId, token
            }
        });
    };

    const addToken = function (tokenId, token) {
        board.dispatch({
            type: "token/add",
            payload: {
                tokenId, token
            }
        });
    };

    const getTokenVariant = function (tokenId, variantId) {
        let state = board.getState();
        return state.tokens[tokenId][variantId];
    };

    const getToken = function (tokenId) {
        let state = board.getState();
        let token = state.tokens[tokenId];
        if (!token) {
            throw Error("Token with id '" + tokenId + "' does not exist!"); 
        }
        return token;
    }

    const tokentray = function (arg1, arg2) {
        if (typeof arg1 === 'object') {
            if (arg1.variantId) {
                addTokenVariant(arg1.componentId, arg1.variantId, arg1);
            } else {
                addToken(arg1.componentId, arg1);    
            }
        } else {
            if (arg2) {
                return getTokenVariant(arg1, arg2)
            } else {
                return getToken(arg1);
            }
        }
    }
    
    return tokentray;

});