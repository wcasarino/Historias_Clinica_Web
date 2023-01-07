import React, { useState, useEffect } from "react";
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
  Snackbar,
  Autocomplete,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

import MuiAlert from "@mui/material/Alert";
import swal from "sweetalert";
import { styled } from "@mui/material/styles";

import { getCalendarioBySearch } from "../../actions/calendario";

import useStyles from "./styles";
import { useVolverContext } from "../../contexts/volverContext";
import { useCalendarioContext } from "../../contexts/CalendarioContext";

import CalendarioTodos from "../Calendario/CalendarioTodos";

const HomeCalendar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contextVolver, setContextVolver } = useVolverContext();
  const { searchQuery, tags, diagnosticos, practicas } = contextVolver;

  const { contextCalendario, setContextCalendario } = useCalendarioContext();
  const { stepc, hini, hfin } = contextCalendario;

  const hinis = [
    "00",
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
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];
  const hfins = [
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
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
  ];

  //const [stepc, setStepc] = useState("15");
  //const [hini, setHini] = useState("07");
  //const [hfin, setHfin] = useState("20");

  let searchIni = "";
  if (searchQuery !== "9a69dc7e834f617" && searchQuery !== null) {
    searchIni = searchQuery;
  }
  const [search, setSearch] = useState(searchIni);
  const [tagsAdd, setTagsAdd] = useState("");
  const [dxAdd, setDxAdd] = useState("");
  const [practicasAdd, setPracticasAdd] = useState("");

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

  const user = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    console.log("useEffect datos");
    dispatch(
      getCalendarioBySearch({
        search,
        tags: tags.join(","),
        diagnosticos,
        practicas,
      })
    );
    navigate(
      `/calendario/search?searchQuery=${
        search || "9a69dc7e834f617"
      }&tags=${tags.join(",")}&diagnosticos=${diagnosticos.join(
        ","
      )}&practicas=${practicas.join(",")}`
    );
  }, [search, tags, diagnosticos, practicas]);

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

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper} elevation={6}>
        <Typography variant="h6" align="center">
          Por favor ingrese al sistema para cargar pacientes.
        </Typography>
      </Paper>
    );
  }

  const searchAtenciones = async () => {
    if (
      search.trim() ||
      tags.length > 0 ||
      diagnosticos.length > 0 ||
      practicas.length > 0
    ) {
      dispatch(
        getCalendarioBySearch({
          search,
          tags: tags.join(","),
          diagnosticos,
          practicas,
        })
      );
      navigate(
        `/calendario/search?searchQuery=${
          search || "9a69dc7e834f617"
        }&tags=${tags.join(",")}&diagnosticos=${diagnosticos.join(
          ","
        )}&practicas=${practicas.join(",")}`
      );
    } else {
      navigate("/calendario");
    }
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

  const handleClose = () => {
    setStateToast({ ...stateToast, open: false });
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
            <CalendarioTodos />
          </Grid>

          <Grid item xs={12} sm={6} md={4} xl={3}>
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
                  setSearch(e.target.value);
                  setContextVolver({
                    ...contextVolver,
                    searchQuery: e.target.value,
                  });
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
                    <Chip key={i} label={data} onDelete={() => hdel(data)} />
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
                    <Chip key={i} label={data} onDelete={() => hdelDx(data)} />
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
                style={{
                  alignSelf: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  style={{ marginBottom: "10px" }}
                  variant="subtitle1"
                  alignSelf="center"
                >
                  Intérvalo:
                </Typography>

                <StyledToggleButtonGroup
                  color="success"
                  value={stepc}
                  size="small"
                  exclusive
                  onChange={(event, newValue) => {
                    setContextCalendario({
                      ...contextCalendario,
                      stepc: newValue,
                    });
                  }}
                  style={{
                    marginBottom: "20px",
                    alignSelf: "center",
                    border: 5,
                  }}
                >
                  <ToggleButton size="small" value="15" defaultChecked>
                    15
                  </ToggleButton>
                  <ToggleButton size="small" value="30">
                    30
                  </ToggleButton>
                  <ToggleButton size="small" value="60">
                    60
                  </ToggleButton>
                </StyledToggleButtonGroup>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                style={{
                  alignSelf: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Autocomplete
                  style={{ width: 100 }}
                  value={hini}
                  size="small"
                  onChange={(event, newValue) => {
                    if (newValue >= hfin) {
                      return swal({
                        title: "Hora de Inicio",
                        text: "Hora de Inicio inválida, verifique",
                        icon: "danger",
                        timer: "3000",
                      });
                    }
                    setContextCalendario({
                      ...contextCalendario,
                      hini: newValue,
                    });
                  }}
                  id="hini"
                  isOptionEqualToValue={(option, value) => option === value}
                  options={hinis}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Hora inicial" />
                  )}
                />
                <Autocomplete
                  style={{ width: 100 }}
                  value={hfin}
                  size="small"
                  onChange={(event, newValue) => {
                    if (newValue <= hini) {
                      return swal({
                        title: "Hora de Fin",
                        text: "Hora de Fin inválida, verifique",
                        icon: "danger",
                        timer: "3000",
                      });
                    }
                    setContextCalendario({
                      ...contextCalendario,
                      hfin: newValue,
                    });
                  }}
                  id="hfin"
                  isOptionEqualToValue={(option, value) => option === value}
                  options={hfins}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Hora Final" />
                  )}
                />
              </Stack>

              <Button
                onClick={() => searchAtenciones()}
                className={classes.searchButton}
                variant="contained"
                color="primary"
              >
                Buscar
              </Button>
            </AppBar>
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default HomeCalendar;
