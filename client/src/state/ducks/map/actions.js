import {
  ADD_AIR_MARKERS,
  ADD_VISUAL_MARKERS,
  CHANGE_LAYER
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

export const changeLayer = () => (dispatch, getState) => {
  dispatch({
    type: CHANGE_LAYER,
    payload: !getState().map.isAirLayer
  })
}