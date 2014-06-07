'use strict';

var MongoClient = require('mongodb').MongoClient;
var mongoUrl = `mongodb://localhost/${process.env.DBNAME}`;
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(next);
  }else{
    next();
  }
};

function load(fn){
  MongoClient.connect(mongoUrl, (err, db)=>{
    if(err){throw err;}
    global.nss = {};
    global.nss.db = db;
    global.nss.db.collection('activities').ensureIndex({'coordinates':'2dsphere'}, function(err, indexName){
      global.nss.db.collection('users').ensureIndex({'coordinates':'2dsphere'}, function(e, iN){
        console.log('Connected to MongoDB');
        fn();
      });
    });
  });
}
