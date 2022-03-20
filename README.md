# pulsar

Pulsar on BGA

# Utility Classes

## DBUtil
Generic database access. Works only for tables with a primary key that consists of only one field.
But that is good enough for the use cases in this game.

### DBUtil::get($table, $filter = null, $sort = null, $fieldmapping = null)

Retrieves an array of records of the given table.
