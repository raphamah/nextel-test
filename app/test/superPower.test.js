var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('../../server.js');
const Role = require('../models/role.model.js');
const User = require('../models/user.model.js');
const SuperPower = require('../models/superPower.model.js');
const jwt = require('jsonwebtoken');
var config = require('../config/config');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
describe('## Super Powers APIs', () => {
    let adminJwtToken = '';
    const superPowerExample = {
        "name":"x-ray vision",
        "description": "Only a test"
    };
    const rootUser = {
        username: "admin",
        password: bcrypt.hashSync("admin", 10),
        roles: [new Role({name: "Admin"})]
    };
    before((done) => {
        new User(rootUser).save().then(function(user) {
            adminJwtToken = jwt.sign({ username: rootUser.username, password: rootUser.password, roles: rootUser.roles}, config.jwt_secret);
            new SuperPower(superPowerExample).save().then(function(aux) {
                done();
            });
        }).catch(done);

    });
    after(function (done) {
        mongoose.models = {};
        mongoose.modelSchemas = {};
        mongoose.connection.close();
        done();
    });
    describe('Testing insert superPower', function(){
        it('it responds with 400 status code if we forget to send name', function(done) {
            request(app)
            .post('/api/super_powers/')
            .set('authorization', adminJwtToken )
            .send({"description": "Only a test"})
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });

        it('it responds with 200 status code if good parameters are passed', function(done) {
            request(app)
            .post('/api/super_powers/')
            .set('authorization', adminJwtToken )
            .send(superPowerExample)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Testing get all superPowers', () => {

        it('it should get all superPowers (with limit and page)', (done) => {
            request(app)
            .get('/api/super_powers/')
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

    describe('Testing get a superPower', () => {
        it('it responds with 404 status code if bad parameters are passed (in this case the id is wrong)', function(done) {
            request(app)
            .get('/api/super_powers/')
            .set('authorization', adminJwtToken )
            .end(function(err, res){
                request(app)
                .get('/api/super_powers/0')
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
            .get('/api/super_powers/')
            .set('authorization', adminJwtToken )
            .end(function(err, res){
                request(app)
                .get('/api/super_powers/'+res.body[0]._id)
                .set('authorization', adminJwtToken )
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
            });
        });
    });

    describe('Testing update a superPower', () => {
        it('it responds with 404 status code if bad parameters are passed (in this case the id is wrong)', function(done) {
            request(app)
            .get('/api/super_powers/')
            .set('authorization', adminJwtToken )
            .end(function(err, res){
                request(app)
                .put('/api/super_powers/0')
                .set('authorization', adminJwtToken )
                .send(superPowerExample)
                .expect(404)
                .end(function(error, response) {
                    if (error) return done(error);
                    done();
                });
            });
        });

        it('it responds with 200 status code if parameters are ok', function(done) {
            request(app)
            .get('/api/super_powers/')
            .set('authorization', adminJwtToken )
            .end(function(err, res){
                request(app)
                .put('/api/super_powers/'+res.body[0]._id)
                .set('authorization', adminJwtToken )
                .send(superPowerExample)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
            });
        });
    });
    describe('Testing delete a superPower', () => {
        it('it responds with 404 status code if bad parameters are passed', function(done) {
            request(app)
            .delete('/api/super_powers/0')
            .set('authorization', adminJwtToken )
            .expect(404)
            .end(function(error, response) {
                if (error) return done(error);
                done();
            });
        });

        it('it responds with 200 status code if _id is correct', function(done) {
            request(app)
            .get('/api/super_powers/')
            .set('authorization', adminJwtToken )
            .end(function(err, res){
                request(app)
                .delete('/api/super_powers/'+res.body[0]._id)
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