'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var session = require('express-session');

var app = express();
require('dotenv').load();

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

routes(app);

var monthMapper = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

function convertDate(req, res) {
	var param = req.url.substr(1);	// strip the first '/' char
	param = param.replace(/%20/g, " ");
	var date = isNaN(param) ? new Date(param) : new Date(Number(param));

	return res.end(JSON.stringify({
		"unix": date.getTime(),
        "natural": isNaN(date.getTime()) ? null :
        	monthMapper[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
    }));
}

app.get('/.?*', convertDate);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
