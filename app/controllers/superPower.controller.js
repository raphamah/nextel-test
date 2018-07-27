const SuperPower= require('../models/superPower.model.js');
const User = require('../models/user.model.js');
var config = require('../config/config');
const redis = require("redis");
const createRedisClient = require("../config/createRedisClient");
// POST a SuperPower
exports.create = (req, res) => {
    var client = createRedisClient.createRedisClient();

    client.del("superPowers");
    const data = req.body;
    // Create a superPower
    const superPower = new SuperPower({
        name: req.body.name,
        description: req.body.description,
        superHero: req.body.superHero
    });

    // Save a SuperPower in the MongoDB
    superPower.save()
    .then(data => {
        User.methods.publish("SuperPower",superPower._id,"CREATE",req.headers.authorization,config.jwt_secret);
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};


// FETCH all SuperPowers
exports.findPaginate = (req, res) => {
    var client = createRedisClient.createRedisClient();
    client.hgetall("superPowers-"+req.query.page+'-'+req.query.limit, function (err, obj) {
        if(err || !obj)
        {
            SuperPower.paginate({}, { page: req.query.page, limit: req.query.limit })
            .then(superPowers => {
                res.send(superPowers);
                client.hmset(["superPowers-"+req.query.page+'-'+req.query.limit, "superPowers"], superPowers);
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


// FIND a SuperPower
exports.findOne = (req, res) => {
    var client = createRedisClient.createRedisClient();
    client.hgetall("superPower-"+req.params.id, function (err, obj) {
        if(err || !obj)
        {
            SuperPower.findById(req.params.id)
            .then(superPower => {
                if(!superPower) {
                    return res.status(404).send({
                        message: "SuperPower not found with id " + req.params.id
                    });            
                }
                res.send(superPower);
                client.hmset(["superPower-"+req.params.id, "superPowers"], superPowers);
            }).catch(err => {
                if(err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "SuperPower not found with id " + req.params.id
                    });                
                }
                return res.status(500).send({
                    message: "Error retrieving SuperPower with id " + req.params.id
                });
            });
        }
        else
        {
            res.send(obj);
        }
    });
};

// UPDATE a SuperPower
exports.update = (req, res) => {
    var client = createRedisClient.createRedisClient();

    client.del("superPowers");
    // Find SuperPower and update it
    SuperPower.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(superPower => {
        if(!superPower) {
            return res.status(404).send({
                message: "SuperPower not found with id " + req.params.id
            });
        }
        User.methods.publish("SuperPower",superPower._id,"UPDATE",req.headers.authorization,config.jwt_secret);
        res.send(superPower);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "SuperPower not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating SuperPower with id " + req.params.id
        });
    });
};

// DELETE a superPower
exports.delete = (req, res) => {
    var client = createRedisClient.createRedisClient();

    client.del("superPowers");

    SuperPower.find({id: req.params.id}, function(err, superPower) {
        if (err)
            res.send(err);

        if( superPower.superHero != null)
        {
            return res.status(404).send({
                message: "SuperPower cant be deleted"
            });
        }
        SuperPower.findByIdAndRemove(req.params.id)
        .then(superPower => {
            if(!superPower) {
                return res.status(404).send({
                    message: "SuperPower not found with id " + req.params.id
                });
            }
            User.methods.publish("SuperPower",superPower._id,"DELETE",req.headers.authorization,config.jwt_secret);
            res.send({message: "SuperPower deleted successfully!"});
        }).catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "SuperPower not found with id " + req.params.id
                });                
            }
            return res.status(500).send({
                message: "Could not delete superPower with id " + req.params.id
            });
        });
    });
    
};