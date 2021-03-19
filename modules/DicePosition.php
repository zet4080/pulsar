<?php

class DicePosition {
    
    function __construct()
	{
        $this->dicepositions = array(
            1 => array (0, 1, 2, 3, 4, 5, 6, 7, 8),
            2 => array (9, 10, 11, 12, 13, 14, 15, 16, 17),
            3 => array (18, 19, 20, 21, 22, 23, 24, 25, 26),
            4 => array (27, 28, 29, 30, 31, 32, 33, 34, 35),
            5 => array (36, 37, 38, 39, 40, 41, 42, 43, 44),
            6 => array (45, 46, 47, 48, 49, 50, 51, 52, 53)
        );
    }

    function calculate ($value) {
        $length = count($this->dicepositions[$value]);
        $pos = bga_rand(0, $length - 1);
        $posid = $this->dicepositions[$value][$pos];
        unset($this->dicepositions[$value][$pos]);
        $this->dicepositions[$value] = array_values($this->dicepositions[$value]);
        return $posid;
    }

    function error($text) {
        echo "<pre>";
        var_dump( $text );
        echo "</pre>";
        die('ok');
    }    

}