import { SHOW_DETAILS, HIDE_DETAILS } from './types'

/**
  store.state.charts:
  
  {
    showDetails: bool
  }

 */

const initialState = {
  showDetails: false
}

const chartsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_DETAILS:
      return {
        ...state,
        showDetails: true
      }
    case HIDE_DETAILS:
      return {
        ...state,
        showDetails: false
      }
    default:
      return state
  }
}

export default chartsReducer