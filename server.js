var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const routes = require('./index.route');

app.use(bodyParser.json())

// Configuring the database
const config = require('./app/config/config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(config.url)
.then(() => {
    console.log("Successfully connected to MongoDB.");    
}).catch(err => {
    console.log('Could not connect to MongoDB.');
    process.exit();
});

app.use('/api', routes);

// Create a Server
var server = app.listen(4040, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("App listening at http://%s:%s", host, port)

})

module.exports = app;