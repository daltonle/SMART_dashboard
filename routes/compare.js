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
  let live, historyPM2_5, historyPM10
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

    res.json({
      id: req.params.id,
      ...live,
      history: {
        pm2_5: {...historyPM2_5},
        pm10: {...historyPM10}
      }
    })
  }
  catch (err) { console.log(err) }
})

module.exports = router