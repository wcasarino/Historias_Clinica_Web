import { FETCH_BY_SEARCH_ATE, START_LOADING_ATE, END_LOADING_ATE, FETCH_ALL_ANOATE, FETCH_ZERO_ATE } from '../constants/actionTypes';
import * as api from '../api/index.js';
import swal from 'sweetalert'

export const getAtencionesBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING_ATE });
    const { data: { data, message, error } } = await api.fetchAtencionesBySearch(searchQuery);
    //console.log(data)
    dispatch({ type: FETCH_BY_SEARCH_ATE, payload: { data, error } });

    if (error) {
      swal({
        title: "Buscar Atenciones",
        text: message,
        icon: "error",
        timer: "7000"
      })
    }

    dispatch({ type: END_LOADING_ATE });
  } catch (error) {
    swal({
      title: "Buscar Atenciones",
      text: error,
      icon: "error",
      timer: "7000"
    })
    console.log('Error getAtencionesBySearch', error)
  }
}

export const getAnoAtenciones = () => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING_ATE });
    const { data: { data, message, error } } = await api.fetchAnoAtenciones();
    dispatch({ type: FETCH_ALL_ANOATE, payload: { data, error } });
    if (error) {
      swal({
        title: "Buscar Atenciones",
        text: message,
        icon: "error",
        timer: "7000"
      })
    }
    dispatch({ type: END_LOADING_ATE });
  } catch (error) {
    swal({
      title: "Buscar Atenciones",
      text: error,
      icon: "error",
      timer: "7000"
    })
    console.log('Error getAnoAtenciones', error);
  }
};

export const getZeroAtenciones = () => (dispatch) => {
  try {
    dispatch({ type: FETCH_ZERO_ATE });
  } catch (error) {
    swal({
      title: "Buscar Atenciones",
      text: error,
      icon: "error",
      timer: "7000"
    })
    console.log('Error getZeroAtenciones', error)

  }
}