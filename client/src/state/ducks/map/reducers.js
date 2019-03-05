import { ADD_AIR_MARKERS, ADD_VISUAL_MARKERS, CHANGE_LAYER, CHANGE_CENTRE, CHANGE_ZOOM } from "./types"

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
    centre: {
      lat,
      long
    }
  }

**/

const initialState = {
  layers: {
    air: true,
    visual: false
  },
  centre: { lat: -33.9225, lng: 150.9254 },
  zoomLevel: 15
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
        layers: action.payload
      }
    case CHANGE_CENTRE:
      return {
        ...state,
        centre: action.payload
      }
    case CHANGE_ZOOM:
      return {
        ...state,
        zoomLevel: action.payload
      }
    default:
      return state
  }
}

export default mapReducer