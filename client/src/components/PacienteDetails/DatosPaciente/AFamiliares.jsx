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

import { afamiliaresPaciente } from "../../../actions/pacientes";
import { PacienteAFamiliares } from "../../../constants/pacienteAFamiliares";

import useStyles from "./styles";

const AFamiliares = ({ setBtnEstado, btnEstado }) => {
  const { paciente } = useSelector((state) => state.pacientes);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [pacienteAFamiliares, setPacienteAFamiliares] = useState(
    paciente.antecedentes?.familiares || PacienteAFamiliares
  );
  const { id } = useParams();
  const [btnGrabar, setBtnGrabar] = useState(true);

  if (!paciente) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pacienteAFamiliares) {
      dispatch(afamiliaresPaciente(pacienteAFamiliares, id));
    }
    setBtnGrabar(true);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setPacienteAFamiliares({
      ...pacienteAFamiliares,
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
        <div style={{ width: "100%", textAlign: "center" }}>
          <Typography variant="h6">Antecedentes Familiares</Typography>
        </div>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          style={{ width: "100%" }}
        >
          <TextField
            select
            name="hta"
            value={pacienteAFamiliares?.hta}
            onChange={handleChange}
            SelectProps={{
              native: true,
            }}
            helperText="HTA"
          >
            {VerdaderoFalso.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>

          <TextField
            select
            name="cardiaca"
            value={pacienteAFamiliares?.cardiaca}
            onChange={handleChange}
            SelectProps={{
              native: true,
            }}
            helperText="Cardíacas antes 55 años"
          >
            {VerdaderoFalso.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>

          <TextField
            select
            name="dbt"
            value={pacienteAFamiliares?.dbt}
            onChange={handleChange}
            SelectProps={{
              native: true,
            }}
            helperText="DBT"
          >
            {VerdaderoFalso.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>

          <TextField
            select
            name="acv"
            value={pacienteAFamiliares?.acv}
            onChange={handleChange}
            SelectProps={{
              native: true,
            }}
            helperText="ACV"
          >
            {VerdaderoFalso.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>

          <TextField
            select
            name="celiaca"
            value={pacienteAFamiliares?.celiaca}
            onChange={handleChange}
            SelectProps={{
              native: true,
            }}
            helperText="Celíaca"
          >
            {VerdaderoFalso.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>

          <TextField
            select
            name="drogas"
            value={pacienteAFamiliares?.drogas}
            onChange={handleChange}
            SelectProps={{
              native: true,
            }}
            helperText="Drogas"
          >
            {VerdaderoFalso.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>

          <TextField
            select
            name="alcohol"
            value={pacienteAFamiliares?.alcohol}
            onChange={handleChange}
            SelectProps={{
              native: true,
            }}
            helperText="Alcohol"
          >
            {VerdaderoFalso.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>

          <TextField
            select
            name="depresion"
            value={pacienteAFamiliares?.depresion}
            onChange={handleChange}
            SelectProps={{
              native: true,
            }}
            helperText="Depresión"
          >
            {VerdaderoFalso.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Stack>

        <TextField
          variant="outlined"
          label="Cáncer en la familia"
          fullWidth
          name="cancer"
          value={pacienteAFamiliares?.cancer}
          onChange={handleChange}
        />

        <TextField
          name="notas"
          variant="outlined"
          label="Notas"
          fullWidth
          rows={3}
          multiline
          value={pacienteAFamiliares?.notas}
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
              setBtnEstado({ ...btnEstado, btnAFamiliares: false })
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

export default AFamiliares;
