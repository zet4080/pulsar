# pulsar

Pulsar on BGA

# Utility Classes

## DBUtil
Generic database access. Works only for tables with a primary key that consists of only one field.
But that is good enough for the use cases in this game.

### DBUtil::get($table, $filter = null, $sort = null, $fieldlist = null)

Retrieves an array of records of the given table.

``$dice = DBUtil::get('dice', array('position' => 'blackhole'));``

Retrieves all dice that are located in the black hole.

# Coding Conventions

## check-methods

Methods whose names begin with "check" (for example checkIfTimeMarkerAllowsAction) are checking a game state or rule. If the check fails, then a BgaException is thrown
