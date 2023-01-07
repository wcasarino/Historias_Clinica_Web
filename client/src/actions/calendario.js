import { FETCH_BY_SEARCH_CAL, START_LOADING_CAL, END_LOADING_CAL } from '../constants/actionTypes';
import * as api from '../api/index.js';
import swal from 'sweetalert'

export const getCalendarioBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING_CAL });
    const { data: { data, message, error } } = await api.fetchCalendarioBySearch(searchQuery);
    dispatch({ type: FETCH_BY_SEARCH_CAL, payload: { data, error } });

    if (error) {
      swal({
        title: "Buscar Calendario",
        text: message,
        icon: "error",
        timer: "7000"
      })
    }

    dispatch({ type: END_LOADING_CAL });
  } catch (error) {
    swal({
      title: "Buscar Calendario",
      text: error,
      icon: "error",
      timer: "7000"
    })
    console.log('Error getCalendarioBySearch', error)
  }
}

