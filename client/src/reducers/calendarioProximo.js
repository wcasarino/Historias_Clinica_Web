import {
  FETCH_CALP,
  START_LOADING_CALP,
  END_LOADING_CALP,
} from "../constants/actionTypes";

const calendarioProximoReducer = (
  state = { isLoading: true, calendarioProximo: [] },
  action
) => {
  switch (action.type) {
    case START_LOADING_CALP:
      return { ...state, isLoading: true };
    case END_LOADING_CALP:
      return { ...state, isLoading: false };
    case FETCH_CALP:
      return {
        ...state,
        calendarioProximo: action.payload.data,
      };
    default:
      return state;
  }
};

export default calendarioProximoReducer;
