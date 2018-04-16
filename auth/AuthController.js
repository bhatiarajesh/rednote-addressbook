var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var VerifyToken = require('./VerifyToken');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file
var
md5        = require('MD5');
db = require('../db');

router.get('/login', (req, res) => {
  res.render('login-form');
});

// authenticate user
router.post('/login', function (req, res) {
    //console.log(req);
    var userPassword = md5(req.body.password).substring(0,15);
    var q  = "SELECT * FROM users WHERE username = '" + req.body.username + "'";
    db.query(q, function (err, result) {
        if (err) { return res.status(500).send('Error on the server.'); }
        //console.log(result);
        if (result.rowCount == 0) { return res.status(404).send('No user found.');}
        var jsonData = JSON.parse(JSON.stringify(result.rows));
        if (jsonData == undefined) { return res.status(404).send('No user found.')};
        var passwordDB = jsonData[0].password;
        var usernameDB = jsonData[0].username;
        var idDB = jsonData[0].id;
        if (result.rowCount && userPassword === passwordDB) {
             // if user is found and password is valid
             // create a token
             var token = jwt.sign({ id: idDB }, config.secret, {
               expiresIn: 86400 // expires in 24 hours
             });

             // return the information including token as JSON
             var nextLocation = '/api/users/contacts/'+ idDB;
             res.setHeader('Location', nextLocation);
             res.setHeader('x-access-token',token);
             res.status(200).send({ auth: true, token: token, location : nextLocation});
             //res.status(200).redirect('/api/users/contacts/'+ idDB); //.send({ auth: true, token: token });
        } else {
          return res.status(401).send({ auth: false, token: null });
        }
    });
});

//present register user form
router.get('/register', (req, res) => {
  res.render('register-form');
});

// register user
router.post('/register', function (req, res) {
    //console.log(req);
    // See if a user is already registered with the same username. If yes, return a 201 status code and a valid token
    var q  = "SELECT * FROM users WHERE username = '" + req.body.username + "'";
    db.query(q, function (err, result) {
        if (err) { return res.status(500).send('Error on the server retriving the user details.'); }
        //console.log(' result from an already registered account ');
        //console.log(result);
        if (result.rowCount > 0) {
            return res.redirect(409,'login');}
        else {
            var q1, values;
            values1 = [
                req.body.username,
                md5(req.body.password).substring(0,15)
            ];
            q1 = 'INSERT INTO users (username,password) VALUES ($1,$2) RETURNING *';
            db.query(q1, values1, function (err, result) {
                if (err) { return res.status(500).send("There was a problem registering the user`."); }
                if (result.rowCount == 0) { return res.status(500).send("There was a problem retrieving the registered user details`.");}
                var jsonData = JSON.parse(JSON.stringify(result.rows));
                if (jsonData == undefined) { return res.status(500).send("There was a problem parsing the registered user details`.");};
                var passwordDB = jsonData[0].password;
                var usernameDB = jsonData[0].username;
                var idDB = jsonData[0].id;

                // if user is registered without errors
                // create a token
                var token = jwt.sign({ id: idDB }, config.secret, {
                  expiresIn: 86400 // expires in 24 hours
                });

             // return the information including token as JSON
             var nextLocation = '/api/users/contacts/'+ idDB;
             res.setHeader('Location', nextLocation);
             res.setHeader('x-access-token',token);
             res.status(200).send({ auth: true, token: token, location : nextLocation});
            });
        }
     });

});

// logout
router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

// protected about-me profile page
router.get('/profile/:userid', VerifyToken, function(req, res, next) {
  var q  = "SELECT * FROM users WHERE id = '" + req.params.userid + "'";
  db.query(q, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    //console.log(req.userid);
    res.status(200).send(user.rows[0]);
  });

});

module.exports = router;