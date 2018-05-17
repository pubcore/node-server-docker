'use strict'
const app = require('./index.js')
app.use((req, res) => res.send('Hello world!'))
