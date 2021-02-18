<?php

if (!defined('STATE_END_GAME')) { // ensure this block is only invoked once, since it is included multiple times
    define("STATE_ROLL_DICES_AND_SET_MARKER", 2);
    define("STATE_PLAYER_CHOOSE_DICE", 3);
    define("STATE_END_GAME", 99);
 }
 
$machinestates = array(

    // The initial state. Please do not modify.
    1 => array(
        "name" => "gameSetup",
        "description" => "",
        "type" => "manager",
        "action" => "stGameSetup",
        "transitions" => array( "" => STATE_ROLL_DICES_AND_SET_MARKER )
    ),
    
    2 => array(
        "name" => "rollDicesAndSetMarker",
        "description" => clienttranslate('${actplayer} rolls the dices'),
        "descriptionmyturn" => clienttranslate('${you} roll the dices'),
        "type" => "game",
        "action" => "stRollDicesAndSetMarker",
        "transitions" => array( "markerSet" => STATE_PLAYER_CHOOSE_DICE )
    ),

    3 => array(
        "name" => "playerChooseDice",
        "description" => clienttranslate('${actplayer} must choose a dice'),
        "descriptionmyturn" => clienttranslate('${you} must choose a dice'),
        "type" => "activeplayer",
        "args" => "argMarkerSet",
        "possibleactions" => array( "playCard", "pass" ),
        "transitions" => array( "playCard" => 2, "pass" => 2 )
    ),
    
    // Final state.
    // Please do not modify (and do not overload action/args methods).
    99 => array(
        "name" => "gameEnd",
        "description" => clienttranslate("End of game"),
        "type" => "manager",
        "action" => "stGameEnd",
        "args" => "argGameEnd"
    )

);



