import * as actionType from '../constants/actionTypes';

const authReducer = (state = { authData: null, errors: null, message: null }, action) => {
  switch (action.type) {
    case actionType.AUTH:
      if (!action.data.error) {
        localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
        return { ...state, authData: action.data, loading: false, errors: null };
      } else {
        localStorage.clear();
        return { ...state, authData: null, loading: false, errors: true, message: action.data.message };
      }

    case actionType.LOGOUT:
      localStorage.clear();
      return { ...state, authData: null, loading: false, errors: null };

    default:
      return state;
  }
};

export default authReducer;
