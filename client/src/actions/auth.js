import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js';
import swal from 'sweetalert'

export const signin = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    dispatch({ type: AUTH, data });

    if (!data?.error) {
      router('/pacientes', { replace: true });
    } else {
      swal({
        title: "Ingreso al sistema",
        text: data?.message,
        icon: "error",
        timer: "7000"
      })
    }
  } catch (error) {
    console.log(error);
  }
};

export const signup = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);
    dispatch({ type: AUTH, data });

    if (!data?.error) {
      router('/', { replace: true });
    } else {
      swal({
        title: "Crear Usuario",
        text: data?.message,
        icon: "error",
        timer: "7000"
      })
    }

  } catch (error) {
    console.log(error);
  }
};
