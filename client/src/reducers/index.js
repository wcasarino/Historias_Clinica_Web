import { combineReducers } from 'redux';

import auth from './auth';
import pacientes from './pacientes';
import download from './download'
import atenciones from './atenciones'

export const reducers = combineReducers({ auth, pacientes, download, atenciones });
