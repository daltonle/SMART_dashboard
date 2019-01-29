require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const fs = require('fs')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// set up logger
const accessLogStream = fs.createWriteStream('/access.log', { flags: 'a' })
if (app.get('env') === 'production')
  app.use(morgan('combined'))
else app.use(morgan('dev', {stream: accessLogStream}))

const db = require('./db/index');
db.query('SELECT * FROM aq_sensor', (err, res) => {
  if (err) {
    console.log(err)
  }
  console.log(res)
})


