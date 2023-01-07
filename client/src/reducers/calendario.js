import { FETCH_BY_SEARCH_CAL, START_LOADING_CAL, END_LOADING_CAL } from '../constants/actionTypes'


const calendarioReducer = (state = { isLoading: true, calendario: [] }, action) => {

  switch (action.type) {
    case START_LOADING_CAL:
      return { ...state, isLoading: true };
    case END_LOADING_CAL:
      return { ...state, isLoading: false };
    case FETCH_BY_SEARCH_CAL:
      return {
        ...state,
        calendario: action.payload.data,
      }
    default:
      return state;
  }

};

export default calendarioReducer;