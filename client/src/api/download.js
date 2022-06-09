import axios from 'axios';

const API = axios.create({ baseURL: 'https://historias-clinicas-api.herokuapp.com/', responseType: 'blob' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});


export const downloadFile = (id, viewAteId, file) => API.get(`/download/${id}/${viewAteId}/${file}/downloadFile`);