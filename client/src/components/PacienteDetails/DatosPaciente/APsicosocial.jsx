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

import { apsicosocialPaciente } from "../../../actions/pacientes";
import { PacienteAPsicosocial } from "../../../constants/pacienteAPsicosocial";

import useStyles from "./styles";

const APsicosocial = ({ setBtnEstado, btnEstado }) => {
  const { paciente } = useSelector((state) => state.pacientes);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [pacienteAPsicosocial, setPacienteAPsicosocial] = useState(
    paciente.antecedentes?.psicosocial || PacienteAPsicosocial
  );
  const { id } = useParams();
  const [btnGrabar, setBtnGrabar] = useState(true);

  if (!paciente) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pacienteAPsicosocial) {
      dispatch(apsicosocialPaciente(pacienteAPsicosocial, id));
    }
    setBtnGrabar(true);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setPacienteAPsicosocial({
      ...pacienteAPsicosocial,
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
        <Typography variant="h6">Situación Psicosocial</Typography>

        <TextField
          name="violencia"
          variant="outlined"
          label="Violencia Familiar"
          fullWidth
          value={pacienteAPsicosocial?.violencia}
          onChange={handleChange}
        />
        <div style={{ width: "100%", textAlign: "center" }}>
          <Typography variant="body1">
            Sucesos vitales que lo afectan
          </Typography>
        </div>

        <TextField
          select
          helperText="Duelo"
          name="duelo"
          value={pacienteAPsicosocial?.duelo}
          onChange={handleChange}
          SelectProps={{
            native: true,
          }}
        >
          {VerdaderoFalso.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>

        <TextField
          select
          helperText="Separación"
          name="separacion"
          value={pacienteAPsicosocial?.separacion}
          onChange={handleChange}
          SelectProps={{
            native: true,
          }}
        >
          {VerdaderoFalso.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>

        <TextField
          select
          helperText="Pérdida de trabajo"
          name="trabajo"
          value={pacienteAPsicosocial?.trabajo}
          onChange={handleChange}
          SelectProps={{
            native: true,
          }}
        >
          {VerdaderoFalso.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>

        <TextField
          select
          helperText="Traslado"
          name="traslado"
          value={pacienteAPsicosocial?.traslado}
          onChange={handleChange}
          SelectProps={{
            native: true,
          }}
        >
          {VerdaderoFalso.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>

        <TextField
          select
          helperText="Nacimiento"
          name="nacimiento"
          value={pacienteAPsicosocial?.nacimiento}
          onChange={handleChange}
          SelectProps={{
            native: true,
          }}
        >
          {VerdaderoFalso.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          style={{ width: "100%" }}
        >
          <TextField
            name="empleo"
            variant="outlined"
            label="Empleo estable en la familia"
            fullWidth
            value={pacienteAPsicosocial?.empleo}
            onChange={handleChange}
          />

          <TextField
            name="recurre"
            variant="outlined"
            label="Ante un problema personal a quien recurre"
            fullWidth
            value={pacienteAPsicosocial?.recurre}
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
          value={pacienteAPsicosocial?.notas}
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
            onClick={() =>
              setBtnEstado({ ...btnEstado, btnAPsicosocial: false })
            }
          >
            Cerrar
          </Button>
        </Stack>
      </form>
      <Divider style={{ margin: 10 }} />
    </Paper>
  );
};

export default APsicosocial;
