import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Chip,
  Box,
  Stack,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "react-file-base64";
import { useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

import { updatePaciente } from "../../../actions/pacientes";
import useStyles from "./styles";

const DatosPaciente = ({ setBtnEstado, btnEstado }) => {
  const { paciente } = useSelector((state) => state.pacientes);
  const dispatch = useDispatch();
  const classes = useStyles();

  const { id } = useParams();
  const [btnGrabar, setBtnGrabar] = useState(true);
  const [tagsAdd, setTagsAdd] = useState("");

  const [pacienteData, setPacienteData] = useState(paciente);

  if (!paciente) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pacienteData) {
      dispatch(updatePaciente(id, pacienteData));
    }
    setBtnGrabar(true);
  };

  const handleChange = async (e) => {
    e.preventDefault();
    setPacienteData({ ...pacienteData, [e.target.name]: e.target.value });
    setBtnGrabar(false);
  };

  const handleChangeTagsAdd = (e) => {
    e.preventDefault();
    setTagsAdd(e.target.value.trim().toLowerCase());
    setBtnGrabar(false);
  };

  const handleSubmitTag = (e) => {
    e.preventDefault();
    if (tagsAdd) {
      setPacienteData({
        ...pacienteData,
        tags: [...pacienteData.tags, tagsAdd],
      });
      setTagsAdd("");
    }
    setBtnGrabar(false);
  };

  const hdel = (chipToDelete) => {
    setPacienteData({
      ...pacienteData,
      tags: pacienteData.tags.filter((tag) => tag !== chipToDelete),
    });
    setBtnGrabar(false);
  };

  return (
    <Paper className={classes.paper} elevation={6}>
      <form
        autoComplete="off"
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6" alignSelf="center">
          Datos del Paciente
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          style={{ width: "100%" }}
        >
          <TextField
            name="dni"
            variant="outlined"
            label="DNI"
            fullWidth
            value={pacienteData.dni}
            onChange={handleChange}
          />
          <TextField
            name="apellidos"
            variant="outlined"
            label="Apellidos"
            fullWidth
            value={pacienteData.apellidos}
            onChange={handleChange}
          />
          <TextField
            name="nombres"
            variant="outlined"
            label="Nombres"
            fullWidth
            value={pacienteData.nombres}
            onChange={handleChange}
          />
        </Stack>
        <form autoComplete="off" noValidate style={{ marginBottom: "10px" }}>
          <Box
            sx={{
              display: "grid",
              gridAutoFlow: "row",
              gridTemplateColumns: "repeat(3, 1fr)",

              gap: 1,
            }}
          >
            {pacienteData.tags.map((data, i) => (
              <Chip key={i} label={data} onDelete={() => hdel(data)} />
            ))}
          </Box>

          <TextField
            name="tagsAdd"
            variant="outlined"
            label="Nueva Etiquetas"
            size="small"
            value={tagsAdd}
            onChange={handleChangeTagsAdd}
          />

          <Button
            className={classes.buttonSubmit}
            variant="contained"
            color="primary"
            size="small"
            type="submit"
            onClick={handleSubmitTag}
          >
            <AddIcon fontSize="small" />
          </Button>
        </form>

        <Button
          className={classes.buttonSubmit}
          variant="contained"
          color="primary"
          type="submit"
          disabled={btnGrabar}
        >
          Grabar
        </Button>
        <Button
          className={classes.buttonSubmit}
          variant="contained"
          color="secondary"
          onClick={() =>
            setBtnEstado({ ...btnEstado, btnDatosPaciente: false })
          }
        >
          Cerrar
        </Button>
      </form>
      <Divider style={{ margin: 10 }} />
    </Paper>
  );
};

export default DatosPaciente;
