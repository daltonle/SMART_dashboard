import { 
  SHOW_DETAILS, 
  HIDE_DETAILS, 
  CHANGE_ZOOM_DOMAINS_HISTORY, 
  CHANGE_AIR_DOW_HOUR_CHART, 
  CHANGE_VISUAL_DOW_HOUR_CHART 
} from './types'

/**
  store.state.charts:
  
  {
    showDetails: bool
    history: {
      zoomDomain: { x: [] }
    },
    airDow: number
  }

 */

const initialState = {
  showDetails: false,
  history: {
    zoomDomain: { x: [new Date(2019, 1, 1), new Date()] }
  },
  airDow: new Date().getDay(),
  visualDow: new Date().getDay()
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
    case CHANGE_AIR_DOW_HOUR_CHART:
      return {
        ...state,
        airDow: action.payload
      }
    case CHANGE_VISUAL_DOW_HOUR_CHART:
      return {
        ...state,
        visualDow: action.payload
      }
    default:
      return state
  }
}

export default chartsReducer