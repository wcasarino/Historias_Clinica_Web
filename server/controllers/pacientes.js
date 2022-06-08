import mongoose from 'mongoose';
import fs from 'fs';

import PacienteDatos from '../models/pacienteDatos.js';

export const getPacientes = async (req, res) => {
    const { page } = req.query;

    try {
        const LIMIT = 13;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
        const total = await PacienteDatos.countDocuments({});
        const pacientes = await PacienteDatos.find().sort({ proximaAtencion: -1 }).limit(LIMIT).skip(startIndex);
        res.status(201).json({ data: pacientes, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT), documentos: total });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const createPaciente = async (req, res) => {
    const paciente = req.body;
    const newPacienteDatos = new PacienteDatos({ ...paciente, userId: req.userId })

    try {
        const pacienteDNI = await PacienteDatos.findOne({ dni: newPacienteDatos.dni })
        if (pacienteDNI) {
            res.status(201).json({ data: pacienteDNI, dniDuplicado: true });
        } else {
            await newPacienteDatos.save();
            res.status(201).json({ data: newPacienteDatos, dniDuplicado: false });
        }
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


export const getPacientesBySearch = async (req, res) => {
    const { searchQuery, tags, vista, page, fechaAte1, anomesStr } = req.query;
    let today = new Date();

    try {
        const LIMIT = 13;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
        const dni = new RegExp(searchQuery, "i");
        const apellidos = new RegExp(searchQuery, "i");
        const nombres = new RegExp(searchQuery, "i");
        let pacientes = []
        let total = 1

        switch (vista) {
            case 'anomes':
                if (searchQuery !== '9a69dc7e834f617' || tags.length > 0) {
                    if (searchQuery !== '9a69dc7e834f617' && tags.length > 0) {
                        //console.log('tiene search y tags');
                        pacientes = await PacienteDatos.find({
                            $and: [
                                { $or: [{ dni }, { apellidos }, { nombres }] },
                                { tags: { $in: tags.split(',') } },
                                { "atenciones.anomesStr": anomesStr }
                            ]
                        }).sort({ proximaAtencion: -1 }).limit(LIMIT).skip(startIndex);
                        total = await PacienteDatos.countDocuments({
                            $and: [
                                { $or: [{ dni }, { apellidos }, { nombres }] },
                                { tags: { $in: tags.split(',') } },
                                { "atenciones.anomesStr": anomesStr }
                            ]
                        });
                    } else {
                        if (searchQuery !== '9a69dc7e834f617') {
                            //console.log('Solo tiene nombres');
                            pacientes = await PacienteDatos.find({
                                $and: [
                                    { $or: [{ dni }, { apellidos }, { nombres }] },
                                    { "atenciones.anomesStr": anomesStr }
                                ]
                            }).sort({ proximaAtencion: -1 }).limit(LIMIT).skip(startIndex);
                            total = await PacienteDatos.countDocuments({
                                $and: [
                                    { $or: [{ dni }, { apellidos }, { nombres }] },
                                    { "atenciones.anomesStr": anomesStr }
                                ]
                            });
                        } else {
                            //console.log('Solo tiene tags');
                            pacientes = await PacienteDatos.find({
                                $and: [
                                    { tags: { $in: tags.split(',') } },
                                    { "atenciones.anomesStr": anomesStr }
                                ]
                            }).sort({ proximaAtencion: -1 }).limit(LIMIT).skip(startIndex);
                            total = await PacienteDatos.countDocuments({
                                $and: [
                                    { tags: { $in: tags.split(',') } },
                                    { "atenciones.anomesStr": anomesStr }
                                ]
                            });
                        }
                    }
                } else {
                    //console.log('no tiene nombre ni tags')
                    pacientes = await PacienteDatos.find({ "atenciones.anomesStr": anomesStr }).sort({ proximaAtencion: -1 }).limit(LIMIT).skip(startIndex);
                    total = await PacienteDatos.countDocuments({ "atenciones.anomesStr": anomesStr });
                }

                break;

            case 'dia':
                //console.log('entro DIA')
                if (searchQuery !== '9a69dc7e834f617' || tags.length > 0) {
                    if (searchQuery !== '9a69dc7e834f617' && tags.length > 0) {
                        //console.log('tiene search y tags');
                        pacientes = await PacienteDatos.find({
                            $and: [
                                { $or: [{ dni }, { apellidos }, { nombres }] },
                                { tags: { $in: tags.split(',') } },
                                { "atenciones.diaStr": fechaAte1 }
                            ]
                        }).sort({ proximaAtencion: -1 }).limit(LIMIT).skip(startIndex);
                        total = await PacienteDatos.countDocuments({
                            $and: [
                                { $or: [{ dni }, { apellidos }, { nombres }] },
                                { tags: { $in: tags.split(',') } },
                                { "atenciones.diaStr": fechaAte1 }
                            ]
                        });
                    } else {
                        if (searchQuery !== '9a69dc7e834f617') {
                            //console.log('Solo tiene nombres');
                            pacientes = await PacienteDatos.find({
                                $and: [
                                    { $or: [{ dni }, { apellidos }, { nombres }] },
                                    { "atenciones.diaStr": fechaAte1 }
                                ]
                            }).sort({ proximaAtencion: -1 }).limit(LIMIT).skip(startIndex);
                            total = await PacienteDatos.countDocuments({
                                $and: [
                                    { $or: [{ dni }, { apellidos }, { nombres }] },
                                    { "atenciones.diaStr": fechaAte1 }
                                ]
                            });
                        } else {
                            //console.log('Solo tiene tags');
                            pacientes = await PacienteDatos.find({
                                $and: [
                                    { tags: { $in: tags.split(',') } },
                                    { "atenciones.diaStr": fechaAte1 }
                                ]
                            }).sort({ proximaAtencion: -1 }).limit(LIMIT).skip(startIndex);
                            total = await PacienteDatos.countDocuments({
                                $and: [
                                    { tags: { $in: tags.split(',') } },
                                    { "atenciones.diaStr": fechaAte1 }
                                ]
                            });
                        }
                    }
                } else {
                    //console.log('no tiene nombre ni tags')
                    pacientes = await PacienteDatos.find({ "atenciones.diaStr": fechaAte1 }).sort({ proximaAtencion: -1 }).limit(LIMIT).skip(startIndex);
                    total = await PacienteDatos.countDocuments({ "atenciones.diaStr": fechaAte1 });
                }
                break;

            case 'proxima':
                //console.log('entro Proxima')
                if (searchQuery !== '9a69dc7e834f617' || tags.length > 0) {
                    if (searchQuery !== '9a69dc7e834f617' && tags.length > 0) {
                        //console.log('tiene search y tags');
                        pacientes = await PacienteDatos.find({
                            $and: [
                                { $or: [{ dni }, { apellidos }, { nombres }] },
                                { tags: { $in: tags.split(',') } },
                                { proximaAtencion: { $gt: today } }
                            ]
                        }).sort({ proximaAtencion: 1 }).limit(LIMIT).skip(startIndex);
                        total = await PacienteDatos.countDocuments({
                            $and: [
                                { $or: [{ dni }, { apellidos }, { nombres }] },
                                { tags: { $in: tags.split(',') } },
                                { proximaAtencion: { $gt: today } }
                            ]
                        });
                    } else {
                        if (searchQuery !== '9a69dc7e834f617') {
                            //console.log('Solo tiene nombres');
                            pacientes = await PacienteDatos.find({
                                $and: [
                                    { $or: [{ dni }, { apellidos }, { nombres }] },
                                    { proximaAtencion: { $gt: today } }
                                ]
                            }).sort({ proximaAtencion: 1 }).limit(LIMIT).skip(startIndex);
                            total = await PacienteDatos.countDocuments({
                                $and: [
                                    { $or: [{ dni }, { apellidos }, { nombres }] },
                                    { proximaAtencion: { $gt: today } }
                                ]
                            });
                        } else {
                            //console.log('Solo tiene tags');
                            pacientes = await PacienteDatos.find({
                                $and: [
                                    { tags: { $in: tags.split(',') } },
                                    { proximaAtencion: { $gt: today } }
                                ]
                            }).sort({ proximaAtencion: 1 }).limit(LIMIT).skip(startIndex);
                            total = await PacienteDatos.countDocuments({
                                $and: [
                                    { tags: { $in: tags.split(',') } },
                                    { proximaAtencion: { $gt: today } }
                                ]
                            });
                        }
                    }
                } else {
                    //console.log('no tiene nombre ni tags')
                    pacientes = await PacienteDatos.find({ proximaAtencion: { $gt: today } }).sort({ proximaAtencion: 1 }).limit(LIMIT).skip(startIndex);
                    total = await PacienteDatos.countDocuments({ proximaAtencion: { $gt: today } });
                }

                break;

            case 'todos':
                //console.log('Todos')
                if (searchQuery !== '9a69dc7e834f617' && tags.length > 0) {
                    //console.log('tiene los dos');
                    pacientes = await PacienteDatos.find({
                        $and: [
                            { $or: [{ dni }, { apellidos }, { nombres }] },
                            { tags: { $in: tags.split(',') } }
                        ]
                    }).sort({ proximaAtencion: -1 }).limit(LIMIT).skip(startIndex);
                    total = await PacienteDatos.countDocuments({
                        $and: [
                            { $or: [{ dni }, { apellidos }, { nombres }] },
                            { tags: { $in: tags.split(',') } }
                        ]
                    });
                } else {
                    if (searchQuery !== '9a69dc7e834f617') {
                        //console.log('Solo tiene nombres');
                        pacientes = await PacienteDatos.find({ $or: [{ dni }, { apellidos }, { nombres }] }).sort({ proximaAtencion: -1 }).limit(LIMIT).skip(startIndex);
                        total = await PacienteDatos.countDocuments({ $or: [{ dni }, { apellidos }, { nombres }] });
                    } else {
                        if (tags.length > 0) {
                            //console.log('Solo tiene tags');
                            pacientes = await PacienteDatos.find({ tags: { $in: tags.split(',') } }).sort({ proximaAtencion: -1 }).limit(LIMIT).skip(startIndex);
                            total = await PacienteDatos.countDocuments({ tags: { $in: tags.split(',') } });
                        } else {
                            //console.log('No tiene Nada');
                            pacientes = await PacienteDatos.find().sort({ proximaAtencion: -1 }).limit(LIMIT).skip(startIndex);
                            total = await PacienteDatos.countDocuments();
                        }
                    }
                }
                break;

            default:
                break;
        }

        res.status(201).json({ data: pacientes, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT), documentos: total, datosVolver: req.query });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPaciente = async (req, res) => {
    const { id } = req.params;

    try {
        const paciente = await PacienteDatos.findById(id);
        res.status(200).json(paciente);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deletePaciente = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No paciente with id: ${id}`);

    try {
        await PacienteDatos.findByIdAndRemove(id);
        res.status(200).json({ message: "Paciente deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}

export const AddAtencion = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    try {
        const paciente = await PacienteDatos.findById(id);
        paciente.atenciones.push(value);
        const updatedPaciente = await PacienteDatos.findByIdAndUpdate(id, paciente, { new: true });
        res.status(200).json(updatedPaciente);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

};

export const DeleteAtencion = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    try {
        const paciente = await PacienteDatos.findById(id);
        paciente.atenciones = paciente.atenciones.filter((ate) => ate.id !== value);
        const updatedPaciente = await PacienteDatos.findByIdAndUpdate(id, paciente, { new: true });
        //Borro Carpeta
        if (fs.existsSync(`./uploads/${id}/${value}`)) {
            fs.rm(`./uploads/${id}/${value}`, { recursive: true }, (err) => {
                if (err) {
                    // File deletion failed
                    console.error(err.message);
                }
            }
            );
        } else {
            console.log('el directorio no existe ', `./uploads/${id}/${value}`)
        }

        res.status(200).json(updatedPaciente);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const DeleteFileAtencion = async (req, res) => {

    try {
        const { id } = req.params;
        const { value } = req.body;
        const idAtencion = value._id
        const sFile = value.selectedFile

        //Borro Archivo
        if (fs.existsSync(`./uploads/${id}/${idAtencion}/${sFile}`)) {
            fs.rm(`./uploads/${id}/${idAtencion}/${sFile}`, { recursive: true }, (err) => {
                if (err) {
                    // File deletion failed
                    console.error(err.message);
                }
            }
            );
        } else {
            console.log('el Archivo no existe ', `./uploads/${id}/${idAtencion}/${sFile}`)
        }

        // Borro en selectedFiles el nombre del archivo
        const paciente = await PacienteDatos.findById(id);
        let newAte = {}
        paciente.atenciones.forEach(ate => {
            if (ate.id === idAtencion) { newAte = ate }
        });

        if (newAte) {
            newAte.selectedFiles = newAte.selectedFiles.filter((file) => file !== sFile)
            const newAtenciones = paciente.atenciones.map((ate) => ate.id === idAtencion ? newAte : ate)
            paciente.atenciones = newAtenciones
        }
        const updatedPaciente = await PacienteDatos.findByIdAndUpdate(id, paciente, { new: true });
        res.status(200).json(updatedPaciente);

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const UpdateAtencion = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    const idAtencion = value._id

    try {
        const paciente = await PacienteDatos.findById(id);
        const newAtenciones = paciente.atenciones.map((ate) => ate.id === idAtencion ? value : ate)
        paciente.atenciones = newAtenciones
        const updatedPaciente = await PacienteDatos.findByIdAndUpdate(id, paciente, { new: true });
        res.status(200).json(updatedPaciente);
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};

export const updatePaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No paciente with id: ${id}`);


    try {
        const updatedPaciente = { ...paciente, _id: id };
        const pacienteId = await PacienteDatos.findById(id);
        if (pacienteId) {
            if (pacienteId.dni === paciente.dni) {
                await PacienteDatos.findByIdAndUpdate(id, updatedPaciente, { new: true });
                res.status(200).json({ data: updatedPaciente, message: '', error: false });
            } else {
                const pacienteDNI = await PacienteDatos.findOne({ dni: paciente.dni })
                if (!pacienteDNI) {
                    console.log('no existe DNI')
                    await PacienteDatos.findByIdAndUpdate(id, updatedPaciente, { new: true });
                    res.status(200).json({ data: updatedPaciente, message: '', error: false });
                } else {
                    console.log('Existe DNI')
                    res.status(200).json({ data: pacienteId, message: 'Ya existe un Paciente con ese DNI', error: true });
                }
            }
        } else {
            res.status(200).json({ data: updatedPaciente, message: 'No se encontró el Paciente', error: true });
        }

    } catch (error) {
        res.status(200).json({ message: 'no se pudo actualizar el Paciente', error: true });
    }

}


export const resumenPaciente = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    try {
        const paciente = await PacienteDatos.findById(id);
        paciente.resumen = value
        const updatedPaciente = await PacienteDatos.findByIdAndUpdate(id, paciente, { new: true });
        res.status(200).json({ data: updatedPaciente, message: '', error: false });
    } catch (error) {
        res.status(200).json({ message: 'no se pudo actualizar el Paciente', error: true });
    }
};

export const proximaAtencionPaciente = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    try {
        const paciente = await PacienteDatos.findById(id);
        paciente.proximaAtencion = value
        const updatedPaciente = await PacienteDatos.findByIdAndUpdate(id, paciente, { new: true });
        res.status(200).json({ data: updatedPaciente, message: '', error: false });
    } catch (error) {
        res.status(200).json({ message: 'no se pudo actualizar la próxima Atención', error: true });
    }
};

export const domicilioPaciente = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    try {
        const paciente = await PacienteDatos.findById(id);
        paciente.domicilio = value
        const updatedPaciente = await PacienteDatos.findByIdAndUpdate(id, paciente, { new: true });
        res.status(200).json({ data: updatedPaciente, message: '', error: false });
    } catch (error) {
        res.status(200).json({ message: 'no se pudo actualizar el Domicilio', error: true });
    }
};

export const personaPaciente = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    try {
        const paciente = await PacienteDatos.findById(id);
        paciente.persona = value
        const updatedPaciente = await PacienteDatos.findByIdAndUpdate(id, paciente, { new: true });
        res.status(200).json({ data: updatedPaciente, message: '', error: false });
    } catch (error) {
        res.status(200).json({ message: 'no se pudo actualizar los Datos Personales', error: true });
    }
};

export const afamiliaresPaciente = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    try {
        const paciente = await PacienteDatos.findById(id);
        paciente.antecedentes.familiares = value
        const updatedPaciente = await PacienteDatos.findByIdAndUpdate(id, paciente, { new: true });
        res.status(200).json({ data: updatedPaciente, message: '', error: false });
    } catch (error) {
        res.status(200).json({ message: 'no se pudo actualizar los Antecedentes Familiares', error: true });
    }
};

export const amedicosPaciente = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    try {
        const paciente = await PacienteDatos.findById(id);
        paciente.antecedentes.medicos = value
        const updatedPaciente = await PacienteDatos.findByIdAndUpdate(id, paciente, { new: true });
        res.status(200).json({ data: updatedPaciente, message: '', error: false });
    } catch (error) {
        res.status(200).json({ message: 'no se pudo actualizar los Antecedentes Médicos', error: true });
    }
};

export const aginecoPaciente = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    try {
        const paciente = await PacienteDatos.findById(id);
        paciente.antecedentes.gineco = value
        const updatedPaciente = await PacienteDatos.findByIdAndUpdate(id, paciente, { new: true });
        res.status(200).json({ data: updatedPaciente, message: '', error: false });
    } catch (error) {
        res.status(200).json({ message: 'no se pudo actualizar los Antecedentes Gineco-Obstétricos', error: true });
        console.log('Error en Gineco', error)
    }
};

export const ahabitosPaciente = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    try {
        const paciente = await PacienteDatos.findById(id);
        paciente.antecedentes.habitos = value
        const updatedPaciente = await PacienteDatos.findByIdAndUpdate(id, paciente, { new: true });
        res.status(200).json({ data: updatedPaciente, message: '', error: false });
    } catch (error) {
        res.status(200).json({ message: 'no se pudo actualizar los Hábitos', error: true });
    }
};

export const apsicosocialPaciente = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    try {
        const paciente = await PacienteDatos.findById(id);
        paciente.antecedentes.psicosocial = value
        const updatedPaciente = await PacienteDatos.findByIdAndUpdate(id, paciente, { new: true });
        res.status(200).json({ data: updatedPaciente, message: '', error: false });
    } catch (error) {
        res.status(200).json({ message: 'no se pudo actualizar la situación Psico-Social', error: true });
    }
};
