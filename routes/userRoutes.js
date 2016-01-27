"use strict";

var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var router = express.Router();

router.post('/register', function (req, res, next) {
    var user = new User();
    user.username = req.body.username;
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

module.exports = router;
