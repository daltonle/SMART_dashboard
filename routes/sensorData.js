const router = require('express').Router()
const bodyParser = require('body-parser')
const LTTB = require('downsample').LTTB
const moment = require('moment')
const db = require('../db')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

// retrieve air quality data history of a sensor
router.get('/air/:id', (req, res, next) => {
  let query = {
    text: `SELECT pm2_5, pm10, to_char(ts, 'DD-MM-YYYY HH24:MI:SS') as timestamp FROM aq_data
      WHERE id_aq=$1::text
      ORDER BY ts DESC`,
    values: [req.params.id]
  }

  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve PM2_5 history data of a sensor based on id
router.get('/pm25/:id', (req, res, next) => {
  let query = {
    text: `SELECT pm2_5, to_char(ts, 'DD-MM-YYYY HH24:MI:SS') as timestamp FROM aq_data
      WHERE id_aq=$1::text
      ORDER BY ts DESC`,
    values: [req.params.id]
  }

  db.query(query)
    .then(result => res.json(LTTB(result.rows, 1000)))
    .catch(next)
})

// retrieve PM10 history data of a sensor based on id
router.get('/pm10/:id', (req, res, next) => {
  let query = {
    text: `SELECT pm10, to_char(ts, 'DD-MM-YYYY HH24:MI:SS') as timestamp FROM aq_data
      WHERE id_aq=$1::text
      ORDER BY ts DESC`,
    values: [req.params.id]
  }

  db.query(query)
    .then(result => res.json(LTTB(result.rows, 1000)))
    .catch(next)
})

// retrieve air quality data history of a sensor based on coordinates
router.get('/air/:long,:lat', (req, res, next) => {
  let {
    long,
    lat
  } = req.params

  let query = {
    text: `SELECT pm2_5, pm10, to_char(ts, 'DD-MM-YYYY HH24:MI:SS') as timestamp FROM aq_data
    WHERE aq_sensor.id=aq_data.id AND aq_sensor.long=$1::numeric AND aq_sensor.lat=$2::numeric
    ORDER BY aq_data.ts DESC`,
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
    text: `SELECT id, name, description, pm2_5, pm10, to_char(ts, 'DD-MM-YYYY HH24:MI:SS') FROM aq_sensor
    WHERE aq_sensor.long=$1::numeric AND aq_sensor.lat=$2::numeric`,
    values: [long, lat]
  }
  
  db.query(query)
    .then(result => res.json(result.rows[0]))
    .catch(next)
})

// retrieve visual data history of a sensor
router.get('/visual/:id', (req, res, next) => {
  let query = {
    text: `SELECT to_char(ts, 'DD-MM-YYYY HH24:MI:SS') as timestamp, type, counter FROM vs_count
      WHERE id_vs=$1::text
      ORDER BY ts DESC`,
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
    text: `SELECT to_char(ts, 'DD-MM-YYYY HH24:MI:SS') as timestamp, type, counter FROM vs_count
    WHERE vs_count.id=vs_sensor.id AND vs_sensor.long=$1::numeric AND vs_sensor.lat=$2::numeric
    ORDER BY vs_count.ts DESC`,
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
    text: `SELECT id, name, description, to_char(ts, 'DD-MM-YYYY HH24:MI:SS'), pedestrians, vehicles, bicycles FROM vs_sensor
    WHERE vs_sensor.long=$1::numeric AND vs_sensor.lat=$2::numeric`,
    values: [long, lat]
  }
  
  db.query(query)
    .then(result => res.json(result.rows[0]))
    .catch(next)
})

// retrieve air quality data from a time period
router.get('/air/by-period/:id/:year-:month-:day', (req, res, next) => {
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
    text: `SELECT pm2_5, pm10, to_char(ts, 'DD-MM-YYYY HH24:MI:SS') FROM aq_data
      WHERE id_aq = $1::text AND '[${d_start.format('YYYY-MM-DD')}, ${d_end.format('YYYY-MM-DD')}]'::daterange @> ts::date`,
    values: [id]
  }

  console.log(query)
  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve visual data from a time period
router.get('/visual/by-period/:id/:year-:month-:day', (req, res, next) => {
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
    text: `SELECT to_char(ts, 'DD-MM-YYYY HH24:MI:SS'), type, counter FROM vs_count
      WHERE id_vs = $1::text AND '[${d_start.format('YYYY-MM-DD')}, ${d_end.format('YYYY-MM-DD')}]'::daterange @> ts::date`,
    values: [id]
  }

  console.log(query)
  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve average air quality by hour
router.get('/air/by-hour/avg/:id', (req, res, next) => {
  let query = {
    text: `SELECT extract(dow from ts) as dow,
                  extract(hour from ts) as hour,
                  avg(pm2_5) as pm2_5,
                  avg(pm10) as pm10
          FROM aq_data
          WHERE id_aq = $1
          GROUP BY 1,2`,
    values: [req.params.id]
  }

  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve min air quality by hour
router.get('/air/by-hour/min/:id', (req, res, next) => {
  let query = {
    text: `SELECT extract(dow from ts) as dow,
                  extract(hour from ts) as hour,
                  min(pm2_5) as pm2_5,
                  min(pm10) as pm10
          FROM aq_data
          WHERE id_aq = $1
          GROUP BY 1,2`,
    values: [req.params.id]
  }

  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve max air quality by hour
router.get('/air/by-hour/max/:id', (req, res, next) => {
  let query = {
    text: `SELECT extract(dow from ts) as dow,
                  extract(hour from ts) as hour,
                  max(pm2_5) as pm2_5,
                  max(pm10) as pm10
          FROM aq_data
          WHERE id_aq = $1
          GROUP BY 1,2`,
    values: [req.params.id]
  }

  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve average vehicle count by hour
router.get('/visual/by-hour/avg/:id', (req, res, next) => {
  let query = {
    text: `SELECT extract(dow from ts) as dow,
                  extract(hour from ts) as hour,
                  type,
                  avg(counter) as counter
          FROM vs_count
          WHERE id_vs = $1
          GROUP BY 1,2,3`,
    values: [req.params.id]
  }

  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve min vehicle count by hour
router.get('/visual/by-hour/min/:id', (req, res, next) => {
  let query = {
    text: `SELECT extract(dow from ts) as dow,
                  extract(hour from ts) as hour,
                  type,
                  min(counter) as counter
          FROM vs_count
          WHERE id_vs = $1
          GROUP BY 1,2,3`,
    values: [req.params.id]
  }

  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve max vehicle count by hour
router.get('/visual/by-hour/max/:id', (req, res, next) => {
  let query = {
    text: `SELECT extract(dow from ts) as dow,
                  extract(hour from ts) as hour,
                  type,
                  max(counter) as counter
          FROM vs_count
          WHERE id_vs = $1
          GROUP BY 1,2,3`,
    values: [req.params.id]
  }

  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

// retrieve air data from a specific day
router.get('/:type/by-day/:name/:id/:year-:month-:day', (req, res, next) => {
  let day = moment([req.params.year, req.params.month-1, req.params.day]).format('YYYY-MM-DD HH:mm:ss')
  let query = {}
  if (req.params.type === 'air') {
    query = {
      text: `SELECT to_char(ts, 'DD-MM-YYYY HH24:mm:ss') as timestamp, ${req.params.name} FROM aq_data
            WHERE id_aq=$1 and date_trunc('day', ts)=$2
            ORDER BY ts ASC`,
      values: [req.params.id, day]
    }
  }
  else if (req.params.type === 'visual') {
    query = {
      text: `SELECT to_char(ts, 'DD-MM-YYYY HH24:mm:ss') as timestamp, counter FROM vs_count
            WHERE id_vs=$1 AND type=$2 AND date_trunc('day', ts)=$3
            ORDER BY ts ASC`,
      values: [req.params.id, req.params.name, day]
    }
  }
  

  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

module.exports = router