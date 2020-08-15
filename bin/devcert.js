#!/usr/bin/env node
//once top level await is ready, we can move this code to lib
const {stdout, exit} = process,
  main = async () => {try{
  const devcert = require('devcert')
  var {key, cert} = await devcert.certificateFor('localhost', {skipCertutil:true})
  stdout.write(JSON.stringify({
    key:key.toString('utf8'),
    cert:cert.toString('utf8')}
  ))
}catch(e){
  console.error(e); exit(1)
}}

main()