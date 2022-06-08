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

import { domicilioPaciente } from "../../../actions/pacientes";
import { PacienteDomicilio } from "../../../constants/pacienteDomicilio";

import useStyles from "./styles";

const Domicilio = ({ setBtnEstado, btnEstado }) => {
  const { paciente } = useSelector((state) => state.pacientes);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [pacienteDomicilio, setPacienteDomicilio] = useState(
    paciente?.domicilio || PacienteDomicilio
  );
  const { id } = useParams();
  const [btnGrabar, setBtnGrabar] = useState(true);

  if (!paciente) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pacienteDomicilio) {
      dispatch(domicilioPaciente(pacienteDomicilio, id));
    }
    setBtnGrabar(true);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setPacienteDomicilio({
      ...pacienteDomicilio,
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
        <Typography variant="h6">Datos del Domicilio</Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          style={{ width: "100%" }}
        >
          <TextField
            name="calle"
            variant="outlined"
            label="Calle"
            fullWidth
            value={pacienteDomicilio?.calle}
            onChange={handleChange}
          />
          <TextField
            name="barrio"
            variant="outlined"
            label="Barrio"
            fullWidth
            value={pacienteDomicilio?.barrio}
            onChange={handleChange}
          />
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          style={{ width: "100%" }}
        >
          <TextField
            name="departamento"
            variant="outlined"
            label="Departamento"
            fullWidth
            value={pacienteDomicilio?.departamento}
            onChange={handleChange}
          />
          <TextField
            name="telefono"
            variant="outlined"
            label="Teléfono"
            fullWidth
            value={pacienteDomicilio?.telefono}
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
          value={pacienteDomicilio?.notas}
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
            onClick={() => setBtnEstado({ ...btnEstado, btnDomicilio: false })}
          >
            Cerrar
          </Button>
        </Stack>
      </form>
      <Divider style={{ margin: 10 }} />
    </Paper>
  );
};

export default Domicilio;
