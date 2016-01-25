"use strict";

require('dotenv').config({silent: true});
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let port = process.env.PORT || 3000;

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

app.get('/*', function(req, res) {
	res.render('index');
});

module.exports = app.listen(port, () => {
	console.log('Spot Sight Running on Port:' + port);
});
