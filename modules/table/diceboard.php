<?php

class Dice {
    public $id;
    public $value;

    function __construct($id, $value) {
        $this->id = $id;
        $this->value = $value;
    }
}

class DiceBoard extends APP_GameClass {

    private $dice;

    function __construct() {
        $this->dice = self::getNew( "module.common.deck" );
        $this->dice->init( "dice" );
    }

    public function setup() {
		$dice = array ();
		for ($value = 1; $value <= 6; $value++) {
			$dice [] = array ('type' => 'dice', 'type_arg' => $value, 'nbr' => 7 );
        }
        $this->dice->createCards($dice, 'deck'); 
    }

    public function doRollDice () {
        $this->dice->moveAllCardsInLocation("diceboard", "deck");
        $this->dice->moveAllCardsInLocation("hand", "deck");
        $this->dice->shuffle("deck");
        $this->dice->pickCardsForLocation(7, "deck", "diceboard");
    }

    public function getDiceboard () {
        $dice = $this->dice->getCardsInLocation("diceboard", null, "type_arg");

        $diceboard = array();
        foreach ($dice as $id => $die) {
            $diceboard[] = new Dice($die["id"], $die["type_arg"]);
        }
        return $diceboard;
    }

    public function getPlayerDice(int $playerId) {
        $dice = $this->dice->getCardsInLocation('hand', $playerId);
        $playerdice = array();
        foreach ($dice as $id => $die) {
            $playerdice[] = new Dice($die["id"], $die["type_arg"]);
        }        
        return $playerdice;
    }

    public function playerChooseDice(int $playerId, int $diceId) {
        $this->dice->moveCard($diceId, 'hand', $playerId);
    }

    public function getDice(int $id) {
        $die = $this->dice->getCard($id);
        return new Dice($die["id"], $die["type_arg"]);
    }

    public function doCalculateMarker() {
        $dice = $this->getDiceboard();
        $middleDie = $dice[3]->value;
        $lower = 0;
        $higher = 0;
        foreach ($dice as $id => $die) {
            if ($die->value < $middleDie) {
                $lower = $lower + 1;
            }
            if ($die->value > $middleDie) {
                $higher = $higher + 1;
            }
        }   
        if ($lower == $higher) {
            $marker = ($middleDie * 2) - 1;
        }
        if ($lower > $higher) {
            $marker = ($middleDie * 2) - 2;
        }
        if ($lower < $higher) {
            $marker = ($middleDie * 2);
        }
    }

    public function getMarker() {
        return 0;
    }
}

/*
        echo "<pre>";
        var_dump( $middleDie );
        echo "</pre>";
        die('ok');          
*/

?> 