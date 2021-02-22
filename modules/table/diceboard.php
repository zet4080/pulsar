<?php

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

    public function rollDice () {
        $this->dice->moveAllCardsInLocation("diceboard", "deck");
        $this->dice->moveAllCardsInLocation("hand", "deck");
        $this->dice->shuffle("deck");
        $this->dice->pickCardsForLocation(7, "deck", "diceboard");
    }

    public function getDiceboard () {
        return $this->dice->getCardsInLocation("diceboard");
    }

    public function getPlayerDice(int $playerId) {
        return $this->dice->getCardsInLocation('hand', $playerId);
    }

    public function playerChooseDice(int $playerId, int $diceId) {
        $this->dice->moveCard($diceId, 'hand', $playerId);
    }

    public function getDice(int $id) {
        return $this->dice->getCard($id);
    }
}

?> 