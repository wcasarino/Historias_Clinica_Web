import { START_LOADING_PAC, END_LOADING_PAC, FETCH_ALL_PAC, FETCH_PAC, FETCH_BY_SEARCH_PAC, CREATE_PAC, UPDATE_PAC, UPDATE_DATOS_PAC, DELETE_PAC } from '../constants/actionTypes';
import * as api from '../api/index.js';
import swal from 'sweetalert'


export const getPaciente = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING_PAC });
    const { data } = await api.fetchPaciente(id);
    dispatch({ type: FETCH_PAC, payload: { paciente: data } });
  } catch (error) {
    console.log('Error getPaciente', error);
  }
};

export const getPacientes = (page) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING_PAC });
    const { data: { data, currentPage, numberOfPages, documentos, datosVolver } } = await api.fetchPacientes(page);
    dispatch({ type: FETCH_ALL_PAC, payload: { data, currentPage, numberOfPages, documentos, datosVolver } });
    dispatch({ type: END_LOADING_PAC });
  } catch (error) {
    console.log('Error getPacientes', error);
  }
};

export const getPacientesBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING_PAC });
    const { data: { data, currentPage, numberOfPages, documentos, datosVolver } } = await api.fetchPacientesBySearch(searchQuery);
    dispatch({ type: FETCH_BY_SEARCH_PAC, payload: { data, currentPage, numberOfPages, documentos, datosVolver } });
    dispatch({ type: END_LOADING_PAC });
  } catch (error) {
    console.log('Error getPacientesBySearch', error);
  }
};

export const createPaciente = (paciente, history) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING_PAC });
    const { data: { data, dniDuplicado } } = await api.createPaciente(paciente);
    dispatch({ type: CREATE_PAC, payload: { data, dniDuplicado } });
    history(`/pacientes/${data._id}`, { replace: true });
  } catch (error) {
    console.log('Error createPaciente', error);
  }
};

export const deletePaciente = (id) => async (dispatch) => {
  try {
    await api.deletePaciente(id);
    dispatch({ type: DELETE_PAC, payload: id });
  } catch (error) {
    console.log('Error deletePaciente', error);
  }
};



export const updatePaciente = (id, paciente) => async (dispatch) => {
  try {
    const { data: { data, message, error } } = await api.updatePaciente(id, paciente);
    dispatch({ type: UPDATE_DATOS_PAC, payload: { data, error } });
    if (error) {
      swal({
        title: "Actualizar Paciente",
        text: message,
        icon: "error",
        timer: "7000"
      })
    }
  } catch (error) {
    swal({
      title: "Actualizar Paciente",
      text: error,
      icon: "error",
      timer: "7000"
    })
    console.log('Error updatePaciente loco', error);
  }
};

export const resumenPaciente = (value, id) => async (dispatch) => {
  try {
    const { data: { data, message, error } } = await api.resumenPaciente(value, id);
    dispatch({ type: UPDATE_DATOS_PAC, payload: { data, error } });
    if (error) {
      swal({
        title: "Actualizar Resumen",
        text: message,
        icon: "error",
        timer: "7000"
      })
    }
  } catch (error) {
    swal({
      title: "Actualizar Resumen",
      text: error,
      icon: "error",
      timer: "7000"
    })
    console.log('Error resumenPaciente', error);
  }
}

export const proximaAtencionPaciente = (value, id) => async (dispatch) => {
  try {
    const { data: { data, message, error } } = await api.proximaAtencionPaciente(value, id);
    dispatch({ type: UPDATE_DATOS_PAC, payload: { data, error } });
    if (error) {
      swal({
        title: "Actualizar Próxima Atención",
        text: message,
        icon: "error",
        timer: "7000"
      })
    }
  } catch (error) {
    swal({
      title: "Actualizar Próxima Atención",
      text: error,
      icon: "error",
      timer: "7000"
    })
    console.log('Error proximaAtencionPaciente', error);
  }
}

export const domicilioPaciente = (value, id) => async (dispatch) => {
  try {
    const { data: { data, message, error } } = await api.domicilioPaciente(value, id);
    dispatch({ type: UPDATE_DATOS_PAC, payload: { data, error } });
    if (error) {
      swal({
        title: "Actualizar Domicilio Paciente",
        text: message,
        icon: "error",
        timer: "7000"
      })
    }
  } catch (error) {
    swal({
      title: "Actualizar Domicilio Paciente",
      text: error,
      icon: "error",
      timer: "7000"
    })
    console.log('Error domicilioPaciente', error);
  }
}

export const personaPaciente = (value, id) => async (dispatch) => {
  try {
    const { data: { data, message, error } } = await api.personaPaciente(value, id);
    dispatch({ type: UPDATE_DATOS_PAC, payload: { data, error } });
    if (error) {
      swal({
        title: "Actualizar Datos Personales",
        text: message,
        icon: "error",
        timer: "7000"
      })
    }
  } catch (error) {
    swal({
      title: "Actualizar Datos Personales",
      text: error,
      icon: "error",
      timer: "7000"
    })
    console.log('Error personaPaciente', error);
  }
}

export const afamiliaresPaciente = (value, id) => async (dispatch) => {
  try {
    const { data: { data, message, error } } = await api.afamiliaresPaciente(value, id);
    dispatch({ type: UPDATE_DATOS_PAC, payload: { data, error } });
    if (error) {
      swal({
        title: "Actualizar Antecedentes Familiares",
        text: message,
        icon: "error",
        timer: "7000"
      })
    }
  } catch (error) {
    swal({
      title: "Actualizar Antecedentes Familiares",
      text: error,
      icon: "error",
      timer: "7000"
    })
    console.log('Error afamiliaresPaciente', error);
  }
}

export const amedicosPaciente = (value, id) => async (dispatch) => {
  try {
    const { data: { data, message, error } } = await api.amedicosPaciente(value, id);
    dispatch({ type: UPDATE_DATOS_PAC, payload: { data, error } });
    if (error) {
      swal({
        title: "Actualizar Antecedentes Médicos",
        text: message,
        icon: "error",
        timer: "7000"
      })
    }
  } catch (error) {
    swal({
      title: "Actualizar Antecedentes Médicos",
      text: error,
      icon: "error",
      timer: "7000"
    })
    console.log('Error amedicosPaciente', error);
  }
}

export const aginecoPaciente = (value, id) => async (dispatch) => {
  try {
    const { data: { data, message, error } } = await api.aginecoPaciente(value, id);
    dispatch({ type: UPDATE_DATOS_PAC, payload: { data, error } });
    if (error) {
      swal({
        title: "Actualizar Antecedentes Gineco-Obstétricos",
        text: message,
        icon: "error",
        timer: "7000"
      })
    }
  } catch (error) {
    swal({
      title: "Actualizar Antecedentes Gineco-Obstétricos",
      text: error,
      icon: "error",
      timer: "7000"
    })
    console.log('Error aginecoPaciente', error);
  }
}

export const ahabitosPaciente = (value, id) => async (dispatch) => {
  try {
    const { data: { data, message, error } } = await api.ahabitosPaciente(value, id);
    dispatch({ type: UPDATE_DATOS_PAC, payload: { data, error } });
    if (error) {
      swal({
        title: "Actualizar Hábitos",
        text: message,
        icon: "error",
        timer: "7000"
      })
    }
  } catch (error) {
    swal({
      title: "Actualizar Hábitos",
      text: error,
      icon: "error",
      timer: "7000"
    })
    console.log('Error ahabitosPaciente', error);
  }
}

export const apsicosocialPaciente = (value, id) => async (dispatch) => {
  try {
    const { data: { data, message, error } } = await api.apsicosocialPaciente(value, id);
    dispatch({ type: UPDATE_DATOS_PAC, payload: { data, error } });
    if (error) {
      swal({
        title: "Actualizar Situación Psico-Social",
        text: message,
        icon: "error",
        timer: "7000"
      })
    }
  } catch (error) {
    swal({
      title: "Actualizar Situación Psico-Social",
      text: error,
      icon: "error",
      timer: "7000"
    })
    console.log('Error apsicosocialPaciente', error);
  }
}

export const AddAtencion = (value, id) => async (dispatch) => {
  try {
    const { data } = await api.AddAtencion(value, id);
    dispatch({ type: UPDATE_PAC, payload: data });
    return data.atenciones;
  } catch (error) {
    console.log('Error AddAtencion', error);
  }
}

export const UpdateAtencion = (value, id) => async (dispatch) => {
  try {
    const { data } = await api.UpdateAtencion(value, id);
    dispatch({ type: UPDATE_PAC, payload: data });
    return data.atenciones;
  } catch (error) {
    console.log('Error UpdateAtencion', error);
  }
}

export const DeleteAtencion = (value, id) => async (dispatch) => {
  try {
    const { data } = await api.DeleteAtencion(value, id);
    dispatch({ type: UPDATE_PAC, payload: data });
    return data.atenciones;
  } catch (error) {
    console.log('Error DeleteAtencion', error);
  }
}


export const DeleteFileAtencion = (value, id) => async (dispatch) => {
  try {
    const { data } = await api.DeleteFileAtencion(value, id);
    dispatch({ type: UPDATE_PAC, payload: data });
    return data.atenciones;
  } catch (error) {
    console.log('Error DeleteFileAtencion', error);
  }
}

export const UpdateSelectedFilesAtencion = (value, id) => async (dispatch) => {
  try {
    const { data } = await api.UpdateSelectedFilesAtencion(value, id);
    dispatch({ type: UPDATE_PAC, payload: data });
    return data;
  } catch (error) {
    console.log('Error UpdateSelectedFilesAtencion', error);
  }
}
