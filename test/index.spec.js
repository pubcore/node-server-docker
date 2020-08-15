'use strict'
const chai = require('chai')
const {expect} = chai
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const dhparam = require('dhparam')(1024)
const selfsigned = require('selfsigned')
const certs = selfsigned.generate([{name:'commonName', value: 'test.com' }], { days: 365 })
const fs = require('fs')
const {readFileSync} = require('fs')
fs.readFileSync = (file, ...args) => ({
  './ssl-key':certs.private,
  './ssl-cert':certs.cert,
  './ssl-dhparam':dhparam})[file] || readFileSync(file, ...args)

var app, server, env = {...process.env}
const setup = args => () => {
    setEnv(args)
    ;({app, server} = require('../index'))
  },
  cleanup = () => {
    process.env = {...env}
    server.close()
    delete require.cache[require.resolve('../index')]
  },
  setEnv = args => process.env = {...env, ...args}

describe('server', () => {
  describe('with default config', () => {
    before(() => {
      setEnv({TLS_KEY_DIR:'.', NODE_ENV:'development'})
      ;({app, server} = require('../index'))
    })
    it('serves 404 with default config', async () => {
      var response = await chai.request(app).get('/').send()
      expect(response).to.have.status(404)
    })
    after(cleanup)
  })
  describe('create TLS keys by "devcert"', () => {
    describe('correct environment config', () => {
      before(setup({TLS_KEY_SOURCE:'devcert', NODE_ENV:'development'}))
      it('supports env var "TLS_KEY_SOURCE"', async () => {
        var response = await chai.request(app).get('/').send()
        expect(response).to.have.status(404)
      })
      after(cleanup)
    })
    describe('wrong environment config', () => {
      it('throws an error, if not in development mode', () => {
        expect(() => setup({TLS_KEY_SOURCE:'devcert', NODE_ENV:'production'})()).to.throw(Error)
      })
      after(() => process.env = {...env})
    })
  })
  describe('HTTP (no TLS) mode', () => {
    before(setup({HTTP:'true', NODE_ENV:'production'}))
    it('does serve insecure, unecripted http payload, if env var HTTP is "true"', () => {
      it('serves 404', async () => {
        var response = await chai.request(app).get('/').send()
        expect(response).to.have.status(404)
      })
    })
    after(cleanup)
  })
  describe('overload protection by "toobusy-js"', () => {
    before(setup({NODE_ENV:'production', TOOBUSY_ENABLED:'true', HTTP:'true'}))
    it('enables overload protection, if env var TOOBUSY_ENABLED is "true"', async () => {
      var response = await chai.request(app).get('/').send()
      expect(response).to.have.status(404)
    })
    after(cleanup)
  })
})