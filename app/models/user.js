var bcrypt = require('bcrypt');
var userCollection = global.nss.db.collection('users');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

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
        user.bodyType = obj.bodyType;
        user.sex = obj.sex;
        user.lookingFor = obj.lookingFor.split(',').map(s=>s.trim());
        user.save(()=>fn(user));
      }else{
        fn(null);
      }
    });
  }

  update(obj, fn){
    this.sex = obj.sex;
    this.lookingFor = obj.lookingFor;
    this.race = obj.race;
    this.religion = obj.religion;
    this.bodyType = obj.bodyType;
    this.height = obj.height;
    this.about = obj.about;
    this.save(()=>fn(this));
  }

  save(fn){
    userCollection.save(this, ()=>fn(this));
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

  // static findByLocation(zip, fn){
  //   Base.findByLocation(zip, userCollection, User, fn);
  // }

}

module.exports = User;
