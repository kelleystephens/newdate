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

var Activity;

describe('Activity', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(){
      Activity = traceur.require(__dirname + '/../../../app/models/activity.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('activities').remove(function(){
      factory('activity', function(activities){
        done();
      });
    });
  });

  describe('.create', function(){
    it('should successfully create an activity', function(done){
      var obj = {
        name:'Derping',
        date:'6/13/2014',
        description:'Join us for some serious herpderp.',
        address:'91 Herp Lane, Suite 108, Brentwood, TN 37208',
        lat: '87.124235356',
        lng: '92.249863579847',
        tags:'herping, derping'
      };

      Activity.create(obj, function(a){
        expect(a).to.be.ok;
        expect(a).to.be.an.instanceof(Activity);
        expect(a._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(a.name).to.equal('Derping');
        expect(moment(a.date).format('MM/DD/YYYY')).to.equal('06/13/2014');
        expect(a.userIds.length).to.equal(0);
        expect(a.description).to.equal('Join us for some serious herpderp.');
        expect(a.address).to.equal('91 Herp Lane, Suite 108, Brentwood, TN 37208');
        expect(a.coordinates).to.be.an('array');
        expect(a.coordinates[0].toString()).to.equal('87.124235356');
        expect(a.coordinates[1].toString()).to.equal('92.249863579847');
        expect(a.tags).to.be.an('array');
        expect(a.tags[0]).to.equal('herping');
        expect(a.tags[1]).to.equal('derping');
        done();
      });
    });
  });

  describe('.findByLocation', function () {
    it('should find an activity by a current location', function (done) {
      var obj = {
        lat: '7.345356345',
        lng: '4.30430594'
      };

      Activity.findByLocation(obj, function (activities) {
        expect(activities).to.be.ok;
        expect(activities).to.be.an('array');
        expect(activities[0]).to.be.instanceof(Activity);
        expect(activities[0].name).to.equal('Happy Hour');
        done();
      });
    });
  });

  describe('.findAll', function () {
    it('should find all activity activities', function (done) {
      Activity.findAll(function (activities) {
        expect(activities).to.be.an('array');
        expect(activities[0]).to.be.ok;
        expect(activities[0]).to.be.instanceof(Activity);
        expect(activities[0]._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.findById', function () {
    it('should return an activity with matching credentials', function (done) {
      Activity.findById('0123456789abcdef01234568', function (activity) {
        expect(activity).to.be.ok;
        expect(activity).to.be.instanceof(Activity);
        expect(activity._id.toString()).to.equal('0123456789abcdef01234568');
        done();
      });
    });
  });
  // describe('.login', function(){
  //   it('should successfully login an activity', function(done){
  //     Activity.login({email:'sue@aol.com', password:'5678'}, function(a){
  //       expect(a).to.be.ok;
  //       done();
  //     });
  //   });
  //
  //   it('should NOT login activity - bad email', function(done){
  //     Activity.login({email:'wrong@aol.com', password:'5678'}, function(a){
  //       expect(a).to.be.null;
  //       done();
  //     });
  //   });
  //
  //   it('should NOT login activity - bad password', function(done){
  //     Activity.login({email:'sue@aol.com', password:'wrong'}, function(a){
  //       expect(a).to.be.null;
  //       done();
  //     });
  //   });
  // });
  //
  //
  //   it('should return a null activity object', function (done) {
  //     Activity.findById('538de154065c89565f9bde6c', function (activity) {
  //       expect(activity).to.be.null;
  //       done();
  //     });
  //   });
  // });
  //
  //
  // describe('#update', function () {
  //   it('should update an activity', function (done) {
  //     Activity.findById('0123456789abcdef01234568', function (activity) {
  //
  //       var obj = {
  //         sex: 'female',
  //         race: 'black',
  //         religion: 'Jewish',
  //         bodyType: 'hourglass with extra minutes',
  //         height: '5-6',
  //         about: 'I am a successful, independent black woman looking for love.'
  //       };
  //
  //       activity.update(obj, function (activity) {
  //         expect(activity).to.be.ok;
  //         expect(activity).to.be.instanceof(Activity);
  //         expect(activity._id).to.be.instanceof(Mongo.ObjectID);
  //         expect(activity._id.toString()).to.deep.equal('0123456789abcdef01234568');
  //         expect(activity.email).to.equal('sue@aol.com');
  //         expect(activity.zip).to.equal('37203');
  //         expect(activity.sex).to.equal('female');
  //         expect(activity.race).to.equal('black');
  //         expect(activity.religion).to.equal('Jewish');
  //         expect(activity.bodyType).to.equal('hourglass with extra minutes');
  //         expect(activity.height).to.equal('5-6');
  //         expect(activity.about).to.equal('I am a successful, independent black woman looking for love.');
  //         done();
  //       });
  //     });
  //   });
  // });
  //

});
