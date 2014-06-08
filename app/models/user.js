/* jshint unused: false */

var bcrypt = require('bcrypt');
var userCollection = global.nss.db.collection('users');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var fs = require('fs');
var rimraf = require('rimraf');

class User{
  static create(obj, fn){
    userCollection.findOne({email:obj.email}, (e,u)=>{
      if(!u){
        if(!obj.password.length){
          fn(null);
          return;
        }
        var user = new User();
        user._id = Mongo.ObjectID(obj._id);
        user.email = obj.email;
        user.password = bcrypt.hashSync(obj.password, 8);
        user.name = obj.name;
        user.zip = obj.zip;
        user.coordinates = obj.coordinates.map(n=>n*1);
        user.save(()=>fn(user));
      }else{
        fn(null);
      }
    });
  }

  static login(obj, fn){
    userCollection.findOne({email:obj.email}, (e,u)=>{
      if(u){
        var isMatch = bcrypt.compareSync(obj.password, u.password);
        if(isMatch){
          fn(u);
        }else{
          fn(null);
        }
      }else{
        fn(null);
      }
    });
  }

  static findById(id, fn){
    Base.findById(id, userCollection, User, fn);
  }

  static findByLocation(obj, fn){
    Base.findByLocation(obj, userCollection, User, fn);
  }

  static search(query, user, fn){

    var lat = user.coordinates[0] * 1;
    var lng = user.coordinates[1] * 1;
    var oneMile = 0.000250;
    var maxDistance = query.maxDistance ? ((query.maxDistance * 1) * oneMile) : 50000;

    var filter = {
      lookingFor: user.sex,
      _id: { $ne: user._id },
      coordinates: {$nearSphere:[lat, lng],$maxDistance:maxDistance}
    };

    if(user.lookingFor.length === 2){
      filter.$or = [{sex: user.lookingFor[0]}, {sex: user.lookingFor[1]}];
    }else{
      filter.sex = user.lookingFor[0];
    }

    if(query.race !== 'any'){
      filter.race = query.race;
    }

    if(query.religion !== 'any'){
      filter.religion = query.religion;
    }

    if(query.bodyType !== 'any'){
      filter.bodyType = query.bodyType;
    }

    if(query.ageRange !== 'any'){
      var maxAge = user.age + query.ageRange * 1;
      var minAge = user.age - query.ageRange * 1;
      filter.age = { $gte: minAge, $lte: maxAge };
    }

    var height;

    if(query.heightRange !== 'any'){
      if(query.heightRange === 'u59'){
        height = query.heightRange.trim('u') * 1;
        filter.height = {$lt: height};
      }else if(query.heightRange === 'o77'){
        height = query.heightRange.trim('o') * 1;
        filter.height = {$gt: height};
      }else{
        height = query.heightRange.split('-');
        filter.height = {$lte: height[1], $gte: height[0]}  ;
      }
    }

    userCollection.find(filter).toArray((err, users)=>{
      fn(users);
    });
  }

  update(obj, fn){
    this.sex = obj.sex;
    this.lookingFor = obj.lookingFor.split(',').map(s=>s.trim());
    this.race = obj.race;
    this.religion = obj.religion;
    this.bodyType = obj.bodyType;
    this.height = obj.height;
    this.about = obj.about;
    this.age = obj.age * 1;
    this.photo = `/img/${this._id.toString()}/${obj.photo[0].originalFilename}`;

    var path = obj.photo[0].path;
    if(path[0] !== '/'){path = __dirname + '/' + path;}
    var userDir = `${__dirname}/../static/img/${this._id.toString()}`;
    var fileDir =  `${userDir}/${obj.photo[0].originalFilename}`;
    if(!fs.existsSync(userDir)){
      fs.mkdirSync(userDir);
      fs.renameSync(path, fileDir);
      this.save(()=>fn(this));
    }else{
      rimraf(userDir, ()=>{
        fs.mkdirSync(userDir);
        fs.renameSync(path, fileDir);
        this.save(()=>fn(this));
      });
    }
  }

  save(fn){
    userCollection.save(this, ()=>fn(this));
  }

}

module.exports = User;
