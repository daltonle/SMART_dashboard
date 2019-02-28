import {
  INCREMENT_COUNT,
  DECREMENT_COUNT,
  ADD_SENSOR,
  REMOVE_SENSOR
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
    case REMOVE_SENSOR:
      return {
        ...state,
        sensors: state.sensors.filter(s => s.id !== action.id)
      }
    default:
      return state
  }
}

export default compareReducer