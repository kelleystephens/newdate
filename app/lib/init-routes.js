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
  var user = traceur.require(__dirname + '/../routes/users.js');

  app.all('*', users.lookup);

  app.get('/', dbg, home.index);
  console.log('Routes Loaded');
  fn();
}
