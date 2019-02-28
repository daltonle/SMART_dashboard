const Router = require('express-promise-router')
const bodyParser = require('body-parser')
const LTTB = require('downsample').LTTB
const moment = require('moment')
const db = require('../db')

const router = new Router()

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

/**
 * Get all the data needed to compare air sensors
 */
router.get('/air/:id', async (req, res) => {
  let live, historyPM2_5, historyPM10,
      avgByHourPM2_5 = [], avgByHourPM10 = [],
      minByHourPM2_5 = [], minByHourPM10 = [],
      maxByHourPM2_5 = [], maxByHourPM10 = []
  let query, result
  
  try {
    // get live data
    query = {
      text: `SELECT id, name, description, pm2_5, pm10, to_char(ts, 'DD-MM-YYYY HH24:MI:SS') FROM aq_sensor
      WHERE id=$1`,
      values: [req.params.id]
    }
    result = await db.query(query)
    live = { ...result.rows[0] }
    
    // history of pm2.5
    query = {
      text: `SELECT pm2_5, to_char(ts, 'DD-MM-YYYY HH24:MI:SS') as timestamp FROM aq_data
        WHERE id_aq=$1::text
        ORDER BY ts DESC`,
      values: [req.params.id]
    }
    result = await db.query(query)
    let tmp = LTTB(result.rows.map(d => ({x: moment(d.timestamp, "DD-MM-YYYY HH:mm:ss").toDate(), y: parseFloat(d.pm2_5)})), 100)
    let x = [], y = []
    for (let i=0, l=tmp.length; i < l; i++) {
      x.push(moment(tmp[i].x).format("DD-MM-YYYY HH:mm:ss"))
      y.push(tmp[i].y)
    }
    historyPM2_5 = { x, y }

    // history of pm10
    query = {
      text: `SELECT pm10, to_char(ts, 'DD-MM-YYYY HH24:MI:SS') as timestamp FROM aq_data
        WHERE id_aq=$1::text
        ORDER BY ts DESC`,
      values: [req.params.id]
    }
    result = await db.query(query)
    tmp.splice(0, tmp.length)
    x.splice(0, x.length)
    y.splice(0, y.length)
    tmp = LTTB(result.rows.map(d => ({x: moment(d.timestamp, "DD-MM-YYYY HH:mm:ss").toDate(), y: parseFloat(d.pm10)})), 100)
    for (let i=0, l=tmp.length; i < l; i++) {
      x.push(moment(tmp[i].x).format("DD-MM-YYYY HH:mm:ss"))
      y.push(tmp[i].y)
    }
    historyPM10 = { x, y }

    // initialise by-hour data variables
    for (let i = 0; i < 7; i++) {
      avgByHourPM2_5[i] = { x:[], y:[] }
      avgByHourPM10[i] = { x:[], y:[] }
      minByHourPM2_5[i] = { x:[], y:[] }
      minByHourPM10[i] = { x:[], y:[] }
      maxByHourPM2_5[i] = { x:[], y:[] }
      maxByHourPM10[i] = { x:[], y:[] }
    }

    // average air particles data by hour
    query = {
      text: `SELECT extract(dow from ts) as dow,
                    extract(hour from ts) as hour,
                    avg(pm2_5) as pm2_5,
                    avg(pm10) as pm10
            FROM aq_data
            WHERE id_aq = $1
            GROUP BY 1,2
            ORDER BY 1 ASC, 2 ASC`,
      values: [req.params.id]
    }
    result = await db.query(query)
    for (let i = 0, l = result.rows.length; i < l; i++) {
      let { dow, hour, pm2_5, pm10 } = result.rows[i]
      avgByHourPM2_5[dow].x.push(hour)
      avgByHourPM2_5[dow].y.push(parseFloat(pm2_5))
      avgByHourPM10[dow].x.push(hour)
      avgByHourPM10[dow].y.push(parseFloat(pm10))
    }

    // min air particles data by hour
    query = {
      text: `SELECT extract(dow from ts) as dow,
                    extract(hour from ts) as hour,
                    min(pm2_5) as pm2_5,
                    min(pm10) as pm10
            FROM aq_data
            WHERE id_aq = $1
            GROUP BY 1,2
            ORDER BY 1 ASC, 2 ASC`,
      values: [req.params.id]
    }
    result = await db.query(query)
    for (let i = 0, l = result.rows.length; i < l; i++) {
      let { dow, hour, pm2_5, pm10 } = result.rows[i]
      minByHourPM2_5[dow].x.push(hour)
      minByHourPM2_5[dow].y.push(parseInt(pm2_5))
      minByHourPM10[dow].x.push(hour)
      minByHourPM10[dow].y.push(parseInt(pm10))
    }

    // max air particles data by hour
    query = {
      text: `SELECT extract(dow from ts) as dow,
                    extract(hour from ts) as hour,
                    max(pm2_5) as pm2_5,
                    max(pm10) as pm10
            FROM aq_data
            WHERE id_aq = $1
            GROUP BY 1,2
            ORDER BY 1 ASC, 2 ASC`,
      values: [req.params.id]
    }
    result = await db.query(query)
    for (let i = 0, l = result.rows.length; i < l; i++) {
      let { dow, hour, pm2_5, pm10 } = result.rows[i]
      maxByHourPM2_5[dow].x.push(hour)
      maxByHourPM2_5[dow].y.push(parseInt(pm2_5))
      maxByHourPM10[dow].x.push(hour)
      maxByHourPM10[dow].y.push(parseFloat(pm10))
    }

    res.json({
      id: req.params.id,
      ...live,
      history: {
        pm2_5: historyPM2_5,
        pm10: historyPM10
      },
      byHour: {
        pm2_5: {
          avg: avgByHourPM2_5,
          min: minByHourPM2_5,
          max: maxByHourPM2_5
        },
        pm10: {
          avg: avgByHourPM10,
          min: minByHourPM10,
          max: maxByHourPM10
        }
      }
    })
  }
  catch (err) { console.log(err) }
})


/**
 * Get all the data needed to compare visual sensors
 */
router.get('/visual/:id', async (req, res) => {
  let live, historyPed, historyBi, historyVeh,
      avgByHourPed = [], avgByHourBi = [], avgByHourVeh = [],
      minByHourPed = [], minByHourBi = [], minByHourVeh = [],
      maxByHourPed = [], maxByHourBi = [], maxByHourVeh = []
  let query, result
  
  try {
    // get live data
    query = {
      text: `SELECT id, name, description, to_char(ts, 'DD-MM-YYYY HH24:MI:SS'), pedestrians, vehicles, bicycles FROM vs_sensor
      WHERE id=$1`,
      values: [req.params.id]
    }
    result = await db.query(query)
    live = { ...result.rows[0] }
    
    // history of pedestrians
    query = {
      text: `SELECT to_char(ts, 'DD-MM-YYYY HH24:MI:SS') as timestamp, counter FROM vs_count
        WHERE id_vs=$1::text AND type='pedestrian'
        ORDER BY ts DESC`,
      values: [req.params.id]
    }
    result = await db.query(query)
    let tmp = LTTB(result.rows.map(d => ({x: moment(d.timestamp, "DD-MM-YYYY HH:mm:ss").toDate(), y: parseFloat(d.counter)})), 100)
    let x = [], y = []
    for (let i=0, l=tmp.length; i < l; i++) {
      x.push(moment(tmp[i].x).format("DD-MM-YYYY HH:mm:ss"))
      y.push(tmp[i].y)
    }
    historyPed = { x, y }

    // history of bicycles
    query = {
      text: `SELECT to_char(ts, 'DD-MM-YYYY HH24:MI:SS') as timestamp, counter FROM vs_count
        WHERE id_vs=$1::text AND type='pedestrian'
        ORDER BY ts DESC`,
      values: [req.params.id]
    }
    result = await db.query(query)
    tmp.splice(0, tmp.length)
    x.splice(0, x.length)
    y.splice(0, y.length)
    tmp = LTTB(result.rows.map(d => ({x: moment(d.timestamp, "DD-MM-YYYY HH:mm:ss").toDate(), y: parseFloat(d.counter)})), 100)
    for (let i=0, l=tmp.length; i < l; i++) {
      x.push(moment(tmp[i].x).format("DD-MM-YYYY HH:mm:ss"))
      y.push(tmp[i].y)
    }
    historyBi = { x, y }

    // history of vehicles
    query = {
      text: `SELECT to_char(ts, 'DD-MM-YYYY HH24:MI:SS') as timestamp, counter FROM vs_count
        WHERE id_vs=$1::text AND type='pedestrian'
        ORDER BY ts DESC`,
      values: [req.params.id]
    }
    result = await db.query(query)
    tmp.splice(0, tmp.length)
    x.splice(0, x.length)
    y.splice(0, y.length)
    tmp = LTTB(result.rows.map(d => ({x: moment(d.timestamp, "DD-MM-YYYY HH:mm:ss").toDate(), y: parseFloat(d.counter)})), 100)
    for (let i=0, l=tmp.length; i < l; i++) {
      x.push(moment(tmp[i].x).format("DD-MM-YYYY HH:mm:ss"))
      y.push(tmp[i].y)
    }
    historyVeh = { x, y }

    // initialise by-hour data variables
    for (let i = 0; i < 7; i++) {
      avgByHourPed[i] = { x:[], y:[] }
      avgByHourBi[i] = { x:[], y:[] }
      avgByHourVeh[i] = { x:[], y:[] }
      minByHourPed[i] = { x:[], y:[] }
      minByHourBi[i] = { x:[], y:[] }
      minByHourVeh[i] = { x:[], y:[] }
      maxByHourPed[i] = { x:[], y:[] }
      maxByHourBi[i] = { x:[], y:[] }
      maxByHourVeh[i] = { x:[], y:[] }
    }

    // avg vehicle count by hour
    query = {
      text: `SELECT extract(dow from ts) as dow,
                    extract(hour from ts) as hour,
                    type,
                    avg(counter) as counter
            FROM vs_count
            WHERE id_vs = $1
            GROUP BY 1,2,3
            ORDER BY 1 ASC, 2 ASC`,
      values: [req.params.id]
    }
    result = await db.query(query)
    for (let i = 0, l = result.rows.length; i < l; i++) {
      let { dow, hour, type, counter } = result.rows[i]
      if (type === 'pedestrian') {
        avgByHourPed[dow].x.push(hour)
        avgByHourPed[dow].y.push(parseInt(counter))
      } else if (type === 'bicycle') {
        avgByHourBi[dow].x.push(hour)
        avgByHourBi[dow].y.push(parseInt(counter))
      } else if (type === 'vehicle') {
        avgByHourVeh[dow].x.push(hour)
        avgByHourVeh[dow].y.push(parseInt(counter))
      }
    }

    // min vehicle count by hour
    query = {
      text: `SELECT extract(dow from ts) as dow,
                    extract(hour from ts) as hour,
                    type,
                    min(counter) as counter
            FROM vs_count
            WHERE id_vs = $1
            GROUP BY 1,2,3
            ORDER BY 1 ASC, 2 ASC`,
      values: [req.params.id]
    }
    result = await db.query(query)
    for (let i = 0, l = result.rows.length; i < l; i++) {
      let { dow, hour, type, counter } = result.rows[i]
      if (type === 'pedestrian') {
        minByHourPed[dow].x.push(hour)
        minByHourPed[dow].y.push(parseInt(counter))
      } else if (type === 'bicycle') {
        minByHourBi[dow].x.push(hour)
        minByHourBi[dow].y.push(parseInt(counter))
      } else if (type === 'vehicle') {
        minByHourVeh[dow].x.push(hour)
        minByHourVeh[dow].y.push(parseInt(counter))
      }
    }

    // max vehicle count by hour
    query = {
      text: `SELECT extract(dow from ts) as dow,
                    extract(hour from ts) as hour,
                    type,
                    max(counter) as counter
            FROM vs_count
            WHERE id_vs = $1
            GROUP BY 1,2,3
            ORDER BY 1 ASC, 2 ASC`,
      values: [req.params.id]
    }
    result = await db.query(query)
    for (let i = 0, l = result.rows.length; i < l; i++) {
      let { dow, hour, type, counter } = result.rows[i]
      if (type === 'pedestrian') {
        maxByHourPed[dow].x.push(hour)
        maxByHourPed[dow].y.push(parseInt(counter))
      } else if (type === 'bicycle') {
        maxByHourBi[dow].x.push(hour)
        maxByHourBi[dow].y.push(parseInt(counter))
      } else if (type === 'vehicle') {
        maxByHourVeh[dow].x.push(hour)
        maxByHourVeh[dow].y.push(parseInt(counter))
      }
    }

    res.json({
      id: req.params.id,
      ...live,
      history: {
        pedestrian: historyPed,
        bicycle: historyBi,
        vehicle: historyVeh
      },
      byHour: {
        pedestrian: {
          avg: avgByHourPed,
          min: minByHourPed,
          max: maxByHourPed
        },
        bicycle: {
          avg: avgByHourBi,
          min: minByHourBi,
          max: maxByHourBi
        },
        vehicle: {
          avg: avgByHourVeh,
          min: minByHourVeh,
          max: maxByHourVeh
        }
      }
    })
  }
  catch (err) { console.log(err) }
})

module.exports = router