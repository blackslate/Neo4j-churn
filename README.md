 
# NEO4J CHURN
 
This script demonstrates an issue with the Neo4j database driver.

The same functionality is created using both MongoDB and Neo4j.
When the value of any of the popup menus is changed, a
console.log() call is made to show the which Mongo documents have
been retrieved to display in the menu.

If you choose the Neo4j Master menu, you will see something like:

    Mongo Master change to: B
    Mongo Slaves [Object, Object]
    Mongo Slaves [Object, Object, Object]
    Neo4j Master: [Object, Object, Object]
    Mongo Slaves [Object, Object]
 
*Note that the Neo4j Master popup menu is refreshed when the value
of the Mongo Master menu changes. Is this normal? (In any case,
it is not too troublesome.)*
 
However, if you choose the Neo4j Master menu, you will see
something like this:

    Neo4j Master change to: B
    Neo4j Master: [Object, Object, Object]
    Neo4j Slave
 
Notice that the Slave menu does not output an array of objects.
Go to line 174 to fix this. Change the line to...
 
    console.log("Neo4j Slave", results.count())
 
... or uncomment one of the lines that shows results.count() or
results.fetch(), and save this script.
 
SYMPTOM: You will now see that the neoslaves function that
generates the items for the Slave menu is being called constantly.
This does not happen to the Mongo Slave when the Mongo Master is
updated.
 
This is caused by the called to one of the methods of the `results`
object.
 
EXPECTED: A call to `results.count()` or `results.fetch()` should not
create an endless cascade of refreshes.
