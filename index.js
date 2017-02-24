var express = require('express');
var firebase = require("firebase");
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
 var config = {
    apiKey: "AIzaSyBr0sEJAfB1XUtFemcFOp8WfBaXEPwV434",
    authDomain: "simpleonenode.firebaseapp.com",
    databaseURL: "https://simpleonenode.firebaseio.com",
    storageBucket: "simpleonenode.appspot.com",
    messagingSenderId: "889210340292"
  };
firebase.initializeApp(config);


var FirebaseClient = require('firebase-client');
var firebaseCli = new FirebaseClient({
  url: "https://simpleonenode.firebaseio.com/",
  auth: "AIzaSyBr0sEJAfB1XUtFemcFOp8WfBaXEPwV434"
});

firebaseCli
.push('example', { value: true });
console.log('set');

var v=firebaseCli.get('example');
console.log('get=',v);