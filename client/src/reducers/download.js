import { DOWNLOAD_FILE } from '../constants/actionTypes';

const downloadReducer = (state = { fileDwn: {} }, action) => {
  switch (action.type) {
    case DOWNLOAD_FILE:
      return { ...state, fileDwn: action.payload.fileDwn };
    default:
      return state;
  }
};

export default downloadReducer;