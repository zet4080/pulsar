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
    define("STATE_NEXT_PLAYER_DICE_PHASE", 4);
    define("STATE_END_GAME", 99);
 }
 
$machinestates = array(

    // The initial state. Please do not modify.
    1 => array(
        "name" => "gameSetup",
        "description" => "",
        "type" => "manager",
        "action" => "stGameSetup",
        "transitions" => array( "test" => STATE_START_ROUND )
    ),

    STATE_START_ROUND => array(
        "name" => "startround",
        "description" => "",
        "type" => "game",
        "possibleactions" => array("rollDice"),
        "transitions" => array( "dicesRolled" => STATE_PLAYER_CHOOSE_DICE )
    ),    
    
    STATE_PLAYER_CHOOSE_DICE => array(
        "name" => "playerChooseDice",
        "description" => clienttranslate('${actplayer} must choose a dice'),
        "descriptionmyturn" => clienttranslate('${you} must choose a dice'),
        "type" => "activeplayer",
        "possibleactions" => array( "chooseDice" ),
        "transitions" => array( "diceChoosen" => STATE_NEXT_PLAYER_DICE_PHASE )
    ),
    
    STATE_NEXT_PLAYER_DICE_PHASE => array(
        "name" => "playerChooseDice",
        "description" => "",
        "type" => "game",
        "action" => "stNextPlayerDicePhase",
        "transitions" => array( "nextPlayerCalculated" => STATE_PLAYER_CHOOSE_DICE )
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



