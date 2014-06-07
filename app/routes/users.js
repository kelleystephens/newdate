'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Activity = traceur.require(__dirname + '/../models/activity.js');
var Message = traceur.require(__dirname + '/../models/message.js');

exports.profile = (req, res)=> {
  User.findById(req.session.userId.toString(), user=>{
    res.render('users/profile', {user: user, title: `${user.name}`});
  });
};

exports.update = (req, res)=> {
  User.findById(req.session.userId, u=>{
    u.update(req.body, ()=>{
    res.redirect('/dashboard');
    });
  });
};

exports.profileEdit = (req, res)=> {
  res.render('users/profileEdit', {title: 'Profile Setup'});
};

exports.dashboard = (req, res)=> {
  User.findById(req.session.userId.toString(), user=>{
    Activity.findByLocation(user, activities=>{
      Message.findAllByToUserId(user._id.toString(), messages=>{
        res.render('users/dashboard', {user: user, activities: activities, messages: messages, title: 'Dashboard'});
      });
    });
  });
};

exports.register = (req, res)=> {
  User.create(req.body, u=> {
    if(u) {
      req.session.userId = u._id;
      res.send(u);
    } else {
      req.session.userId = null;
      res.redirect('/');
    }
  });
};

exports.lookup = (req, res, next)=> {
  User.findById(req.session.userId, u=>{
    res.locals.user = u;
    next();
  });
};

exports.login = (req, res, next)=> {
  User.login(req.body, u=> {
    if(u) {
      req.session.userId = u._id;
      res.redirect('/dashboard');
    } else {
      req.session.userId = null;
      res.redirect('/');
    }
  });
};
