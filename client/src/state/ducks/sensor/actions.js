import {
  GET_AIR_DATA_LIVE, 
  GET_VISUAL_DATA_LIVE, 
  GET_AIR_DATA_HISTORY, 
  GET_VISUAL_DATA_HISTORY, 
  GET_AIR_DATA_BY_HOUR, 
  GET_VISUAL_DATA_BY_HOUR
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

// get air data history by hour
export const getAirDataByHour = id => dispatch => {
  fetch(`/sensor-data/air/by-hour/${id}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_AIR_DATA_BY_HOUR,
    payload: res
  }))
  .catch(err => console.log(err))
}

// get visual data history by hour
export const getVisualDataByHour = id => dispatch => {
  fetch(`/sensor-data/visual/by-hour/${id}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => dispatch({
    type: GET_VISUAL_DATA_BY_HOUR,
    payload: res
  }))
  .catch(err => console.log(err))
}