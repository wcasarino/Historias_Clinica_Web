import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert'

import { createPaciente, updatePaciente, getPacientesBySearch } from '../../actions/pacientes'
import useStyles from './styles';
import { useVolverContext } from "../../contexts/volverContext";

const Form = ({ currentId, setCurrentId }) => {
  const [pacienteData, setPacienteData] = useState({ dni: '', apellidos: '', nombres: '', tags: [], foto: '', resumen: '' });
  const paciente = useSelector((state) => (currentId ? state.pacientes.pacientes.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const navigate = useNavigate();

  const { contextVolver, setContextVolver } = useVolverContext()

  const { vista, page, tags, anomesStr, fechaAte1 } = contextVolver

  const clear = () => {
    setCurrentId(0);
    setPacienteData({ dni: '', apellidos: '', nombres: '', tags: [], foto: '', resumen: '' });
    //navigate('/pacientes');
  };

  useEffect(() => {
    if (!paciente?.dni) clear();
    if (paciente) setPacienteData(paciente);
  }, [paciente]);

  const fechaAteStrInicial = () => {
    const nuevaFecha = new Date();
    let anoAte = parseInt(nuevaFecha.getFullYear());
    let mesAte = parseInt(nuevaFecha.getMonth()) + 1;
    let diaAte = parseInt(nuevaFecha.getDate());
    diaAte = ("0" + diaAte).slice(-2);
    mesAte = ("0" + mesAte).slice(-2);
    return `${anoAte}${mesAte}${diaAte}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pacienteData.dni || pacienteData.dni === '') {
      swal({
        title: "Creación de Paciente",
        text: "El DNI no puede estar en blanco",
        icon: "error",
        button: "Aceptar"

      })
    } else {
      if (currentId === 0) {
        dispatch(createPaciente({ ...pacienteData, userId: user?.result?._id }, navigate));
        clear();
      } else {
        dispatch(updatePaciente(currentId, { ...pacienteData, userId: user?.result?._id }));
        clear();
      }
    }
  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper} elevation={6}>
        <Typography variant="h6" align="center">
          Por favor ingrese al sistema para cargar pacientes.
        </Typography>
      </Paper>
    );
  }

  const handleChange = async (e) => {
    e.preventDefault();
    setPacienteData({ ...pacienteData, [e.target.name]: e.target.value })
    const search = e.target.value

    if (search.length > 0 && currentId === 0) {
      if (search.trim()) {
        setContextVolver({
          vista: "todos",
          menu: "1", //"1" pacientes, "2" atenciones
          page: "1",
          searchQuery: search,
          tags: [],
          solo: true,
          anomesStr: null,
          fechaAte1: fechaAteStrInicial(),
        });
        dispatch(getPacientesBySearch({ search, tags, page, vista, fechaAte1, anomesStr }));
        navigate(`/pacientes/search?searchQuery=${search || '9a69dc7e834f617'}&tags=${tags.join(',')}&page=1&vista=${vista}&fechaAte1=${fechaAte1}&anomesStr=${anomesStr}`)
      }
    } else {
      navigate('/pacientes')
    }
  }

  return (
    <Paper className={classes.paper} elevation={6} >
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6" >{currentId ? `Editando "${paciente?.dni}"` : 'Crear un Paciente'}</Typography>
        <TextField size='small' name="dni" variant="outlined" label="DNI" fullWidth value={pacienteData.dni} onChange={handleChange} />
        <Stack direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 4 }} style={{ marginTop: '0px' }}>
          <TextField size='small' name="apellidos" variant="outlined" label="Apellidos" fullWidth value={pacienteData.apellidos} onChange={handleChange} />
          <TextField size='small' name="nombres" variant="outlined" label="Nombres" fullWidth value={pacienteData.nombres} onChange={(e) => setPacienteData({ ...pacienteData, nombres: e.target.value })} />
        </Stack>

        <div className={classes.fileInput}>
          <FileBase type="file" multiple={false} onDone={({ base64 }) => setPacienteData({ ...pacienteData, foto: base64 })} />
        </div>
        <Stack direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 4 }} style={{ marginTop: '20px' }}>
          <Button variant="contained" color="primary" size="small" type="submit" >{currentId ? 'Actualizar' : 'Crear'}</Button>
          <Button variant="contained" color="secondary" size="small" onClick={clear} >Limpiar</Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default Form;
