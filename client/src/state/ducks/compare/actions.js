import { 
  ADD_SENSOR,
  REMOVE_SENSOR,
  ADD_SENSOR_DATA,
  INCREMENT_COUNT,
  DECREMENT_COUNT,
  REMOVE_ALL_SENSORS,
  UPDATE_LIVE_DATA,
  CHANGE_TYPE
} from "./types"

let timers = [null, null, null, null, null]

/**
 * Get all the data needed for comparing sensors
 * @param {string} id 
 * @param {string} desc
 * @param {string} type
 */
export const addCompareSensor = (id, desc, type) => async (dispatch, getState) => {
  dispatch({
    type: ADD_SENSOR,
    payload: { id: id, description: desc}
  })
  dispatch({
    type:INCREMENT_COUNT,
    payload: getState().compare.count + 1
  })
    
  fetch(`/api/compare/${type}/${id}`)
  .then(res => res.text())
  .then(text => text.length ? JSON.parse(text) : undefined)
  .then(res => {
    console.log(res)
    let nextSensors = [...getState().compare.sensors]
    let idx = nextSensors.findIndex(s => s.id === res.id) // undefined or in range [0, 4]
    if (idx)
      nextSensors[idx] = { ...res }
    dispatch({
      type: ADD_SENSOR_DATA,
      payload: nextSensors
    })

    // set live data of this sensor to be updated every 30 seconds
    clearTimeout(timers[idx])
    const updateDataLive = async () => {
      let liveData = await fetch(`/sensors/${type}/id=${nextSensors[idx].id}`)
        .then(res => res.text())
        .then(text => text.length ? JSON.parse(text) : undefined)
      console.log(liveData)
      dispatch({
        type: UPDATE_LIVE_DATA,
        payload: liveData,
        idx: idx
      })
    
      timers[idx] = setTimeout(updateDataLive, 30000)
    }

    updateDataLive()
  })
}

/**
 * Remove a sensor from compare list
 * @param {string} id 
 */
export const removeCompareSensor = id => (dispatch, getState) => {
  let nextSensors = [...getState().compare.sensors]
  let idx = nextSensors.findIndex(s => s.id === id)
  nextSensors.splice(idx, 1)

  clearTimeout(timers[idx])

  dispatch({
    type: REMOVE_SENSOR,
    payload: nextSensors
  })

  dispatch({
    type: DECREMENT_COUNT,
    payload: getState().compare.count - 1
  })
}

/**
 * Remove all sensors from the compare list
 */
export const removeAllSensors = () => dispatch => {
  dispatch({
    type: REMOVE_ALL_SENSORS
  })

  for (let i=0; i<timers.length; i++) {
    clearTimeout(timers[i])
  }
}

/**
 * Change the type of sensors being compared
 * @param {string} type 
 */
export const changeType = (type) => dispatch => {
  dispatch({
    type: CHANGE_TYPE,
    payload: type
  })
}