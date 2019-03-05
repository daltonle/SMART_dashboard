import {
  INCREMENT_COUNT,
  DECREMENT_COUNT,
  ADD_SENSOR,
  REMOVE_SENSOR,
  ADD_SENSOR_DATA,
  REMOVE_ALL_SENSORS,
  UPDATE_LIVE_DATA,
  CHANGE_TYPE
} from './types'


const initialState = {
  count: 0,
  type: 'air',
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
    case UPDATE_LIVE_DATA:
      const newSensors = [...state.sensors]
      if (newSensors[action.idx].id === action.payload.id) // only update if id matches
        newSensors[action.idx] = {...action.payload}
      return {
        ...state,
        sensors: newSensors
      }
    case REMOVE_SENSOR:
      return {
        ...state,
        sensors: action.payload
      }
    case REMOVE_ALL_SENSORS:
      return {
        ...state,
        sensors: [],
        count: 0
      }
    case CHANGE_TYPE:
      return {
        ...state,
        type: action.payload
      }
    default:
      return state
  }
}

export default compareReducer