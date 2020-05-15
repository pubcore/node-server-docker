'use strict'
const fs = require('fs'), //dev: helper
	express = require('express'), //dev: http server
	https = require('https'), //security: SSL
	helmet = require('helmet'), //security: HTTP headers
	morgan = require('morgan'), //ops: accesss logs
	compression = require('compression'), //performance: response compression,
	RateLimit = require('express-rate-limit') //security: DOS and brute force protection

var {env} = process,
	{APP_PORT, NODE_ENV, RATE_WIN, RATE_MAX, RATE_DELAY, TLS_KEY_DIR,
	TOOBUSY_ENABLED, TOOBUSY_MAX_LAT, TOOBUSY_INTERVALL} = env,
	tlsKeyDir = TLS_KEY_DIR || '/run/secrets',
	port = APP_PORT || 0 //auto select next free port if set to 0

if(!NODE_ENV) throw new TypeError('undefined NODE_ENV')
console.log('node environment is ' + NODE_ENV)

//leverage injections of secrets by bind-mounts or docker-secrets
const options = {
		key: fs.readFileSync(`${tlsKeyDir}/ssl-key`, 'utf8'),
		cert: fs.readFileSync(`${tlsKeyDir}/ssl-cert`, 'utf8'),
		dhparam: fs.readFileSync(`${tlsKeyDir}/ssl-dhparam`, 'utf8')
	},
	rateLimiter = new RateLimit({
		windowMs: RATE_WIN || 5*60*1000, // 5 minutes
		max: RATE_MAX || 300, // limit each IP to # requests per windowMs
		delayMs: RATE_DELAY || 0 // disable delaying - full speed until the max limit is reached
	})

const app = express()
if(TOOBUSY_ENABLED){
	toobusy = require('toobusy-js') //availability
	toobusy.maxLag(TOOBUSY_MAX_LAT || 300)
	toobusy.interval(TOOBUSY_INTERVALL || 1500)
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
var server = https.createServer(options, app).listen(
	port,
	() => console.log('listening on port ' + server.address().port)
)
module.exports = {express, app, server}
