'use strict';

exports.write = (req, res)=> {
  User.findById(req.session.userId.toString(), fromUser=>{
    User.findById(req.params.id.toString(), toUser=>{
      res.render('users/message', {fromUser: fromUser, toUser: toUser, title: 'Message'});
    });
  });
};

exports.write = (req, res)=> {
  Message.create(req.body, m=>{
    res.send(m);
  });
};
