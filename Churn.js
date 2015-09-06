

/** 
 * CHURN
 *
 * This script demonstrates an issue with the Neo4j database driver.
 * 
 * The same functionality is created using both MongoDB and Neo4j.
 * When the value of any of the popup menus is changed, a
 * console.log() call is made to show the which Mongo documents have
 * been retrieved to display in the menu.
 * 
 * If you choose the Neo4j Master menu, you will see something like:
*
 * Mongo Master change to: B
 * Mongo Slaves [Object, Object]
 * Mongo Slaves [Object, Object, Object]
 * Neo4j Master: [Object, Object, Object]
 * Mongo Slaves [Object, Object]
 *
 * NOTE that the Neo4j Master popup menu is refreshed when the value
 * of the Mongo Master menu changes. Is this normal? (In any case,
 * it is not too troublesome.)
 *
 * However, if you choose the Neo4j Master menu, you will see
 * something like this:
 * 
 * Neo4j Master change to: B
 * Neo4j Master: [Object, Object, Object]
 * Neo4j Slave
 *
 * Notice that the Slave menu does not output an array of objects.
 * Go to line 174 to fix this. Change the line to...
 *
 *   console.log("Neo4j Slave", results.count())
 *
 * ... or uncomment one of the lines that shows results.count() or
 * results.fetch(), and save this script.
 *
 * SYMPTOM: You will now see that the neoslaves function that
 * generates the items for the Slave menu is being called constantly.
 * This does not happen to the Mongo Slave when the Mongo Master is
 * updated.
 *
 * This is caused by the called to one of the methods of the `results`
 * object.
 *
 * EXPECTED: A call to results.count() or results.fetch() should not
 * create an endless cascade of refreshes.
 */

// MONGODB
var Masters = new Mongo.Collection("masters");
var Slaves = new Mongo.Collection("slaves");

// NEO4J
var queries = {
  "masters": {
    collection: Meteor.neo4j.collection("masters")
  , query: 
     "MATCH (master:Master) RETURN master"
  , link: "master"
  }
, "slaves": {
    collection: Meteor.neo4j.collection("slaves")
  , query: 
      "MATCH (neoslave:Slave) "+
      "WHERE neoslave.not <> {master} "+
      "RETURN neoslave"
  , options: {master: ""}
  , link: "neoslave"
  }
}

if (Meteor.isClient) {
  Tracker.autorun(function () {
    ;(function subscriptionsForMongoDB(){
      Meteor.subscribe("Masters");
      Meteor.subscribe("Slaves", Session.get("master"));
    })()

    ;(function subsccriptionsForNeo4j(){
      var queryKeys = Object.keys(queries)
      queryKeys.forEach(subscribe)

      function subscribe(key) { //, index, array){
        var queryData = queries[key]
        var options = queryData.options
        var link = queryData.link
        var collection = queryData.collection
        var subscription = collection.subscribe(key, options, link)
      }    
    })()
  });

  ;(function MongoDBMasterSlave(){
    Session.set("master", "none")
   
    Template.mongo.helpers({
      masters: function () {
        var result = Masters.find()
        var fetched = result.fetch()
        if (fetched.length > 0) {
          Session.set("master", fetched[0].name)
        }
        console.log("Mongo Masters", fetched)
        return result;
      }

    , slaves: function () {
        var master = Session.get("master")
        var result = Slaves.find()
        console.log("Mongo Slaves", result.fetch())
        return result;
      }
    });

    Template.mongo.events({
      'change #master': function () {
        var master = $("#master :selected").text()
        console.log("Mongo Master change to:", master)
        Session.set("master", master)
      }
    })
  })()


  ;(function Neo4jMasterSlave(){ 
    Session.set("neo4j", "none")

    function getResults(queryData) {
      var collection = queryData.collection
      var cursor = collection.find()
  
      return cursor
    }

    Template.neo4j.onRendered (function () {
      var master = $("#neomaster :selected").text()
      Session.set("neo4j", master)
    })

    Template.neo4j.events({
      'change #neomaster': function () {
        var master = $("#neomaster :selected").text()
        console.log("Neo4j Master change to:", master)
        Session.set("neo4j", master)
      }
    })

    Template.neo4j.helpers({
      neomasters: function() {
        var results = getResults(queries.masters)
        if (!Session.get("neo4j").length) {
          var fetched = results.fetch()
          if (fetched.length > 0) {
            Session.set("neo4j", fetched[0].name)
          }
        }
        console.log("Neo4j Master:",results.fetch())
        return results
      }

    , neoslaves: function () {
        var key = "slaves"
        var queryData = queries[key]
        var options = { master: Session.get("neo4j") }
        var link = queryData.link
        var collection = queryData.collection
        // Options have changed, so subscribe() needs to be refreshed
        collection.subscribe(key, options, link)

        var results = getResults(queryData)
        console.log("Neo4j Slave")
         // UNCOMMENT EITHER OF THE TWO FOLLOWING LINES
        // console.log(results.count())
        // console.log(results.fetch())
        return results
      }
    })
  })()
} 

if (Meteor.isServer) {
  Meteor.startup(function () {
    ;(function publishForMongoDB(){
      Masters.remove({})
      Masters.insert({ name: "A" })
      Masters.insert({ name: "B" })
      Masters.insert({ name: "C" })

      Slaves.remove({})
      Slaves.insert({ name: "x", not: "A" })
      Slaves.insert({ name: "y", not: "B"  })
      Slaves.insert({ name: "z", not: "C"  })

      Meteor.publish("Masters", function () {
        return Masters.find({});
      })
      Meteor.publish("Slaves", function (master) {
        return Slaves.find({not: {$ne: master}})
      })  
    })()
 
    ;(function publishForNeo4j(){
     Meteor.N4JDB.query("MATCH (m:Master), (s:Slave) DELETE m, s", null, function(error, data){
          Meteor.N4JDB.query(
            "CREATE " +
            "  (a:Master {name:'A'})" +
            ", (b:Master {name:'B'})" +
            ", (c:Master {name:'C'})" +
            ", (x:Slave {name:'x', not:'A'})" +
            ", (y:Slave {name:'y', not:'B'})" +
            ", (z:Slave {name:'z', not:'C'})" +
            "RETURN a,b,c,x,y,z"
          , null
          , function(error, data){
              //console.log("CREATE:", error, data)
            }
          )
        }
      )

      var queryKeys = Object.keys(queries)
      queryKeys.forEach(publish)

      function publish(key) { //, index, array){
        var queryData = queries[key]
        var query = queryData.query
        var collection = queryData.collection

        collection.publish(key, publishCallback)

        function publishCallback(){
          return query
        }
      }
    })()
  })
}
