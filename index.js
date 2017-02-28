// set up ======================================================================
var express = require('express');
var app = express(); 						// create our app w/ express
var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 8080; 				// set the port
var database = require('./config/database'); 			// load the database config
var config = require('./config/config');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var jwt = require('jsonwebtoken');


// configuration ===============================================================
app.set('superSecret', config.secret);
app.use(express.static('./public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

console.log('-------------------------------------');
var args = process.argv.slice(2);
var mode=args[0] && args[0]!=''?args[0]:'dev';
console.log('mode:',mode);
console.log('-------------------------------------');
var dbUrl=database.localUrl;
if(mode=='remote')dbUrl=database.remoteUrl;
mongoose.connect(dbUrl);
// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
