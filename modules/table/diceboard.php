<?php

require_once __DIR__.'/../util/DBAccess.php';

class Dice {
    public $id;
    public $value;

    function __construct($id, $value) {
        $this->id = $id;
        $this->value = $value;
    }
}

class DiceBoard extends DBAccess {

    private $dice;

	function __construct( )
	{

    }

    public function setup() {
		$dice = array ();
		for ($i = 0; $i < 7; $i++) {
			$dice [] = array (
                'diceId' => $i,
                'value' => 0,
                'location' => 'blackhole',
                'player' => 0
            );
        }
        self::insertRows('dice', $dice);
    }

    public function doRollDice () {
		for ($i = 0; $i < 7; $i++) {
			$dice = array (
                'diceId' => $i,
                'value' => bga_rand(1, 6),
                'location' => 'diceboard',
                'player' => 0
            );
            self::updateRow('dice', $i, $dice);
        }
    }

    public function getDiceboard () {
        $dice = self::get('dice', array('location' => 'diceboard'), 'value');
        $diceboard = array();
        foreach ($dice as $id => $die) {
            $diceboard[] = new Dice($die["diceId"], $die["value"]);
        }
        return $diceboard;
    }

    public function getPlayerDice(int $playerId) {
        $dice = self::get('dice', array('player' => $playerId), 'value');
        $diceboard = array();
        foreach ($dice as $id => $die) {
            $diceboard[] = new Dice($die["diceId"], $die["value"]);
        }
        return $diceboard;
    }

    public function playerChooseDice(int $playerId, int $diceId) {
        self::updateRow('dice', $diceId, array('location' => 'hand', 'player' => $playerId));
    }

    public function getDice(int $id) {
        $dice = self::get('dice', $id);
        return new Dice($dice[0]["diceId"], $dice[0]["value"]);
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

        $this->setMarker($marker);
    }

    public function getMarker() {
    }

    private function setMarker($pos) {
    }
}

/*
        echo "<pre>";
        var_dump( $middleDie );
        echo "</pre>";
        die('ok');          
*/

?> 