var express = require('express');
// var firebase = require("firebase");
var mongoose = require('mongoose');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


// Initialize Firebase
// TODO: Replace with your project's customized code snippet
//  var config = {
//     apiKey: "AIzaSyBr0sEJAfB1XUtFemcFOp8WfBaXEPwV434",
//     authDomain: "simpleonenode.firebaseapp.com",
//     databaseURL: "https://simpleonenode.firebaseio.com",
//     storageBucket: "simpleonenode.appspot.com",
//     messagingSenderId: "889210340292"
//   };
// firebase.initializeApp(config);

// var database = firebase.database();
 mongoose.connect('mongodb://dhamofficial:1qaz2wsx@ds058369.mlab.com:58369/simpleonenode');
//  mongoose.connect('mongodb://localhost/myappdatabase');
 var Schema = mongoose.Schema;
 var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: false },
  password: { type: String, required: true },
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: Date,
  updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;


var chris = new User({
  name: 'Chris',
  username: 'sevilayha',
  password: 'password' 
});

// call the custom method. this will just add -dude to his name
// user will now be Chris-dude
// chris.dudify(function(err, name) {
//   if (err) throw err;

//   console.log('Your new name is ' + name);
// });

// call the built-in save method to save to the database
chris.save(function(err) {
  if (err) throw err;

  console.log('User saved successfully!');
});

User.find({}, function(err, users) {
  if (err) throw err;

  // object of all the users
  console.log(users);
});