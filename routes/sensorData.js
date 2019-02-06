const router = require('express').Router()
const bodyParser = require('body-parser')
const moment = require('moment')
const db = require('../db')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

// retrieve air quality data of a sensor
router.get('/air/:id', (req, res, next) => {
  let query = {
    text: `SELECT pm2_5, pm10, to_char(ts, 'DD-MM-YYYY HH24:mm:ss') FROM aq_data
      WHERE id_aq=$1::text
      ORDER BY ts DESC
      LIMIT 500`,
    values: [req.params.id]
  }

  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve air quality data of a sensor based on coordinates
router.get('/air/:long,:lat', (req, res, next) => {
  let {
    long,
    lat
  } = req.params

  let query = {
    text: `SELECT pm2_5, pm10, to_char(ts, 'DD-MM-YYYY HH24:mm:ss') FROM aq_data
    WHERE aq_sensor.id=aq_data.id AND aq_sensor.long=$1::numeric AND aq_sensor.lat=$2::numeric
    ORDER BY aq_data.ts DESC
    LIMIT BY 500`,
    values: [long, lat]
  }
  
  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve live data of air sensor based on coordinates
router.get('/air/live/:long,:lat', (req, res, next) => {
  let {
    long,
    lat
  } = req.params

  let query = {
    text: `SELECT pm2_5, pm10, to_char(ts, 'DD-MM-YYYY HH24:mm:ss') FROM aq_sensor
    WHERE aq_sensor.long=$1::numeric AND aq_sensor.lat=$2::numeric`,
    values: [long, lat]
  }
  
  db.query(query)
    .then(result => res.json(result.rows[0]))
    .catch(next)
})

// retrieve visual data of a sensor
router.get('/visual/:id', (req, res, next) => {
  let query = {
    text: `SELECT to_char(ts, 'DD-MM-YYYY HH24:mm:ss'), type, counter FROM vs_count
      WHERE id_vs=$1::text
      ORDER BY ts DESC
      LIMIT 500`,
    values: [req.params.id]
  }

  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve visual data history of a sensor based on coordinates
router.get('/visual/:long,:lat', (req, res, next) => {
  let {
    long,
    lat
  } = req.params

  let query = {
    text: `SELECT to_char(ts, 'DD-MM-YYYY HH24:mm:ss'), type, counter FROM vs_count
    WHERE vs_count.id=vs_sensor.id AND vs_sensor.long=$1::numeric AND vs_sensor.lat=$2::numeric
    ORDER BY vs_count.ts DESC
    LIMIT BY 500`,
    values: [long, lat]
  }
  
  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve live visual data of a sensor based on coordinates
router.get('/visual/live/:long,:lat', (req, res, next) => {
  let {
    long,
    lat
  } = req.params

  let query = {
    text: `SELECT to_char(ts, 'DD-MM-YYYY HH24:mm:ss'), pedestrians, vehicles, bicycles FROM vs_sensor
    WHERE vs_sensor.long=$1::numeric AND vs_sensor.lat=$2::numeric`,
    values: [long, lat]
  }
  
  db.query(query)
    .then(result => res.json(result.rows[0]))
    .catch(next)
})

// retrieve air quality data from a time period
router.get('/air/:id/:year-:month-:day', (req, res, next) => {
  let {
    year,
    month,
    day,
    id
  } = req.params

  let date = moment(`${day}-${month}-${year}`, 'DD-MM-YYYY')
  let d_end = moment(date).add(15, 'days')
  let d_start = moment(date).subtract(15, 'days')

  let query = {
    text: `SELECT pm2_5, pm10, to_char(ts, 'DD-MM-YYYY HH24:mm:ss') FROM aq_data
      WHERE id_aq = $1::text AND '[${d_start.format('YYYY-MM-DD')}, ${d_end.format('YYYY-MM-DD')}]'::daterange @> ts::date`,
    values: [id]
  }

  console.log(query)
  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve visual data from a time period
router.get('/visual/:id/:year-:month-:day', (req, res, next) => {
  let {
    year,
    month,
    day,
    id
  } = req.params

  let date = moment(`${day}-${month}-${year}`, 'DD-MM-YYYY')
  let d_end = moment(date).add(15, 'days')
  let d_start = moment(date).subtract(15, 'days')

  let query = {
    text: `SELECT to_char(ts, 'DD-MM-YYYY HH24:mm:ss'), type, count FROM vs_count
      WHERE id_vs = $1::text AND '[${d_start.format('YYYY-MM-DD')}, ${d_end.format('YYYY-MM-DD')}]'::daterange @> ts::date`,
    values: [id]
  }

  console.log(query)
  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

module.exports = router