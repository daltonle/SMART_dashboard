import {
  CHANGE_ZOOM_DOMAINS_HISTORY, 
  CHANGE_AIR_DOW_HOUR_CHART,
  CHANGE_VISUAL_DOW_HOUR_CHART,
  CHANGE_AIR_TYPE_HOUR_CHART,
  CHANGE_VISUAL_TYPE_HOUR_CHART
} from './types'

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

export const changeAirTypeHourChart = aggType => dispatch => {
  dispatch({
    type: CHANGE_AIR_TYPE_HOUR_CHART,
    payload: aggType
  })
}

export const changeVisualTypeHourChart = aggType => dispatch => {
  dispatch({
    type: CHANGE_VISUAL_TYPE_HOUR_CHART,
    payload: aggType
  })
}