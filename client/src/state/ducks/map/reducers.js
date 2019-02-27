import { ADD_AIR_MARKERS, ADD_VISUAL_MARKERS, CHANGE_LAYER, CHANGE_CENTRE } from "./types"

/**
  store.state.map

  {
    airMarkers: [
      { id: '',
        long: '',
        lat: '',
        alt: ''
      }
    ],
    visualMarkers: [
      { id: '',
        long: '',
        lat: '',
        alt: ''
      }
    ],
    isAirLayer: bool,
    centre: {
      lat,
      long
    }
  }

**/

const initialState = {
  isAirLayer: true,
  centre: { lat: -33.9225, lng: 150.9254 }
}

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_AIR_MARKERS:
      return {
        ...state,
        airMarkers: action.payload
      }
    case ADD_VISUAL_MARKERS:
      return {
        ...state,
        visualMarkers: action.payload
      }
    case CHANGE_LAYER:
      return {
        ...state,
        isAirLayer: action.payload
      }
    case CHANGE_CENTRE:
      return {
        ...state,
        centre: action.payload
      }
    default:
      return state
  }
}

export default mapReducer