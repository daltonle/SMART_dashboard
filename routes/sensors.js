const router = require('express').Router()
const bodyParser = require('body-parser')
const moment = require('moment')
const db = require('../db')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

// retrieve all air sensors
router.get('/air', (req, res, next) => {
  let query = 'SELECT id, name, lat, long, alt, pm2_5, pm10 FROM aq_sensor'
  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve all visual sensors
router.get('/visual', (req, res, next) => {
  let query = 'SELECT id, name, lat, long, alt, pedestrians, bicycles, vehicles FROM vs_sensor'
  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve a specific air sensor by id
router.get('/air/id=:id', (req, res, next) => {
  let id = req.params.id
  let query = {
    text: `SELECT id, name, description, long, lat, alt, name, pm2_5, pm10 FROM aq_sensor
    WHERE id=$1::text`,
    values: [id]
  } 

  db.query(query)
    .then(result => res.json(result.rows[0]))
    .catch(next)
})

// retrieve a specific visual sensor by id
router.get('/visual/id=:id', (req, res, next) => {
  let id = req.params.id
  let query = {
    text: `SELECT id, name, description, long, lat, alt, name, pedestrians, bicycles, vehicles FROM vs_sensor
    WHERE id=$1`,
    values: [id]
  }
  
  
  db.query(query)
    .then(result => res.json(result.rows[0]))
    .catch(next)
})

// retrieve a specific air sensor by coordinates
router.get('/air/coordinates=:long,:lat', (req, res, next) => {
  let {
    long,
    lat
  } = req.params

  let query = {
    text: `SELECT id, long, lat, alt, name, description, pm2_5, pm10 FROM aq_sensor
    WHERE long=$1::numeric AND lat=$2::numeric`,
    values: [long, lat]
  }
  
  db.query(query)
    .then(result => res.json(result.rows[0]))
    .catch(next)
})

// retrieve a specific visual sensor by coordinates
router.get('/visual/coordinates=:long,:lat', (req, res, next) => {
  let {
    long,
    lat
  } = req.params
  let query = {
    text: `SELECT id, long, lat, alt, name, description, pedestrians, bicycles, vehicles FROM vs_sensor
    WHERE long=$1::numeric AND lat=$2::numeric`,
    values: [long, lat]
  }
  
  db.query(query)
    .then(result => res.json(result.rows[0]))
    .catch(next)
})

module.exports = router