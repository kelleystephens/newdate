'use strict';

var traceur = require('traceur');
var Activity = traceur.require(__dirname + '/../models/activity.js');

exports.show = (req, res)=> {
  Activity.findById(req.params.id, activity=>{
    res.render('activities/show', {activity: activity, title: 'Activity: ' + activity.name});
  });
};

exports.rsvp = (req, res)=> {
  Activity.findById(req.params.aid, activity=>{
    activity.rsvp(res.locals.user, ()=>{
      res.redirect('/dashboard');
    });
  });
};
