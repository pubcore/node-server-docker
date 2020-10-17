'use strict'
const express = require('express'), //dev: http server
	helmet = require('helmet'), //security: HTTP headers
	morgan = require('morgan'), //ops: accesss logs
	compression = require('compression'), //performance: response compression,
	RateLimit = require('express-rate-limit') //security: DOS and brute force protection

var {env} = process,
	{NODE_ENV, RATE_WIN, RATE_MAX, RATE_DELAY, TOOBUSY_ENABLED, TOOBUSY_MAX_LAT,
		TOOBUSY_INTERVALL} = env

if(!NODE_ENV) throw new TypeError('undefined NODE_ENV, required to be set either "development" or "production"')
console.log('node environment is ' + NODE_ENV)

//leverage injections of secrets by bind-mounts or docker-secrets
const rateLimiter = new RateLimit({
		windowMs: RATE_WIN || 5*60*1000, // 5 minutes
		max: RATE_MAX || 300, // limit each IP to # requests per windowMs
		delayMs: RATE_DELAY || 0 // disable delaying - full speed until the max limit is reached
	})

const app = express()
if(TOOBUSY_ENABLED === 'true'){
	const toobusy = require('toobusy-js') //availability
	toobusy.maxLag(TOOBUSY_MAX_LAT || 200)
	toobusy.interval(TOOBUSY_INTERVALL || 1000)
	app.use((req, res, next) => {
		if (toobusy()) {
			res.send(503, 'Service currently unavailable');
		} else {
			next()
		}
	})
}
app.use(morgan('common', {
	skip: (req, res) => res.statusCode < 400, stream: process.stderr
}))
app.use(morgan('common', {
	skip: (req, res) => res.statusCode >= 400, stream: process.stdout
}))
app.enable('trust proxy')
app.use(rateLimiter)
app.use(helmet())
app.use(compression())
app.head('/healthcheck', (req, res) => res.send(''))
var server = require('./server')(env, app)
module.exports = {express, app, server}
