import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, Avatar, Button, ButtonBase, Tab, Box } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import historiaClinicaFoto from '../../images/historiaClinicaFoto.jpg';
//import historiaClinicaLogo from '../../images/historiaClinicaLogo.png';
import * as actionType from '../../constants/actionTypes';
import useStyles from './styles';
import { getZeroAtenciones } from '../../actions/atenciones'
import { useVolverContext } from "../../contexts/volverContext";


const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();
  const { contextVolver,setContextVolver } = useVolverContext()
  const [value, setValue] = React.useState(contextVolver.menu);

  const fechaAteStrInicial = () => {
    const nuevaFecha = new Date()
    let anoAte = parseInt(nuevaFecha.getFullYear());
    let mesAte = parseInt(nuevaFecha.getMonth()) + 1;
    let diaAte = parseInt(nuevaFecha.getDate());
    diaAte = ("0" + diaAte).slice(-2);
    mesAte = ("0" + mesAte).slice(-2);
    return `${anoAte}${mesAte}${diaAte}`
  }

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });
    navigate('/auth', { replace: true });
    setUser(null);
    setValue("1");
    setContextVolver({
      vista: "todos",
      menu: "1", //"1" pacientes, "2" atenciones
      page: "1",
      searchQuery: '',
      tags: [],
      solo: true,
      anomesStr: null,
      fechaAte1: fechaAteStrInicial(),
    })
  };

  const login = () => {
    setUser(null);
    navigate('/auth', { replace: true });
    setValue("1");
    setContextVolver({
      vista: "todos",
      menu: "1", //"1" pacientes, "2" atenciones
      page: "1",
      searchQuery: '',
      tags: [],
      solo: true,
      anomesStr: null,
      fechaAte1: fechaAteStrInicial(),
    })
    window.location.reload(true);
  };


  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 100000 < new Date().getTime()) logout();
    }
    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  const handleClickPac = async () => {
    setContextVolver({
      vista: "todos",
      menu: "1", //"1" pacientes, "2" atenciones
      page: "1",
      searchQuery: '',
      tags: [],
      solo: true,
      anomesStr: null,
      fechaAte1: fechaAteStrInicial(),
    })
    navigate('/pacientes', { replace: true });

  }

  
  const handleClickAte = () => {
    setContextVolver({
      vista: "anomes",
      menu: "2", //"1" pacientes, "2" atenciones
      page: "1",
      searchQuery: '',
      tags: [],
      solo: false,
      anomesStr: null,
      fechaAte1: fechaAteStrInicial(),
    })
    dispatch(getZeroAtenciones());
    navigate('/atenciones', { replace: true });
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <AppBar position="static" color="inherit"
      className={classes.appBar}
    >
      <ButtonBase
        component="span"
        name="test"
        className={classes.cardAction}
        onClick={() => handleClickPac()}

      >
        <img component={Link} to="/pacientes" src={historiaClinicaFoto} alt="icon" height="45px"
          className={classes.brandContainer}
        />
        {/* <img className={classes.image} src={historiaClinicaLogo} alt="icon" height="40px" /> */}
      </ButtonBase>

       <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" >
            <Tab label="Pacientes" value="1" onClick={() => handleClickPac()} />
            <Tab label="Atenciones" value="2" onClick={() => handleClickAte()} />
          </TabList>
        </Box>
        <TabPanel value="1"></TabPanel>
        <TabPanel value="2"></TabPanel>

      </TabContext> 


      <Typography variant="h4" component="h3">SISTEMA DE HISTORIAS CLÍNICAS</Typography>
      <Toolbar
        className={classes.toolbar}
      >
        {user?.result ? (
          <div className={classes.profile}>
            <Avatar className={classes.purple} alt={user?.result.name} src={user?.result.imageUrl}
            >{user?.result.name.charAt(0)}</Avatar>
            <Typography variant="h6" className={classes.userName}
            >{user?.result.name}</Typography>
            <Button variant="contained" color="secondary" onClick={logout}
              className={classes.logout}
            >Salir</Button>
          </div>
        ) : (
          <Button variant="contained" color="primary" onClick={() => login()}
            style={{
              marginLeft: '20px',
            }}
          >Ingresar</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
