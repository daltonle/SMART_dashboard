import { GET_AIR_DATA_LIVE, GET_VISUAL_DATA_LIVE } from "./types"

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
    default: break
  }
}
