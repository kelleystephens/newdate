'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Activity = traceur.require(__dirname + '/../models/activity.js');

exports.profile = (req, res)=> {
  res.render('users/profile');
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
    Activity.findAll(activities=>{
      res.render('users/dashboard', {user: user, activities: activities, title: 'Dashboard'});
    });
  });
};

exports.register = (req, res)=> {
  User.create(req.body, u=> {
    if(u) {
      req.session.userId = u._id;
      res.redirect(`/profile/${u._id}/setup`);
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
