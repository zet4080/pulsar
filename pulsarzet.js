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
    // "bgagame/modules/tests/boardtests",
    "ebg/core/gamegui",
    "ebg/counter"
],
function (declare, connect, lang, pulsarboard, canvas, calculatedicepositions, backend, tests) {
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
            pulsarboard.createPulsarBoard(gamedatas.players).then(lang.hitch(this, function (board) {
                this.board = board;
                connect.publish("setup/tracks", { etrack: gamedatas.engineeringTrack, itrack: gamedatas.initiativeTrack, players: gamedatas.players });
                connect.publish("setup/marker", gamedatas.markerposition);
                connect.publish("setup/diceboard", { dice: gamedatas.diceboard });
                connect.publish("setup/playerdice", { players: gamedatas.players, dice: gamedatas.playerdice });
                connect.publish("setup/playerorder", { playerorder: gamedatas.shiporder, players: gamedatas.players } );
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

        setColorstonesOnDiceboardTracks: function (tokenType, tracks, players) {
            var diceboard = this.board.getGameTile('diceboard');
            diceboard.removeAllTokens(tokenType);
            for (let pos in tracks) {
                let track = tracks[pos];
                for (let i = 0; i < track.length; i++) {
                    let token = pos + '-' + (4 - i);
                    diceboard.placeTokenAtPosition(tokenType, token, players[track[i]].color);
                }
            }
        },

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

            connect.subscribe("setup/diceboard", this, function (args) {
                let dice = args.dice || args.args.dice;
                var diceboard = this.board.getGameTile('diceboard');
                diceboard.removeAllTokens('dice');
                for (var i = 0; i < dice.length; i++) {
                    diceboard.placeTokenAtPosition('dice', dice[i].position, dice[i].value);
                }
                canvas.drawBoard(this.board);
            });

            connect.subscribe("setup/playerdice", this, function (args) {
                var dice = args.dice;
                for (var i = 0; i < dice.length; i++) {
                    let playerboard = this.board.getGameTile(dice[i].player);
                    let pos = playerboard.isPositionOccupied('dice', 0) ? 1 : 0;
                    playerboard.placeTokenAtPosition('dice', pos, dice[i]['value']);
                }
                canvas.drawBoard(this.board);
            });

            connect.subscribe("setup/marker", this, function (args) {
                let markerposition = (args.args && args.args.markerposition) || args;
                var diceboard = this.board.getGameTile('diceboard');
                diceboard.removeAllTokens('marker');
                diceboard.placeTokenAtPosition('marker', markerposition - 1);
                canvas.drawBoard(this.board);
            });            
            
            connect.subscribe("setup/playerorder", this, function (args) {
                let players = args.players || args.args.players;
                let order = args.playerorder || args.args.playerorder;
                let diceboard = this.board.getGameTile('diceboard');
                diceboard.removeAllTokens('ship');
                for (let i = 0; i < order.length; i++) {
                    diceboard.placeTokenAtPosition('ship', i + 1, players[order[i]].color);
                }
                canvas.drawBoard(this.board);
            });            

            connect.subscribe("setup/tracks", this, function (args) {
                let initiativeTrack  = args.itrack; 
                let engineerTrack = args.etrack;
                this.setColorstonesOnDiceboardTracks('initiativeToken', initiativeTrack, args.players);
                this.setColorstonesOnDiceboardTracks('engineerToken', engineerTrack, args.players);
                canvas.drawBoard(this.board);
            });

            connect.subscribe("server/engineeringtrack/player_choose_track", this, function (args) {
                this.setColorstonesOnDiceboardTracks('engineerToken', args.track, args.players);
                canvas.drawBoard(this.board);
            });

            connect.subscribe("server/initiativetrack/player_choose_track", this, function (args) {
                this.setColorstonesOnDiceboardTracks('initiativeToken', args.track, args.players);
                canvas.drawBoard(this.board);
            });            

            connect.subscribe("server/dice/player_choose_dice", this, function (args) {
                let diceboard = this.board.getGameTile('diceboard');
                let playerboard = this.board.getGameTile(args.player_id);
                diceboard.removeTokenFromPosition('dice', args.posId);
                
                let pos = playerboard.isPositionOccupied('dice', 0) ? 1 : 0;
                playerboard.placeTokenAtPosition('dice', pos, args.variantId);
                canvas.drawBoard(this.board);
            });
        },  
   });             
});
