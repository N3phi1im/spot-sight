"use strict";

require('dotenv').config({silent: true});
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');

require('./models/users');
require('./config/passport');

mongoose.connect(process.env.MONGODB);

app.set('views', './views');
app.engine('.html', require('ejs').renderFile);
app.use(express.static('./src'));
app.use(express.static('./dist'));
app.use(express.static('./bower_components'));
app.set('view engine', 'html');
app.set('view options', {
	layout: false
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);


app.get('/*', function(req, res) {
	res.render('index');
});

module.exports = app.listen(port, () => {
	console.log('Spot Sight Running on Port:' + port);
});
