var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const routes = require("./index.route");

app.use(bodyParser.json())

// Configuring the database
const config = require("./app/config/config.js");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(config.url)
	.then(() => {

	}).catch(err => { // eslint-disable-line
		process.exit();
	});

app.use("/api", routes);

// Create a Server
var server = app.listen(4040, function () {

	server.address().address
	server.address().port

	//console.log("App listening at http://%s:%s", host, port)

})

module.exports = app;