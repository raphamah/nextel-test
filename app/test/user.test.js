var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('../../server.js');
const Role = require('../models/role.model.js');
const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
var config = require('../config/config');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
describe('## Users APIs', () => {
    let adminJwtToken = '';
    const rootUser = {
        username: "admin",
        password: bcrypt.hashSync("admin", 10),
        roles: [new Role({name: "Admin"})]
    };
    before((done) => {
        new User(rootUser).save().then(function(user) {
            adminJwtToken = jwt.sign({ username: rootUser.username, password: rootUser.password, roles: rootUser.roles}, config.jwt_secret);
            done();
        }).catch(done);
        
    });
    after(function (done) {
        mongoose.models = {};
        mongoose.modelSchemas = {};
        mongoose.connection.close();
        done();
    });
    describe('Testing sign_in', function(){
        it('it responds with 401 status code if bad username or password', function(done) {
            request(app)
            .post('/api/auth/sign_in')
            .send({"username":"bad","password":"wrong"})
            .expect(401)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });

        it('it responds with 200 status code if good username or password', function(done) {
            request(app)
            .post('/api/auth/sign_in')
            .send({"username":"admin","password":"admin"})
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });

        it('it returns JWT token if good username or password', function(done) {
            request(app)
            .post('/api/auth/sign_in')
            .send({"username":"admin","password":"admin"})
            .end(function(err, res) {
                if (err) return done(err);

                expect(res.body).have.property('token');

                done();
            });
        });
    });

    describe('Testing register', function(){
        it('it responds with 400 status code if bad parameters are passed', function(done) {
            request(app)
            .post('/api/auth/')
            .send({"username":"admin","password":"admin", "roles": ["Wrong"]})
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });

        it('it responds with 200 status code if good username, password and roles', function(done) {
            request(app)
            .post('/api/auth/')
            .send(userExample)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Testing get all users', () => {

        it('it should get all users (with limit and page)', (done) => {
            request(app)
            .get('/api/user/')
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

    describe('Testing update a user', () => {
        it('it responds with 400 status code if bad parameters are passed', function(done) {
            request(app)
            .get('/api/user/')
            .set('authorization', adminJwtToken )
            .end(function(err, res){
                request(app)
                .put('/api/user/'+res.body[0]._id)
                .set('authorization', adminJwtToken )
                .send('{"username":"admin","password":"admin", "roles": ["Wrong"]}')
                .expect(400)
                .end(function(error, response) {
                    if (error) return done(error);
                    done();
                });
            });
        });

        it('it responds with 200 status code if good username, password and roles', function(done) {
            request(app)
            .get('/api/user/')
            .set('authorization', adminJwtToken )
            .end(function(err, res){
                request(app)
                .put('/api/user/'+res.body[0]._id)
                .set('authorization', adminJwtToken )
                .send(userExample)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
            });
        });
    });
    describe('Testing delete a user', () => {
        it('it responds with 404 status code if bad parameters are passed', function(done) {
            request(app)
            .delete('/api/user/0')
            .set('authorization', adminJwtToken )
            .expect(400)
            .end(function(error, response) {
                if (error) return done(error);
                done();
            });
        });

        it('it responds with 200 status code if _id is correct', function(done) {
            request(app)
            .get('/api/user/')
            .set('authorization', adminJwtToken )
            .end(function(err, res){
                request(app)
                .delete('/api/user/'+res.body[0]._id)
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