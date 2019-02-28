import {
  INCREMENT_COUNT,
  DECREMENT_COUNT,
  ADD_SENSOR,
  REMOVE_SENSOR,
  ADD_SENSOR_DATA,
  REMOVE_ALL_SENSORS
} from './types'


const initialState = {
  count: 0,
  sensors: []
}

const compareReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT_COUNT:
    case DECREMENT_COUNT:
      return {
        ...state,
        count: action.payload
      }
    case ADD_SENSOR:
      return {
        ...state,
        sensors: [
          ...state.sensors,
          action.payload
        ]
      }
    case ADD_SENSOR_DATA:
      return {
        ...state,
        sensors: action.payload
      }
    case REMOVE_SENSOR:
      return {
        ...state,
        sensors: action.payload
      }
    case REMOVE_ALL_SENSORS:
      return {
        ...state,
        sensors: []
      }
    default:
      return state
  }
}

export default compareReducer