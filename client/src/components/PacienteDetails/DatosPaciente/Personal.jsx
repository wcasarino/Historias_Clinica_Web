import React, { useEffect, useState } from "react";
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
import DatePicker from "@mui/lab/DatePicker";

import { personaPaciente } from "../../../actions/pacientes";
import { PacientePersona } from "../../../constants/pacientePersona";

import useStyles from "./styles";

const Personal = ({ setBtnEstado, btnEstado }) => {
  const { paciente } = useSelector((state) => state.pacientes);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [pacientePersona, setPacientePersona] = useState(
    paciente.persona || PacientePersona
  );
  const { id } = useParams();
  const [btnGrabar, setBtnGrabar] = useState(true);
  const [edad, setEdad] = useState("");

  useEffect(() => {
    if (pacientePersona?.fecha_nac) {
      calcularEdad(pacientePersona?.fecha_nac);
    }
  }, [pacientePersona?.fecha_nac]);

  if (!paciente) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pacientePersona) {
      dispatch(personaPaciente(pacientePersona, id));
    }
    setBtnGrabar(true);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setPacientePersona({
      ...pacientePersona,
      [e.target.name]: e.target.value,
    });
    setBtnGrabar(false);
  };

  const calcularEdad = (fechaNacimiento) => {
    let edadA = 0;
    let edadM = 0;
    let edadD = 0;
    if (fechaNacimiento) {
      const fechaActual = new Date();
      const anoActual = parseInt(fechaActual.getFullYear());
      const mesActual = parseInt(fechaActual.getMonth()) + 1;
      const diaActual = parseInt(fechaActual.getDate());

      let anoNacimiento = 0;
      let mesNacimiento = 0;
      let diaNacimiento = 0;

      if (isNaN(parseInt(String(fechaNacimiento).substring(0, 4)))) {
        anoNacimiento = parseInt(fechaNacimiento.getFullYear());
        mesNacimiento = parseInt(fechaNacimiento.getMonth()) + 1;
        diaNacimiento = parseInt(fechaNacimiento.getDate());
      } else {
        anoNacimiento = parseInt(String(fechaNacimiento).substring(0, 4));
        mesNacimiento = parseInt(String(fechaNacimiento).substring(5, 7));
        diaNacimiento = parseInt(String(fechaNacimiento).substring(8, 10));
      }

      edadA = anoActual - anoNacimiento;
      setEdad("");
      if (edadA > 1) {
        if (mesActual < mesNacimiento) {
          edadA--;
        } else if (mesActual === mesNacimiento) {
          if (diaActual < diaNacimiento) {
            edadA--;
          }
        }
        setEdad(`${edadA} años`);
      } else if (edadA === 0) {
        edadM = mesActual - mesNacimiento;
        if (edadM > 0) {
          setEdad(`${edadM} meses`);
        } else {
          edadD = diaActual - diaNacimiento;
          setEdad(`${edadD} días`);
        }
      } else if (edadA === 1) {
        if (mesNacimiento < mesActual) {
          setEdad(`${edadA} años`);
        } else if (mesActual === mesNacimiento) {
          if (diaNacimiento <= diaActual) {
            setEdad(`${edadA} años`);
          } else {
            edadM = 11 - mesNacimiento + mesActual;
            setEdad(`${edadM} meses`);
          }
        } else {
          if (diaNacimiento <= diaActual) {
            edadM = 12 - mesNacimiento + mesActual;
            setEdad(`${edadM} meses`);
          } else {
            edadM = 11 - mesNacimiento + mesActual;
            setEdad(`${edadM} meses`);
          }
        }
      } else {
        setEdad("Error Edad");
      }
    }
  };

  const opcionSexo = [
    {
      value: "",
      label: "",
    },
    {
      value: "F",
      label: "F",
    },
    {
      value: "M",
      label: "M",
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
        <Typography variant="h6">Datos de la Persona</Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          style={{ width: "100%" }}
        >
          <TextField
            name="cuit"
            variant="outlined"
            label="cuit"
            value={pacientePersona?.cuit}
            onChange={handleChange}
          />

          <DatePicker
            mask="__/__/____"
            label="Fecha Nacimiento"
            value={pacientePersona?.fecha_nac}
            maxDate={new Date()}
            onChange={(newValue) => {
              setPacientePersona({
                ...pacientePersona,
                fecha_nac: newValue,
              });
              setBtnGrabar(false);
              calcularEdad(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />

          <Typography variant="h6"> Edad {edad}</Typography>

          <TextField
            select
            helperText="Sexo"
            name="sexo"
            value={pacientePersona?.sexo}
            onChange={handleChange}
            SelectProps={{
              native: true,
            }}
          >
            {opcionSexo.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>

          <TextField
            name="estado_civil"
            variant="outlined"
            label="Estado Civil"
            value={pacientePersona?.estado_civil}
            onChange={handleChange}
          />
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          style={{ width: "100%" }}
        >
          <TextField
            name="obra_social"
            variant="outlined"
            label="Obra Social"
            fullWidth
            value={pacientePersona?.obra_social}
            onChange={handleChange}
          />
        </Stack>

        <TextField
          name="familograma"
          variant="outlined"
          label="Familograma"
          fullWidth
          rows={2}
          multiline
          value={pacientePersona?.familograma}
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
            onClick={() => setBtnEstado({ ...btnEstado, btnPersona: false })}
          >
            Cerrar
          </Button>
        </Stack>
      </form>
      <Divider style={{ margin: 10 }} />
    </Paper>
  );
};

export default Personal;
