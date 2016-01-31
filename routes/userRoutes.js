"use strict";

var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var router = express.Router();

router.post('/register', function (req, res, next) {
    var user = new User();
    user.username = req.body.username;
    user.name_first = req.body.name_first;
    user.name_last = req.body.name_last;
    user.setPassword(req.body.password);
    user.save(function (err, user) {
        if (err) return next(err);
        res.send('Registration Complete. Please login.');
    });
});

router.post('/login', function (req, res, next) {
    if (!req.body.username || !req.body.password)
        return res.status(400).send('Please fill out every field');
    passport.authenticate('local', function (err, user, info) {
        if (err) return next(err);
        if (user) return res.json({ token: user.generateJWT() });
        return res.status(400).send(info);
    })(req, res, next);
});

router.post('/search', function(req, res, next) {
  User.find( { $text: { $search: req.body.search } } )
  .select('username name_last name_first _id')
  .exec(function(err, users) {
      res.send(users);
  });
});

router.post('/add', function(req, res, next) {
  User.findOne({_id: req.body.logged_in_id})
  .exec(function(err, user) {
    user.contacts_list.push(req.body.add_id);
    user.save();
    res.send();
  });
});


module.exports = router;
