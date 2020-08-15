'use strict'
const fs = require('fs'),
	{readFileSync} = fs,
	{spawnSync} = require('child_process'),
	runBin = bin => {
			var result = spawnSync('node', [`bin/${bin}`], {encoding:'utf8', timeout:60000, cwd:__dirname}),
			{status, stdout} = result
		if(status !== 0){
			throw Error(result)
		}
		return JSON.parse(stdout)
	}

module.exports = ({TLS_KEY_DIR, TLS_KEY_SOURCE, NODE_ENV}) => {
	switch (TLS_KEY_SOURCE) {
		case 'devcert':
			if(NODE_ENV !== 'development'){
				throw TypeError(`TLS_KEY_SOURCE "${TLS_KEY_SOURCE}" is only for NODE_ENV==="development"`)
			}
			return runBin('devcert')
		default:
			var tlsKeyDir = TLS_KEY_DIR || '/run/secrets'
			return {
				key: readFileSync(`${tlsKeyDir}/ssl-key`, 'utf8'),
				cert: readFileSync(`${tlsKeyDir}/ssl-cert`, 'utf8'),
				dhparam: readFileSync(`${tlsKeyDir}/ssl-dhparam`, 'utf8')
			}
	}
}