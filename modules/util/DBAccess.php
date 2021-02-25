<?php

/**
 * A generic DBAccess class for BGA Games.
 * Works only for tables with a primary key with one field.
 */

class DBAccess extends APP_GameClass {

	function __construct( )
	{
      parent::__construct();
    }

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

    public function queryFilter($table, $filter = null, $sort = null, $fieldmapping = null) {
        
        // Check, if filter is a single value or an array.
        // If it is a single value, it is the uid of the row and we have to 
        // create an array.
        $pairs = NULL;
        $unique = false;

        if (isset($filter)) {
            if (is_array($filter) == false) {
                $pairs[self::getPrimaryKey($table)] = $filter;
                $unique = true;
            } else {
                $pairs = $filter;
            }
        }

        if (!isset($fieldmapping)) {
            $fieldmapping = '*';
        }
        
        $query = sprintf('SELECT %s FROM %s', $fieldmapping, $table);
        
        if (isset($pairs)) {
            $query .= ' WHERE '.self::query($pairs);
        }
        
        if (isset($sort) && $sort != '') {
          $query .= sprintf(' ORDER BY %s', $sort);
        }

        return $query;
    }    

    /**
     * Get the rows in a table.
     * @param str fields The names of the columns to return
     * @param str table
     * @return resource A resultset resource
     */
    public function get($table, $filter = null, $sort = null, $fieldmapping = null) {
        $query = self::queryFilter($table, $filter, $sort, $fieldmapping);
        $result = self::getObjectListFromDB($query);
        return $result;
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

    public function insertRows($table, $rows) {
        if (!is_array(reset($rows))) {
            self::error("DBAccess (insertRows): Parameter $rows is not an array of arrays");
        }

        $columns = self::getColumns($table);
        $fields = array();
        if ($columns) {
            while ($column = self::row($columns)) {
                $fields[$column["Field"]] = $column["Default"];
            }
        }

        $valuerows = array();
        foreach($rows as $row) {
            $values = array();
            foreach ($fields as $field => $default) {
                if (array_key_exists($field, $row)) {
                    $values[] = $row[$field];
                } else {
                    $values[] = $default;
                }
            }
            $valuerows[] = sprintf('(%s)', self::implodeWithNull($values));
        }
        $valuetext = implode(",", $valuerows);
        $names = implode(",", array_keys($fields));
        self::DBQuery(sprintf('INSERT INTO %s (%s) VALUES %s', $table, $names, $valuetext));
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

    function implodeWithNull($array) {
        $values = join(', ', array_map(function ($value) {
            return $value === null ? 'NULL' : "'$value'";
        }, $array));
        return $values;
    }
    
    function error($text) {
        echo "<pre>";
        var_dump( $text );
        echo "</pre>";
        die('ok');   
    }
}
/*

<?php

class DBAccess extends APP_GameClass {

	function __construct( )
	{
      parent::__construct();
    }

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


    public function queryFilter($table, $filter = null, $sort = null, $fieldmapping = null) {
        
        // Check, if filter is a single value or an array.
        // If it is a single value, it is the uid of the row and we have to 
        // create an array.
        $pairs = NULL;
        $unique = false;

        if (isset($filter)) {
            if (is_array($filter) == false) {
                $pairs[self::getPrimaryKey($table)] = $filter;
                $unique = true;
            } else {
                $pairs = $filter;
            }
        }

        if (!isset($fieldmapping)) {
            $fieldmapping = '*';
        }
        
        $query = sprintf('SELECT %s FROM %s', $fieldmapping, $table);
        
        if (isset($pairs)) {
            $query .= ' WHERE '.self::query($pairs);
        }
        
        if (isset($sort) && $sort != '') {
          $query .= sprintf(' ORDER BY %s', $sort);
        }

        return $query;
    }

    public function insertRow($table, $pairs) {
        
        foreach ($pairs as $key => $value) {
            $pairs[$key] = $value;
        }
        
        $values = join('", "', $pairs);
        $names = join('`, `', array_keys($pairs));

        self::DbQuery(sprintf('INSERT INTO %s (`%s`) VALUES ("%s")', $table, $names, $values));
    }   

    public function insertRows($table, $rows) {
        if (!is_array(reset($rows))) {
            self::error("DBAccess (insertRows): Parameter $rows is not an array of arrays");
        }

        $columns = self::getColumns($table);
        $fields = array();
        if ($columns) {
            while ($column = self::row($columns)) {
                $fields[$column["Field"]] = $column["Default"];
            }
        }

        $valuerows = array();
        foreach($rows as $row) {
            $values = array();
            foreach ($fields as $field => $default) {
                if (array_key_exists($field, $row)) {
                    $values[] = $row[$field];
                } else {
                    $values[] = $default;
                }
            }
            $valuerows[] = sprintf('(%s)', self::implodeWithNull($values));
        }
        $valuetext = implode(",", $valuerows);
        $names = implode(",", array_keys($fields));
        self::DBQuery(sprintf('INSERT INTO %s (%s) VALUES %s', $table, $names, $valuetext));
    }

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

    function implodeWithNull($array) {
        $values = join(', ', array_map(function ($value) {
            return $value === null ? 'NULL' : "'$value'";
        }, $array));
        return $values;
    }
    
    function error($text) {
        echo "<pre>";
        var_dump( $text );
        echo "</pre>";
        die('ok');   
    }
}
*/