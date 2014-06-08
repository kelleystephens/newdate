var activityCollection = global.nss.db.collection('activities');
var Mongo = require('mongodb');
// var _ = require('lodash');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

class Activity{
  static create(obj, fn){
    var activity = new Activity();
    activity._id = Mongo.ObjectID(obj._id);
    activity.name = obj.name;
    activity.date = new Date(obj.date);
    activity.attendees = [];
    activity.description = obj.description;
    activity.address = obj.address;
    activity.coordinates = obj.coordinates.map(n=>n*1);
    activity.tags = obj.tags.split(',').map(t=>t.trim().toLowerCase());
    activityCollection.save(activity, ()=>fn(activity));
    activity.save(()=>fn(activity));
  }

  static findAll(fn){
    Base.findAll(activityCollection, Activity, fn);
  }

  static findById(id, fn){
    Base.findById(id, activityCollection, Activity, fn);
  }

  static findByLocation(obj, fn){
    Base.findByLocation(obj, activityCollection, Activity, fn);
  }

  rsvp(user, fn){
    var u = {
      userId: user._id.toString(),
      name: user.name,
      photo: user.photo
    };

    this.attendees.push(u);

    this.save(()=>fn(this));
  }

  save(fn){
    activityCollection.save(this, ()=>fn(this));
  }
}

module.exports = Activity;
