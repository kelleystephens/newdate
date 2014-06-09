var messageCollection = global.nss.db.collection('messages');
var Mongo = require('mongodb');
var _ = require('lodash');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

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

  static findById(messageId, fn){
    Base.findById(messageId, messageCollection, Message, fn);
  }

  read(fn){
    this.isRead = true;
    fn(this);
  }

  get classes(){
    var classes = [];

    if(!this.isRead){
      classes.push('unread');
    }

    if(this.isRead){
      classes.push('read');
    }

    return classes.join(' ');
  }

}

module.exports = Message;
