import { 
  SHOW_DETAILS, 
  HIDE_DETAILS, 
  CHANGE_ZOOM_DOMAINS_HISTORY, 
  CHANGE_AIR_DOW_HOUR_CHART,
  CHANGE_VISUAL_DOW_HOUR_CHART
} from './types'

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

export const changeAirDowChart = day => dispatch => {
  dispatch({
    type: CHANGE_AIR_DOW_HOUR_CHART,
    payload: day
  })
}

export const changeVisualDowChart = day => dispatch => {
  dispatch({
    type: CHANGE_VISUAL_DOW_HOUR_CHART,
    payload: day
  })
}