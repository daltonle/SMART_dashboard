import { GET_AIR_DATA_LIVE, GET_VISUAL_DATA_LIVE, GET_AIR_DATA_HISTORY, GET_VISUAL_DATA_HISTORY } from "./types"

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
    },
    air: {
      name: "",
      description: "",
      to_char: "",
      pm2_5: "",
      pm10: ""
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
    case GET_AIR_DATA_HISTORY:
      return {
        ...state,
        air: {
          ...state.air,
          history: action.payload
        }
      }
    case GET_VISUAL_DATA_HISTORY:
      return {
        ...state,
        visual: {
          ...state.visual,
          history: action.payload
        }
      }
    default: 
      return state
  }
}

export default sensorReducer
