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
var cp = require('child_process');

var Activity;
var User;

describe('Activity', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(){
      Activity = traceur.require(__dirname + '/../../../app/models/activity.js');
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('activities').remove(function(){
      factory('activity', function(activities){

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
    });
  });

  describe('.create', function(){
    it('should successfully create an activity', function(done){
      var obj = {
        name:'Derping',
        date:'6/13/2014',
        description:'Join us for some serious herpderp.',
        address:'91 Herp Lane, Suite 108, Brentwood, TN 37208',
        coordinates: ['87.124235356', '92.249863579847'],
        tags:'herping, derping'
      };

      Activity.create(obj, function(a){
        expect(a).to.be.ok;
        expect(a).to.be.an.instanceof(Activity);
        expect(a._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(a.name).to.equal('Derping');
        expect(moment(a.date).format('MM/DD/YYYY')).to.equal('06/13/2014');
        expect(a.attendees.length).to.equal(0);
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
      var obj= {coordinates: ['7.345356345', '4.30430594']};

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
      Activity.findById('1234567890abcdef12345678', function (activity) {
        expect(activity).to.be.ok;
        expect(activity).to.be.instanceof(Activity);
        expect(activity._id.toString()).to.equal('1234567890abcdef12345678');
        done();
      });
    });
  });

  describe('#rsvp', function () {
    it('should RSVP the user to the event', function (done) {
      User.findById('0123456789abcdef01234567', function (user) {
        Activity.findById('1234567890abcdef12345678', function (activity) {
          activity.rsvp(user, function (activity) {
            expect(activity).to.be.ok;
            expect(activity).to.be.instanceof(Activity);
            expect(activity._id.toString()).to.equal('1234567890abcdef12345678');
            done();
          });
        });
      });
    });
  });

});
