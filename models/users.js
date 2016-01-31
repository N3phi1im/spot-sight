"use strict";
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var Uuid = require('uuid');

var UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, lowercase: true },
    name_first: { type: String, lowercase: true},
    name_last: { type: String, lowercase: true},
    contacts_list: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    passwordHash: String,
    salt: String,
    callid: {type: String, 'default': Uuid.v4()}
});

UserSchema.method('setPassword', function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
});

UserSchema.method('validatePassword', function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return (hash === this.passwordHash);
});

UserSchema.method('generateJWT', function () {
    return jwt.sign({
        callid: this.callid,
        username: this.username
    }, process.env.SECRET_KEY );
});

exports.User = mongoose.model('User', UserSchema);
