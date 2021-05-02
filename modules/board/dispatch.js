define([
    "bgagame/modules/board/board"    
], function (board) {
    return function (type, payload) {
        board.dispatch({
            type: type,
            payload: payload
        });
    }
});