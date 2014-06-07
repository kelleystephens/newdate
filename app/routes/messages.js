'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Message = traceur.require(__dirname + '/../models/message.js');

exports.write = (req, res)=> {
  User.findById(req.session.userId.toString(), fromUser=>{
    User.findById(req.params.toId.toString(), toUser=>{
      res.render('users/message', {fromUser: fromUser, toUser: toUser, title: 'Message'});
    });
  });
};

exports.create = (req, res)=> {
  Message.create(req.body, m=>{
    res.send(m);
  });
};
