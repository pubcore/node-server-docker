'use strict'
const fs = require('fs'), //dev: helper
	express = require('express'), //dev: http server
	https = require('https'), //security: SSL
	helmet = require('helmet'), //security: HTTP headers
	morgan = require('morgan'), //ops: accesss logs
	compression = require('compression'), //performance: response compression,
	RateLimit = require('express-rate-limit') //security: DOS and brute force protection

var {env} = process,
	{APP_PORT, NODE_ENV} = env

if(!APP_PORT) throw new TypeError('undefined APP_PORT')
if(!NODE_ENV) throw new TypeError('undefined NODE_ENV')
console.log('node environment is ' + NODE_ENV)

//leverage docker's "secrets"
const options = {
		key: fs.readFileSync('/run/secrets/ssl-key'),
		cert: fs.readFileSync('/run/secrets/ssl-cert'),
		dhparam: fs.readFileSync('/run/secrets/ssl-dhparam')
	},
	rateLimiter = new RateLimit({
		windowMs: 5*60*1000, // 5 minutes
		max: 300, // limit each IP to # requests per windowMs
		delayMs: 0 // disable delaying - full speed until the max limit is reached
	})


const app = express()
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
https.createServer(options, app).listen(
	APP_PORT,
	() => console.log('listening on port ' + APP_PORT)
)
module.exports = {express, app}
