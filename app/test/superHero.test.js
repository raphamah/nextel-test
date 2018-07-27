var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('../../server.js');
const Role = require('../models/role.model.js');
const User = require('../models/user.model.js');
const SuperHero = require('../models/superHero.model.js');
const ProtectionArea = require('../models/protectionArea.model.js');
const jwt = require('jsonwebtoken');
var config = require('../config/config');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const Cleaner = require('database-cleaner');
const dbCleaner = new Cleaner('mongodb');
describe('## Super Heroes APIs', () => {
    let adminJwtToken = '';
    const superHeroExample = {
        "name":"Iron Man",
        "alias":"Tony Stark",
        "protectionArea": new ProtectionArea({
            "name" : "Gotham",
            "loc" : [20.00000,20.00000],
            "radius" : 20.00
        })
    };
    const rootUser = {
        username: "admin",
        password: bcrypt.hashSync("admin", 10),
        roles: [new Role({name: "Admin"})]
    };
    before((done) => {
        mongoose.connect(config.url, function (err) {
            dbCleaner.clean(mongoose.connection.db, () => {
                done();
            });
        });
    });
    after(function (done) {
        mongoose.models = {};
        mongoose.modelSchemas = {};
        mongoose.connection.close();
        done();
    });
    it('Seeder', function(done) {
        new User(rootUser).save().then(function(user) {
            adminJwtToken = jwt.sign({ username: rootUser.username, password: rootUser.password, roles: rootUser.roles}, config.jwt_secret);
            new SuperHero(superHeroExample).save().then(function(aux) {
                done();
            });
        }).catch(done);
    });
    describe('Testing insert superHero', function(){

        it('it responds with 400 status code if we forget to send name or alias', function(done) {
            request(app)
            .post('/api/super_heroes/')
            .set('authorization', adminJwtToken )
            .send({"alias":"Tony Stark", "protectionArea": { "name" : "Gotham", "loc" : [20.00000,20.00000], "radius" : 20.00}})
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });

        it('it responds with 200 status code if good parameters are passed', function(done) {
            request(app)
            .post('/api/super_heroes/')
            .set('authorization', adminJwtToken )
            .send(superHeroExample)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Testing get all superHeroes', () => {

        it('it should get all superHeroes (with limit and page)', (done) => {
          request(app)
            .get('/api/super_heroes/')
            .set('authorization', adminJwtToken )
            .query({ limit: 10, page: 1 })
            .expect(200)
            .then((res) => {
              expect(res.body).to.be.an('array');
              done();
            })
            .catch(done);
        });
    });

    describe('Testing get Help Me Super Heroes', () => {
        it('it should get parameters erros (latitude and longitude missing)', (done) => {
            request(app)
            .get('/api/super_heroes/help')
            .set('authorization', adminJwtToken )
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });

        it('it should get all superHeroes', (done) => {
            request(app)
            .get('/api/super_heroes/help')
            .set('authorization', adminJwtToken )
            .query({ latitude: 20.00000, longitude: 20.00000 })
            .expect(200)
            .then((res) => {
              expect(res.body).to.be.an('array');
              done();
            })
            .catch(done);
        });
    });
        
    describe('Testing get a superHero', () => {
        it('it responds with 404 status code if bad parameters are passed (in this case the id is wrong)', function(done) {
            request(app)
            .get('/api/super_heroes/')
            .set('authorization', adminJwtToken )
            .end(function(err, res){
                request(app)
                .get('/api/super_heroes/id/0')
                .set('authorization', adminJwtToken )
                .expect(404)
                .end(function(error, response) {
                    if (error) return done(error);
                    done();
                });
            });
        });

        it('it responds with 200 status code if parameters are ok', function(done) {
            request(app)
            .get('/api/super_heroes/')
            .set('authorization', adminJwtToken )
            .end(function(err, res){
                request(app)
                .get('/api/super_heroes/id/'+res.body[0]._id)
                .set('authorization', adminJwtToken )
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
            });
        });
    });
    describe('Testing update a superHero', () => {
        it('it responds with 404 status code if bad parameters are passed (in this case the id is wrong)', function(done) {
            request(app)
            .get('/api/super_heroes/')
            .set('authorization', adminJwtToken )
            .end(function(err, res){
                request(app)
                .put('/api/super_heroes/id/0')
                .set('authorization', adminJwtToken )
                .send(superHeroExample)
                .expect(404)
                .end(function(error, response) {
                    if (error) return done(error);
                    done();
                });
            });
        });

        it('it responds with 200 status code if parameters are ok', function(done) {
            request(app)
            .get('/api/super_heroes/')
            .set('authorization', adminJwtToken )
            .end(function(err, res){
                request(app)
                .put('/api/super_heroes/id/'+res.body[0]._id)
                .set('authorization', adminJwtToken )
                .send(superHeroExample)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
            });
        });
    });
    describe('Testing delete a superHero', () => {
        it('it responds with 404 status code if bad parameters are passed', function(done) {
            request(app)
            .delete('/api/super_heroes/id/0')
            .set('authorization', adminJwtToken )
            .expect(404)
            .end(function(error, response) {
                if (error) return done(error);
                done();
            });
        });

        it('it responds with 200 status code if _id is correct', function(done) {
            request(app)
            .get('/api/super_heroes/')
            .set('authorization', adminJwtToken )
            .end(function(err, res){
                request(app)
                .delete('/api/super_heroes/id/'+res.body[0]._id)
                .set('authorization', adminJwtToken )
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
            });
        });
    });
});