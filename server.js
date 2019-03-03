require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const fs = require('fs')
const port = process.env.PORT || 5000;

const app = express()

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// set up logger
const accessLogStream = fs.createWriteStream('access.log', { flags: 'a' })
if (app.get('env') === 'production')
  app.use(morgan('combined'))
else app.use(morgan('dev', {stream: accessLogStream}))

// immport routers
const sensors = require('./routes/sensors')
const sensorData = require('./routes/sensorData')
const compare = require('./routes/compare')

app.use('/sensors', sensors)
app.use('/sensor-data', sensorData)
app.use('/compare', compare)

// start server
const server = app.listen(port, () => {
  console.log(`SMART Air API is running on port ${port}`);
})