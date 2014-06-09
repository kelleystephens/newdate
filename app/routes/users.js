/* jshint unused:false */

'use strict';

var multiparty = require('multiparty');
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Activity = traceur.require(__dirname + '/../models/activity.js');
var Message = traceur.require(__dirname + '/../models/message.js');

exports.index = (req, res)=>{
  res.render('users/index', {title: 'Login'});
};


exports.logout = (req, res)=> {
  req.session.userId = null;
  res.redirect('/login');
};

exports.profile = (req, res)=> {
  User.findById(req.params.id.toString(), user=>{
    res.render('users/profile', {user1: user, title: `${user.name}`});
  });
};

exports.update = (req, res)=> {
  User.findById(req.session.userId, u=>{
    var form = new multiparty.Form();  //this is just how you use multiparty to pull pics
    form.parse(req, (err, fields, files)=>{
      fields.photo = files.photo;
      u.update(fields, u=>{
        res.redirect('/dashboard');
      });
    });
  });
};

exports.profileEdit = (req, res)=> {
  res.render('users/profileEdit', {title: 'Profile Setup'});
};

exports.dashboard = (req, res)=> {
  User.findById(req.session.userId.toString(), user=>{
    Activity.findByLocation(user, activities=>{
      Message.findAllByToUserId(user._id, messages=>{
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
      res.redirect('/login');
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
      res.redirect('/login');
    }
  });
};

exports.search = (req, res)=>{
  User.search(req.query, res.locals.user, results=>{
    res.render('users/results', {results:results});
  });
};
