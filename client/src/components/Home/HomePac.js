import React, { useEffect, useState } from "react";
import {
  Container,
  Grow,
  Grid,
  AppBar,
  TextField,
  Button,
  Paper,
  Typography,
  Chip,
  Box,
  Autocomplete,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Snackbar,
  Tab,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DatePicker from "@mui/lab/DatePicker";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import moment from "moment";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";

import { getPacientesBySearch } from "../../actions/pacientes";
import Pacientes from "../Pacientes/Pacientes";
import Form from "../Form/Form";
import Pagination from "../Pagination";
import PaginationSearch from "../PaginationSearch";
import useStyles from "./styles";
import { useVolverContext } from "../../contexts/volverContext";
import { getAnoAtenciones } from "../../actions/atenciones";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const HomePac = () => {
  const { anos } = useSelector((state) => state.atenciones);
  const classes = useStyles();
  const query = useQuery();
  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const page1 = Number(query.get("page")) || 1;
  const { contextVolver, setContextVolver } = useVolverContext();
  const {
    vista,
    searchQuery,
    tags,
    page,
    anomesStr,
    fechaAte1,
    diagnosticos,
    practicas,
  } = contextVolver;

  let searchIni = "";
  if (searchQuery !== "9a69dc7e834f617" && searchQuery !== null) {
    searchIni = searchQuery;
  }
  const [search, setSearch] = useState(searchIni);

  const [tagsAdd, setTagsAdd] = useState("");
  const [dxAdd, setDxAdd] = useState("");
  const [practicasAdd, setPracticasAdd] = useState("");

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
    return new Date(anoAte, mesAte - 1, diaAte);
  };
  const [fechaAte, setFechaAte] = useState(fechaAteInicial);

  const fechaAteStrInicial = () => {
    setContextVolver({
      ...contextVolver,
      page: Number(query.get("page")) || 1,
    });
    if (!fechaAte1) {
      const nuevaFecha = new Date();
      let anoAte = parseInt(nuevaFecha.getFullYear());
      let mesAte = parseInt(nuevaFecha.getMonth()) + 1;
      let diaAte = parseInt(nuevaFecha.getDate());
      diaAte = ("0" + diaAte).slice(-2);
      mesAte = ("0" + mesAte).slice(-2);
      return `${anoAte}${mesAte}${diaAte}`;
    }
    return fechaAte1;
  };
  const [fechaAteStr, setFechaAteStr] = useState(fechaAteStrInicial);

  const anoStrInicial = () => {
    if (!anomesStr) {
      return anos?.length > 0 ? anos[0] : null;
    } else {
      return anomesStr.substring(0, 4);
    }
  };

  const meses = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  const mesStrInicial = () => {
    if (!anomesStr) {
      return meses[0];
    } else {
      return anomesStr.substring(4, 6);
    }
  };
  const [anoSelected, setAnoSelected] = useState(anoStrInicial);
  const [mesSelected, setMesSelected] = useState(mesStrInicial);

  const [stateToast, setStateToast] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
  });

  const { vertical, horizontal, open, message } = stateToast;
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [value, setValue] = useState("1");

  const user = JSON.parse(localStorage.getItem("profile"));

  /*
  useEffect(() => {
    if (page1 !== page) {
      setContextVolver({ ...contextVolver, page: page1 })
    }
  }, [page1])
  */

  const buscarAnos = async () => {
    await dispatch(getAnoAtenciones());
    console.log("busca en PAC ANOS", anos);
    anos && setAnoSelected(anos[0]);
  };

  useEffect(() => {
    console.log("PAC ANO", anos);

    if (anos?.length === 0) {
      buscarAnos();
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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

  const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    "& .MuiToggleButtonGroup-grouped": {
      margin: theme.spacing(0.5),
      border: 0,
      "&.Mui-selected": {
        outlineColor: "blue",
        outlineWidth: "1px",
        outlineStyle: "solid",
        margin: "2px",
      },
    },
  }));

  const searchPacientes = (dato) => {
    let anomesStr = null;
    let fechaAte1 = null;
    if (dato) {
      fechaAte1 = dato;
    }
    setContextVolver({
      ...contextVolver,
      solo:
        vista === "todos" &&
        !searchQuery &&
        !tags.length &&
        !diagnosticos.length &&
        !practicas.length,
    });
    switch (vista) {
      case "anomes":
        if (anoSelected && mesSelected) {
          anomesStr = anoSelected + mesSelected;
          dispatch(
            getPacientesBySearch({
              search,
              tags: tags.join(","),
              page,
              vista,
              fechaAte1,
              anomesStr,
              diagnosticos,
              practicas,
            })
          );
          navigate(
            `/pacientes/search?searchQuery=${
              search || "9a69dc7e834f617"
            }&tags=${tags.join(
              ","
            )}&page=1&vista=${vista}&fechaAte1=${fechaAte1}&anomesStr=${anomesStr}&diagnosticos=${diagnosticos.join(
              ","
            )}&practicas=${practicas.join(",")}`
          );
        } else {
          !anoSelected &&
            setStateToast({
              ...stateToast,
              open: true,
              message: "Debe elegir un año",
            });
          !mesSelected &&
            setStateToast({
              ...stateToast,
              open: true,
              message: "Debe elegir un mes",
            });
          navigate("/pacientes");
        }
        break;

      case "dia":
        if (!fechaAte1) {
          setStateToast({
            ...stateToast,
            open: true,
            message: "Debe elegir una Fecha válida",
          });
          navigate("/pacientes");
        } else {
          dispatch(
            getPacientesBySearch({
              search,
              tags: tags.join(","),
              page,
              vista,
              fechaAte1,
              anomesStr,
              diagnosticos,
              practicas,
            })
          );
          navigate(
            `/pacientes/search?searchQuery=${
              search || "9a69dc7e834f617"
            }&tags=${tags.join(
              ","
            )}&page=1&vista=${vista}&fechaAte1=${fechaAte1}&anomesStr=${anomesStr}&diagnosticos=${diagnosticos.join(
              ","
            )}&practicas=${practicas.join(",")}`
          );
        }
        break;

      case "proxima":
        dispatch(
          getPacientesBySearch({
            search,
            tags: tags.join(","),
            page,
            vista,
            fechaAte1,
            anomesStr,
            diagnosticos,
            practicas,
          })
        );
        navigate(
          `/pacientes/search?searchQuery=${
            search || "9a69dc7e834f617"
          }&tags=${tags.join(
            ","
          )}&page=1&vista=${vista}&fechaAte1=${fechaAte1}&anomesStr=${anomesStr}&diagnosticos=${diagnosticos.join(
            ","
          )}&practicas=${practicas.join(",")}`
        );
        break;

      case "todos":
        if (
          search.trim() ||
          tags.length > 0 ||
          diagnosticos.length > 0 ||
          practicas.length > 0
        ) {
          dispatch(
            getPacientesBySearch({
              search,
              tags: tags.join(","),
              page,
              vista,
              fechaAte1,
              anomesStr,
              diagnosticos,
              practicas,
            })
          );
          navigate(
            `/pacientes/search?searchQuery=${
              search || "9a69dc7e834f617"
            }&tags=${tags.join(
              ","
            )}&page=1&vista=${vista}&fechaAte1=${fechaAte1}&anomesStr=${anomesStr}&diagnosticos=${diagnosticos.join(
              ","
            )}&practicas=${practicas.join(",")}`
          );
        } else {
          navigate("/pacientes");
        }
        break;

      default:
        break;
    }
  };

  const cambioFecha = (newValue) => {
    const nuevaFecha = new Date(newValue);
    setFechaAte(nuevaFecha);

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

      const dato = `${anoAte}${mesAte}${diaAte}`;
      setFechaAteStr(dato);
      setContextVolver({ ...contextVolver, fechaAte1: dato });
      //searchPacientes(dato)
    } else {
      setFechaAte(null);
      setFechaAteStr(null);
      setContextVolver({ ...contextVolver, fechaAte1: null });
      //searchPacientes(null)
    }
  };

  const handleVista = (event, newVista) => {
    //const { contextVolver, setContextVolver } = useVolverContext()
    if (newVista !== null) {
      setContextVolver({
        ...contextVolver,
        vista: newVista,
        solo:
          newVista === "todos" &&
          !searchQuery &&
          !tags.length &&
          !diagnosticos.length &&
          !practicas.length,
      });
    }
  };

  function sumarDias(fecha, dias) {
    if (fecha && !isNaN(moment(fecha))) {
      const nuevaF = new Date(fecha);
      return nuevaF.setDate(nuevaF.getDate() + dias);
    }
    return null;
  }

  const handleClose = () => {
    setStateToast({ ...stateToast, open: false });
  };

  const cambiaDNI = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
    setContextVolver({ ...contextVolver, searchQuery: e.target.value });
  };

  const handleChangeTagsAdd = (e) => {
    e.preventDefault();
    setTagsAdd(e.target.value.trim().toLowerCase());
  };

  const handleSubmitTag = (e) => {
    e.preventDefault();
    if (tagsAdd) {
      setContextVolver({
        ...contextVolver,
        tags: [...contextVolver.tags, tagsAdd],
      });
      setTagsAdd("");
    }
  };

  const hdel = (chipToDelete) => {
    setContextVolver({
      ...contextVolver,
      tags: contextVolver.tags.filter((tag) => tag !== chipToDelete),
    });
  };

  const handleChangeDxAdd = (e) => {
    e.preventDefault();
    setDxAdd(e.target.value.toLowerCase());
  };

  const handleChangePracticasAdd = (e) => {
    e.preventDefault();
    setPracticasAdd(e.target.value.toLowerCase());
  };

  const handleSubmitDx = (e) => {
    e.preventDefault();
    if (dxAdd) {
      setContextVolver({
        ...contextVolver,
        diagnosticos: [...contextVolver.diagnosticos, dxAdd.trim()],
      });
      setDxAdd("");
    }
  };

  const handleSubmitPracticas = (e) => {
    e.preventDefault();
    if (practicasAdd) {
      setContextVolver({
        ...contextVolver,
        practicas: [...contextVolver.practicas, practicasAdd.trim()],
      });
      setPracticasAdd("");
    }
  };

  const hdelDx = (chipToDelete) => {
    setContextVolver({
      ...contextVolver,
      diagnosticos: contextVolver.diagnosticos.filter(
        (dx) => dx !== chipToDelete
      ),
    });
  };

  const hdelPractias = (chipToDelete) => {
    setContextVolver({
      ...contextVolver,
      practicas: contextVolver.practicas.filter(
        (practica) => practica !== chipToDelete
      ),
    });
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
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>

        <Grid
          container
          justify="space-between"
          alignItems="stretch"
          spacing={3}
          className={classes.gridContainer}
        >
          <Grid item xs={12} sm={6} md={8} xl={9}>
            <Pacientes />
          </Grid>

          <Grid item xs={12} sm={6} md={4} xl={3}>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                    centered
                  >
                    {/* <Tab icon={< SearchIcon />} label="Buscar" value="1" />
                    <Tab icon={<PersonAddIcon />} label="Crear" value="2" /> */}
                    <Tab label="Buscar" value="1" />
                    <Tab label="Crear" value="2" />
                  </TabList>
                </Box>

                <TabPanel value="1">
                  <AppBar
                    className={classes.appBarSearch}
                    position="static"
                    color="inherit"
                  >
                    <TextField
                      className={classes.txtApellidos}
                      name="search"
                      variant="outlined"
                      label="Buscar por DNI o Apellido"
                      fullWidth
                      size="small"
                      value={search}
                      onChange={(e) => {
                        cambiaDNI(e);
                      }}
                    />

                    <form
                      autoComplete="off"
                      noValidate
                      style={{ marginBottom: "10px" }}
                    >
                      <Box
                        sx={{
                          display: "grid",
                          gridAutoFlow: "row",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          marginBottom: "1rem",
                          gap: 1,
                        }}
                      >
                        {tags.map((data, i) => (
                          <Chip
                            key={i}
                            label={data}
                            onDelete={() => hdel(data)}
                          />
                        ))}
                      </Box>

                      <TextField
                        name="tagsAdd"
                        size="small"
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
                    </form>
                    <form
                      autoComplete="off"
                      noValidate
                      style={{ marginBottom: "10px" }}
                    >
                      <Box
                        sx={{
                          display: "grid",
                          gridAutoFlow: "row",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          marginBottom: "1rem",
                          gap: 1,
                        }}
                      >
                        {diagnosticos.map((data, i) => (
                          <Chip
                            key={i}
                            label={data}
                            onDelete={() => hdelDx(data)}
                          />
                        ))}
                      </Box>

                      <TextField
                        size="small"
                        name="DxAdd"
                        variant="outlined"
                        label="Diagnóstico presuntivo"
                        value={dxAdd}
                        onChange={handleChangeDxAdd}
                      />

                      <Button
                        className={classes.buttonSubmit}
                        variant="contained"
                        color="primary"
                        size="small"
                        type="submit"
                        onClick={handleSubmitDx}
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                    </form>
                    <form
                      autoComplete="off"
                      noValidate
                      style={{ marginBottom: "10px" }}
                    >
                      <Box
                        sx={{
                          display: "grid",
                          gridAutoFlow: "row",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          marginBottom: "1rem",
                          gap: 1,
                        }}
                      >
                        {practicas.map((data, i) => (
                          <Chip
                            key={i}
                            label={data}
                            onDelete={() => hdelPractias(data)}
                          />
                        ))}
                      </Box>

                      <TextField
                        size="small"
                        name="PracticasAdd"
                        variant="outlined"
                        label="Prácticas"
                        value={practicasAdd}
                        onChange={handleChangePracticasAdd}
                      />

                      <Button
                        className={classes.buttonSubmit}
                        variant="contained"
                        color="primary"
                        size="small"
                        type="submit"
                        onClick={handleSubmitPracticas}
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                    </form>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={{ xs: 1, sm: 2, md: 4 }}
                    >
                      <Typography
                        style={{ marginBottom: "20px" }}
                        variant="subtitle1"
                        alignSelf="center"
                      >
                        Atenciones:
                      </Typography>

                      <StyledToggleButtonGroup
                        color="success"
                        value={vista}
                        size="small"
                        exclusive
                        onChange={handleVista}
                        style={{
                          marginBottom: "20px",
                          alignSelf: "center",
                          border: 5,
                        }}
                      >
                        <ToggleButton size="small" value="todos">
                          T
                        </ToggleButton>
                        <ToggleButton size="small" value="anomes">
                          M
                        </ToggleButton>
                        <ToggleButton size="small" value="dia">
                          D
                        </ToggleButton>
                        <ToggleButton size="small" value="proxima">
                          P
                        </ToggleButton>
                      </StyledToggleButtonGroup>
                    </Stack>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={{ xs: 1, sm: 2, md: 4 }}
                    >
                      <Autocomplete
                        disabled={vista === "anomes" ? false : true}
                        style={{ width: 130 }}
                        value={anoSelected}
                        size="small"
                        onChange={(event, newValue) => {
                          setAnoSelected(newValue);
                          if (newValue && mesSelected) {
                            setContextVolver({
                              ...contextVolver,
                              anomesStr: newValue + mesSelected,
                            });
                          } else {
                            setContextVolver({
                              ...contextVolver,
                              anomesStr: null,
                            });
                          }
                        }}
                        id="anoSelected"
                        isOptionEqualToValue={(option, value) =>
                          option === value
                        }
                        options={anos}
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                          <TextField {...params} label="Año" />
                        )}
                      />
                      <Autocomplete
                        disabled={vista === "anomes" ? false : true}
                        style={{ width: 130 }}
                        value={mesSelected}
                        size="small"
                        onChange={(event, newValue) => {
                          setMesSelected(newValue);
                          if (newValue && anoSelected) {
                            setContextVolver({
                              ...contextVolver,
                              anomesStr: anoSelected + newValue,
                            });
                          } else {
                            setContextVolver({
                              ...contextVolver,
                              anomesStr: null,
                            });
                          }
                        }}
                        id="mesSelected"
                        options={meses}
                        isOptionEqualToValue={(option, value) =>
                          option === value
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Mes" />
                        )}
                      />
                    </Stack>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={{ xs: 1, sm: 2, md: 4 }}
                      style={{ marginTop: "20px" }}
                    >
                      <IconButton
                        aria-label="anterior"
                        disabled={vista === "dia" ? false : true}
                        onClick={() => {
                          const fechaSumada = sumarDias(fechaAte, -1);
                          cambioFecha(fechaSumada);
                          //navigate(`/pacientes`)
                          //walter(fechaAte, -1)
                        }}
                      >
                        <SkipPreviousIcon />
                      </IconButton>
                      <DatePicker
                        disabled={vista === "dia" ? false : true}
                        mask="__/__/____"
                        label="Fecha de Atención."
                        value={fechaAte}
                        onChange={(newValue) => {
                          cambioFecha(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                      <IconButton
                        aria-label="próximo"
                        disabled={vista === "dia" ? false : true}
                        onClick={() => {
                          const fechaSumada = sumarDias(fechaAte, 1);
                          cambioFecha(fechaSumada);
                          //navigate(`/pacientes`)
                          //walter(fechaAte, 1)
                        }}
                      >
                        <SkipNextIcon />
                      </IconButton>
                    </Stack>

                    <Button
                      onClick={() => searchPacientes(fechaAteStr)}
                      className={classes.searchButton}
                      variant="contained"
                      color="primary"
                    >
                      Buscar
                    </Button>
                  </AppBar>
                </TabPanel>

                <TabPanel value="2">
                  <Form currentId={currentId} setCurrentId={setCurrentId} />
                </TabPanel>

                {vista === "todos" &&
                !searchQuery &&
                !tags.length &&
                !diagnosticos.length &&
                !practicas.length ? (
                  <Paper className={classes.pagination} elevation={6}>
                    <Pagination page={page1} />
                  </Paper>
                ) : (
                  <Paper className={classes.pagination} elevation={6}>
                    <PaginationSearch page={page1} />
                  </Paper>
                )}
              </TabContext>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default HomePac;
