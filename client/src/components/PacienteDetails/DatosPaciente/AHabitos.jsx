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

import { ahabitosPaciente } from "../../../actions/pacientes";
import { PacienteAHabitos } from "../../../constants/pacienteAHabitos";

import useStyles from "./styles";

const AHabitos = ({ setBtnEstado, btnEstado }) => {
  const { paciente } = useSelector((state) => state.pacientes);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [pacienteAHabitos, setPacienteAHabitos] = useState(
    paciente.antecedentes?.habitos || PacienteAHabitos
  );
  const { id } = useParams();
  const [btnGrabar, setBtnGrabar] = useState(true);

  if (!paciente) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pacienteAHabitos) {
      dispatch(ahabitosPaciente(pacienteAHabitos, id));
    }
    setBtnGrabar(true);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setPacienteAHabitos({
      ...pacienteAHabitos,
      [e.target.name]: e.target.value,
    });
    setBtnGrabar(false);
  };

  const VerdaderoFalso = [
    {
      value: null,
      label: "",
    },
    {
      value: false,
      label: "NO",
    },
    {
      value: true,
      label: "SI",
    },
  ];

  return (
    <Paper className={classes.paper} elevation={6}>
      <form
        autoComplete="off"
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">Hábitos</Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          style={{ width: "100%" }}
        >
          <TextField
            name="tabaco"
            variant="outlined"
            label="Tabaco"
            fullWidth
            value={pacienteAHabitos?.tabaco}
            onChange={handleChange}
          />

          <TextField
            name="alcohol_habi"
            variant="outlined"
            label="Alcohol"
            fullWidth
            value={pacienteAHabitos?.alcohol_habi}
            onChange={handleChange}
          />

          <TextField
            name="drogas"
            variant="outlined"
            label="Drogas"
            fullWidth
            value={pacienteAHabitos?.drogas}
            onChange={handleChange}
          />
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          style={{ width: "100%" }}
        >
          <TextField
            select
            name="sedentarismo"
            value={pacienteAHabitos?.sedentarismo}
            onChange={handleChange}
            SelectProps={{
              native: true,
            }}
            helperText="Sedentarismo"
          >
            {VerdaderoFalso.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>

          <TextField
            name="fisico"
            variant="outlined"
            label="Actividad Física"
            value={pacienteAHabitos?.fisico}
            onChange={handleChange}
          />

          <TextField
            name="alimentacion"
            variant="outlined"
            label="Alimentacion"
            value={pacienteAHabitos?.alimentacion}
            onChange={handleChange}
          />

          <TextField
            name="cinturon"
            variant="outlined"
            label="Usa Cinturón de seguridad o casco"
            value={pacienteAHabitos?.cinturon}
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
          value={pacienteAHabitos?.notas}
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
            onClick={() => setBtnEstado({ ...btnEstado, btnAHabitos: false })}
          >
            Cerrar
          </Button>
        </Stack>
      </form>
      <Divider style={{ margin: 10 }} />
    </Paper>
  );
};

export default AHabitos;
