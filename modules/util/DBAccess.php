<?php

/**
 * A generic DBAccess class for BGA Games.
 * Works only for tables with a primary key with one field.
 */

class DBAccess  extends APP_GameClass {

    function getColumns($table) {
        $sql = sprintf('SHOW COLUMNS FROM %s', $table);
        return self::DbQuery($sql);
    }

    function getPrimaryKey($table) {
        $resource = self::getColumns($table);
        $primary = NULL;
        if ($resource) {
            while ($row = self::row($resource)) {
                if ($row["Key"] == "PRI") {
                    $primary[] = $row["Field"];
                }
            }
        }
        
        if (count($primary) > 1) {
            return NULL;
        }
        
        return $primary[0];
    }   

    function query($filter) {
        $query = '';
        if (isset($filter) && $filter != '') {
            $query = " (";
            foreach ($filter as $key => $value) {
                $query .= sprintf('(%s = "%s") AND ', $key, $value);
            }    
            $query = substr($query, 0, -5);
            $query .= ")";
        }    
        return $query;
    }    

    /**
     * Get the rows in a table.
     * @param str fields The names of the columns to return
     * @param str table
     * @return resource A resultset resource
     */
    public function get($table, $filter, $sort = null, $limit = null) {
        
        // Check, if filter is a single value or an array.
        // If it is a single value, it is the uid of the row and we have to 
        // create an array.
        $pairs = NULL;
        
        if (isset($filter)) {
            if (is_array($filter) == false) {
                $pairs[self::getPrimaryKey($table)] = $filter;
            } else {
                $pairs = $filter;
            }
        }
        
        $query = sprintf('SELECT SQL_CALC_FOUND_ROWS * FROM %s', $table);
        
        if (isset($pairs)) {
            $query .= ' WHERE '.self::query($pairs);
        }
        
        if (isset($sort) && $sort != '') {
          $query .= sprintf(' ORDER BY %s', $sort);
        }
        
        if (isset($limit) && $limit != '') {
          $query .= sprintf(' LIMIT %s', $limit);
        }
        
        $result = self::DbQuery($query);
        $response = self::createArrayFromResult($result);
        
        return $response;
    }

    /**
     * Insert a new row.
     * @param str table
     * @param str names
     * @param str values
     * @return bool
     */
    public function insertRow($table, $pairs) {
        
        foreach ($pairs as $key => $value) {
            $pairs[$key] = $value;
        }
        
        $values = join('", "', $pairs);
        $names = join('`, `', array_keys($pairs));

        self::DbQuery(sprintf('INSERT INTO %s (`%s`) VALUES ("%s")', $table, $names, $values));
    }   

    /**
     * Update a row.
     * @param str table
     * @param str values
     * @param str where
     * @return bool
     */
    public function updateRow($table, $uid, $pairs) {
        
        $values = '';
        foreach ($pairs as $column => $data) {
            $values .= '`'.$column.'` = "'.self::escapeStringForDB($data).'", ';
        }
        $values = substr($values, 0, -2);    
        
        $key[self::getPrimaryKey($table)] = $uid;

        $query = sprintf('UPDATE %s SET %s WHERE %s', $table, $values, self::query($key));

        self::DbQuery($query);
    }    
    
    /**
     * Get the columns in a table.
     * @param str table
     * @return resource A resultset resource
     */
    public function deleteRow($table, $uid) {
        $pairs[self::getPrimaryKey($table)] = $uid;
        return self::DbQuery(sprintf('DELETE FROM %s WHERE %s', $table, self::query($pairs)));
    }    
    
    public function row($resource) {
        return self::mysql_fetch_assoc($resource);
    }

    function createArrayFromResult($result) {
        $row_result = array();        
        while ($row = self::row($result)) {
            $values = array();
            foreach ($row as $column => $data) {
                $values[$column] = $data;
            }
            $row_result[] = $values; 
        }    
       
        return $row_result;
    }    
}