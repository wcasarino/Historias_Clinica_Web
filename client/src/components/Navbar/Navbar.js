import React, { useState, useEffect } from "react";
import {
  AppBar,
  Typography,
  Toolbar,
  Avatar,
  Button,
  Tab,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";

import { styled, alpha } from "@mui/material/styles";
import { Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import * as actionType from "../../constants/actionTypes";
import useStyles from "./styles";
import { getAnoAtenciones, getZeroAtenciones } from "../../actions/atenciones";
import { useVolverContext } from "../../contexts/volverContext";

import { getAllPacientes } from "../../actions/pacientes";
import ExcelPacientes from "../../helpers/ExcelPacientes";
import ExcelAtenciones from "../../helpers/ExcelAtenciones";

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();
  const { contextVolver, setContextVolver } = useVolverContext();
  const [value, setValue] = React.useState(contextVolver.menu);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [expoValue, setExpoValue] = useState(null);

  const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === "light"
          ? "rgb(55, 65, 81)"
          : theme.palette.grey[300],
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));

  const fechaAteStrInicial = () => {
    const nuevaFecha = new Date();
    let anoAte = parseInt(nuevaFecha.getFullYear());
    let mesAte = parseInt(nuevaFecha.getMonth()) + 1;
    let diaAte = parseInt(nuevaFecha.getDate());
    diaAte = ("0" + diaAte).slice(-2);
    mesAte = ("0" + mesAte).slice(-2);
    return `${anoAte}${mesAte}${diaAte}`;
  };

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });
    navigate("/auth", { replace: true });
    setUser(null);
    setValue("1");
    setContextVolver({
      vista: "todos",
      menu: "1", //"1" pacientes, "2" atenciones, "3" calendario
      page: 1,
      searchQuery: "",
      tags: [],
      solo: true,
      anomesStr: null,
      fechaAte1: fechaAteStrInicial(),
      diagnosticos: [],
      practicas: [],
    });
  };

  const login = () => {
    setUser(null);
    navigate("/auth", { replace: true });
    setValue("1");
    setContextVolver({
      vista: "todos",
      menu: "1", //"1" pacientes, "2" atenciones, "3" calendario
      page: 1,
      searchQuery: "",
      tags: [],
      solo: true,
      anomesStr: null,
      fechaAte1: fechaAteStrInicial(),
      diagnosticos: [],
      practicas: [],
    });
    window.location.reload(true);
  };

  const buscarAnos = async () => {
    await dispatch(getAnoAtenciones());
    console.log("busca en NAV ANOS");
  };

  useEffect(() => {
    console.log("NAV ANO");
    buscarAnos();
  }, []);

  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 10000 < new Date().getTime()) logout();
    }
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  const handleClickPac = async () => {
    setContextVolver({
      vista: "todos",
      menu: "1", //"1" pacientes, "2" atenciones, "3" calendario
      page: 1,
      searchQuery: "",
      tags: [],
      solo: true,
      anomesStr: null,
      fechaAte1: fechaAteStrInicial(),
      diagnosticos: [],
      practicas: [],
    });

    navigate("/pacientes", { replace: true });
  };

  const handleClickAte = () => {
    setContextVolver({
      vista: "anomes",
      menu: "2", //"1" pacientes, "2" atenciones, "3" calendario
      page: 1,
      searchQuery: "",
      tags: [],
      solo: false,
      anomesStr: null,
      fechaAte1: fechaAteStrInicial(),
      diagnosticos: [],
      practicas: [],
    });
    dispatch(getZeroAtenciones());
    navigate("/atenciones", { replace: true });
  };

  const handleClickCal = () => {
    setContextVolver({
      vista: "anomes",
      menu: "3", //"1" pacientes, "2" atenciones, "3" calendario
      page: 1,
      searchQuery: "",
      tags: [],
      solo: false,
      anomesStr: null,
      fechaAte1: fechaAteStrInicial(),
      diagnosticos: [],
      practicas: [],
    });
    dispatch(getZeroAtenciones());
    navigate("/calendario", { replace: true });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = async (index) => {
    setAnchorEl(null);
    setExpoValue(index);
    const data = await dispatch(getAllPacientes());
    const pacientes = data;
    if (!pacientes) {
      return null;
    }

    dispatch({ type: actionType.START_LOADING_PAC });
    if (index === 1) {
      ExcelPacientes(pacientes);
    } else {
      ExcelAtenciones(pacientes);
    }

    dispatch({ type: actionType.END_LOADING_PAC });
  };

  return (
    <AppBar position="static" color="inherit" className={classes.appBar}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Pacientes" value="1" onClick={() => handleClickPac()} />
            <Tab
              label="Atenciones"
              value="2"
              onClick={() => handleClickAte()}
            />
            <Tab
              label="Calendario"
              value="3"
              onClick={() => handleClickCal()}
            />
          </TabList>
        </Box>
      </TabContext>

      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Exportar
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleMenuItemClick(1)} disableRipple>
          Pacientes
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(2)} disableRipple>
          Atenciones
        </MenuItem>
      </StyledMenu>
      {/*       
      {expoValue === 1 && <ExpoPacientes setExpoValue={setExpoValue} />}
      {expoValue === 2 && <ExpoAtenciones setExpoValue={setExpoValue} />} */}

      <Typography variant="h4" component="h3">
        SISTEMA DE HISTORIAS CLÍNICAS
      </Typography>
      <Toolbar className={classes.toolbar}>
        {user?.result ? (
          <div className={classes.profile}>
            <Avatar
              className={classes.purple}
              alt={user?.result.name}
              src={user?.result.imageUrl}
            >
              {user?.result.name.charAt(0)}
            </Avatar>
            <Typography variant="h6" className={classes.userName}>
              {user?.result.name}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={logout}
              className={classes.logout}
            >
              Salir
            </Button>
          </div>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => login()}
            style={{
              marginLeft: "20px",
            }}
          >
            Ingresar
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
