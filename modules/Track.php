<?php

require_once 'JSON.php';

class Track {
    
    function __construct($jsonid)
	{
        $this->jsonid = $jsonid;
        $this->track = JSON::read($jsonid);
        if ($this->track == null) {
            JSON::create($jsonid);
        } 
    }

    function addPlayer ($player, $pos) {
        $this->track[$pos][] = $player;
    }

    function calculateNewSlot($oldSlot, $distance) {
        $distance = $distance / 2;
        if ($distance < 0) {
            $distance = (int)floor($distance);
        } else {
            $distance = (int)ceil($distance);
        }
        return $oldSlot + $distance;
    }

    function movePlayer ($player, $distance) {
        foreach( $this->track as $slotNumber => $slot ) {
            $slotPos = array_search($player, $slot);
            if ($slotPos !== false) {
                unset($this->track[$slotNumber][$slotPos]);
                $newSlot = self::calculateNewSlot($slotNumber, $distance);
                $this->track[$newSlot][] = (int)$player;
            }
        }
    }

    function save() {
        JSON::write($this->jsonid, $this->track);
    }

    function getPlayerOrder ($jsonid = null) {
        if (isset($jsonid)) {
            $track = JSON::read($jsonid);
        } else {
            $track = $this->track;
        }
        ksort($track);
        $return = array();
        foreach($track as $slot => $players ) {
            $reverse = array_reverse($players);
            foreach($reverse as $player) {
                $return [] = $player;
            }
        }        
        return $return;
    }

    function getTrackForClient($jsonid = null) {
        if (isset($jsonid)) {
            $track = JSON::read($jsonid);
        } else {
            $track = $this->track;
        }
        $return = array();
        foreach($track as $slot => $players ) {
            if (count($players) > 0) {
                $return[$slot] = array_values($players);
            }
        }
        return $return;
    }

    function error($text) {
        echo "<pre>";
        var_dump( $text );
        echo "</pre>";
        die('ok');
    }    
}