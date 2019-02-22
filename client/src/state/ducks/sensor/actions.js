import {
  GET_AIR_DATA_LIVE, 
  GET_VISUAL_DATA_LIVE, 
  GET_AIR_DATA_HISTORY, 
  GET_VISUAL_DATA_HISTORY,
  GET_AVG_AIR_DATA_BY_HOUR,
  GET_MIN_AIR_DATA_BY_HOUR,
  GET_MAX_AIR_DATA_BY_HOUR,
  GET_AVG_VISUAL_DATA_BY_HOUR,
  GET_MIN_VISUAL_DATA_BY_HOUR,
  GET_MAX_VISUAL_DATA_BY_HOUR,
  GET_PM25_DATA_HISTORY,
  GET_PM10_DATA_HISTORY
} from './types'

// get live data of air sensor at given position,
// and the data of the closest visual sensor in a 10m radius
// REVIEW: At the moment only getting visual sensor with exact same coordinates
export const getAirDataLive = (sensor) => (dispatch) => {
  fetch(`/sensor-data/air/live/${sensor.lng},${sensor.lat}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => dispatch({
      type: GET_AIR_DATA_LIVE,
      payload: res
    }))
    .catch(err => console.log(err))

  fetch(`/sensor-data/visual/live/${sensor.lng},${sensor.lat}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => dispatch({
      type: GET_VISUAL_DATA_LIVE,
      payload: res
    }))
    .catch(err => console.log(err))
}

// get live data of visual sensor at given position,
// and the data of the closest air sensor in a 10m radius
// REVIEW: At the moment only getting air sensor with exact same coordinates
export const getVisualDataLive = (sensor) => (dispatch) => {
  fetch(`/sensor-data/visual/live/${sensor.lng},${sensor.lat}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => dispatch({
      type: GET_VISUAL_DATA_LIVE,
      payload: res
    }))
    .catch(err => console.log(err))

  fetch(`/sensor-data/air/live/${sensor.lng},${sensor.lat}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => dispatch({
      type: GET_AIR_DATA_LIVE,
      payload: res
    }))
    .catch(err => console.log(err))
}

// get air data history of a sensor by id
export const getAirDataHistory = id => dispatch => {
  fetch(`/sensor-data/air/${id}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => dispatch({
      type: GET_AIR_DATA_HISTORY,
      payload: res
    }))
    .catch(err => console.log(err))
}

// get PM2_5 data history by id
export const getDataHistoryPM2_5 = id => dispatch => {
  fetch(`/sensor-data/pm25/${id}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => dispatch({
      type: GET_PM25_DATA_HISTORY,
      payload: res
    }))
    .catch(err => console.log(err))
}

// get PM10 data history by id
export const getDataHistoryPM10 = id => dispatch => {
  fetch(`/sensor-data/pm25/${id}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => dispatch({
      type: GET_PM10_DATA_HISTORY,
      payload: res
    }))
    .catch(err => console.log(err))
}

// get visual data history of a sensor by id
export const getVisualDataHistory = id => dispatch => {
  fetch(`/sensor-data/visual/${id}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => dispatch({
      type: GET_VISUAL_DATA_HISTORY,
      payload: res
    }))
    .catch(err => console.log(err))
}

// get average air data by hour
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

// get min air data by hour
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

// get max air data by hour
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

// get average visual data history by hour
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

// get min visual data history by hour
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

// get max visual data history by hour
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