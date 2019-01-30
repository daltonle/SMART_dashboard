const router = require('express').Router()
const bodyParser = require('body-parser')
const db = require('../db')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

// retrieve all sensors and coordinates
router.get('/', (req, res, next) => {
  let query = 'SELECT id, lat, long, alt FROM aq_sensor'
  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve a specific sensor by id
router.get('/:id', (req, res, next) => {
  let id = req.params.id
  let query = 
  `SELECT * FROM aq_sensor
  WHERE id=${id}
  UNION ALL
  SELECT * from vs_sensor
  WHERE id=${id}`
  
  db.query(query)
    .then(result => res.json(result))
    .catch(next)
})

// retrieve a specific sensor by coordinates
router.get('/:long.:lat.:alt', (req, res, next) => {
  let long = req.params.long
  let lat = req.params.lat
  let alt = req.params.alt
  let query = 
  `SELECT * FROM aq_sensor
  WHERE long=${long} AND lat=${lat} AND alt=${alt}
  UNION ALL
  SELECT * from vs_sensor
  WHERE long=${long} AND lat=${lat} AND alt=${alt}`

  db.query(query)
    .then(result => res.json(result))
    .catch(next)
})

// retrieve air quality data of a sensor
router.get('/air-data/:id', (req, res, next) => {
  let query =
  `SELECT pm2_5, pm10, ts FROM aq_data
  WHERE id_aq=${req.params.id}
  ORDER BY ts`

  db.query(query)
    .then(result => res.json(result))
    .catch(next)
})

// retrieve visual data of a sensor
router.get('/visual-data/:id', (req, res, next) => {
  let query =
  `SELECT ts, type, count FROM vs_data
  WHERE id_vs=${req.params.id}
  ORDER BY ts`

  db.query(query)
    .then(result => res.json(result))
    .catch(next)
})


module.exports = router