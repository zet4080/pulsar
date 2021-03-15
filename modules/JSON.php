<?php

require_once 'DBUtil.php';

class JSON {

    function create($id) {
        DBUtil::insertRow('json', array('id' => $id));
    }

    function write($id, $array) {
        DBUtil::updateRow('json', $id, array('value' => json_encode($array)));
    }

    function read($id) {
        $json = DBUtil::get('json', $id)[0];
        return json_decode(stripslashes($json['value']), true);
    }
    
}