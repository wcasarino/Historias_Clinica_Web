import { START_LOADING_PAC, END_LOADING_PAC, FETCH_ALL_PAC, FETCH_BY_SEARCH_PAC, FETCH_PAC, CREATE_PAC, UPDATE_PAC, UPDATE_DATOS_PAC, DELETE_PAC } from '../constants/actionTypes';

const pacientesReducer = (state = { isLoading: true, pacientes: [] }, action) => {
  switch (action.type) {
    case START_LOADING_PAC:
      return { ...state, isLoading: true };
    case END_LOADING_PAC:
      return { ...state, isLoading: false };
    case FETCH_ALL_PAC:
      return {
        ...state,
        pacientes: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
        documentos: action.payload.documentos,
      };
    case FETCH_BY_SEARCH_PAC:
      return {
        ...state,
        pacientes: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
        documentos: action.payload.documentos,
      };
    case FETCH_PAC:
      return { ...state, paciente: action.payload.paciente };
    case CREATE_PAC:
      return { ...state, pacientes: [...state.pacientes, action.payload.data], dniDuplicado: action.payload.dniDuplicado };
    case UPDATE_DATOS_PAC:
      if (!action.payload.error) {
        return { ...state, pacientes: state.pacientes.map((paciente) => (paciente._id === action.payload.data._id ? action.payload.data : paciente)), paciente: action.payload.data };
      }
      return state;
    case UPDATE_PAC:
      return { ...state, pacientes: state.pacientes.map((paciente) => (paciente._id === action.payload._id ? action.payload : paciente)), paciente: action.payload };
    case DELETE_PAC:
      return { ...state, pacientes: state.pacientes.filter((paciente) => paciente._id !== action.payload) };
    default:
      return state;
  }
};

export default pacientesReducer;
