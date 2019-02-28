import { 
  ADD_SENSOR,
  REMOVE_SENSOR,
  ADD_SENSOR_DATA,
  INCREMENT_COUNT,
  DECREMENT_COUNT
} from "./types"

/**
 * Get all the data needed for comparing sensors
 * @param {string} id 
 * @param {string} name
 */
export const addCompareSensor = (id, desc) => (dispatch, getState) => {
  const { isAirLayer } = getState().map
  if (isAirLayer) {
    dispatch({
      type: ADD_SENSOR,
      payload: { id: id, description: desc}
    })
    dispatch({
      type:INCREMENT_COUNT,
      payload: getState().compare.count + 1
    })
    fetch(`compare/air/${id}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => {
      let nextSensors = [...getState().compare.sensors]
      let idx = nextSensors.findIndex(s => s.id === res.id)
      nextSensors[idx] = { ...res }
      dispatch({
        type: ADD_SENSOR_DATA,
        payload: nextSensors
      })
    })
    .catch(err => console.log(err))
  }
  else {
    
  }
}

/**
 * Remove a sensor from compare list
 * @param {string} id 
 */
export const removeCompareSensor = id => (dispatch, getState) => {
  let nextSensors = [...getState().compare.sensors]
  let idx = nextSensors.findIndex(s => s.id === id)
  nextSensors.splice(idx, 1)

  dispatch({
    type: REMOVE_SENSOR,
    payload: nextSensors
  })

  dispatch({
    type: DECREMENT_COUNT,
    payload: getState().compare.count - 1
  })
}