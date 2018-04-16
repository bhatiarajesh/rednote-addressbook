var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var VerifyToken = require(__root + 'auth/VerifyToken');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
//var User = require('../user/User');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file
var md5 = require('MD5');
db = require('../db');

// GET all contacts for a user
router.get('/contacts/:userid', VerifyToken, (req, res) => {
    //console.log(req);
    db.query('SELECT * FROM contacts where userid =' + req.params.userid + ' ORDER BY lastname', (err, results) => {
      if (err) { return res.status(500).send('There was a problem retrieving a list of contacts for a user.'); }
      results.userid = req.params.userid;
      //console.log('results', results);
      res.status(200).render('addressbook-list', results);
    });
});

// update user
router.post('/api/updateUser/:id', function (req, res) {
    var
        isUpdatingPassword = req.body.oldpassword !== undefined && req.body.newpassword !== undefined,
        q, fields, values, pw
    ;

    if (isUpdatingPassword) {
        pw     = md5(req.body.oldpassword).substring(0,15);
        q      = "UPDATE users SET username = ?, password = ? WHERE id = " + req.params.id + " AND password = '" + pw + "'";
        values = [ req.body.username, md5(req.body.newpassword) ];
    }
    else {
        q      = 'UPDATE users SET username = ? WHERE id = ' + req.params.id;
        values = [req.body.username];
    }

    db.query(q, values, function (err, result) {
        if (err) { console.log(err); }
        res.json(result);
    });
});

module.exports = router;