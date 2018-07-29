const SuperHero = require("../models/superHero.model.js");
const ProtectionArea = require("../models/protectionArea.model.js");
const User = require("../models/user.model.js");
const config = require("../config/config");
const createRedisClient = require("../config/createRedisClient");
// POST a SuperHero
exports.create = (req, res) => {
	var client = createRedisClient();

	// Create a superHero
	const superHero = new SuperHero({
		name: req.body.name,
		alias: req.body.alias,
		superPowers: req.body.superPowers
	});

	client.del("superHeroes");
	client.del("superPowers");
    
	if(req.body.protectionArea._id)
	{
		SuperHero.protectionArea = req.body.protectionArea._id;
		createSuperHero(superHero);
		return;
	}

	// Save the protection Area first
	const protectionArea = new ProtectionArea({
		name: req.body.protectionArea.name,
		loc: [req.body.protectionArea.coordinates[0],req.body.protectionArea.coordinates[1]],
		radius: req.body.protectionArea.radius
	});

	protectionArea.save()
		.then(protArea => {
			superHero.protectionArea = protArea._id;
			createSuperHero(superHero);
		}).catch(errArea => {
			res.status(500).send({
				message: errArea.message
			});
		});
	function createSuperHero(superHero)
	{

		superHero.save()
			.then(data => {
				User.publish("SuperHero",data._id,"CREATE",req.headers.authorization,config.jwt_secret);
				res.send(data);
			}).catch(err => {
				res.status(500).send({
					message: err.message
				});
			});
	}
};


// FETCH all SuperHeroes
exports.findPaginate = (req, res) => {

	var client = createRedisClient();
	client.hget("superHeroes","superHeroes-"+req.query.page+"-"+req.query.limit, function (err, obj) {
		if(err || !obj)
		{
			SuperHero.paginate({}, { page: req.query.page, limit: req.query.limit })
				.then(superHeroes => {
					let jsonResponse = {
						"resp" : superHeroes
					};
					res.send(jsonResponse);
					client.hmset("superHeroes", ["superHeroes-"+req.query.page+"-"+req.query.limit, JSON.stringify(jsonResponse)], function () {

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

exports.helpMe = (req, res) => {
	var client = createRedisClient();
	client.hget("superHeroes","HelpMe-"+req.query.latitude+"-"+req.query.longitude, function (err, obj) {
		if(err || !obj)
		{
			ProtectionArea.find({
				loc: {
					$near: {
						$geometry: {
							type: "Point",
							coordinates: [req.query.latitude,req.query.longitude]
						},
						$maxDistance: 10000
					}
				} 
			})
				.limit(8)
				.then(protectionAreas => {
					let arr = protectionAreas.map(uniqueId => uniqueId._id);
					SuperHero.find({
						"protectionArea": arr
					})
						.then(superHeroes => {
							let jsonResponse = {
								"resp" : superHeroes
							}
							res.send(jsonResponse);
							client.hmset("superHeroes", ["HelpMe-"+req.query.latitude+"-"+req.query.longitude, JSON.stringify(jsonResponse)], function () {

							});
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


// FIND a SuperHero
exports.findOne = (req, res) => {
	var client = createRedisClient();
	client.hget("superHeroes","superHero-"+req.params.id, function (err, obj) {
		if(err || !obj)
		{
			SuperHero.findById(req.params.id)
				.then(superHero => {
					if(!superHero) {
						return res.status(404).send({
							message: "SuperHero not found with id " + req.params.id
						});            
					}
					let jsonResponse = {
						"resp" : superHero
					}
					res.send(jsonResponse);
					client.hmset("superHeroes", ["superHero-"+req.params.id, JSON.stringify(jsonResponse)] );
				}).catch(err => {
					if(err.kind === "ObjectId") {
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
	var client = createRedisClient();

	client.del("superHeroes");

	// Find SuperHero and update it
	SuperHero.findByIdAndUpdate(req.params.id, req.body, {new: true})
		.then(superHero => {
			if(!superHero) {
				return res.status(404).send({
					message: "SuperHero not found with id " + req.params.id
				});
			}
			User.publish("SuperHero",superHero._id,"UPDATE",req.headers.authorization,config.jwt_secret);
			res.send(superHero);
		}).catch(err => {
			if(err.kind === "ObjectId") {
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
	var client = createRedisClient();

	client.del("superHeroes");

	SuperHero.findByIdAndRemove(req.params.id)
		.then(superHero => {
			if(!superHero) {
				return res.status(404).send({
					message: "SuperHero not found with id " + req.params.id
				});
			}
			User.publish("SuperHero",superHero._id,"DELETE",req.headers.authorization,config.jwt_secret);
			res.send({message: "SuperHero deleted successfully!"});
		}).catch(err => {
			if(err.kind === "ObjectId" || err.name === "NotFound") {
				return res.status(404).send({
					message: "SuperHero not found with id " + req.params.id
				});                
			}
			return res.status(500).send({
				message: "Could not delete superHero with id " + req.params.id
			});
		});
};