const Router = require('express-promise-router')
const bodyParser = require('body-parser')
const LTTB = require('downsample').LTTB
const moment = require('moment')
const db = require('../db')
const generateHeatmapData = require('../utils/generateHeatmapData')

const router = new Router()

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

// retrieve air history data of a sensor based on id
router.get('/history/air/:name/:id', (req, res, next) => {
  let query = {
    text: `SELECT ${req.params.name}, to_char(ts, 'DD-MM-YYYY HH24:MI:SS') as timestamp FROM aq_data
      WHERE id_aq=$1::text
      ORDER BY ts DESC`,
    values: [req.params.id]
  }

  db.query(query)
    .then(result => result.rows.map(d => ({x: moment(d.timestamp, "DD-MM-YYYY HH:mm:ss").toDate(), y: parseFloat(d[req.params.name])})))
    .then(result => LTTB(result, 1000))
    .then(result => res.json(result.map(d => ({x: moment(d.x).format("DD-MM-YYYY HH:mm:ss"), y: d.y}))))
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
router.get('/air/live/:id', (req, res, next) => {
  let query = {
    text: `SELECT id, name, description, pm2_5, pm10, to_char(ts, 'DD-MM-YYYY HH24:MI:SS') FROM aq_sensor
    WHERE id=$1`,
    values: [req.params.id]
  }
  
  db.query(query)
    .then(result => res.json(result.rows[0]))
    .catch(next)
})

// retrieve visual data history based on id
router.get('/history/visual/:name/:id', (req, res, next) => {
  let query = {
    text: `SELECT to_char(ts, 'DD-MM-YYYY HH24:MI:SS') as timestamp, counter FROM vs_count
      WHERE id_vs=$1::text AND type=$2
      ORDER BY ts DESC`,
    values: [req.params.id, req.params.name]
  }

  db.query(query)
    .then(result => result.rows.map(d => ({x: moment(d.timestamp, "DD-MM-YYYY HH:mm:ss").toDate(), y: parseFloat(d.counter)})))
    .then(result => LTTB(result, 1000))
    .then(result => res.json(result.map(d => ({x: moment(d.x).format("DD-MM-YYYY HH:mm:ss"), y: d.y}))))
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
router.get('/visual/live/:id', (req, res, next) => {

  let query = {
    text: `SELECT id, name, description, to_char(ts, 'DD-MM-YYYY HH24:MI:SS'), pedestrians, vehicles, bicycles, reso_x, reso_y FROM vs_sensor
    WHERE id=$1`,
    values: [req.params.id]
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
router.get('/air/by-day/:name/:id/:year-:month-:day', (req, res, next) => {
  let day = moment([req.params.year, req.params.month-1, req.params.day]).format('YYYY-MM-DD HH:mm:ss')
  let query = {
    text: `SELECT to_char(ts, 'DD-MM-YYYY HH24:MI:ss') as timestamp, ${req.params.name} FROM aq_data
          WHERE id_aq=$1 and date_trunc('day', ts)=$2
          ORDER BY ts ASC`,
    values: [req.params.id, day]
  }

  db.query(query)
    .then(result => result.rows.map(d => ({x: moment(d.timestamp, "DD-MM-YYYY HH:mm:ss").toDate(), y: parseFloat(d[req.params.name])})))
    .then(result => LTTB(result, 1000))
    .then(result => res.json(result.map(d => ({x: moment(d.x).format("DD-MM-YYYY HH:mm:ss"), y: d.y}))))
    .catch(next)
})

// retrieve visual data from a specific day
router.get('/visual/by-day/:name/:id/:year-:month-:day', (req, res, next) => {
  let day = moment([req.params.year, req.params.month-1, req.params.day]).format('YYYY-MM-DD HH:mm:ss')
  let query = {
    text: `SELECT to_char(ts, 'DD-MM-YYYY HH24:MI:ss') as timestamp, counter FROM vs_count
          WHERE id_vs=$1 AND type=$2 AND date_trunc('day', ts)=$3
          ORDER BY ts ASC`,
    values: [req.params.id, req.params.name, day]
  }

  db.query(query)
    .then(result => result.rows.map(d => ({x: moment(d.timestamp, "DD-MM-YYYY HH:mm:ss").toDate(), y: parseFloat(d.counter)})))
    .then(result => LTTB(result, 1000))
    .then(result => res.json(result.map(d => ({x: moment(d.x).format("DD-MM-YYYY HH:mm:ss"), y: d.y}))))
    .catch(next)
})

// retrieve data for visual heatmap
router.get('/visual/heatmap/:id', async (req, res, next) => {
  let query = {
    text: `SELECT x1, y1, x2, y2 FROM vs_detections
          WHERE id_obj IN (SELECT id FROM vs_object WHERE id_sensor=$1)
          ORDER BY ts DESC
          LIMIT 5000`,
    values: [req.params.id]
  }
  const { rows } = await db.query(query)
  
  db.query({
    text: `SELECT reso_x, reso_y FROM vs_sensor
          WHERE id=$1`,
    values: [req.params.id]
  })
  .then(result => generateHeatmapData(rows, result.rows[0].reso_x, result.rows[0].reso_y))
  .then(result => res.json(result))
  .catch(next)
})

// retrieve data for visual trajectory tracking
router.get('/visual/trajectory/:id', (req, res, next) => {
  let query = {
    text: `SELECT id_obj, array_agg((x1+x2)/2 ORDER BY ts DESC) as x, array_agg((y1+y2)/2) as y FROM vs_detections
          WHERE id_obj IN (SELECT id FROM vs_object WHERE id_sensor=$1)
          GROUP BY id_obj
          ORDER BY id_obj ASC
          LIMIT 500`,
    values: [req.params.id]
  }

  db.query(query)
    .then(result => res.json(result.rows))
    .catch(next)
})

module.exports = router