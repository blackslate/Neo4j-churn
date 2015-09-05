// var Masters = new Mongo.Collection("masters");
// var Slaves = new Mongo.Collection("slaves");

// // var queries = {
// //   "masters": {
// //     collection: Meteor.neo4j.collection("masters")
// //   , query: 
// //      "MATCH (neomaster:Master) RETURN neomaster"
// //   , link: "neomaster"
// //   }
// // , "slaves": {
// //     collection: Meteor.neo4j.collection("slaves")
// //   , query: 
// //       "MATCH (neoslave:Slave) "+
// //       "WHERE neoslave.not <> {master} "+
// //       "RETURN neoslave"
// //   , options: {master: ""}
// //   , link: "neoslave"
// //   }
// // }

// if (Meteor.isClient) {
//   Tracker.autorun(function () {
//     // MONGODB
//     Meteor.subscribe("Masters");
//     Meteor.subscribe("Slaves", Session.get("master"));

//     // // NEO4J
//     // var queryKeys = Object.keys(queries)
//     // queryKeys.forEach(subscribe)

//     // function subscribe(key) { //, index, array){
//     //   var queryData = queries[key]
//     //   var options = queryData.options
//     //   var link = queryData.link
//     //   var collection = queryData.collection
//     //   var subscription = collection.subscribe(key, options, link)
//     // }
//   });

//   // ;(function MongoMasterSlave(){
//   //   Session.set("master", "none")
   
//   //   Template.mongo.helpers({
//   //     masters: function () {
//   //       var result = Masters.find()
//   //       var fetched = result.fetch()
//   //       if (fetched.length > 0) {
//   //         Session.set("master", fetched[0].name)
//   //       }
//   //       console.log("Masters", fetched)
//   //       return result;
//   //     }

//   //   , slaves: function () {
//   //       var master = Session.get("master")
//   //       var result = Slaves.find()
//   //       console.log("Slaves", result.fetch())
//   //       return result;
//   //     }
//   //   });

//   //   Template.mongo.events({
//   //     'change #master': function () {
//   //       var master = $("#master :selected").text()
//   //       Session.set("master", master)
//   //     }
//   //   })
//   // })()


//   // ;(function Neo4jMasterSlave(){
//   //   Session.set("neo4j", "none")

//   //   function getResults(queryData) {
//   //     var collection = queryData.collection
//   //     var cursor = collection.find()
//   //     return cursor
//   //   }
   
//   //   // Template.neo4j.helpers({
//   //   //   "neomasters": function () {
//   //   //     var results = getResults(queries.masters)
//   //   //     return results
//   //   //   }

//   //   // , "neoslaves": function () {
//   //   //     var key = "slaves"
//   //   //     var queryData = queries[key]
//   //   //     var options = { master: Session.get("neo4j") }
//   //   //     var link = queryData.link
//   //   //     var collection = queryData.collection
//   //   //     collection.subscribe(key, options, link)

//   //   //     var results = getResults(queryData)
//   //   //     return results
//   //   //   }
//   //   // })

//   //   // Template.neo4j.events({
//   //   //   'change #neomaster': function () {
//   //   //     var master = $("#neomaster :selected").text()
//   //   //     Session.set("neomaster", master)
//   //   //   }
//   //   // })
//   // })()
// } 

// if (Meteor.isServer) {
//   Meteor.startup(function () {
//     // MONGODB
//     Masters.remove({})
//     Masters.insert({ name: "A" })
//     Masters.insert({ name: "B" })
//     Masters.insert({ name: "C" })

//     Slaves.remove({})
//     Slaves.insert({ name: "x", not: "A" })
//     Slaves.insert({ name: "y", not: "B"  })
//     Slaves.insert({ name: "z", not: "C"  })

//     // Meteor.publish("Masters", function () {
//     //   return Masters.find({});
//     // })
//     // Meteor.publish("Slaves", function (master) {
//     //   return Slaves.find({not: {$ne: master}})
//     // })

//     // // NEO4J
//     // Meteor.N4JDB.query("MATCH (m:Master), (s:Slave) DELETE m, s", null, function(error, data){
//     //     console.log("DELETE error:", error, data)

//     //     Meteor.N4JDB.query(
//     //       "CREATE " +
//     //       "  (a:Master {name:'A'})" +
//     //       ", (b:Master {name:'B'})" +
//     //       ", (c:Master {name:'C'})" +
//     //       ", (x:Slave {name:'x'})" +
//     //       ", (y:Slave {name:'y'})" +
//     //       ", (z:Slave {name:'z'})" +
//     //       "RETURN a,b,c,x,y,z"
//     //     , null
//     //     , function(error, data){
//     //         console.log("CREATE error:", error, data)
//     //       }
//     //     )
//     //   }
//     // )

//     // ;(function (){
//     //   var queryKeys = Object.keys(queries)
//     //   queryKeys.forEach(publish)

//     //   function publish(key) {
//     //     var queryData = queries[key]
//     //     var query = queryData.query
//     //     var collection = queryData.collection

//     //     collection.publish(key, publishCallback)

//     //     function publishCallback(){
//     //       return query
//     //     }
//     //   }
//     // })()

//   })
// }
