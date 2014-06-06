'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.register = (req, res)=> {
  User.register(req.body, u=> {
    if(u) {
      req.session.userId = u._id;
      res.redirect('/dashboard');
    } else {
      req.session.userId = null;
      res.redirect('/');
    }
  });
};

exports.dashboard = (req, res)=> {
  User.findByUserId(req.session.userId.toString(), users=>{
    res.render('users/dashboard', {users: users, title: 'Dashboard'});
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
