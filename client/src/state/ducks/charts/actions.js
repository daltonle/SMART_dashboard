import { SHOW_DETAILS, HIDE_DETAILS, CHANGE_ZOOM_DOMAINS_HISTORY } from './types'

export const showDataDetails = () => dispatch => {
  dispatch({
    type: SHOW_DETAILS
  })
}

export const hideDataDetails = () => dispatch => {
  dispatch({
    type: HIDE_DETAILS
  })
}

export const changeZoomDomain = domain => dispatch => {
  dispatch({
    type: CHANGE_ZOOM_DOMAINS_HISTORY,
    payload: domain
  })
}