var Mongo = require('mongodb');
var _ = require('lodash');

class Base{
  static findById(id, collection, model, fn){
    if(typeof id === 'string'){
      if(id.length !== 24){fn(null); return;}
      id = Mongo.ObjectID(id);
    }

    if(!(id instanceof Mongo.ObjectID)){fn(null); return;}

    collection.findOne({_id:id}, (e,o)=>{
      if(o){
        o = _.create(model.prototype, o);
        fn(o);
      }else{
        fn(null);
      }
    });
  }

  static findByLocation(obj, collection, model, fn){
    var lat = obj.coordinates[0] * 1;
    var lng = obj.coordinates[1] * 1;
    var oneMile = 0.000250;
    var maxDistance = obj.maxDistance ? obj.maxDistance * oneMile : 50000;

    collection.find({'coordinates':{$nearSphere:[lat, lng],$maxDistance:maxDistance}}).toArray(function(err, records){
      records = records.map(r=>_.create(model.prototype, r));
      fn(records);
    });
  }

  static findAll(collection, model, fn){
    collection.find().toArray((e,objs)=>{
      objs = objs.map(o=>_.create(model.prototype, o));
      fn(objs);
    });
  }
}

module.exports = Base;
