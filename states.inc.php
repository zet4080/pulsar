<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * PulsarZet implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 * 
 * states.inc.php
 *
 * PulsarZet game states description
 *
 */

if (!defined('STATE_END_GAME')) { // ensure this block is only invoked once, since it is included multiple times
    define("STATE_START_ROUND", 2);
    define("STATE_PLAYER_CHOOSE_DICE", 3);
    define("STATE_NEXT_PLAYER_DURING_DICE_PHASE", 4);
    define("STATE_NEXT_PLAYER_DURING_ACTION_PHASE", 5);
    define("STATE_PLAYER_CHOOSE_TRACK", 6);
    define("STATE_START_ACTION_PHASE", 7);
    define("STATE_PLAYER_CHOOSE_ACTION", 8);
    define("STATE_START_PRODUCTION_PHASE", 9);
    define("STATE_START_DICE_PHASE", 10);
    define("STATE_START_FIRST_ROUND", 11);
    define("STATE_END_GAME", 99);
 }
 
$machinestates = array(

    // The initial state. Please do not modify.
    1 => array(
        "name" => "gameSetup",
        "description" => "",
        "type" => "manager",
        "action" => "stGameSetup",
        "transitions" => array( "test" => STATE_START_FIRST_ROUND )
    ),

    STATE_START_FIRST_ROUND => array(
        "name" => "start_first_round",
        "description" => "",
        "type" => "game",
        "action" => "stStartFirstRound",
        "transitions" => array( "roundStarted" => STATE_START_DICE_PHASE )
    ),      

    STATE_START_ROUND => array(
        "name" => "startround",
        "description" => "",
        "type" => "game",
        "action" => "stStartRound",
        "transitions" => array( "roundStarted" => STATE_START_DICE_PHASE )
    ),    

    STATE_START_DICE_PHASE => array(
        "name" => "start_dice_phase",
        "description" => "",
        "type" => "game",
        "action" => "stStartDicePhase",
        "transitions" => array( "dicePhaseStarted" => STATE_NEXT_PLAYER_DURING_DICE_PHASE )
    ),       
    
    STATE_PLAYER_CHOOSE_DICE => array(
        "name" => "player_choose_dice",
        "description" => clienttranslate('${actplayer} must choose a dice'),
        "descriptionmyturn" => clienttranslate('${you} must choose a dice'),
        "type" => "activeplayer",
        "possibleactions" => array( "click", "chooseDie" ),
        "transitions" => array( "dieChoosen" => STATE_PLAYER_CHOOSE_TRACK )
    ),

    STATE_PLAYER_CHOOSE_TRACK => array(
        "name" => "player_choose_track",
        "description" => clienttranslate('${actplayer} must choose a track'),
        "descriptionmyturn" => clienttranslate('${you} must choose a track'),
        "type" => "activeplayer",
        "possibleactions" => array( "click", "chooseEngineeringTrack", "chooseInitiativeTrack" ),
        "transitions" => array( "trackChoosen" => STATE_NEXT_PLAYER_DURING_DICE_PHASE )
    ),    
    
    STATE_NEXT_PLAYER_DURING_DICE_PHASE => array(
        "name" => "next_player_during_dice_phase",
        "description" => "",
        "type" => "game",
        "action" => "stCalculateNextPlayerDuringDicePhase",
        "transitions" => array( "nextPlayerCalculated" => STATE_PLAYER_CHOOSE_DICE, "startActionPhase" => STATE_START_ACTION_PHASE )
    ),    

    STATE_START_ACTION_PHASE => array(
        "name" => "start_action_phase",
        "description" => "",
        "type" => "game",
        "action" => "stStartActionPhase",
        "transitions" => array( "actionPhaseStarted" => STATE_NEXT_PLAYER_DURING_ACTION_PHASE )
    ),    

    STATE_NEXT_PLAYER_DURING_ACTION_PHASE => array(
        "name" => "next_player_during_dice_phase",
        "description" => "",
        "type" => "game",
        "action" => "stCalculateNextPlayerDuringActionPhase",
        "transitions" => array( "nextPlayerCalculated" => STATE_PLAYER_CHOOSE_ACTION, "roundEnded" => STATE_START_PRODUCTION_PHASE ) 
    ),

    STATE_PLAYER_CHOOSE_ACTION => array(
        "name" => "player_choose_action",
        "description" => clienttranslate('${actplayer} must choose an action'),
        "descriptionmyturn" => clienttranslate('${you} must choose an action'),
        "type" => "activeplayer",
        "possibleactions" => array( "click", "flyShip", "developPulsar", "buildArray", "patentTechnology", "workOnHQProject" ),
        "transitions" => array( "actionChoosen" => STATE_NEXT_PLAYER_DURING_ACTION_PHASE )
    ),   
    
    STATE_START_PRODUCTION_PHASE => array(
        "name" => "start_production_phase",
        "description" => "",
        "type" => "game",
        "action" => "stStartProductionPhase",
        "transitions" => array( "productionPhaseCompleted" => STATE_START_ROUND )
    ),        
    
    // Final state.
    // Please do not modify (and do not overload action/args methods).
    STATE_END_GAME => array(
        "name" => "gameEnd",
        "description" => clienttranslate("End of game"),
        "type" => "manager",
        "action" => "stGameEnd",
        "args" => "argGameEnd"
    )

);



