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
var moment = require('moment');

var Message;

describe('Message', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(){
      Message = traceur.require(__dirname + '/../../../app/models/message.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('messages').remove(function(){
      factory('message', function(messages){
        done();
      });
    });
  });

  describe('.create', function(){
    it('should successfully create a message', function(done){
      var obj = {
        fromUserId:'0123456789abcdef01234567',
        toUserId:'0123456789abcdef01234568',
        to: 'George Hamilton',
        subject:'Hot stuff',
        body:'Hey there good lookin.',
      };

      Message.create(obj, function(m){
        expect(m).to.be.ok;
        expect(m).to.be.an.instanceof(Message);
        expect(m._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(m.fromUserId.toString()).to.equal('0123456789abcdef01234567');
        expect(m.toUserId.toString()).to.equal('0123456789abcdef01234568');
        expect(m.to).to.equal('George Hamilton');
        expect(moment(m.sentDate).format('MM/DD/YYYY')).to.equal(moment().format('MM/DD/YYYY'));
        expect(m.subject).to.equal('Hot stuff');
        expect(m.body).to.equal('Hey there good lookin.');
        expect(m.isRead).to.not.be.ok;
        done();
      });
    });
  });

  describe('.findAllByToUserId', function () {
    it('should find messages by a users Id', function (done) {
      Message.findAllByToUserId('0123456789abcdef01234568', function (messages) {
        expect(messages).to.be.ok;
        expect(messages).to.be.an('array');
        expect(messages[0]).to.be.instanceof(Message);
        // expect(messages[0].subject).to.equal('Hot stuff');
        done();
      });
    });
  });

  describe('.findAllByFromUserId', function () {
    it('should find messages by a users Id', function (done) {
      Message.findAllByFromUserId('0123456789abcdef01234567', function (messages) {
        expect(messages).to.be.ok;
        expect(messages).to.be.an('array');
        expect(messages[0]).to.be.instanceof(Message);
        // expect(messages[0].subject).to.equal('Hot stuff');
        done();
      });
    });
  });

  describe('.findById', function () {
    it('should find a message by its id', function (done) {
      Message.findById('539260a9db70807210dcda66', function (message) {
        expect(message).to.be.ok;
        expect(message._id.toString()).to.equal('539260a9db70807210dcda66');
        expect(message).to.be.instanceof(Message);
        done();
      });
    });
  });

  describe('#read', function () {
    it('should set a message status to read', function (done) {
      Message.findById('539260a9db70807210dcda66', function (message) {
        message.read(function (m) {
          expect(m).to.be.ok;
          expect(m.isRead).to.be.true;
          expect(m._id.toString()).to.equal('539260a9db70807210dcda66');
          expect(m).to.be.instanceof(Message);
          done();
        });
      });
    });
  });
  //
  // describe('.findAll', function () {
  //   it('should find all activity activities', function (done) {
  //     Activity.findAll(function (activities) {
  //       expect(activities).to.be.an('array');
  //       expect(activities[0]).to.be.ok;
  //       expect(activities[0]).to.be.instanceof(Activity);
  //       expect(activities[0]._id).to.be.instanceof(Mongo.ObjectID);
  //       done();
  //     });
  //   });
  // });
  //
  // describe('.findById', function () {
  //   it('should return an activity with matching credentials', function (done) {
  //     Activity.findById('0123456789abcdef01234568', function (activity) {
  //       expect(activity).to.be.ok;
  //       expect(activity).to.be.instanceof(Activity);
  //       expect(activity._id.toString()).to.equal('0123456789abcdef01234568');
  //       done();
  //     });
  //   });
  // });

});
