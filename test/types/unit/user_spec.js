/* global describe, it, before, beforeEach, afterEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'dating-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var app = require('../../../app/app');
var request = require('supertest');
var traceur = require('traceur');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var cp = require('child_process');

var User;

describe('User', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').remove(function(){
      cp.execFile(__dirname + '/../../pictures/before.sh', {cwd:__dirname + '/../../pictures'}, function(err, stdout, stderr){
        factory('user', function(users){
          var bill = {
            'sex': ['male'],
            'lookingFor': ['male, female'],
            'race': ['american indian'],
            'religion': ['buddhist'],
            'age': ['23'],
            'bodyType': ['athletic'],
            'height': ['74'],
            'about': ['looking for hotties'],
            'photo': [{
              'originalFilename': 'profilePic1.jpg',
              'path': '../../test/pictures/copy/profilePic1.jpg',
              'size': 10
              }]
          };

          var mark = {
            'sex': ['male'],
            'lookingFor': ['male'],
            'race': ['black'],
            'religion': ['muslim'],
            'age': ['24'],
            'bodyType': ['ripped'],
            'height': ['70'],
            'about': ['Im so lonely'],
            'photo': [{
              'originalFilename': 'profilePic2.jpg',
              'path': '../../test/pictures/copy/profilePic2.jpg',
              'size': 10
              }]
          };

          var sue = {
            'sex': ['female'],
            'lookingFor': ['male'],
            'race': ['black'],
            'religion': ['muslim'],
            'age': ['24'],
            'bodyType': ['ripped'],
            'height': ['70'],
            'about': ['lyke hiiiiiii!!!!!!!1!'],
            'photo': [{
              'originalFilename': 'profilePic3.jpg',
              'path': '../../test/pictures/copy/profilePic3.jpg',
              'size': 10
              }]
          };

          var alex = {
            'sex': ['female'],
            'lookingFor': ['female'],
            'race': ['white'],
            'religion': ['christian'],
            'age': ['24'],
            'bodyType': ['slender'],
            'height': ['55'],
            'about': ['I want someone to build canoes with'],
            'photo': [{
              'originalFilename': 'profilePic4.jpg',
              'path': '../../test/pictures/copy/profilePic4.jpg',
              'size': 10
              }]
          };

          users[0].update(bill, function () {
            users[1].update(mark, function () {
              users[2].update(sue, function () {
                users[3].update(alex, function () {
                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  afterEach(function(done){
    cp.execFile(__dirname + '/../../pictures/after.sh', {cwd:__dirname + '/../../pictures'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('.create', function(){

    it('should successfully create a user', function(done){
      var fields = {
        email:'billy@aol.com',
        password:'1234',
        bodyType: 'Otter',
        name: 'billy',
        age: '23',
        sex: 'male',
        lookingFor: 'female',
        zip: '37203',
        coordinates: ['7.345356345', '4.30430594']
      };

      var files = {photo: [{originalFilename: 'profilePic6.jpg', path: '../../test/pictures/copy/profilePic6.jpg', size: 10}]};
      fields.photo = files.photo;

      User.create(fields, function(u){
        expect(u).to.be.ok;
        expect(u).to.be.an.instanceof(User);
        expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(u.password).to.have.length(60);
        expect(u.name).to.equal('billy');
        expect(u.zip).to.equal('37203');
        done();
      });
    });

    it('should NOT successfully register a user - user already exists', function(done){
      User.create({email:'bill@aol.com', password:'does not matter', name: 'sue', zip: '37203'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });

    it('should NOT successfully register a user - no password', function(done){
      User.create({email:'billy@aol.com', password:'', name:'billy', zip: '37203'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });

  describe('.login', function(){
    it('should successfully login a user', function(done){
      User.login({email:'bill@aol.com', password:'1234'}, function(u){
        expect(u).to.be.ok;
        done();
      });
    });

    it('should NOT login user - bad email', function(done){
      User.login({email:'wrong@aol.com', password:'5678'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });

    it('should NOT login user - bad password', function(done){
      User.login({email:'bill@aol.com', password:'wrong'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });

  describe('.findById', function () {
    it('should return a user with matching credentials', function (done) {
      User.findById('0123456789abcdef01234567', function (user) {
        expect(user).to.be.ok;
        expect(user).to.be.instanceof(User);
        expect(user.email).to.equal('bill@aol.com');
        done();
      });
    });

    it('should return a null user object', function (done) {
      User.findById('538de154065c89565f9bde6c', function (user) {
        expect(user).to.be.null;
        done();
      });
    });
  });

  describe('#save', function () {
    it('should save a user', function (done) {
      User.findById('0123456789abcdef01234567', function (user) {
        user.name = 'susan';
        user.save(function (user) {
          expect(user).to.be.ok;
          expect(user).to.be.instanceof(User);
          expect(user.email).to.equal('bill@aol.com');
          expect(user.name).to.equal('susan');
          expect(user.zip).to.equal('37203');
          done();
        });
      });
    });
  });

  describe('#update', function () {
    it('should update a user - no profile pic', function (done) {
      User.findById('0123456789abcdef01234567', function (user) {

        var obj = {
          sex: ['female'],
          race: ['black'],
          religion: ['Jewish'],
          bodyType: ['hourglass with extra minutes'],
          height: ['66'],
          age: ['23'],
          about: ['I am a successful, independent black woman looking for love.'],
          lookingFor: ['male, female'],
          photo: [{
            originalFilename: 'profilePic5.jpg',
            path: '../../test/pictures/copy/profilePic5.jpg',
            size: 10
          }]
        };

        user.update(obj, function (user) {
          expect(user).to.be.ok;
          expect(user).to.be.instanceof(User);
          expect(user._id).to.be.instanceof(Mongo.ObjectID);
          expect(user._id.toString()).to.deep.equal('0123456789abcdef01234567');
          expect(user.email).to.equal('bill@aol.com');
          expect(user.zip).to.equal('37203');
          expect(user.sex).to.equal('female');
          expect(user.race).to.equal('black');
          expect(user.religion).to.equal('Jewish');
          expect(user.bodyType).to.equal('hourglass with extra minutes');
          expect(user.height).to.equal('66');
          expect(user.about).to.equal('I am a successful, independent black woman looking for love.');
          done();
        });
      });
    });

    it('should update a user - existing profile pic', function (done) {
      User.findById('0123456789abcdef01234567', function (user) {

        var obj = {
          sex: ['female'],
          race: ['black'],
          religion: ['Jewish'],
          bodyType: ['hourglass with extra minutes'],
          height: ['66'],
          age: ['23'],
          about: ['I am a successful, independent black woman looking for love.'],
          lookingFor: ['male, female'],
          photo: [{
            originalFilename: 'profilePic6.jpg',
            path: '../../test/pictures/copy/profilePic6.jpg',
            size: 10
          }]
        };

        user.update(obj, function (user) {
          expect(user).to.be.ok;
          expect(user).to.be.instanceof(User);
          expect(user._id).to.be.instanceof(Mongo.ObjectID);
          expect(user._id.toString()).to.deep.equal('0123456789abcdef01234567');
          expect(user.email).to.equal('bill@aol.com');
          expect(user.zip).to.equal('37203');
          expect(user.sex).to.equal('female');
          expect(user.race).to.equal('black');
          expect(user.religion).to.equal('Jewish');
          expect(user.bodyType).to.equal('hourglass with extra minutes');
          expect(user.height).to.equal('66');
          expect(user.about).to.equal('I am a successful, independent black woman looking for love.');
          done();
        });
      });
    });
  });

  describe('.findByLocation', function () {
    it('should find a user by their location', function (done) {
      var obj = {coordinates: ['7.345356345', '4.30430594']};
      User.findByLocation(obj, function (users) {
        expect(users).to.be.an('array');
        expect(users[0]).to.be.ok;
        expect(users[0]).to.be.instanceof(User);
        expect(users[0]._id).to.be.instanceof(Mongo.ObjectID);
        expect(users[0].zip).to.equal('37203');
        done();
      });
    });
  });

  describe('.search', function () {
    it('should find a user by the query parameters', function (done) {
      User.findById('0123456789abcdef01234567', function (user) {
        var query = {
          maxDistance: '30',
          race: 'black',
          religion: 'muslim',
          bodyType: 'ripped',
          ageRange: '5',
          heightRange: '65-71'
        };

        User.search(query, user, function (users) {
          expect(users).to.be.ok;
          expect(users).to.be.an('array');
          expect(users.length).to.equal(2);
          done();
        });
      });
    });

    it('should find a user by the query parameters - any race', function (done) {
      User.findById('0123456789abcdef01234567', function (user) {
        var query = {
          maxDistance: '30',
          race: 'any',
          religion: 'muslim',
          bodyType: 'ripped',
          ageRange: '5',
          heightRange: '65-71'
        };

        User.search(query, user, function (users) {
          expect(users).to.be.ok;
          expect(users).to.be.an('array');
          expect(users.length).to.equal(2);
          done();
        });
      });
    });

    it('should find a user by the query parameters - any religion', function (done) {
      User.findById('0123456789abcdef01234567', function (user) {
        var query = {
          maxDistance: '30',
          race: 'black',
          religion: 'any',
          bodyType: 'ripped',
          ageRange: '5',
          heightRange: '65-71'
        };

        User.search(query, user, function (users) {
          expect(users).to.be.ok;
          expect(users).to.be.an('array');
          expect(users.length).to.equal(2);
          done();
        });
      });
    });

    it('should find a user by the query parameters - any bodyType', function (done) {
      User.findById('0123456789abcdef01234567', function (user) {
        var query = {
          maxDistance: '30',
          race: 'black',
          religion: 'muslim',
          bodyType: 'any',
          ageRange: '5',
          heightRange: '65-71'
        };

        User.search(query, user, function (users) {
          expect(users).to.be.ok;
          expect(users).to.be.an('array');
          expect(users.length).to.equal(2);
          done();
        });
      });
    });

    it('should find a user by the query parameters - any age', function (done) {
      User.findById('0123456789abcdef01234567', function (user) {
        var query = {
          maxDistance: '30',
          race: 'black',
          religion: 'muslim',
          bodyType: 'ripped',
          ageRange: 'any',
          heightRange: '65-71'
        };

        User.search(query, user, function (users) {
          expect(users).to.be.ok;
          expect(users).to.be.an('array');
          expect(users.length).to.equal(2);
          done();
        });
      });
    });
  });

  it('should find a user by the query parameters - any height', function (done) {
    User.findById('0123456789abcdef01234567', function (user) {
      var query = {
        maxDistance: '30',
        race: 'black',
        religion: 'muslim',
        bodyType: 'ripped',
        ageRange: '5',
        heightRange: 'any'
      };

      User.search(query, user, function (users) {
        expect(users).to.be.ok;
        expect(users).to.be.an('array');
        expect(users.length).to.equal(2);
        done();
      });
    });
  });

  it('should find a user by the query parameters - no maxDistance', function (done) {
    User.findById('0123456789abcdef01234567', function (user) {
      var query = {
        // maxDistance: '30',
        race: 'black',
        religion: 'muslim',
        bodyType: 'ripped',
        ageRange: '5',
        heightRange: '65-71'
      };

      User.search(query, user, function (users) {
        expect(users).to.be.ok;
        expect(users).to.be.an('array');
        expect(users.length).to.equal(2);
        done();
      });
    });
  });

  it('should find a user by the query parameters - any everything', function (done) {
    User.findById('0123456789abcdef01234567', function (user) {
      var query = {
        race: 'any',
        religion: 'any',
        bodyType: 'any',
        ageRange: 'any',
        heightRange: 'any'
      };

      User.search(query, user, function (users) {
        expect(users).to.be.ok;
        expect(users).to.be.an('array');
        expect(users.length).to.equal(2);
        done();
      });
    });
  });

});
