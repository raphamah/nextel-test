const SuperPower= require("../models/superPower.model.js");
const User = require("../models/user.model.js");
const config = require("../config/config");
const createRedisClient = require("../config/createRedisClient");
// POST a SuperPower
exports.create = (req, res) => {
	var client = createRedisClient();

	client.del("superPowers");
	// Create a superPower
	const superPower = new SuperPower({
		name: req.body.name,
		description: req.body.description
	});

	// Save a SuperPower in the MongoDB
	superPower.save()
		.then(data => {
			User.publish("SuperPower",superPower._id,"CREATE",req.headers.authorization,config.jwt_secret);
			res.send(data);
		}).catch(err => {
			res.status(500).send({
				message: err.message
			});
		});
};


// FETCH all SuperPowers
exports.findPaginate = (req, res) => {
	var client = createRedisClient();
	client.hget("superPowers","superPowers-"+req.query.page+"-"+req.query.limit, function (err, obj) {
		if(err || !obj)
		{
			SuperPower.paginate({}, { page: req.query.page, limit: req.query.limit })
				.then(superPowers => {
					let jsonResponse = {
						"resp" : superPowers
					};
					res.send(jsonResponse);
					client.hmset("superPowers", ["superPowers-"+req.query.page+"-"+req.query.limit, JSON.stringify(jsonResponse)] , function () {

					});
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
	var client = createRedisClient();
	client.hget("superPowers","superPower-"+req.params.id, function (err, obj) {
		if(err || !obj)
		{
			SuperPower.findById(req.params.id)
				.then(superPower => {
					if(!superPower) {
						return res.status(404).send({
							message: "SuperPower not found with id " + req.params.id
						});            
					}
					let jsonResponse = {
						"resp" : superPower
					};
					res.send(jsonResponse);
					client.hmset("superPowers", ["superPower-"+req.params.id, JSON.stringify(jsonResponse)] );
				}).catch(err => {
					if(err.kind === "ObjectId") {
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
	var client = createRedisClient();

	client.del("superPowers");
	// Find SuperPower and update it
	SuperPower.findByIdAndUpdate(req.params.id, req.body, {new: true})
		.then(superPower => {
			if(!superPower) {
				return res.status(404).send({
					message: "SuperPower not found with id " + req.params.id
				});
			}
			User.publish("SuperPower",superPower._id,"UPDATE",req.headers.authorization,config.jwt_secret);
			res.send(superPower);
		}).catch(err => {
			if(err.kind === "ObjectId") {
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
	var client = createRedisClient();

	client.del("superHeroes");
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
				User.publish("SuperPower",superPower._id,"DELETE",req.headers.authorization,config.jwt_secret);
				res.send({message: "SuperPower deleted successfully!"});
			}).catch(err => {
				if(err.kind === "ObjectId" || err.name === "NotFound") {
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