const router = require('express').Router()
const bodyParser = require('body-parser')
const moment = require('moment')
const db = require('../db')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

// retrieve all air sensors
router.get('/air', (req, res, next) => {
  let query = 'SELECT id, lat, long, alt FROM aq_sensor'
  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve all visual sensors
router.get('/visual', (req, res, next) => {
  let query = 'SELECT id, lat, long, alt FROM vs_sensor'
  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve a specific air sensor by id
router.get('/air/:id', (req, res, next) => {
  let id = req.params.id
  let query = {
    text: `SELECT * FROM aq_sensor
    WHERE id=$1::text`,
    values: [id]
  } 

  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve a specific visual sensor by id
router.get('/visual/:id', (req, res, next) => {
  let id = req.params.id
  let query = {
    text: `SELECT * FROM vs_sensor
    WHERE id=$1`,
    values: [id]
  }
  
  
  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve a specific air sensor by coordinates
router.get('/air/:long.:lat.:alt', (req, res, next) => {
  let {
    long,
    lat,
    alt
  } = req.params

  let query = {
    text: `SELECT * FROM aq_sensor
    WHERE long=$1::text AND lat=$2::text AND alt=$3::text`,
    values: [long, lat, alt]
  }
  
  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve a specific visual sensor by coordinates
router.get('/visual/:long.:lat.:alt', (req, res, next) => {
  let {
    long,
    lat,
    alt
  } = req.params
  let query = {
    text: `SELECT * FROM vs_sensor
    WHERE long=$1::text AND lat=$2::text AND alt=$3::text`,
    values: [long, lat, alt]
  }
  
  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

module.exports = router