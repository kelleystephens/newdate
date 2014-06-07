/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'dating-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var app = require('../../../app/app');
var request = require('supertest');
var traceur = require('traceur');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');

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
    global.nss.db.collection('users').drop(function(){
      factory('user', function(users){
        done();
      });
    });
  });

  describe('.create', function(){
    it('should successfully create a user', function(done){
      User.create({email:'billy@aol.com', password:'1234', bodyType: 'Otter', name: 'billy', sex: 'male', lookingFor: 'female', zip: '37203'}, function(u){
        expect(u).to.be.ok;
        expect(u).to.be.an.instanceof(User);
        expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(u.password).to.have.length(60);
        expect(u.name).to.equal('billy');
        expect(u.zip).to.equal('37203');
        expect(u.bodyType).to.equal('Otter');
        done();
      });
    });

    it('should NOT successfully register a user - user already exists', function(done){
      User.create({email:'sue@aol.com', password:'does not matter', name: 'sue', zip: '37203'}, function(u){
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
      User.login({email:'sue@aol.com', password:'5678'}, function(u){
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
      User.login({email:'sue@aol.com', password:'wrong'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });

  describe('.findById', function () {
    it('should return a user with matching credentials', function (done) {
      User.findById('0123456789abcdef01234568', function (user) {
        expect(user).to.be.ok;
        expect(user).to.be.instanceof(User);
        expect(user.email).to.equal('sue@aol.com');
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
      User.findById('0123456789abcdef01234568', function (user) {
        user.name = 'susan';
        user.save(function (user) {
          expect(user).to.be.ok;
          expect(user).to.be.instanceof(User);
          expect(user.email).to.equal('sue@aol.com');
          expect(user.name).to.equal('susan');
          expect(user.zip).to.equal('37203');
          done();
        });
      });
    });
  });

  describe('#update', function () {
    it('should update a user', function (done) {
      User.findById('0123456789abcdef01234568', function (user) {

        var obj = {
          sex: 'female',
          race: 'black',
          religion: 'Jewish',
          bodyType: 'hourglass with extra minutes',
          height: '5-6',
          about: 'I am a successful, independent black woman looking for love.'
        };

        user.update(obj, function (user) {
          expect(user).to.be.ok;
          expect(user).to.be.instanceof(User);
          expect(user._id).to.be.instanceof(Mongo.ObjectID);
          expect(user._id.toString()).to.deep.equal('0123456789abcdef01234568');
          expect(user.email).to.equal('sue@aol.com');
          expect(user.zip).to.equal('37203');
          expect(user.sex).to.equal('female');
          expect(user.race).to.equal('black');
          expect(user.religion).to.equal('Jewish');
          expect(user.bodyType).to.equal('hourglass with extra minutes');
          expect(user.height).to.equal('5-6');
          expect(user.about).to.equal('I am a successful, independent black woman looking for love.');
          done();
        });
      });
    });
  });

  describe('.findByLocation', function () {
    it('should find a user by their location', function (done) {
      var obj = {zip: '37203'};
      User.findByLocation(obj.zip, function (users) {
        expect(users).to.be.an('array');
        expect(users[0]).to.be.ok;
        expect(users[0]).to.be.instanceof(User);
        expect(users[0]._id).to.be.instanceof(Mongo.ObjectID);
        expect(users[0].zip).to.equal('37203');
        done();
      });
    });
  });

});
