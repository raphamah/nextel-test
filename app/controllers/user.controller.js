const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redis = require("redis");
const createRedisClient = require("../config/createRedisClient");
var config = require('../config/config');
exports.register = function(req, res){
    var client = createRedisClient.createRedisClient();

    client.del("users");
    var newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(req.body.password, 10);
    newUser.save(function(err, user) {
        if (err) {
          return res.status(400).send({
            message: err
          });
        } else {
          user.password = undefined;
          return res.json(user);
        }
    });
}

exports.findPaginate = (req, res) => {
    var client = createRedisClient.createRedisClient();
    client.hgetall("users-"+req.query.page+'-'+req.query.limit, function (err, obj) {
        if(err || !obj)
        {
            User.paginate({}, { page: req.query.page, limit: req.query.limit })
            .then(users => {
                res.send(users);
                client.hmset(["users-"+req.query.page+'-'+req.query.limit, "users"], users);
            }).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });
        }
        else
        {
            res.send(obj);
        }
    });
};


exports.update = function(req, res){
    var client = createRedisClient.createRedisClient();

    client.del("users");
    if(req.body.password != undefined && req.body.password != null)
    {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.id
        });
    });
}

exports.delete = function(req, res){
    var client = createRedisClient.createRedisClient();

    client.del("users");
    User.findByIdAndRemove(req.params.id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.id
        });
    });
}

exports.sign_in = function(req, res) {
    User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err) throw err;
        if (!user || !user.comparePassword(req.body.password)) {
          return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
        }
        return res.json({ token: jwt.sign({ username: user.username, password: user.password, roles: user.roles}, config.jwt_secret) });
    });
};

exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};