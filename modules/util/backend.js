define([
    "dojo/Deferred"
], function (Deferred) {

    var checkIfActionIsValid = function(action) {
        var validAction = dojo.filter(gameui.gamedatas.gamestate.possibleactions, function(item) {
            return item == action;
        });

        if (validAction.length == 0) {
            console.error("Action \"" + action + " \"not allowed in current state " + gameui.gamedatas.gamestate.id + ".");
            throw "Action " + action + "not allowed in current state " + gameui.gamedatas.gamestate.id + ".";
        }
    };

    // summary:
    // This methods sends an ajax call to the server. It returns a deferred
    var call = function (action, param) {

        param = param || {};

        deferred = new Deferred();
        
        checkIfActionIsValid(action);

        var success = function (args) {
            deferred.resolve(args);
        };

        var error = function (args) {
            deferred.reject(args);
        }

        gameui.ajaxcall("/" + gameui.game_name + "/" + gameui.game_name + "/" + action + ".html", param, gameui, success, error);

        return deferred;
    };

    return {
        call: call
    }    
});