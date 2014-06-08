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
    console.log('User input: ');
    console.log(user);
    var u = {
      userId: user._id.toString(),
      name: user.name,
      photo: user.photo
    };
    console.log('u object: ');
    console.log(u);

    console.log('this: ');
    console.log(this);

    console.log('this.attendees before: ');
    console.log(this.attendees);

    this.attendees.push(u);

    console.log('this.attendees after: ');
    console.log(this.attendees);
    this.save(()=>fn(this));
  }

  save(fn){
    activityCollection.save(this, ()=>fn(this));
  }
}

module.exports = Activity;
