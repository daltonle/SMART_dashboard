import {
  ADD_AIR_MARKERS,
  ADD_VISUAL_MARKERS,
  CHANGE_LAYER,
  CHANGE_CENTRE,
  CHANGE_ZOOM,
  CHANGE_AIR_ATTR,
  CHANGE_VISUAL_ATTR
} from './types'

const _addMarkers = (type, dispatch) => {
  let t
  if (type === 'air') {
    t = ADD_AIR_MARKERS
  } else if (type === 'visual') {
    t = ADD_VISUAL_MARKERS
  }
  
  fetch(`/api/sensors/${type}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => dispatch({
      type: t,
      payload: res
    }))
    .catch(err => console.log(err))
}

export const addAllMarkers = () => dispatch => {
  _addMarkers('air', dispatch)
  _addMarkers('visual', dispatch)
}

export const addTypeMarkers = (type) => dispatch => {
  _addMarkers(type, dispatch)
}

/**
 * Change the types of sensors being displayed
 * @param {string} typeArray 
 */
export const changeLayer = (type) => (dispatch, getState) => {
  const { layers } = getState().map
  let nextLayers = {...layers}
  nextLayers = {
    ...nextLayers,
    [type]: !nextLayers[type]
  }
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

export const changeAirAttr = (attr) => dispatch => {
  dispatch({
    type: CHANGE_AIR_ATTR,
    payload: attr
  })
}

export const changeVisualAttr = (attr) => dispatch => {
  dispatch({
    type: CHANGE_VISUAL_ATTR,
    payload: attr
  })
}