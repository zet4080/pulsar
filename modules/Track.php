<?php

require_once 'DBUtil.php';

class Track {
    
    function __construct($jsonid)
	{
        $this->track = DBUtil::get('json', $jsonid);
        $this->jsonid = $jsonid;
        if ($this->track == null) {
            $this->track = array ();
            DBUtil::insertRow('json', array('id' => $this->jsonid, 'value' => DBUtil::escapeStringForDB(json_encode($this->track))));
        } else {
            $this->track = json_decode(stripslashes(DBUtil::get('json', $jsonid)[0]['value']), true);
        }
    }

    function addPlayer ($player, $pos) {
        $this->track[$pos][] = $player;
    }

    function movePlayer ($player, $distance) {
        foreach( $this->track as $slotNumber => $slot ) {
            $slotPos = array_search($player, $slot);
            if ($slotPos !== false) {
                unset($this->track[$slotNumber][$slotPos]);
                $newSlot = $slotNumber + $distance;
                $this->track[$newSlot][] = (int)$player;
            }
        }
    }

    function save() {
        $save =  DBUtil::escapeStringForDB(json_encode($this->track));
        DBUtil::updateRow('json', $this->jsonid, array('value' => $save));
    }

    function getTrackForClient($jsonid = null) {
        if (isset($jsonid)) {
            $json = DBUtil::get('json', $jsonid)[0];
            $track = json_decode(stripslashes($json['value']), true);
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