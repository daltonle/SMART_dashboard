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
  GET_VEHICLE_BY_DAY
} from './types'

/**
 * Get data of air sensor at given position, 
 * and the data of the closest visual sensor in a 10m radius
 * 
 * // REVIEW: At the moment only getting visual sensor with exact same coordinates
 * @param {{lng: number, lat: number}} sensor 
 */
export const getAirData = (sensor) => (dispatch) => {
  fetch(`/sensor-data/air/live/${sensor.lng},${sensor.lat}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => {
      dispatch({
        type: GET_AIR_DATA_LIVE,
        payload: res
      })
      if (res !== undefined) {
        fetch(`/sensor-data/history/air/pm2_5/${res.id}`)
          .then(res => res.text())
          .then(text => text.length ? JSON.parse(text) : undefined)
          .then(res => dispatch({
            type: GET_PM25_DATA_HISTORY,
            payload: res
          }))
          .catch(err => console.log(err))
        fetch(`/sensor-data/history/air/pm10/${res.id}`)
          .then(res => res.text())
          .then(text => text.length ? JSON.parse(text) : undefined)
          .then(res => dispatch({
            type: GET_PM10_DATA_HISTORY,
            payload: res
          }))
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))

  fetch(`/sensor-data/visual/live/${sensor.lng},${sensor.lat}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => {
      dispatch({
        type: GET_VISUAL_DATA_LIVE,
        payload: res
      })
      if (res !== undefined) {
        fetch(`/sensor-data/history/visual/pedestrian/${res.id}`)
          .then(res => res.text())
          .then(text => text.length ? JSON.parse(text) : undefined)
          .then(res => dispatch({
            type: GET_PEDESTRIAN_HISTORY,
            payload: res
          }))
          .catch(err => console.log(err))
        fetch(`/sensor-data/history/visual/bicycle/${res.id}`)
          .then(res => res.text())
          .then(text => text.length ? JSON.parse(text) : undefined)
          .then(res => dispatch({
            type: GET_BICYCLE_HISTORY,
            payload: res
          }))
          .catch(err => console.log(err))
        fetch(`/sensor-data/history/visual/vehicle/${res.id}`)
          .then(res => res.text())
          .then(text => text.length ? JSON.parse(text) : undefined)
          .then(res => dispatch({
            type: GET_VEHICLE_HISTORY,
            payload: res
          }))
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
}

/**
 * Get data of visual sensor at given position,
 * and the data of the closest air sensor in a 10m radius
 * 
 * // REVIEW: At the moment only getting air sensor with exact same coordinates
 * @param {{lng: number, lat: number}} sensor 
 */
export const getVisualData = (sensor) => (dispatch) => {
  fetch(`/sensor-data/visual/live/${sensor.lng},${sensor.lat}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => {
        dispatch({
        type: GET_VISUAL_DATA_LIVE,
        payload: res
      })
      if (res !== undefined) {
        fetch(`/sensor-data/history/visual/pedestrian/${res.id}`)
          .then(res => res.text())
          .then(text => text.length ? JSON.parse(text) : undefined)
          .then(res => dispatch({
            type: GET_PEDESTRIAN_HISTORY,
            payload: res
          }))
          .catch(err => console.log(err))
        fetch(`/sensor-data/history/visual/bicycle/${res.id}`)
          .then(res => res.text())
          .then(text => text.length ? JSON.parse(text) : undefined)
          .then(res => dispatch({
            type: GET_BICYCLE_HISTORY,
            payload: res
          }))
          .catch(err => console.log(err))
        fetch(`/sensor-data/history/visual/vehicle/${res.id}`)
          .then(res => res.text())
          .then(text => text.length ? JSON.parse(text) : undefined)
          .then(res => dispatch({
            type: GET_VEHICLE_HISTORY,
            payload: res
          }))
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))

  fetch(`/sensor-data/air/live/${sensor.lng},${sensor.lat}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => {
      dispatch({
        type: GET_AIR_DATA_LIVE,
        payload: res
      })
      if (res !== undefined) {
        fetch(`/sensor-data/history/air/pm2_5/${res.id}`)
          .then(res => res.text())
          .then(text => text.length ? JSON.parse(text) : undefined)
          .then(res => dispatch({
            type: GET_PM25_DATA_HISTORY,
            payload: res
          }))
          .catch(err => console.log(err))
        fetch(`/sensor-data/history/air/pm10/${res.id}`)
          .then(res => res.text())
          .then(text => text.length ? JSON.parse(text) : undefined)
          .then(res => dispatch({
            type: GET_PM10_DATA_HISTORY,
            payload: res
          }))
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
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
  .then(res => {console.log('res', res)
    dispatch({
    type: GET_PM25_BY_DAY,
    payload: res
  })})
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