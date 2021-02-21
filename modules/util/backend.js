define([
    "dojo/_base/connect",
    "bgagame/modules/util/gamegui"
], function (connect, gui) {

    var defaulthandler = function () {
    };   

    var checkIfActionIsValid = function(action) {
        var context = gui.context;
        
        var validAction = dojo.filter(context.gamedatas.gamestate.possibleactions, function(item) {
            return item == action;
        });

        if (validAction.length == 0) {
            console.error("Action \"" + action + " \"not allowed in current state " + context.gamedatas.gamestate.id + ".");
            throw "Action " + action + "not allowed in current state " + context.gamedatas.gamestate.id + ".";
        }
    };

    var playerIsNotActive = function () {
        return !gui.context.isCurrentPlayerActive();
    }

    // summary:
    // This methods sends an ajax call to the server. You can concatenate it with a publish call,
    // that is only called if the server call is successful.
    // example:
    //   call("actionname", {id: "example"}).publish("player/dice", {id: id});
    var call = function (action, param, resulthandler, errorhandler) {
        
        var context = gui.context;
        var msg = {};

        if (playerIsNotActive()) {
            return;
        }
        
        checkIfActionIsValid(action);
        param = param || {};
        resulthandler = resulthandler || defaulthandler;
        errorhandler = errorhandler || defaulthandler;
        
        var savePublishParams = function (channel, params) {
            msg = {
                channel: channel,
                params: params
            }
        };

        var publishIfSuccess = function (args) {
            resulthandler(args);
            if (msg.channel && msg.params) {
                connect.publish(msg.channel, msg.params);
            }
        };

        context.ajaxcall("/" + context.game_name + "/" + context.game_name + "/" + action + ".html", param, context, publishIfSuccess, errorhandler);

        return {
            publish: savePublishParams
        }
    };

    return {
        call: call
    }    
});