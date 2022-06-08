import express from 'express';

import { getPacientes, getPacientesBySearch, getPaciente, createPaciente, updatePaciente, AddAtencion, DeleteAtencion, UpdateAtencion, deletePaciente, resumenPaciente, domicilioPaciente, personaPaciente, afamiliaresPaciente, amedicosPaciente, aginecoPaciente, ahabitosPaciente, apsicosocialPaciente, DeleteFileAtencion, proximaAtencionPaciente } from '../controllers/pacientes.js';

const router = express.Router();
import auth from "../middleware/auth.js";

// Necesitan autorización 
//router.delete('/:id', auth, deletePaciente);
//router.post('/', auth, createPaciente);

router.delete('/:id', deletePaciente);
router.post('/', createPaciente);

router.get('/', getPacientes);
router.get('/search', getPacientesBySearch);
router.get('/:id', getPaciente);
router.patch('/:id', updatePaciente);

router.patch('/:id/DeleteAtencion', DeleteAtencion);
router.patch('/:id/UpdateAtencion', UpdateAtencion);
router.post('/:id/AddAtencion', AddAtencion);


router.patch('/:id/DeleteFileAtencion', DeleteFileAtencion);

router.post('/:id/resumenPaciente', resumenPaciente);
router.post('/:id/proximaAtencionPaciente', proximaAtencionPaciente);
router.post('/:id/domicilioPaciente', domicilioPaciente);
router.post('/:id/personaPaciente', personaPaciente);
router.post('/:id/afamiliaresPaciente', afamiliaresPaciente);
router.post('/:id/amedicosPaciente', amedicosPaciente);
router.post('/:id/aginecoPaciente', aginecoPaciente);
router.post('/:id/ahabitosPaciente', ahabitosPaciente);
router.post('/:id/apsicosocialPaciente', apsicosocialPaciente);

export default router;