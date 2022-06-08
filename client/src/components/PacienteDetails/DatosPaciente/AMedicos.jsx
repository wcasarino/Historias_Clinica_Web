import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
} from "@mui/material/";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { amedicosPaciente } from "../../../actions/pacientes";
import { PacienteAMedicos } from "../../../constants/pacienteAMedicos";

import useStyles from "./styles";

const AMedicos = ({ setBtnEstado, btnEstado }) => {
  const { paciente } = useSelector((state) => state.pacientes);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [pacienteAMedicos, setPacienteAMedicos] = useState(
    paciente.antecedentes?.medicos || PacienteAMedicos
  );
  const { id } = useParams();
  const [btnGrabar, setBtnGrabar] = useState(true);

  if (!paciente) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pacienteAMedicos) {
      dispatch(amedicosPaciente(pacienteAMedicos, id));
    }
    setBtnGrabar(true);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setPacienteAMedicos({
      ...pacienteAMedicos,
      [e.target.name]: e.target.value,
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
        <Typography variant="h6">Antecedentes Médicos</Typography>

        <TextField
          name="app"
          variant="outlined"
          label="Antecedentes Personales Patológicos"
          fullWidth
          value={pacienteAMedicos?.app}
          onChange={handleChange}
        />

        <TextField
          name="alergias"
          variant="outlined"
          label="Alergias"
          fullWidth
          value={pacienteAMedicos?.alergias}
          onChange={handleChange}
        />

        <TextField
          name="alergias_medicamentos"
          variant="outlined"
          label="Alergias a medicamentos"
          fullWidth
          value={pacienteAMedicos?.alergias_medicamentos}
          onChange={handleChange}
        />

        <TextField
          name="internaciones"
          variant="outlined"
          label="Internaciones operaciones accidentes"
          fullWidth
          value={pacienteAMedicos?.internaciones}
          onChange={handleChange}
        />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          style={{ width: "100%" }}
        >
          <TextField
            name="transfusiones"
            variant="outlined"
            label="Transfusiones de sangre"
            fullWidth
            value={pacienteAMedicos?.transfusiones}
            onChange={handleChange}
          />

          <TextField
            name="sexual"
            variant="outlined"
            label="Infecciones de transmición sexual"
            fullWidth
            value={pacienteAMedicos?.sexual}
            onChange={handleChange}
          />
        </Stack>

        <TextField
          name="notas"
          variant="outlined"
          label="Notas"
          fullWidth
          rows={3}
          multiline
          value={pacienteAMedicos?.notas}
          onChange={handleChange}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
        >
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={btnGrabar}
          >
            Grabar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setBtnEstado({ ...btnEstado, btnAMedicos: false })}
          >
            Cerrar
          </Button>
        </Stack>
      </form>
      <Divider style={{ margin: 10 }} />
    </Paper>
  );
};

export default AMedicos;
