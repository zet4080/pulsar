define([
    "bgagame/modules/board/board"
], function (board) {

    const addToken = function (image, tokenId) {
        board.dispatch({
            type: "token/add",
            payload: {
                image, tokenId
            }
        });
    };

    const getToken = function (tokenId) {
        let state = board.getState();
        let token = state.images[tokenId];
        if (!token) {
            throw Error("Token with id '" + tokenId + "' does not exist!"); 
        }
        return tokenId;
    }

    const tray = function () {
        let args = Array.from(arguments);
        if (typeof args[0] === 'object') {
            let image = args.shift();
            addToken(image, args.join("/"));
        } else {
            getToken(args.join("/"));
        }
    }
    
    return tray;

});