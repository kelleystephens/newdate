'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  var messages = traceur.require(__dirname + '/../routes/messages.js');
  var activities = traceur.require(__dirname + '/../routes/activities.js');

  app.all('*', users.lookup);

  app.get('/', dbg, home.index);

  app.post('/login', dbg, users.login);
  app.get('/logout', dbg, users.logout);
  app.post('/register', dbg, users.register);
  app.get('/dashboard', dbg, users.dashboard);
  app.get('/profile/:id/setup', dbg, users.profileEdit);
  app.post('/profile/:id/setup', dbg, users.update);
  app.get('/profile/:id', dbg, users.profile);
  app.get('/message/:toId', dbg, messages.write);
  app.post('/message/:toId', dbg, messages.create);
  app.get('/activity/:id', dbg, activities.show);
  app.get('/all', dbg, users.all);

  console.log('Routes Loaded');
  fn();
}
