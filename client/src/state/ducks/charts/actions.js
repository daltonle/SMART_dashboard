import { SHOW_DETAILS, HIDE_DETAILS } from './types'

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