import { ADD_AIR_MARKERS, ADD_VISUAL_MARKERS } from "./types";

/**
  State tree

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
    ]
  }

**/

const initialState = {}

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
    default:
      return state
  }
}

export default mapReducer