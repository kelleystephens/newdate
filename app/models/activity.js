var activityCollection = global.nss.db.collection('activities');
var Mongo = require('mongodb');
var _ = require('lodash');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

class Activity{
  static create(obj, fn){
    var activity = new Activity();
    activity._id = Mongo.ObjectID(obj._id);
    activity.name = obj.name;
    activity.date = new Date(obj.date);
    activity.userIds = [];
    activity.description = obj.description;
    activity.address = obj.address;
    activity.coordinates = [obj.lat*1, obj.lng*1];
    activity.tags = obj.tags.split(',').map(t=>t.trim().toLowerCase());
    activityCollection.save(activity, ()=>fn(activity));
    // activity.save(()=>fn(activity));
  }

  static findByLocation(obj, fn){
    var lat = obj.lat * 1;
    var lng = obj.lng * 1;
    activityCollection.find({'coordinates':{$nearSphere:[lat, lng],$maxDistance:500000}}).toArray(function(err, records){
      console.log(err);
      console.log(lat);
      console.log(lng);
      records = records.map(r=>_.create(Activity.prototype, r));
      fn(records);
    });
  }

  static findAll(fn){
    Base.findAll(activityCollection, Activity, fn);
  }

  static findById(id, fn){
    Base.findById(id, activityCollection, Activity, fn);
  }
}

module.exports = Activity;
