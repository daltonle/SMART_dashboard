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

let timers = []
const clearTimer = () => { 
  for (let i = 0; i < timers.length; i++)
    window.clearTimeout(timers[i]) 
}

/**
 * Get data of air sensor given id
 * @param { string } id
 */
export const getAirData = (id) => (dispatch) => {
  clearTimer()

  fetch(`/api/sensor-data/air/live/${id}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(response => {
      dispatch({
        type: GET_AIR_DATA_LIVE,
        payload: response
      })
      
    })
    .catch(err => console.log(err))
  fetch(`/api/sensor-data/history/air/pm2_5/${id}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => dispatch({
      type: GET_PM25_DATA_HISTORY,
      payload: res
    }))
    .catch(err => console.log(err))
  fetch(`/api/sensor-data/history/air/pm10/${id}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => dispatch({
      type: GET_PM10_DATA_HISTORY,
      payload: res
    }))
    .catch(err => console.log(err))

  const getAirDataLive = () => {
    timers.push(setTimeout(getAirDataLive, 3000))
    fetch(`/api/sensor-data/air/live/${id}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => {
      dispatch({
        type: UPDATE_AIR_DATA_LIVE,
        payload: res
      })
    })
    .catch(err => console.log(err))
  }
  getAirDataLive()
}

/**
 * Get data of visual sensor given id
 * @param { string } id 
 */
export const getVisualData = (id) => (dispatch) => {
  clearTimer()

  fetch(`/api/sensor-data/visual/live/${id}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(response => {
      dispatch({
        type: GET_VISUAL_DATA_LIVE,
        payload: response
      })
    })
    .catch(err => console.log(err))
  fetch(`/api/sensor-data/history/visual/pedestrian/${id}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => dispatch({
      type: GET_PEDESTRIAN_HISTORY,
      payload: res
    }))
    .catch(err => console.log(err))
  fetch(`/api/sensor-data/history/visual/bicycle/${id}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => dispatch({
      type: GET_BICYCLE_HISTORY,
      payload: res
    }))
    .catch(err => console.log(err))
  fetch(`/api/sensor-data/history/visual/vehicle/${id}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => dispatch({
      type: GET_VEHICLE_HISTORY,
      payload: res
    }))
    .catch(err => console.log(err))
  fetch(`/api/sensor-data/visual/heatmap/${id}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => dispatch({
      type: GET_VISUAL_HEATMAP_DATA,
      payload: res
    }))
    .catch(err => console.log(err))
  fetch(`/api/sensor-data/visual/trajectory/${id}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => dispatch({
      type: GET_TRAJECTORY_DATA,
      payload: res
    }))
    .catch(err => console.log(err))

  // get live data after every minute
  const getVisualDataLive = () => {
    timers.push(setTimeout(getVisualDataLive, 6000))
    fetch(`/api/sensor-data/visual/live/${id}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => {
      dispatch({
        type: UPDATE_VISUAL_DATA_LIVE,
        payload: res
      })
    })
    .catch(err => console.log(err))
  }
  getVisualDataLive()
}

/**
 * Get average number of air particles by hour
 * @param {string} id 
 */
export const getAvgAirDataByHour = id => dispatch => {
  fetch(`/api/sensor-data/air/by-hour/avg/${id}`)
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
  fetch(`/api/sensor-data/air/by-hour/min/${id}`)
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
  fetch(`/api/sensor-data/air/by-hour/max/${id}`)
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
  fetch(`/api/sensor-data/visual/by-hour/avg/${id}`)
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
  fetch(`/api/sensor-data/visual/by-hour/min/${id}`)
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
  fetch(`/api/sensor-data/visual/by-hour/max/${id}`)
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
  fetch( `/api/sensor-data/air/by-day/pm2_5/${id}/${day}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_PM25_BY_DAY,
    payload: res
  }))
  .catch(err => console.log(err))

  fetch( `/api/sensor-data/air/by-day/pm10/${id}/${day}`)
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
  fetch( `/api/sensor-data/visual/by-day/pedestrian/${id}/${day}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_PEDESTRIAN_BY_DAY,
    payload: res
  }))
  .catch(err => console.log(err))

  fetch( `/api/sensor-data/visual/by-day/bicycle/${id}/${day}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_BICYCLE_BY_DAY,
    payload: res
  }))
  .catch(err => console.log(err))

  fetch( `/api/sensor-data/visual/by-day/vehicle/${id}/${day}`)
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
  fetch(`/api/sensor-data/visual/heatmap/${id}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_VISUAL_HEATMAP_DATA,
    payload: res
  }))
  .catch(err => console.log(err))
}