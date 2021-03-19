<?php

require_once 'DBUtil.php';

class JSON {

    function create($id) {
        DBUtil::insertRow('json', array('id' => $id));
    }

    function write($id, $array) {
        DBUtil::updateRow('json', $id, array('value' => DBUtil::escapeStringForDB(json_encode($array))));
    }

    function read($id) {
        $json = DBUtil::get('json', $id);
        if (count($json) == 0) {
            return null;
        }
        return json_decode(stripslashes($json[0]['value']), true);
    }
    
    function error($text) {
        echo "<pre>";
        var_dump( $text );
        echo "</pre>";
        die('ok');
    } 
}