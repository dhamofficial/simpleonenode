var Todo = require('./models/todo');
var User   = require('./models/user');
var moment = require('moment');
var express 	= require('express');
var jwt    = require('jsonwebtoken');
var dtFormat='LLLL';
var appSettings={};
function getTodos(res) {
    Todo.find({}).sort({updated: 'desc'}).exec(function(err,todos){
        if (err)res.send(err);
        res.json(todos);
    });
    // Todo.find(function (err, todos) {
    //     if (err) {
    //         res.send(err);
    //     }
    //     res.json(todos); // return all todos in JSON format
    // });
};
function getUsers(res) {
    User.find(function (err, records) {
        if (err) {
            res.send(err);
        }
        res.json(records); // return all todos in JSON format
    });
};
function createTodoRoute(req,res){
    var now=moment().format(dtFormat);
    var item={
        text: req.body.text,
        created:now,
        updated:now,
        done: false
    };
    Todo.create(item, function (err, todo) {
        if (err)res.send(err);
        getTodos(res);
    });
}
function updateTodoRoute(req,res){
    var now=moment().format(dtFormat);
    var conditions = { _id: req.params.todo_id }
    , updated = req.body
    , options = { multi: true };
    updated.updated=now;
    Todo.update(conditions, updated, options, function (err, todo) {
        if (err)res.send(err);
        getTodos(res);
    });
}
function getTodosRoute(req,res){
    getTodos(res);
}
function authenticateRoute(req,res){
    var item=req.body;
    var condn={name:item.name,password:item.password};
    console.log('authenticating:',condn);
    User.find(condn, function (err, record) {
        if (err)res.send(err);
        if(record && record.length>0){
            var user=record[0];
            var token = jwt.sign(user, appSettings.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            console.log(user);
            res.send({status:200,message:"login successfull",currentuser:{_id:user._id,name:user.name,email:user.email,token: token}});
        }else{
            return res.status(403).send({ 
                success: false, 
                message: 'Unauthorized'
            });
        }
    });
}
function createUserRoute(req,res){
    var now=moment().format(dtFormat);
    var item=req.body;
    if(item._id!=''){
        User.update({_id:item._id},item, { multi: true },function (err, todo) {
            if (err)res.send(err);
            res.send({status:200,message:"Update successfull."});
        });
    }else{
        User.create(item, function (err, todo) {
            if (err)res.send(err);
            res.send({status:200,message:"User creation successfull."});
        });
    }
}


module.exports = function (app) {
    appSettings.secret=app.get('superSecret');
    // api ---------------------------------------------------------------------
    app.post('/authenticate',authenticateRoute);
      
    // ---------------------------------------------------------
    // route middleware to authenticate and check token
    // ---------------------------------------------------------
    app.use(function(req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        if (req.url === '/favicon.ico') {return;}
        // console.log('authenticating request:',token);

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });		
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;	
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.'
            });
            
        }
        
    });
    var apiRoutes = express.Router(); 
    apiRoutes.put('/todos/:todo_id', updateTodoRoute);
    apiRoutes.post('/todos', createTodoRoute);
    apiRoutes.post('/users', createUserRoute);
    apiRoutes.put('/users/:user_id', createUserRoute);
    apiRoutes.get('/users', function (req, res) {
        getUsers(res);
    });
    apiRoutes.get('/todos', getTodosRoute);
    apiRoutes.get('/check', function(req, res) {
        res.json(req.decoded);
    });
    app.use('/api', apiRoutes);

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
