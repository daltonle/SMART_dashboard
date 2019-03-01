import {
  GET_AIR_DATA_LIVE, 
  GET_VISUAL_DATA_LIVE,
  GET_AVG_AIR_DATA_BY_HOUR,
  GET_MIN_AIR_DATA_BY_HOUR,
  GET_MAX_AIR_DATA_BY_HOUR,
  GET_AVG_VISUAL_DATA_BY_HOUR,
  GET_MIN_VISUAL_DATA_BY_HOUR,
  GET_MAX_VISUAL_DATA_BY_HOUR,
  GET_PM25_DATA_HISTORY,
  GET_PM10_DATA_HISTORY,
  GET_PEDESTRIAN_HISTORY,
  GET_BICYCLE_HISTORY,
  GET_VEHICLE_HISTORY,
  GET_PM25_BY_DAY,
  GET_PM10_BY_DAY,
  GET_PEDESTRIAN_BY_DAY,
  GET_BICYCLE_BY_DAY,
  GET_VEHICLE_BY_DAY,
  GET_VISUAL_HEATMAP_DATA,
  GET_TRAJECTORY_DATA,
  UPDATE_AIR_DATA_LIVE,
  UPDATE_VISUAL_DATA_LIVE
} from './types'

let timer1, timer2

/**
 * Get data of air sensor at given position, 
 * and the data of the closest visual sensor in a 10m radius
 * 
 * // REVIEW: At the moment only getting visual sensor with exact same coordinates
 * @param {{lng: number, lat: number}} sensor 
 */
export const getAirData = (sensor) => async (dispatch) => {
  let air = false, visual = false

  let res1 = await fetch(`/sensor-data/air/live/${sensor.lng},${sensor.lat}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .catch(err => console.log(err))
  
  dispatch({
    type: GET_AIR_DATA_LIVE,
    payload: res1
  })
  if (res1 !== undefined) {
    air = true
    fetch(`/sensor-data/history/air/pm2_5/${res1.id}`)
      .then(res => res.text())
      .then(text => text.length ? JSON.parse(text) : undefined)
      .then(res => dispatch({
        type: GET_PM25_DATA_HISTORY,
        payload: res
      }))
      .catch(err => console.log(err))
    fetch(`/sensor-data/history/air/pm10/${res1.id}`)
      .then(res => res.text())
      .then(text => text.length ? JSON.parse(text) : undefined)
      .then(res => dispatch({
        type: GET_PM10_DATA_HISTORY,
        payload: res
      }))
      .catch(err => console.log(err))
  }
    
  let res2 = await fetch(`/sensor-data/visual/live/${sensor.lng},${sensor.lat}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .catch(err => console.log(err))
  
  dispatch({
    type: GET_VISUAL_DATA_LIVE,
    payload: res2
  })
  if (res2 !== undefined) {
    visual = true
    fetch(`/sensor-data/history/visual/pedestrian/${res2.id}`)
      .then(res => res.text())
      .then(text => text.length ? JSON.parse(text) : undefined)
      .then(res => dispatch({
        type: GET_PEDESTRIAN_HISTORY,
        payload: res
      }))
      .catch(err => console.log(err))
    fetch(`/sensor-data/history/visual/bicycle/${res2.id}`)
      .then(res => res.text())
      .then(text => text.length ? JSON.parse(text) : undefined)
      .then(res => dispatch({
        type: GET_BICYCLE_HISTORY,
        payload: res
      }))
      .catch(err => console.log(err))
    fetch(`/sensor-data/history/visual/vehicle/${res2.id}`)
      .then(res => res.text())
      .then(text => text.length ? JSON.parse(text) : undefined)
      .then(res => dispatch({
        type: GET_VEHICLE_HISTORY,
        payload: res
      }))
      .catch(err => console.log(err))
    fetch(`/sensor-data/visual/heatmap/${res2.id}`)
      .then(res => res.text())
      .then(text => text.length ? JSON.parse(text) : undefined)
      .then(res => dispatch({
        type: GET_VISUAL_HEATMAP_DATA,
        payload: res
      }))
      .catch(err => console.log(err))
    fetch(`/sensor-data/visual/trajectory/${res2.id}`)
      .then(res => res.text())
      .then(text => text.length ? JSON.parse(text) : undefined)
      .then(res => dispatch({
        type: GET_TRAJECTORY_DATA,
        payload: res
      }))
      .catch(err => console.log(err))
  }
    
  // get live data after every minute
  clearTimeout(timer1, timer2)
  const getAirDataLive = () => {
    fetch(`/sensor-data/air/live/${sensor.lng},${sensor.lat}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => {
      dispatch({
        type: UPDATE_AIR_DATA_LIVE,
        payload: res
      })
    })
    .catch(err => console.log(err))
    timer1 = setTimeout(getAirDataLive, 60000)
  }
  if (air) getAirDataLive()

  const getVisualDataLive = () => {
    fetch(`/sensor-data/visual/live/${sensor.lng},${sensor.lat}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => {
      dispatch({
        type: UPDATE_VISUAL_DATA_LIVE,
        payload: res
      })
    })
    .catch(err => console.log(err))
    timer2 = setTimeout(getVisualDataLive, 60000)
  }
  if (visual) getVisualDataLive()
}

/**
 * Get data of visual sensor at given position,
 * and the data of the closest air sensor in a 10m radius
 * 
 * // REVIEW: At the moment only getting air sensor with exact same coordinates
 * @param {{lng: number, lat: number}} sensor 
 */
export const getVisualData = (sensor) => async (dispatch) => {
  let air = false, visual = false

  let res1 = await fetch(`/sensor-data/air/live/${sensor.lng},${sensor.lat}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .catch(err => console.log(err))
  
  dispatch({
    type: GET_AIR_DATA_LIVE,
    payload: res1
  })
  if (res1 !== undefined) {
    air = true
    fetch(`/sensor-data/history/air/pm2_5/${res1.id}`)
      .then(res => res.text())
      .then(text => text.length ? JSON.parse(text) : undefined)
      .then(res => dispatch({
        type: GET_PM25_DATA_HISTORY,
        payload: res
      }))
      .catch(err => console.log(err))
    fetch(`/sensor-data/history/air/pm10/${res1.id}`)
      .then(res => res.text())
      .then(text => text.length ? JSON.parse(text) : undefined)
      .then(res => dispatch({
        type: GET_PM10_DATA_HISTORY,
        payload: res
      }))
      .catch(err => console.log(err))
  }
    
  let res2 = await fetch(`/sensor-data/visual/live/${sensor.lng},${sensor.lat}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .catch(err => console.log(err))
  
  dispatch({
    type: GET_VISUAL_DATA_LIVE,
    payload: res2
  })
  if (res2 !== undefined) {
    visual = true
    fetch(`/sensor-data/history/visual/pedestrian/${res2.id}`)
      .then(res => res.text())
      .then(text => text.length ? JSON.parse(text) : undefined)
      .then(res => dispatch({
        type: GET_PEDESTRIAN_HISTORY,
        payload: res
      }))
      .catch(err => console.log(err))
    fetch(`/sensor-data/history/visual/bicycle/${res2.id}`)
      .then(res => res.text())
      .then(text => text.length ? JSON.parse(text) : undefined)
      .then(res => dispatch({
        type: GET_BICYCLE_HISTORY,
        payload: res
      }))
      .catch(err => console.log(err))
    fetch(`/sensor-data/history/visual/vehicle/${res2.id}`)
      .then(res => res.text())
      .then(text => text.length ? JSON.parse(text) : undefined)
      .then(res => dispatch({
        type: GET_VEHICLE_HISTORY,
        payload: res
      }))
      .catch(err => console.log(err))
    fetch(`/sensor-data/visual/heatmap/${res2.id}`)
      .then(res => res.text())
      .then(text => text.length ? JSON.parse(text) : undefined)
      .then(res => dispatch({
        type: GET_VISUAL_HEATMAP_DATA,
        payload: res
      }))
      .catch(err => console.log(err))
    fetch(`/sensor-data/visual/trajectory/${res2.id}`)
      .then(res => res.text())
      .then(text => text.length ? JSON.parse(text) : undefined)
      .then(res => dispatch({
        type: GET_TRAJECTORY_DATA,
        payload: res
      }))
      .catch(err => console.log(err))
  }
    
  // get live data after every minute
  clearTimeout(timer1, timer2)
  const getAirDataLive = () => {
    fetch(`/sensor-data/air/live/${sensor.lng},${sensor.lat}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => {
      dispatch({
        type: UPDATE_AIR_DATA_LIVE,
        payload: res
      })
    })
    .catch(err => console.log(err))
    timer1 = setTimeout(getAirDataLive, 60000)
  }
  if (air) getAirDataLive()

  const getVisualDataLive = () => {
    fetch(`/sensor-data/visual/live/${sensor.lng},${sensor.lat}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => {
      dispatch({
        type: UPDATE_VISUAL_DATA_LIVE,
        payload: res
      })
    })
    .catch(err => console.log(err))
    timer2 = setTimeout(getVisualDataLive, 60000)
  }
  if (visual) getVisualDataLive()
}

/**
 * Get average number of air particles by hour
 * @param {string} id 
 */
export const getAvgAirDataByHour = id => dispatch => {
  fetch(`/sensor-data/air/by-hour/avg/${id}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_AVG_AIR_DATA_BY_HOUR,
    payload: res
  }))
  .catch(err => console.log(err))
}

/**
 * Get min number of air particles by hour
 * @param {string} id 
 */
export const getMinAirDataByHour = id => dispatch => {
  fetch(`/sensor-data/air/by-hour/min/${id}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_MIN_AIR_DATA_BY_HOUR,
    payload: res
  }))
  .catch(err => console.log(err))
}

/**
 * Get max number of air particles by hour
 * @param {string} id 
 */
export const getMaxAirDataByHour = id => dispatch => {
  fetch(`/sensor-data/air/by-hour/max/${id}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_MAX_AIR_DATA_BY_HOUR,
    payload: res
  }))
  .catch(err => console.log(err))
}

/**
 * Get average number of transportations by hour
 * @param {string} id 
 */
export const getAvgVisualDataByHour = id => dispatch => {
  fetch(`/sensor-data/visual/by-hour/avg/${id}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_AVG_VISUAL_DATA_BY_HOUR,
    payload: res
  }))
  .catch(err => console.log(err))
}

/**
 * Get min number of transportations by hour
 * @param {string} id 
 */
export const getMinVisualDataByHour = id => dispatch => {
  fetch(`/sensor-data/visual/by-hour/min/${id}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_MIN_VISUAL_DATA_BY_HOUR,
    payload: res
  }))
  .catch(err => console.log(err))
}

/**
 * Get max number of transportations by hour
 * @param {string} id 
 */
export const getMaxVisualDataByHour = id => dispatch => {
  fetch(`/sensor-data/visual/by-hour/max/${id}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_MAX_VISUAL_DATA_BY_HOUR,
    payload: res
  }))
  .catch(err => console.log(err))
}

/**
 * Get air quality data from a specific day
 * @param {string} id 
 * @param {string} day "YYYY-MM-DD"
 */
export const getAirDataByDay = (id, day) => dispatch => {
  fetch( `/sensor-data/air/by-day/pm2_5/${id}/${day}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_PM25_BY_DAY,
    payload: res
  }))
  .catch(err => console.log(err))

  fetch( `/sensor-data/air/by-day/pm10/${id}/${day}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_PM10_BY_DAY,
    payload: res
  }))
  .catch(err => console.log(err))
}
  
/**
 * Get visual data from a specific day
 * @param {string} id 
 * @param {string} day "YYYY-MM-DD"
 */
export const getVisualDataByDay = (id, day) => dispatch => {
  fetch( `/sensor-data/visual/by-day/pedestrian/${id}/${day}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_PEDESTRIAN_BY_DAY,
    payload: res
  }))
  .catch(err => console.log(err))

  fetch( `/sensor-data/visual/by-day/bicycle/${id}/${day}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_BICYCLE_BY_DAY,
    payload: res
  }))
  .catch(err => console.log(err))

  fetch( `/sensor-data/visual/by-day/vehicle/${id}/${day}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_VEHICLE_BY_DAY,
    payload: res
  }))
  .catch(err => console.log(err))
}

/**
 * Get object tracking data in the heatmap data format
 * @param {string} id 
 */
export const getHeatmapData = (id) => dispatch => {
  fetch(`/sensor-data/visual/heatmap/${id}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_VISUAL_HEATMAP_DATA,
    payload: res
  }))
  .catch(err => console.log(err))
}