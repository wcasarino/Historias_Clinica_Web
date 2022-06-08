import { FETCH_BY_SEARCH_ATE, START_LOADING_ATE, END_LOADING_ATE, FETCH_ALL_ANOATE, FETCH_ZERO_ATE } from '../constants/actionTypes'


const atencionesReducer = (state = { isLoading: true, atenciones: [], anos: [] }, action) => {

  switch (action.type) {
    case START_LOADING_ATE:
      return { ...state, isLoading: true };
    case END_LOADING_ATE:
      return { ...state, isLoading: false };
    case FETCH_BY_SEARCH_ATE:
      return {
        ...state,
        atenciones: action.payload.data,
      }
    case FETCH_ALL_ANOATE:
      return {
        ...state,
        anos: action.payload.data
      };
    case FETCH_ZERO_ATE:
      return {
        ...state,
        atenciones: [],
      }
    default:
      return state;
  }

};

export default atencionesReducer;