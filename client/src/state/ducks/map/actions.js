import {
  ADD_AIR_MARKERS,
  ADD_VISUAL_MARKERS,
  CHANGE_LAYER,
  CHANGE_CENTRE,
  CHANGE_ZOOM
} from './types'

export const addAirMarkers = () => dispatch => {
  fetch('/sensors/air')
    .then(res => res.json())
    .then(res => dispatch({
      type: ADD_AIR_MARKERS,
      payload: res
    }))
    .catch(err => console.log(err))
}

export const addVisualMarkers = () => dispatch => {
  fetch('/sensors/visual')
  .then(res => res.json())
  .then(res => dispatch({
    type: ADD_VISUAL_MARKERS,
    payload: res
  }))
  .catch(err => console.log(err))
}

/**
 * Change the types of sensors being displayed
 * @param {[string]} typeArray 
 */
export const changeLayer = (typeArray) => (dispatch, getState) => {
  const { layers } = getState().map
  let nextLayers = {...layers}
  typeArray.map(type => {
    nextLayers = {
      ...nextLayers,
      [type]: !nextLayers[type]
    }
  })
  dispatch({
    type: CHANGE_LAYER,
    payload: nextLayers
  })
}

export const changeCentre = (position) => (dispatch) => {
  dispatch({
    type: CHANGE_CENTRE,
    payload: position
  })
}

export const changeZoom = (zoomLevel) => dispatch => {
  dispatch({
    type: CHANGE_ZOOM,
    payload: zoomLevel
  })
}