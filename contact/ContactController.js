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
var
md5        = require('MD5');
db = require('../db');

// GET all contacts
router.get('/list', VerifyToken, (req, res) => {
    db.query('SELECT * FROM contacts c ORDER BY c.lastname', (err, results) => {
      if (err) { return res.status(500).send("There was a problem finding the list of contacts."); }
      //console.log('results', results);
      if (!results) { return res.status(404).send("No contacts found.") };
      res.json(results.rows); // JSON response
      //res.render('addressbook-list', results);
    });

});

// GET add user
router.get('/add/:userid', (req, res) => {
  res.userid = req.params.userid;
  res.render('addressbook-form',res);
});

// POST create new contact
router.post('/add/:userid', VerifyToken, function (req, res) {

    var q1, q2, values1, values2;

    values1 = [
        req.params.userid,
        req.body.firstname,
        req.body.lastname,
        req.body.phone
    ];
    q1 = 'INSERT INTO contacts (userid,firstname,lastname,phone) VALUES ($1,$2,$3,$4) RETURNING *';

    db.query(q1, values1, function (err, result) {
        if (err) { return res.status(500).send('There was a problem creating contact on the server.');  }
        //console.log(result);
        var nextLocation = '/api/users/contacts/'+ req.params.userid;
        res.setHeader('Location', nextLocation);
        res.status(200).json(result.rows);
        //res.status(200).redirect('/api/users/contacts/'+req.params.userid);
    });
});

//GET edit contact
router.get('/update/:id', (req, res) => {
  res.id = req.params.id;
  //console.log(req);
  //console.log(res);
  q = 'SELECT * from contacts WHERE id = ' + req.params.id;

  db.query(q, function (err, result) {
      if (err) { return res.status(500).send('There was a problem updating a contact on the server.'); }
      var token = req.headers['x-access-token'];
      result.token = token;
      res.status(200);
      res.render('addressbook-update-form',result);
  });
});

// POST edit contact
router.post('/update/:id/users/:userid', VerifyToken, function (req, res) {

    var q, values;

    values = [
        req.body.firstname,
        req.body.lastname,
        req.body.phone    ];

    q = 'UPDATE contacts SET firstname = $1, lastname = $2, phone = $3 WHERE id = ' + req.params.id + ' RETURNING *';

    db.query(q, values, function (err, result) {
        if (err) { return res.status(500).send('There was a problem updating a contact on the server.'); }
        //res.send(result);
        var nextLocation = '/api/users/contacts/'+ result.rows[0].userid;
        res.setHeader('Location', nextLocation);
        res.status(200).json(result.rows);
        //res.status(200).redirect('/api/users/contacts/'+result.rows[0].userid);

    });
});

// DELETE delete contact
router.post('/delete/:id/users/:userid', VerifyToken, function (req, res) {
    var q = 'DELETE FROM contacts WHERE id = ' + req.params.id;
    db.query(q, function (err, result) {
        if (err) { return res.status(500).send('There was a problem deleting a contact on the server.'); }
        //console.log(result);
        var nextLocation = '/api/users/contacts/'+ req.params.userid;
        res.setHeader('Location', nextLocation);
        res.status(200).json(result);
        //res.status(200).redirect('/api/users/contacts/'+req.params.userid);

    });
});

module.exports = router;