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

const {app, server} = require('../index')

describe('base node server', () => {
  it('exports express app', async () => {
    var response = await chai.request(app).get('/').send()
    expect(response).to.have.status(404)
  })
  after(() => server.close())
})