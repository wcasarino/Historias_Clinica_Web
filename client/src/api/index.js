import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5001' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});


export const fetchPaciente = (id) => API.get(`/pacientes/${id}`);
export const createPaciente = (newPaciente) => API.post('/pacientes', newPaciente);
export const fetchPacientes = (page) => API.get(`/pacientes?page=${page}`);
export const fetchPacientesBySearch = (searchQuery) => API.get(`/pacientes/search?searchQuery=${searchQuery.search || '9a69dc7e834f617'}&tags=${searchQuery.tags}&page=${searchQuery.page}&vista=${searchQuery.vista}&fechaAte1=${searchQuery.fechaAte1}&anomesStr=${searchQuery.anomesStr}`);

export const updatePaciente = (id, updatedPaciente) => API.patch(`/pacientes/${id}`, updatedPaciente);
export const deletePaciente = (id) => API.delete(`/pacientes/${id}`);
export const resumenPaciente = (value, id) => API.post(`/pacientes/${id}/resumenPaciente`, { value });
export const proximaAtencionPaciente = (value, id) => API.post(`/pacientes/${id}/proximaAtencionPaciente`, { value });
export const domicilioPaciente = (value, id) => API.post(`/pacientes/${id}/domicilioPaciente`, { value });
export const personaPaciente = (value, id) => API.post(`/pacientes/${id}/personaPaciente`, { value });
export const afamiliaresPaciente = (value, id) => API.post(`/pacientes/${id}/afamiliaresPaciente`, { value });
export const amedicosPaciente = (value, id) => API.post(`/pacientes/${id}/amedicosPaciente`, { value });
export const aginecoPaciente = (value, id) => API.post(`/pacientes/${id}/aginecoPaciente`, { value });
export const ahabitosPaciente = (value, id) => API.post(`/pacientes/${id}/ahabitosPaciente`, { value });
export const apsicosocialPaciente = (value, id) => API.post(`/pacientes/${id}/apsicosocialPaciente`, { value });

export const AddAtencion = (value, id) => API.post(`/pacientes/${id}/AddAtencion`, { value });
export const UpdateAtencion = (value, id) => API.patch(`/pacientes/${id}/UpdateAtencion`, { value });
export const DeleteAtencion = (value, id) => API.patch(`/pacientes/${id}/DeleteAtencion`, { value });

export const DeleteFileAtencion = (value, id) => API.patch(`/pacientes/${id}/DeleteFileAtencion`, { value });

export const UpdateSelectedFilesAtencion = (value, id) => API.post(`/upload/${id}/UpdateSelectedFilesAtencion`, { value });


export const fetchAtencionesBySearch = (searchQuery) => API.get(`/atenciones/search?searchQuery=${searchQuery.search || '9a69dc7e834f617'}&tags=${searchQuery.tags}&page=${searchQuery.page}&vista=${searchQuery.vista}&fechaAte1=${searchQuery.fechaAte1}&anomesStr=${searchQuery.anomesStr}`);

export const fetchAnoAtenciones = () => API.get(`/atenciones`);

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
