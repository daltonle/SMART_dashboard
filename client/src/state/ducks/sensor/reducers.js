import { 
  GET_AIR_DATA_LIVE, 
  GET_VISUAL_DATA_LIVE, 
  GET_AIR_DATA_HISTORY, 
  GET_VISUAL_DATA_HISTORY,
  GET_AVG_AIR_DATA_BY_HOUR,
  GET_MIN_AIR_DATA_BY_HOUR,
  GET_MAX_AIR_DATA_BY_HOUR,
  GET_AVG_VISUAL_DATA_BY_HOUR,
  GET_MIN_VISUAL_DATA_BY_HOUR,
  GET_MAX_VISUAL_DATA_BY_HOUR,
  GET_PM25_DATA_HISTORY,
  GET_PM10_DATA_HISTORY,
  GET_PEDESTRIAN_HISTORY,
  GET_BICYCLE_HISTORY,
  GET_VEHICLE_HISTORY
} from "./types"

/**
  store.state.sensor

  {
    visual: {
      name: "",
      description: "",
      to_char: "",
      pedestrians: "",
      bicycles: "",
      vehicles: ""
      history: [],
      byHour: {
        avg: [],
        min: [],
        max: []
      }
    },
    air: {
      name: "",
      description: "",
      to_char: "",
      pm2_5: "",
      pm10: "",
      history: [],
      byHour: {
        avg: [],
        min: [],
        max: []
      }
    }
  }
 */

const initialState = {}

const sensorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_AIR_DATA_LIVE:
      return {
        ...state,
        air: action.payload
      }
    case GET_VISUAL_DATA_LIVE:
      return {
        ...state,
        visual: action.payload
      }
    case GET_PM25_DATA_HISTORY:
      return {
        ...state,
        air: {
          ...state.air,
          historyPM2_5: action.payload
        }
      }
    case GET_PM10_DATA_HISTORY:
      return {
        ...state,
        air: {
          ...state.air,
          historyPM10: action.payload
        }
      }
    case GET_PEDESTRIAN_HISTORY:
      return {
        ...state,
        visual: {
          ...state.visual,
          historyPedestrian: action.payload
        }
      }
    case GET_BICYCLE_HISTORY:
      return {
        ...state,
        visual: {
          ...state.visual,
          historyBicycle: action.payload
        }
      }
    case GET_VEHICLE_HISTORY:
      return {
        ...state,
        visual: {
          ...state.visual,
          historyVehicle: action.payload
        }
      }
    case GET_AVG_AIR_DATA_BY_HOUR:
      return {
        ...state,
        air: {
          ...state.air,
          byHour: {
            ...state.air.byHour,
            avg: action.payload
          }
        }
      }
    case GET_MIN_AIR_DATA_BY_HOUR:
      return {
        ...state,
        air: {
          ...state.air,
          byHour: {
            ...state.air.byHour,
            min: action.payload
          }
        }
      }
    case GET_MAX_AIR_DATA_BY_HOUR:
      return {
        ...state,
        air: {
          ...state.air,
          byHour: {
            ...state.air.byHour,
            max: action.payload
          }
        }
      }
    case GET_AVG_VISUAL_DATA_BY_HOUR:
      return {
        ...state,
        visual: {
          ...state.visual,
          byHour: {
            ...state.visual.byHour,
            avg: action.payload
          }
        }
      }
    case GET_MIN_VISUAL_DATA_BY_HOUR:
      return {
        ...state,
        visual: {
          ...state.visual,
          byHour: {
            ...state.visual.byHour,
            min: action.payload
          }
        }
      }
    case GET_MAX_VISUAL_DATA_BY_HOUR:
      return {
        ...state,
        visual: {
          ...state.visual,
          byHour: {
            ...state.visual.byHour,
            max: action.payload
          }
        }
      }
    default: 
      return state
  }
}

export default sensorReducer
