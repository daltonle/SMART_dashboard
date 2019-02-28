import { 
  ADD_SENSOR,
  REMOVE_SENSOR
} from "./types"

/**
 * Get all the data needed for comparing sensors
 * @param {string} id 
 */
export const addCompareSensor = id => (dispatch, getState) => {
  const { isAirLayer } = getState().map
  if (isAirLayer) {
    fetch(`compare/air/${id}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => dispatch({
      type: ADD_SENSOR,
      payload: res
    }))
    .catch(err => console.log(err))
  }
  else {
    
  }
}

/**
 * Remove a sensor from compare list
 * @param {string} id 
 */
export const removeCompareSensor = id => dispatch => {
  dispatch({
    type: REMOVE_SENSOR,
    id: id
  })
}