var messageCollection = global.nss.db.collection('messages');
var Mongo = require('mongodb');
var _ = require('lodash');
// var traceur = require('traceur');
// var Base = traceur.require(__dirname + '/base.js');

class Message{
  static create(obj, fn){
    var message = new Message();
    message._id = Mongo.ObjectID(obj._id);
    message.toUserId = Mongo.ObjectID(obj.toUserId);
    message.fromUserId = Mongo.ObjectID(obj.fromUserId);
    message.isRead = false;
    message.subject = obj.subject;
    message.body = obj.body;
    message.sentDate = new Date();
    messageCollection.save(message, ()=>fn(message));
    // activity.save(()=>fn(activity));
  }

  static findAllByToUserId(toUserId, fn){
    toUserId = Mongo.ObjectID(toUserId);
    messageCollection.find({toUserId:toUserId}).sort({sentDate: -1}).toArray((e,objs)=>{
      objs = objs.map(o=>_.create(Message.prototype, o));
      fn(objs);
    });
  }

  static findAllByFromUserId(fromUserId, fn){
    fromUserId = Mongo.ObjectID(fromUserId);
    messageCollection.find({fromUserId:fromUserId}).sort({sentDate: -1}).toArray((e,objs)=>{
      objs = objs.map(o=>_.create(Message.prototype, o));
      fn(objs);
    });
  }
  // static findByLocation(obj, fn){
  //   var lat = obj.lat * 1;
  //   var lng = obj.lng * 1;
  //   activityCollection.find({'coordinates':{$nearSphere:[lat, lng],$maxDistance:500000}}).toArray(function(err, records){
  //     console.log(err);
  //     console.log(lat);
  //     console.log(lng);
  //     records = records.map(r=>_.create(Activity.prototype, r));
  //     fn(records);
  //   });
  // }
  //
  // static findAll(fn){
  //   Base.findAll(activityCollection, Activity, fn);
  // }
  //
  // static findById(id, fn){
  //   Base.findById(id, activityCollection, Activity, fn);
  // }
}

module.exports = Message;
