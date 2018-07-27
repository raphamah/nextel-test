const SuperHero = require('../models/superHero.model.js');
const User = require('../models/user.model.js');
var config = require('../config/config');
const redis = require("redis");
const createRedisClient = require("../config/createRedisClient");
// POST a SuperHero
exports.create = (req, res) => {
    
    var client = createRedisClient.createRedisClient();
    
    // Create a superHero
    const superHero = new SuperHero({
        name: req.body.name,
        alias: req.body.alias,
    });

    client.del("superHeroes");
    // Save a SuperHero in the MongoDB
    superHero.save()
    .then(data => {
        
        User.methods.publish("SuperHero",data._id,"CREATE",req.headers.authorization,config.jwt_secret);
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};


// FETCH all SuperHeroes
exports.findPaginate = (req, res) => {
    var client = createRedisClient.createRedisClient();

    client.hgetall("superHeroes-"+req.query.page+"-"+req.query.limit, function (err, obj) {
        if(err || !obj)
        {
            SuperHero.paginate({}, { page: req.query.page, limit: req.query.limit })
            .then(superHeroes => {
                res.send(superHeroes);
                client.hmset(["superHeroes-"+req.query.page+"-"+req.query.limit, "superHeroes"], superHeroes);
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

exports.helpMe = (req, res) => {
    var client = createRedisClient.createRedisClient();
    client.hgetall("HelpMe-"+req.query.latitude+"-"+req.query.longitude, function (err, obj) {
        if(err || !obj)
        {
            SuperHero.find({
                loc: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [req.query.latitude,req.query.longitude]
                        },
                        $maxDistance: 10
                    }
                } 
            })
            .limit(8)
            .then(superHeroes => {
                res.send(superHeroes);
                client.hmset(["HelpMe-"+req.query.latitude+"-"+req.query.longitude, "superHeroes"], superHeroes);
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


// FIND a SuperHero
exports.findOne = (req, res) => {
    var client = createRedisClient.createRedisClient();
    client.hgetall("superHero-"+req.params.id, function (err, obj) {
        if(err || !obj)
        {
            SuperHero.findById(req.params.id)
            .then(superHero => {
                if(!superHero) {
                    return res.status(404).send({
                        message: "SuperHero not found with id " + req.params.id
                    });            
                }
                res.send(superHero);
                client.hmset(["superHero-"+req.params.id, "superHeroes"], superHero);
            }).catch(err => {
                if(err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "SuperHero not found with id " + req.params.id
                    });                
                }
                return res.status(500).send({
                    message: "Error retrieving SuperHero with id " + req.params.id
                });
            });
        }
        else
        {
            res.send(obj);
        }
    });
};

// UPDATE a SuperHero
exports.update = (req, res) => {
    var client = createRedisClient.createRedisClient();

    client.del("superHeroes");

    // Find SuperHero and update it
    SuperHero.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(superHero => {
        if(!superHero) {
            return res.status(404).send({
                message: "SuperHero not found with id " + req.params.id
            });
        }
        User.methods.publish("SuperHero",superHero._id,"UPDATE",req.headers.authorization,config.jwt_secret);
        res.send(superHero);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "SuperHero not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating SuperHero with id " + req.params.id
        });
    });
};

// DELETE a superHero
exports.delete = (req, res) => {
    var client = createRedisClient.createRedisClient();

    client.del("superHeroes");

    SuperHero.findByIdAndRemove(req.params.id)
    .then(superHero => {
        if(!superHero) {
            return res.status(404).send({
                message: "SuperHero not found with id " + req.params.id
            });
        }
        User.methods.publish("SuperHero",superHero._id,"DELETE",req.headers.authorization,config.jwt_secret);
        res.send({message: "SuperHero deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "SuperHero not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete superHero with id " + req.params.id
        });
    });
};