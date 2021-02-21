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
    "bgagame/modules/util/gamegui",
    "bgagame/modules/util/backend",
    "bgagame/modules/table/gametable",
    "ebg/core/gamegui",
    "ebg/counter"
],
function (declare, connect, gui, backend, gametable) {
    
    return declare("bgagame.pulsarzet", ebg.core.gamegui, {
        
        constructor: function(){
            console.log('pulsarzet constructor');
            gui.register(this);
        },
        
        setup: function( gamedata )
        {
            console.log( "Starting game setup" );
            gametable.create(gamedata);
            console.log( "Ending game setup" );
        },
       
        onEnteringState: function (stateName, args)
        {
            console.log('Publish enter state: '+ stateName);
            console.log(args);
            connect.publish('enterstate/' + stateName, args);
        },

        onLeavingState: function( stateName )
        {
            console.log( 'Publish leave state: ' + stateName );
            connect.publish('leavestate/' + stateName);
        }, 

        onUpdateActionButtons: function( stateName, args )
        {
            console.log( 'onUpdateActionButtons: '+stateName );
            if( this.isCurrentPlayerActive() )
            {            
                connect.publish('updateactionbutton/' + stateName, args);
            }
        },        

        ///////////////////////////////////////////////////
        //// Player's action
        
        /*
        
            Here, you are defining methods to handle player's action (ex: results of mouse click on 
            game objects).
            
            Most of the time, these methods:
            _ check the action is possible at this game state.
            _ make a call to the game server
        
        */
        
        /* Example:
        
        onMyMethodToCall1: function( evt )
        {
            console.log( 'onMyMethodToCall1' );
            
            // Preventing default browser reaction
            dojo.stopEvent( evt );

            // Check that this action is possible (see "possibleactions" in states.inc.php)
            if( ! this.checkAction( 'myAction' ) )
            {   return; }

            this.ajaxcall( "/pulsarzet/pulsarzet/myAction.html", { 
                                                                    lock: true, 
                                                                    myArgument1: arg1, 
                                                                    myArgument2: arg2,
                                                                    ...
                                                                 }, 
                         this, function( result ) {
                            
                            // What to do after the server call if it succeeded
                            // (most of the time: nothing)
                            
                         }, function( is_error) {

                            // What to do after the server call in anyway (success or failure)
                            // (most of the time: nothing)

                         } );        
        },        
        
        */
   });             
});
