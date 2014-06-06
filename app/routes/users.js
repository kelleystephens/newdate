'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.dashboard = (req, res)=> {
  User.findById(req.session.userId.toString(), user=>{
    res.render('users/dashboard', {user: user, title: 'Dashboard'});
  });
};

exports.register = (req, res)=> {
  User.create(req.body, u=> {
    if(u) {
      req.session.userId = u._id;
      res.redirect('/dashboard');
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
