import { DOWNLOAD_FILE } from '../constants/actionTypes';
import * as api from '../api/download.js';


export const getFileDownload = (id, viewAteId, file) => async (dispatch) => {
  try {
    const data = await api.downloadFile(id, viewAteId, file);
    dispatch({ type: DOWNLOAD_FILE, payload: { fileDwn: data } });
    return data;
  } catch (error) {
    console.log('Error getFileDownload', error);
  }
};