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
 */

const initialState = {}

export default mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_AIR_MARKERS:
      return {
        ...state,
        airMarkers: action.payload
      }
      break
    case ADD_VISUAL_MARKERS:
      return {
        ...state,
        visualMarkers: action.payload
      }
      break
    default:
      break
  }
}