var Masters = new Mongo.Collection("masters");
var Slaves = new Mongo.Collection("slaves");

var NeoMasters = new Mongo.Collection("neomasters");
var NeoSlaves = new Mongo.Collection("neoslaves");

if (Meteor.isClient) {
  ;(function MongoMasterSlave(){
    Session.set("master", "none")
   
    Template.mongo.helpers({
      masters: function () {
        var result = Masters.find()
        var fetched = result.fetch()
        if (fetched.length > 0) {
          Session.set("master", fetched[0].name)
        }
        console.log("Masters", fetched)
        return result;
      }

    , slaves: function () {
        var master = Session.get("master")
        var result = Slaves.find({not: {$ne: master}})
        console.log("Slaves", result.fetch())
        return result;
        }
    });

    Template.mongo.events({
      'change #master': function () {
        var master = $("#master :selected").text()
        Session.set("master", master);
      }
    });
  })()


  ;(function Neo4jMasterSlave(){
    Session.set("neo4j", "none")
   
    Template.neo4j.helpers({
      "neomasters": function () {
        var result = NeoMasters.find()
        var fetched = result.fetch()
        if (fetched.length > 0) {
          Session.set("master", fetched[0].name)
        }
        console.log("NeoMasters", fetched)
        return result;
      }

    , "neoslaves": function () {
        var master = Session.get("master")
        var result = NeoSlaves.find({not: {$ne: master}})
        console.log("Slaves", result.fetch())
        return result;
        }
    });

    Template.mongo.events({
      'change #neomaster': function () {
        var master = $("#neomaster :selected").text()
        Session.set("neomaster", master);
      }
    });
  })()
} 

if (Meteor.isServer) {
  Meteor.startup(function () {
    Masters.remove({})
    Masters.insert({ name: "A" })
    Masters.insert({ name: "B" })
    Masters.insert({ name: "C" })

    Slaves.remove({})
    Slaves.insert({ name: "x", not: "A" })
    Slaves.insert({ name: "y", not: "B"  })
    Slaves.insert({ name: "z", not: "C"  })

    NeoMasters.remove({})
    NeoMasters.insert({ name: "I" })
    NeoMasters.insert({ name: "J" })
    NeoMasters.insert({ name: "K" })

    NeoSlaves.remove({})
    NeoSlaves.insert({ name: "i", not: "I" })
    NeoSlaves.insert({ name: "j", not: "J"  })
    NeoSlaves.insert({ name: "k", not: "K"  })
  })
}
