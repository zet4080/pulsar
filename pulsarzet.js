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
    "bgagame/modules/board/tray",
    "ebg/core/gamegui",
    "ebg/counter"
],
function (declare, connect, lang, pulsarboard, canvas, tray) {
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
        players: {},
        setup: function( gamedatas )
        {
            console.log( "Starting game setup" );

            this.setupNotifications();
            canvas.createTable('table');
            canvas.setScale(0.35);
            
            this.players = gamedatas.players;
            pulsarboard(gamedatas.players).then(lang.hitch(this, function (board) {
                this.board = board;
                /*
                connect.publish("setup/playerpoints", { playerpoints: gamedatas.playerpoints });
                connect.publish("setup/playerorder", { playerorder: gamedatas.shiporder, players: gamedatas.players } );
                connect.publish("setup/marker", gamedatas.markerposition);
                connect.publish("setup/tracks", { etrack: gamedatas.engineeringTrack, itrack: gamedatas.initiativeTrack, players: gamedatas.players });                
                connect.publish("setup/diceboard", { dice: gamedatas.diceboard });
                connect.publish("setup/shippositions", { shippositions: gamedatas.shippositions });                         
                connect.publish("setup/pulsars", { pulsars: gamedatas.pulsars });
                connect.publish("setup/playerboards", { playerboards: gamedatas.playerboards});                      
                connect.publish("setup/playeraction", { currentDie: gamedatas.blackhole.currentDie, modifiertoken: gamedatas.blackhole.modifiertoken, modifiervalue: gamedatas.blackhole.modifiervalue });                
                connect.publish("setup/playerdice", { players: gamedatas.players, dice: gamedatas.playerdice });
                connect.publish("setup/blackholedice", { dice: gamedatas.blackhole.dice });
                connect.publish("setup/systems", { systems: gamedatas.systems });
                connect.publish("setup/tokens", { tokens: gamedatas.tokens });   
                */
                canvas.drawBoard(this.board);
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
            var overlay = this.board.getGameTile('diceboard').getOverlay(tokenType);
            overlay.removeAllTokens();
            for (let pos in tracks) {
                let track = tracks[pos];
                for (let i = 0; i < track.length; i++) {
                    let token = pos + '-' + (4 - i);
                    overlay.slotTokenInPosition(token, tray('token', players[track[i]].color));
                }
            }
        },

        setTokenOnTechBoard: function (player, patent) {
            let techboard = this.board.getGameTile('tech1');
            let pos1 = patent + '-1';
            let pos2 = patent + '-2';
            let pos = techboard.isPositionOccupied('token', pos1) ? pos2 : pos1;
            techboard.placeTokenAtPosition('token', pos, this.players[player].color);
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

            connect.subscribe('setup/playeraction', this, function (args) {
                let die = args.args == undefined ? args.currentDie : args.args.currentDie;
                let modifiertoken = args.args == undefined ? args.modifiertoken : args.args.modifiertoken;
                let modifiervalue = args.args == undefined ? args.modifiervalue : args.args.modifiervalue;

                let overlay = this.board.getGameTile('starcluster').getOverlay('blackhole');
                (die == 0) ? overlay.removeTokenFromPosition('die') : overlay.slotTokenInPosition('die', tray('dice', die));

                // can't use switch, because of type comparison (switch is strict!)
                
                if (modifiertoken == 0) {
                    overlay.removeTokenFromPosition('modifier');
                    overlay.removeTokenFromPosition("minus");
                    overlay.removeTokenFromPosition("plus");
                } else if (modifiertoken == 1) {
                    overlay.slotTokenInPosition('modifier', tray('modifier', 1));
                } else if (modifiertoken == 2) {
                    overlay.slotTokenInPosition('modifier', tray('modifier', 2));
                }

                if (modifiervalue == 0 && modifiertoken == 1) {
                    overlay.slotTokenInPosition("plus", tray('plusone'));
                    if (die != 1) {
                        overlay.slotTokenInPosition("minus", tray('minusone'));
                    }
                }

                if (modifiervalue == 1) {
                    overlay.slotTokenInPosition("plus", tray('plusone'));
                    overlay.removeTokenFromPosition("minus");
                }

                if (modifiervalue == -1) {
                    overlay.slotTokenInPosition("minus", tray('minusone'));
                    overlay.removeTokenFromPosition("plus");
                }
                canvas.drawBoard(this.board);
            });

            connect.subscribe("setup/tokens", this, function (args) {
                let tokens = args.tokens || args.args.tokens;
                for (let i = 0; i < tokens.length; i++) {
                    let overlay = tray(tokens[i].tileId).getOverlay(tokens[i].overlay);
                    if (!overlay.isPositionOccupied(tokens[i].position)) {
                        overlay.slotTokenInPosition(tokens[i].position, tray('token', this.players[tokens[i].player].color));
                    }
                }
                canvas.drawBoard(this.board);
            });
            
            connect.subscribe("setup/systems", this, function (args) {
                let systems = args.systems || args.args.systems;
                let overlay = this.board.getGameTile('starcluster').getOverlay('planetarysystems');
                overlay.removeAllTokens();
                for (let system in systems) {
                    overlay.slotTokenInPosition(systems[system].node, tray(systems[system].system));
                }
                canvas.drawBoard(this.board);
            });
            
            connect.subscribe("setup/shippositions", this, function (args) {
                let shippositions = args.shippositions || args.args.shippositions;
                let overlay = this.board.getGameTile('starcluster').getOverlay('ships');
                overlay.removeAllTokens();
                for (let i = 0; i < shippositions.length; i++) {
                    overlay.slotTokenInPosition( shippositions[i].position, tray('ship', this.players[shippositions[i].playerid].color));
                }
                canvas.drawBoard(this.board);
            });

            connect.subscribe("setup/diceboard", this, function (args) {
                let dice = args.dice || args.args.dice;
                this.board.getGameTile('starcluster').getOverlay('dice').removeAllTokens();
                let overlay = this.board.getGameTile('diceboard').getOverlay('dice');
                overlay.removeAllTokens('dice');
                for (var i = 0; i < dice.length; i++) {
                    overlay.slotTokenInPosition(dice[i].position, tray('smalldice', dice[i].value));
                }
                canvas.drawBoard(this.board);
            });

            connect.subscribe("setup/playerdice", this, function (args) {
                var dice = args.dice;
                for (let player in this.players) {
                    this.board.getGameTile(player).getOverlay('dice').removeAllTokens();
                }
                for (var i = 0; i < dice.length; i++) {
                    let overlay = this.board.getGameTile(dice[i].player).getOverlay('dice');
                    let pos = overlay.isPositionOccupied("0") ? "1" : "0";
                    overlay.slotTokenInPosition(pos, tray('dice', dice[i]['value']));
                }
                canvas.drawBoard(this.board);
            });

            connect.subscribe("setup/blackholedice", this, function (args) {
                let dice = args.dice;
                let overlay = this.board.getGameTile('starcluster').getOverlay('dice');
                for (var i = 0; i < dice.length; i++) {
                    overlay.slotTokenInPosition(i, tray('dice', dice[i].value));
                }
                canvas.drawBoard(this.board);
                canvas.drawBoard(this.board);
            });

            connect.subscribe("setup/marker", this, function (args) {
                let markerposition = (args.args && args.args.markerposition) || args;
                let overlay = this.board.getGameTile('diceboard').getOverlay('marker');
                overlay.removeAllTokens();
                overlay.slotTokenInPosition(markerposition, tray("marker"));
                canvas.drawBoard(this.board);
            });            
            
            connect.subscribe("setup/playerorder", this, function (args) {
                let players = args.players || args.args.players;
                let order = args.playerorder || args.args.playerorder;
                let overlay = this.board.getGameTile('diceboard').getOverlay('ships');
                overlay.removeAllTokens();
                for (let i = 0; i < order.length; i++) {
                    overlay.slotTokenInPosition(i + 1, tray('ship', players[order[i]].color));
                }
                canvas.drawBoard(this.board);
            });            

            connect.subscribe("setup/tracks", this, function (args) {
                let initiativeTrack  = args.itrack; 
                let engineerTrack = args.etrack;
                this.setColorstonesOnDiceboardTracks('initiativeTokens', initiativeTrack, args.players);
                this.setColorstonesOnDiceboardTracks('engineerTokens', engineerTrack, args.players);
                canvas.drawBoard(this.board);
            });

            connect.subscribe("setup/pulsars", this, function (args) {
                let pulsars = args.pulsars || args.args.pulsars;
                let starcluster = this.board.getGameTile('starcluster').getOverlay('rings');
                starcluster.removeAllTokens();
                for (let i = 0; i < pulsars.length; i++) {
                    starcluster.slotTokenInPosition(pulsars[i].node, tray('ring', this.players[pulsars[i].playerid].color));
                }
                canvas.drawBoard(this.board);
            });

            connect.subscribe("server/engineeringtrack/player_choose_track", this, function (args) {
                this.setColorstonesOnDiceboardTracks('engineerTokens', args.track, args.players);
                canvas.drawBoard(this.board);
            });

            connect.subscribe("server/initiativetrack/player_choose_track", this, function (args) {
                this.setColorstonesOnDiceboardTracks('initiativeTokens', args.track, args.players);
                canvas.drawBoard(this.board);
            });       
            
            connect.subscribe("server/settechboardtoken", this, function(args) {
                this.setTokenOnTechBoard(args.args.player_id, args.args.patent);
                canvas.drawBoard(this.board);
            });

            connect.subscribe("server/updatedie", this, function(args) {
                connect.publish("setup/blackholedice", { dice: args.args.blackholedice });
                connect.publish("setup/playerdice", { dice: args.args.playerdice });
            });

            connect.subscribe("server/smalldice/player_choose_dice", this, function (args) {
                let diceboard = this.board.getGameTile('diceboard').getOverlay('dice');
                let playerboard = this.board.getGameTile(args.player_id).getOverlay('dice');
                diceboard.removeTokenFromPosition(args.posId);
                
                let pos = playerboard.isPositionOccupied(0) ? 1 : 0;
                playerboard.slotTokenInPosition(pos, tray('dice', args.variantId));
                canvas.drawBoard(this.board);
            });

            connect.subscribe("setup/playerpoints", this, function (args) {
                let playerpoints = args.playerpoints;
                let starcluster = this.board.getGameTile('starcluster').getOverlay('tokens');
                starcluster.removeAllTokens();
                for (let id in playerpoints) {
                    starcluster.slotTokenInPosition(playerpoints[id], tray('token', this.players[id].color));
                };
                canvas.drawBoard(this.board);
            });

            connect.subscribe("setup/playerboards", this, function (args) {
                let playerboards = args.playerboards || args.args.playerboards;
                for (let i = 0; i < playerboards.length; i++) {
                    let player = playerboards[i]["playerid"];
                    let playerboard = this.board.getGameTile(player);
                    playerboards[i].modifierone !== "0"
                        ? playerboard.getOverlay("modifierone").slotTokenInPosition("0", tray("modifier", 1)) 
                        : playerboard.getOverlay("modifierone").removeTokenFromPosition("0"); 
                    playerboards[i].modifiertwo !== "0"
                        ? playerboard.getOverlay("modifiertwo").slotTokenInPosition("0", tray("modifier", 2)) 
                        : playerboard.getOverlay("modifiertwo").removeTokenFromPosition("0"); 
                    playerboards[i].pulsarrings !== "0"
                        ? playerboard.getOverlay("pulsarrings").slotTokenInPosition("0", tray("ring", this.players[player].color)) 
                        : playerboard.getOverlay("pulsarrings").removeTokenFromPosition("0"); 
                    playerboards[i].gyrodyneone !== "0"
                        ? playerboard.getOverlay("gyrodyne").slotTokenInPosition("1", tray("gyrodyne-inactive", "1")) 
                        : playerboard.getOverlay("gyrodyne").removeTokenFromPosition("1"); 
                    playerboards[i].gyrodynetwo !== "0"
                        ? playerboard.getOverlay("gyrodyne").slotTokenInPosition("2", tray("gyrodyne-inactive", "2")) 
                        : playerboard.getOverlay("gyrodyne").removeTokenFromPosition("2"); 
                    playerboards[i].gyrodynethree !== "0"
                        ? playerboard.getOverlay("gyrodyne").slotTokenInPosition("3", tray("gyrodyne-inactive", "3")) 
                        : playerboard.getOverlay("gyrodyne").removeTokenFromPosition("3"); 
                    canvas.drawBoard(this.board);
                }
            });
        },  
   });             
});
