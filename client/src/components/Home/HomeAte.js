import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid, AppBar, TextField, Button, Paper, Typography, Chip, Box, Autocomplete, Stack, ToggleButtonGroup, ToggleButton, IconButton, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddIcon from "@mui/icons-material/Add";
import DatePicker from "@mui/lab/DatePicker";
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import moment from "moment";
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';

import { getAtencionesBySearch, getAnoAtenciones } from '../../actions/atenciones'
import Atenciones from '../Atenciones/Atenciones'
import useStyles from './styles';
import { useVolverContext } from "../../contexts/volverContext"

const HomeAte = () => {
  const { anos } = useSelector((state) => state.atenciones);
  const classes = useStyles();
  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contextVolver, setContextVolver } = useVolverContext()
  const { vista, searchQuery, tags, page, anomesStr, fechaAte1 } = contextVolver

  let searchIni = ''
  if (searchQuery !== '9a69dc7e834f617' && searchQuery !== null) {
    searchIni = searchQuery
  }
  const [search, setSearch] = useState(searchIni);
  const [tagsAdd, setTagsAdd] = useState("");

  const fechaAteInicial = () => {
    if (!fechaAte1) return new Date();
    let anoAte = 0;
    let mesAte = 0;
    let diaAte = 0;
    anoAte = parseInt(String(fechaAte1).substring(0, 4));
    mesAte = parseInt(String(fechaAte1).substring(4, 6));
    diaAte = parseInt(String(fechaAte1).substring(6, 8));
    diaAte = ("0" + diaAte).slice(-2);
    mesAte = ("0" + mesAte).slice(-2);
    return new Date(anoAte, mesAte - 1, diaAte)
  }

  const [fechaAte, setFechaAte] = useState(fechaAteInicial)

  const fechaAteStrInicial = () => {
    if (!fechaAte1) {
      const nuevaFecha = new Date()
      let anoAte = parseInt(nuevaFecha.getFullYear());
      let mesAte = parseInt(nuevaFecha.getMonth()) + 1;
      let diaAte = parseInt(nuevaFecha.getDate());
      diaAte = ("0" + diaAte).slice(-2);
      mesAte = ("0" + mesAte).slice(-2);
      console.log(`${anoAte}${mesAte}${diaAte}`)
      return `${anoAte}${mesAte}${diaAte}`
    };
    return fechaAte1
  }
  const [fechaAteStr, setFechaAteStr] = useState(fechaAteStrInicial)

  const anoStrInicial = () => {
    if (!anomesStr) {
      return null;
    } else {
      return anomesStr.substring(0, 4)
    }
  }

  const meses = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

  const mesStrInicial = () => {
    if (!anomesStr) {
      return meses[0];
    } else {
      return anomesStr.substring(4, 6)
    }
  }

  const [anoSelected, setAnoSelected] = useState(anoStrInicial);
  const [mesSelected, setMesSelected] = useState(mesStrInicial)


  const [stateToast, setStateToast] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: '',
  })

  const { vertical, horizontal, open, message } = stateToast;
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const user = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => {
    dispatch(getAnoAtenciones())
  }, [])

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper} elevation={6}>
        <Typography variant="h6" align="center">
          Por favor ingrese al sistema para cargar pacientes.
        </Typography>
      </Paper>
    );
  }

  const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
      margin: theme.spacing(0.5),
      border: 0,
      '&.Mui-selected': {
        outlineColor: 'blue', outlineWidth: '1px', outlineStyle: 'solid', margin: '2px',
      }
    },
  }))

  const searchAtenciones = async (dato) => {
    let anomesStr = null
    let fechaAte1 = null
    await setContextVolver({ ...contextVolver, solo: false, fechaAte1: dato, anomesStr: (anoSelected && mesSelected) ? anoSelected + mesSelected : null });
    if (dato) {
      fechaAte1 = dato
    }
    switch (vista) {
      case 'anomes':
        if (anoSelected && mesSelected) {
          anomesStr = anoSelected + mesSelected
          dispatch(getAtencionesBySearch({ search, tags: tags.join(','), page, vista, anomesStr, fechaAte1 }));
          navigate(`/atenciones/search?searchQuery=${search || '9a69dc7e834f617'}&tags=${tags.join(',')}&page=1&vista=${vista}&anomesStr=${anomesStr}&fechaAte1=${fechaAte1}`);
        } else {
          !anoSelected && setStateToast({ ...stateToast, open: true, message: 'Debe elegir un año' });
          !mesSelected && setStateToast({ ...stateToast, open: true, message: 'Debe elegir un mes' });
        }
        break;

      case 'dia':
        if (!fechaAte1) {
          setStateToast({ ...stateToast, open: true, message: 'Debe elegir una Fecha válida' });
        } else {
          console.log('entro al dia Contexto', contextVolver.fechaAte1)
          console.log('entro al dia', fechaAte1)

          dispatch(getAtencionesBySearch({ search, tags: tags.join(','), page, vista, anomesStr, fechaAte1 }));
          navigate(`/atenciones/search?searchQuery=${search || '9a69dc7e834f617'}&tags=${tags.join(',')}&page=1&vista=${vista}&anomesStr=${anomesStr}&fechaAte1=${fechaAte1}`);
        }
        break;

      default:
        break;
    }
  };

  const walter = (fecha, dias) => {
    let dato = null
    if (fecha && !isNaN(moment(fecha))) {
      const nuevaF = new Date(fecha)
      const nuevaF1 = nuevaF.setDate(nuevaF.getDate() + dias);
      const nuevaF2 = new Date(nuevaF1)
      let anoAte = 0;
      let mesAte = 0;
      let diaAte = 0;
      anoAte = parseInt(nuevaF2.getFullYear());
      mesAte = parseInt(nuevaF2.getMonth()) + 1;
      diaAte = parseInt(nuevaF2.getDate());
      diaAte = ("0" + diaAte).slice(-2);
      mesAte = ("0" + mesAte).slice(-2);
      dato = `${anoAte}${mesAte}${diaAte}`
      setContextVolver({ ...contextVolver, fechaAte1: `${anoAte}${mesAte}${diaAte}` });
      searchAtenciones(dato)
    }
  }

  const cambioMensual = async (newValue, tipo) => {
    if (tipo === 'mes') {
      if (newValue && anoSelected) {
        await setContextVolver({ ...contextVolver, anomesStr: anoSelected + newValue });
        //searchAtenciones(fechaAteStr)
      } else {
        await setContextVolver({ ...contextVolver, anomesStr: null });
      }
    } else {
      if (newValue && mesSelected) {
        await setContextVolver({ ...contextVolver, anomesStr: newValue + mesSelected });
        //searchAtenciones(fechaAteStr)
      } else {
        await setContextVolver({ ...contextVolver, anomesStr: null });
      }
    }
  }


  const cambioFecha = (newValue) => {

    const nuevaFecha = new Date(newValue)
    setFechaAte(nuevaFecha)
    //Valido Dia Atencion sea fecha valida
    if (nuevaFecha && !isNaN(nuevaFecha)) {
      let anoAte = 0;
      let mesAte = 0;
      let diaAte = 0;

      if (isNaN(parseInt(String(nuevaFecha).substring(0, 4)))) {
        anoAte = parseInt(nuevaFecha.getFullYear());
        mesAte = parseInt(nuevaFecha.getMonth()) + 1;
        diaAte = parseInt(nuevaFecha.getDate());
      } else {
        anoAte = parseInt(String(nuevaFecha).substring(0, 4));
        mesAte = parseInt(String(nuevaFecha).substring(5, 7));
        diaAte = parseInt(String(nuevaFecha).substring(8, 10));
      }

      diaAte = ("0" + diaAte).slice(-2);
      mesAte = ("0" + mesAte).slice(-2);

      const dato = `${anoAte}${mesAte}${diaAte}`
      setFechaAteStr(dato)
      setContextVolver({ ...contextVolver, fechaAte1: dato });
      searchAtenciones(dato)
    } else {
      setFechaAte(null)
      setFechaAteStr(null)
      setContextVolver({ ...contextVolver, fechaAte1: null });
      searchAtenciones(null)
    }

  }

  const handleChangeTagsAdd = (e) => {
    e.preventDefault();
    setTagsAdd(e.target.value.trim().toLowerCase());
  };

  const handleSubmitTag = (e) => {
    e.preventDefault();
    if (tagsAdd) {
      setContextVolver({ ...contextVolver, tags: [...contextVolver.tags, tagsAdd] });
      setTagsAdd("");
    }
  };

  const hdel = (chipToDelete) => {
    setContextVolver({ ...contextVolver, tags: contextVolver.tags.filter((tag) => tag !== chipToDelete) });
  };

  const handleVista = (event, newVista) => {
    if (newVista !== null) {
      setContextVolver({
        ...contextVolver,
        vista: newVista,
        solo: false
      });
    }

  }

  function sumarDias(fecha, dias) {
    if (fecha && !isNaN(moment(fecha))) {
      const nuevaF = new Date(fecha)
      return nuevaF.setDate(nuevaF.getDate() + dias);
    }
    return null
  }

  const handleClose = () => {
    setStateToast({ ...stateToast, open: false });
  };

  return (
    <Grow in>
      <Container maxWidth="xxl">
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>

        <Grid container justify="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6} md={8} xl={9}>
            <Atenciones setCurrentId={setCurrentId} />
          </Grid>

          <Grid item xs={12} sm={6} md={4} xl={3}>

            <AppBar className={classes.appBarSearch} position="static" color="inherit">
              <TextField className={classes.txtApellidos} name="search" variant="outlined" label="Buscar por DNI o Apellido" fullWidth size='small'
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setContextVolver({ ...contextVolver, searchQuery: e.target.value });
                }}
              />

              <form
                autoComplete="off"
                noValidate
                style={{ marginBottom: '20px' }}

              >

                <Box
                  sx={{
                    display: "grid",
                    gridAutoFlow: "row",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    marginBottom: '1rem',
                    gap: 1,
                  }}
                >
                  {tags.map((data, i) => (
                    <Chip key={i} label={data} onDelete={() => hdel(data)} />
                  ))}
                </Box>
                <Stack direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 1, sm: 2, md: 4 }} >
                  <TextField
                    name="tagsAdd"
                    size='small'
                    variant="outlined"
                    label="Etiquetas"
                    value={tagsAdd}
                    onChange={handleChangeTagsAdd}
                  />


                  <Button
                    className={classes.buttonSubmit}
                    variant="contained"
                    color="primary"
                    size="small"
                    type="submit"
                    style={{ width: 10, height: 30 }}
                    onClick={handleSubmitTag}
                  >
                    <AddIcon fontSize="small" />
                  </Button>
                </Stack>

              </form>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
                <Typography style={{ marginBottom: '20px' }} variant="subtitle1" alignSelf="center" >
                  Atenciones:
                </Typography>

                <StyledToggleButtonGroup
                  color="success"
                  value={vista}
                  size='small'
                  exclusive
                  onChange={handleVista}
                  style={{ marginBottom: '20px', alignSelf: "center", border: 5 }}

                >
                  <ToggleButton size='small' value="anomes" >Mensual</ToggleButton>
                  <ToggleButton size='small' value="dia">Diaria</ToggleButton>
                </StyledToggleButtonGroup>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 4 }} >

                <Autocomplete
                  disabled={vista === 'anomes' ? false : true}
                  style={{ width: 130 }}
                  value={anoSelected}
                  size='small'
                  onChange={(event, newValue) => {
                    setAnoSelected(newValue);
                    cambioMensual(newValue, 'ano')
                  }}
                  id="anoSelected"
                  options={anos}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Año" />}
                />
                <Autocomplete
                  disabled={vista === 'anomes' ? false : true}
                  style={{ width: 130 }}
                  value={mesSelected}
                  size='small'
                  onChange={(event, newValue) => {
                    setMesSelected(newValue);
                    cambioMensual(newValue, 'mes')
                  }}
                  id="mesSelected"
                  options={meses}

                  renderInput={(params) => <TextField {...params} label="Mes" />}
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 4 }} style={{ marginTop: '20px' }}>

                <IconButton aria-label="anterior"
                  disabled={vista === 'anomes' ? true : false}
                  onClick={() => {
                    const fechaSumada = sumarDias(fechaAte, -1)
                    cambioFecha(fechaSumada)
                    navigate(`/atenciones`)
                    walter(fechaAte, -1)
                  }} >
                  <SkipPreviousIcon />
                </IconButton>
                <DatePicker
                  disabled={vista === 'anomes' ? true : false}
                  mask="__/__/____"
                  label="Fecha de Atención."
                  value={fechaAte}
                  onChange={(newValue) => {
                    cambioFecha(newValue)
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <IconButton aria-label="próximo"
                  disabled={vista === 'anomes' ? true : false}
                  onClick={() => {
                    const fechaSumada = sumarDias(fechaAte, 1)
                    cambioFecha(fechaSumada)
                    navigate(`/atenciones`)
                    walter(fechaAte, 1)
                  }}>
                  <SkipNextIcon />
                </IconButton>

              </Stack>

              <Button onClick={() => searchAtenciones(fechaAteStr)} className={classes.searchButton} variant="contained" color="primary">Buscar</Button>
            </AppBar>

          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default HomeAte;
