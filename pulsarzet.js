/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * PulsarZet implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * pulsarzet.js
 *
 * PulsarZet user interface script
 * 
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

define([
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/_base/lang",
    "bgagame/modules/board/pulsarboard",
    "bgagame/modules/board/canvas",
    "bgagame/modules/stocks/calculatedicepositions",
    "bgagame/modules/util/backend",
    "ebg/core/gamegui",
    "ebg/counter"
],
function (declare, connect, lang, pulsarboard, canvas, calculatedicepositions, backend) {
    return declare("bgagame.pulsarzet", ebg.core.gamegui, {
        
        constructor: function() {
            console.log('pulsarzet constructor');
        },
        
        /*
            setup:
            
            This method must set up the game user interface according to current game situation specified
            in parameters.
            
            The method is called each time the game interface is displayed to a player, ie:
            _ when the game starts
            _ when a player refreshes the game page (F5)
            
            "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
        */
        
        setup: function( gamedatas )
        {
            console.log( "Starting game setup" );
            
            this.setupNotifications();
            canvas.createTable('table');
            canvas.setScale(0.5);
            pulsarboard.then(lang.hitch(this, function (board) {
                this.board = board;
                connect.publish("server/markerset", { markerposition: gamedatas.markerposition });
                connect.publish("server/dicerolled", { dice: gamedatas.diceboard });
                connect.publish("server/playerordercalculated", gamedatas.players);
            }));

            console.log( "Ending game setup" );
        },
       

        ///////////////////////////////////////////////////
        //// Game & client states
        
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function( stateName, args )
        {
            console.log( 'Entering state: ' + stateName );
            connect.publish("enteringstate/" + stateName, args);
        },

        // onLeavingState: this method is called each time we are leaving a game state.
        //                 You can use this method to perform some user interface changes at this moment.
        //
        onLeavingState: function( stateName )
        {
            console.log( 'Leaving state: ' + stateName );
            connect.publish("leavingstate/" + stateName);
        }, 

        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //        
        onUpdateActionButtons: function( stateName, args )
        {
            console.log( 'onUpdateActionButtons: '+stateName );
            if( this.isCurrentPlayerActive() )
            {            
                connect.publish("updateactionbuttons/" + stateName, args);
            }
        },        

        ///////////////////////////////////////////////////
        //// Utility methods
        
        ///////////////////////////////////////////////////
        //// Player's action
        
        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications

        /*
            setupNotifications:
            
            In this method, you associate each of your game notifications with your local method to handle it.
            
            Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                  your pulsarzet.game.php file.
        
        */
        setupNotifications: function ()
        {
            console.log( 'notifications subscriptions setup' );
            connect.subscribe("server/dicerolled", this, function (args) {
                var coords = calculatedicepositions(args.dice);
                var diceboard = this.board.getGameTile('diceboard');
                diceboard.removeAllTokens('dice');
                for (var i = 0; i < coords.length; i++) {
                    diceboard.placeTokenAtPosition('dice', coords[i], args.dice[i].value);
                }
                canvas.drawBoard(this.board);
            });

            connect.subscribe("server/markerset", this, function (args) {
                var diceboard = this.board.getGameTile('diceboard');
                diceboard.removeAllTokens('marker');
                diceboard.placeTokenAtPosition('marker', args.markerposition - 1);
                canvas.drawBoard(this.board);
            });

            connect.subscribe("server/playerordercalculated", this, function (players) {
                var diceboard = this.board.getGameTile('diceboard');
                diceboard.removeAllTokens('ship');
                for (var player in players) {
                    diceboard.placeTokenAtPosition('ship', players[player].nr, players[player].color);
                }
                canvas.drawBoard(this.board);
            });

            connect.subscribe("click/diceboard", this, function (info) {
                backend.call('chooseDie', {
                    value: info['id']
                });
            });

        },  
   });             
});
