import { SHOW_DETAILS, HIDE_DETAILS, CHANGE_ZOOM_DOMAINS_HISTORY } from './types'

/**
  store.state.charts:
  
  {
    showDetails: bool
    history: {
      zoomDomain: { x: [] }
    }
  }

 */

const initialState = {
  showDetails: false,
  history: {
    zoomDomain: { x: [new Date(2019, 1, 1), new Date()] }
  }
}

const chartsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_DETAILS:
      return {
        ...state,
        showDetails: true
      }
    case HIDE_DETAILS:
      return {
        ...state,
        showDetails: false
      }
    case CHANGE_ZOOM_DOMAINS_HISTORY:
      return {
        ...state,
        history: {
          ...state.history,
          zoomDomain: action.payload
        }
      }
    default:
      return state
  }
}

export default chartsReducer