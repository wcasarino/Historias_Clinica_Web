import {
  FETCH_CALP,
  START_LOADING_CALP,
  END_LOADING_CALP,
} from "../constants/actionTypes";
import * as api from "../api/index.js";
import swal from "sweetalert";

export const getCalendarioProximo = () => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING_CALP });
    const {
      data: { data, message, error },
    } = await api.fetchCalendarioProximo();
    dispatch({ type: FETCH_CALP, payload: { data, error } });

    if (error) {
      swal({
        title: "Buscar Calendario Próximo",
        text: message,
        icon: "error",
        timer: "7000",
      });
    }

    dispatch({ type: END_LOADING_CALP });
  } catch (error) {
    swal({
      title: "Buscar Calendario Próximo",
      text: error,
      icon: "error",
      timer: "7000",
    });
    console.log("Error getCalendarioProximo", error);
  }
};
