<?php

class Dice {
    public $id;
    public $value;

    function __construct($id, $value) {
        $this->id = $id;
        $this->value = $value;
    }
}

class DiceBoard {

    private $dice;

    function __construct($deck) {
        $this->dice = $deck;
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
        $dice = $this->dice->getCardsInLocation("diceboard");
        
        $diceboard = array();
        foreach ($dice as $id => $die) {
            $diceboard[] = new Dice($id, $die["type_arg"]);
        }
        return $diceboard;
    }

    public function getPlayerDice(int $playerId) {
        $dice = $this->dice->getCardsInLocation('hand', $playerId);
        $playerdice = array();
        foreach ($dice as $id => $die) {
            $playerdice[] = new Dice($id, $die["type_arg"]);
        }        
        return $playerdice;
    }

    public function playerChooseDice(int $playerId, int $diceId) {
        $this->dice->moveCard($diceId, 'hand', $playerId);
    }

    public function getDice(int $id) {
        $die = $this->dice->getCard($id);
        return new Dice($id, $die["type_arg"]);
    }
}
/*
        echo "<pre>";
        var_dump( $diceboard );
        echo "</pre>";
        die('ok');          
*/

?> 