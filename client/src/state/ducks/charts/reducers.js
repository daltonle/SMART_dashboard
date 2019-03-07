import {
  CHANGE_ZOOM_DOMAINS_HISTORY, 
  CHANGE_AIR_DOW_HOUR_CHART, 
  CHANGE_VISUAL_DOW_HOUR_CHART, 
  CHANGE_AIR_TYPE_HOUR_CHART,
  CHANGE_VISUAL_TYPE_HOUR_CHART,
  UPDATE_ANALYSIS_PERIOD
} from './types'

/**
  store.state.charts:
  
  {
    showDetails: bool
    history: {
      zoomDomain: { x: [] }
    },
    byHour: {
      air: {
        dow: number,
        type: ''
      },
      visual: {
        dow: number,
        type: ''
      }
    }
  }

 */

const initialState = {
  history: {
    zoomDomain: { x: [new Date(2019, 1, 1), new Date()] }
  },
  byHour: {
    air: {
      dow: new Date().getDay(),
      type: 'avg'
    },
    visual: {
      dow: new Date().getDay(),
      type: 'avg'
    }
  },
  analysisPeriod: {
    name: 'day',
    startDate: new Date(),
    endDate: new Date()
  }
}

const chartsReducer = (state = initialState, action) => {
  switch (action.type) {
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
        byHour: {
          ...state.byHour,
          air: {
            ...state.byHour.air,
            dow: action.payload
          }
        }
      }
    case CHANGE_VISUAL_DOW_HOUR_CHART:
      return {
        ...state,
        byHour: {
          ...state.byHour,
          visual: {
            ...state.byHour.visual,
            dow: action.payload
          }
        }
      }
    case CHANGE_AIR_TYPE_HOUR_CHART:
      return {
        ...state,
        byHour: {
          ...state.byHour,
          air: {
            ...state.byHour.air,
            type: action.payload
          }
        }
      }
    case CHANGE_VISUAL_TYPE_HOUR_CHART:
      return {
        ...state,
        byHour: {
          ...state.byHour,
          visual: {
            ...state.byHour.visual,
            type: action.payload
          }
        }
      }
    case UPDATE_ANALYSIS_PERIOD:
      return {
        ...state,
        analysisPeriod: action.payload
      }
    default:
      return state
  }
}

export default chartsReducer