<?php

class GoalTiles {
    
    function __construct()
	{
        $this->tiles = array(
            1 => array (0, 1),
            2 => array (2, 3),
            3 => array (4, 5),
            4 => array (6, 7),
            5 => array (8, 9),
            6 => array (10, 11)
        );
    }

    function calculate () {
        $length = count($this->tiles);
        $pos = bga_rand(0, $length - 1);
        $tile = $this->tiles[$pos];

        $tileNr = $tile[bga_rand(0, 1)];

        unset($this->tiles[$pos]);
        $this->tiles = array_values($this->tiles);
        
        return $tileNr;
    }
}