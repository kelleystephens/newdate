var bcrypt = require('bcrypt');
var userCollection = global.nss.db.collection('users');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
// var crypto = require('crypto');
var fs = require('fs');
// var path = require('path');

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
        user.photo = '/img/pictures/' + obj.photo[0].originalFilename;


        var path = obj.photo[0].path;

        if(path[0] !== '/'){
           path = __dirname + '/' + path;
        }

        fs.renameSync(path, __dirname + '/../static/img/pictures/' + obj.photo[0].originalFilename);


        // user.processPhotos(obj.photo);
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

  // processPhotos(photos){
  //   photos.forEach(p=>{
  //     if(p.size){
  //       var name = crypto.randomBytes(12).toString('hex') + path.extname(p.originalFilename).toLowerCase();
  //       var file = `/img/${this._id.toString()}/${name}`;
  //
  //       var photo = {};
  //       photo.name = name;
  //       photo.file = file;
  //       photo.size = p.size;
  //       photo.orig = p.originalFilename;
  //       // photo.isPrimary = false;
  //
  //       var filePath = p.path;
  //
  //       if(filePath[0] !== '/'){
  //         filePath = __dirname + '/' + filePath;
  //       }
  //
  //       console.log(filePath);
  //
  //
  //
  //       var userPath = `${__dirname}/../static/img/${this._id.toString()}`;
  //       var fullPath = `${userPath}/${name}`;
  //
  //       if(!fs.existsSync(userPath)){fs.mkdirSync(userPath);}
  //
  //       fs.renameSync(filePath, fullPath);
  //
  //       // this.userDir = path.normalize(userPath);
  //       this.photos.push(photo);
  //     }
  //   });
  // }

  update(obj, fn){
    this.sex = obj.sex;
    this.lookingFor = obj.lookingFor.split(',').map(s=>s.trim());
    this.race = obj.race;
    this.religion = obj.religion;
    this.bodyType = obj.bodyType;
    this.height = obj.height;
    this.about = obj.about;
    this.age = obj.age * 1;
    this.save(()=>fn(this));
  }

  save(fn){
    userCollection.save(this, ()=>fn(this));
  }

}

module.exports = User;
