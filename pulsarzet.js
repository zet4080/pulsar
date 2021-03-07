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
    "bgagame/modules/board/imageloader",
    "ebg/core/gamegui",
    "ebg/counter"
],
function (declare, connect, dicestock, marker, shipsdiceboard, gameboard, imageloader) {
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

            var board;

            imageloader.addImage('playerboard1', 'img/playerboardA2.webp');
            imageloader.addImage('playerboard2', 'img/playerboardA2.webp')
            imageloader.addImage('playerboard3', 'img/playerboardA2.webp')
            imageloader.addImage('playerboard4', 'img/playerboardA2.webp')

            imageloader.addImage('diceboard', 'img/diceboard.webp');
            imageloader.addImage('gyrodyne', 'img/gyrodyneboard.webp');
            imageloader.addImage('modifierboard', 'img/modifierboard.webp');

            imageloader.addImage('tech3', 'img/A3.webp');
            imageloader.addImage('tech2', 'img/A2.webp');
            imageloader.addImage('tech1', 'img/A1.webp');
            imageloader.addImage('starcluster', 'img/starcluster.webp');
            imageloader.loadImages().then(function (imagelist) {
                board = gameboard('table');

                board.addTableElement('playerboard1', imagelist['playerboard1'], 72, 2070)
                board.addTableElement('playerboard2', imagelist['playerboard2'], 2690, 1710)
                board.addTableElement('playerboard3', imagelist['playerboard3'], 2010, 2070)
                board.addTableElement('playerboard4', imagelist['playerboard4'], 2690, 2070)
    
                board.addTableElement('diceboard', imagelist['diceboard'], 483, 0);
                board.addTableElement('gyrodyne', imagelist['gyrodyne'], 2, 1018);
                board.addTableElement('modifierboard', imagelist['modifierboard'], 238, 610);
    
                board.addTableElement('tech3', imagelist['tech3'], 2597, 954);
                board.addTableElement('tech2', imagelist['tech2'], 2228, 919);
                board.addTableElement('tech1', imagelist['tech1'], 1962, 849);                   

                board.addTableElement('starcluster', imagelist['starcluster'], 352, 408); 
                board.setScale(0.5);
                board.drawScene();
            });

            // this.diceStock = dicestock("dicearea");
            // connect.publish("server/dicerolled", { dice: gamedatas.diceboard });
            //connect.publish("server/markerset", { markerposition: gamedatas.markerposition });
            
            // this.playershipsdiceboard = shipsdiceboard();
            // connect.publish("server/playerordercalculated", gamedatas.players);

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
                    this.diceStock.addDice(args.dice[i].id, args.dice[i].value);
                }
            });

            connect.subscribe("server/markerset", this, function (args) {
                marker.setMarker(args.markerposition);
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
