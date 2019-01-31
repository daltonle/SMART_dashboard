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
      ORDER BY ts
      LIMIT 200`,
    values: [req.params.id]
  }

  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve visual data of a sensor
router.get('/visual/:id', (req, res, next) => {
  let query = {
    text: `SELECT to_char(ts, 'DD-MM-YYYY HH24:mm:ss'), type, count FROM vs_data
      WHERE id_vs=$1::text
      ORDER BY ts
      LIMIT 200`,
    values: [req.params.id]
  }

  db.query(query)
    .then(result => res.json(result.rows))
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
    text: `SELECT to_char(ts, 'DD-MM-YYYY HH24:mm:ss'), type, count FROM vs_data
      WHERE id_vs = $1::text AND '[${d_start.format('YYYY-MM-DD')}, ${d_end.format('YYYY-MM-DD')}]'::daterange @> ts::date`,
    values: [id]
  }

  console.log(query)
  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

module.exports = router