'use strict';
const
	fs = require('fs'), //dev: helper
	express = require('express'), //dev: http server
	https = require('https'), //security: SSL
	helmet = require('helmet'), //security: HTTP headers
	morgan = require('morgan'), //ops: accesss logs
	compression = require('compression'), //performance: response compression
	service = require('./js/app.js') //dev: the application

var {env} = process,
	{APP_PORT} = env

if(!APP_PORT){
	throw new TypeError('undefined APP_PORT')
}

//leverage docker's "secrets"
const options = {
  key: fs.readFileSync('/run/secrets/ssl-key'),
  cert: fs.readFileSync('/run/secrets/ssl-cert'),
  dhparam: fs.readFileSync('/run/secrets/ssl-dhparam')
}

const app = express()
app.use(morgan('common', {
    skip: (req, res) => res.statusCode < 400, stream: process.stderr
}))
app.use(morgan('common', {
	skip: (req, res) => res.statusCode >= 400, stream: process.stdout
}))
app.use(helmet())
app.use(compression())
app.use(service())
https.createServer(options, app).listen(
	APP_PORT,
	() => console.log('listening on port ' + APP_PORT)
)
