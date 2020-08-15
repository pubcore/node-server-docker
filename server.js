'use strict'

module.exports = (env, app) => {
	var server,
		{HTTP, APP_PORT} = env,
		port = APP_PORT || 0, //auto select next free port if set to 0
		onReady = () => console.log('listening on port ' + server.address().port)

	if(HTTP === 'true'){
		server = require('http').createServer({}, app).listen(port, onReady)
	}else{
		const options = require('./tls-options')
		server = require('https').createServer(options(env), app).listen(port, onReady)
	}

	return server
}
