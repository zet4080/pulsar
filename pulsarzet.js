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
    "bgagame/modules/stocks/dicestock",
    "bgagame/modules/stocks/marker",
    "bgagame/modules/stocks/shipsdiceboard",
    "bgagame/modules/board/gameboard",
    "ebg/core/gamegui",
    "ebg/counter"
],
function (declare, connect, dicestock, marker, shipsdiceboard, gameboard) {
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

            var board = gameboard('table');
            
            board.addElement('playerboard1', 'img/playerboardA2.webp', 72, 2070)
            board.addElement('playerboard2', 'img/playerboardA2.webp', 2690, 1710)
            board.addElement('playerboard3', 'img/playerboardA2.webp', 2010, 2070)
            board.addElement('playerboard4', 'img/playerboardA2.webp', 2690, 2070)

            board.addElement('diceboard', 'img/diceboard.webp', 483, 0);
            board.addElement('gyrodyne', 'img/gyrodyneboard.webp', 2, 1018);
            board.addElement('modifierboard', 'img/modifierboard.webp', 238, 610);

            board.addElement('tech3', 'img/A3.webp', 2597, 954);
            board.addElement('tech2', 'img/A2.webp', 2228, 919);
            board.addElement('tech1', 'img/A1.webp', 1962, 849);

            board.addElement('starcluster', 'img/starcluster.webp', 352, 408);

            board.setScale(0.5);
            // board.moveTo(-300, 300);
            board.start().then(function() {
                board.rotate(90, 1194, 1251, ['gyrodyne', 'modifierboard', 'diceboard', 'tech1', 'tech2', 'tech3']);
                board.drawScene();
            });

/*
            this.diceStock = dicestock("dicearea");
            connect.publish("server/dicerolled", { dice: gamedatas.diceboard });
            connect.publish("server/markerset", { markerposition: gamedatas.markerposition });
            
            this.playershipsdiceboard = shipsdiceboard();
            connect.publish("server/playerordercalculated", gamedatas.players);
 */
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
        setupNotifications: function()
        {
            console.log( 'notifications subscriptions setup' );
            connect.subscribe("server/dicerolled", this, function (args) {
                for(var i = 0; i < args.dice.length; i++) {
                    this.diceStock.addToStockWithId(args.dice[i].value, args.dice[i].id);
                }
            });

            connect.subscribe("server/markerset", this, function (args) {
                marker(args.markerposition);
            });

            connect.subscribe("server/playerordercalculated", this, function (players) {
                for (var player in players) {
                    this.playershipsdiceboard.addToStockWithId(players[player].nr, players[player].id);
                }
            });

            connect.subscribe("changeselection/diceboard", this, function () {
                debugger;
            });

        },  
   });             
});
