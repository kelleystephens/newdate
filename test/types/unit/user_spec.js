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
      User.create({email:'billy@aol.com', password:'1234', name: 'billy', zip: '37203'}, function(u){
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

  // describe('.findById', function () {
  //   it('should return a user with matching credentials', function (done) {
  //     User.findById(sue._id, function (user) {
  //       expect(user).to.be.instanceof(User);
  //       expect(user.email).to.equal(sue.email);
  //       done();
  //     });
  //   });
  //
  //   it('should return a null user object', function (done) {
  //     User.findById('538de154065c89565f9bde6c', function (user) {
  //       expect(user).to.be.null;
  //       done();
  //     });
  //   });
  // });


});
