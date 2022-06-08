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

import { aginecoPaciente } from "../../../actions/pacientes";
import { PacienteAGineco } from "../../../constants/pacienteAGineco";

import useStyles from "./styles";

const AGineco = ({ setBtnEstado, btnEstado }) => {
  const { paciente } = useSelector((state) => state.pacientes);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [pacienteAGineco, setPacienteAGineco] = useState(
    paciente?.antecedentes?.gineco || PacienteAGineco
  );
  const { id } = useParams();
  const [btnGrabar, setBtnGrabar] = useState(true);
  const [resFPP, setResFPP] = useState("");

  useEffect(() => {
    if (pacienteAGineco?.fum) {
      calcularFPP(pacienteAGineco?.fum);
    }
  }, [pacienteAGineco?.fum]);

  const calcularFPP = (fumA) => {
    setResFPP("");
    if (fumA) {
      let anofumA = 0;
      let mesfumA = 0;
      let diafumA = 0;

      if (isNaN(parseInt(String(fumA).substring(0, 4)))) {
        anofumA = parseInt(fumA.getFullYear());
        mesfumA = parseInt(fumA.getMonth()) + 1;
        diafumA = parseInt(fumA.getDate());
      } else {
        anofumA = parseInt(String(fumA).substring(0, 4));
        mesfumA = parseInt(String(fumA).substring(5, 7));
        diafumA = parseInt(String(fumA).substring(8, 10));
      }
      const fechafunA = new Date(anofumA, mesfumA, diafumA);
      const fechaFPP = new Date(fechafunA.setMonth(fechafunA.getMonth() + 8));
      let anofechaFPP = parseInt(fechaFPP.getFullYear());
      let mesfechaFPP = parseInt(fechaFPP.getMonth()) + 1;
      let diafechaFPP = parseInt(fechaFPP.getDate());

      diafechaFPP = ("0" + diafechaFPP).slice(-2);
      mesfechaFPP = ("0" + mesfechaFPP).slice(-2);

      setResFPP(
        `Fecha Probable de Parto: ${diafechaFPP}/${mesfechaFPP}/${anofechaFPP}`
      );
    }
  };

  if (!paciente) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pacienteAGineco) {
      dispatch(aginecoPaciente(pacienteAGineco, id));
    }
    setBtnGrabar(true);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setPacienteAGineco({
      ...pacienteAGineco,
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
          <Typography variant="h6">Antecedentes Gineco-Obstétricos</Typography>
        </div>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          style={{ width: "100%" }}
        >
          <DatePicker
            mask="__/__/____"
            label="F.U.M."
            value={pacienteAGineco?.fum}
            maxDate={new Date()}
            onChange={(newValue) => {
              setPacienteAGineco({
                ...pacienteAGineco,
                fum: newValue,
              });
              setBtnGrabar(false);
              calcularFPP(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <Typography fullWidth variant="body2">
            {resFPP}
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          style={{ width: "100%" }}
        >
          <TextField
            name="menarca"
            fullWidth
            variant="outlined"
            label="Menarca"
            size="small"
            value={pacienteAGineco?.menarca}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            size="small"
            name="irs"
            variant="outlined"
            label="I.R.S."
            value={pacienteAGineco?.irs}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            size="small"
            name="gestas"
            variant="outlined"
            label="Gestas"
            value={pacienteAGineco?.gestas}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            size="small"
            name="partos"
            variant="outlined"
            label="Partos"
            value={pacienteAGineco?.partos}
            onChange={handleChange}
          />
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          style={{ width: "100%" }}
        >
          <TextField
            fullWidth
            size="small"
            name="cesareas"
            variant="outlined"
            label="Cesáreas"
            value={pacienteAGineco?.cesareas}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            size="small"
            name="abortos"
            variant="outlined"
            label="Abortos"
            value={pacienteAGineco?.abortos}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            size="small"
            name="ciclos"
            variant="outlined"
            label="Ciclos"
            value={pacienteAGineco?.ciclos}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            size="small"
            name="menopuasia"
            variant="outlined"
            label="Menopuasia"
            value={pacienteAGineco?.menopuasia}
            onChange={handleChange}
          />
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          style={{ width: "100%" }}
        >
          <TextField
            style={{ width: "200px" }}
            size="small"
            select
            name="anticoncepcion_q"
            value={pacienteAGineco?.anticoncepcion_q}
            onChange={handleChange}
            helperText="Anticoncepcion quirúrgica"
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
            fullWidth
            size="small"
            name="anticoncepcion_t"
            variant="outlined"
            label="Anticoncepción"
            value={pacienteAGineco?.anticoncepcion_t}
            onChange={handleChange}
          />

          <TextField
            style={{ width: "200px" }}
            size="small"
            select
            name="diu"
            value={pacienteAGineco?.diu}
            onChange={handleChange}
            SelectProps={{
              native: true,
            }}
            helperText="DIU"
          >
            {VerdaderoFalso.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>

          <TextField
            fullWidth
            size="small"
            name="diu_t"
            variant="outlined"
            label="D.I.U."
            value={pacienteAGineco?.diu_t}
            onChange={handleChange}
          />
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          style={{ width: "100%" }}
        >
          <TextField
            style={{ width: "200px" }}
            size="small"
            select
            name="implante"
            value={pacienteAGineco?.implante}
            onChange={handleChange}
            SelectProps={{
              native: true,
            }}
            helperText="Implante"
          >
            {VerdaderoFalso.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>

          <DatePicker
            mask="__/__/____"
            label="F.U.P."
            value={pacienteAGineco?.fup}
            maxDate={new Date()}
            onChange={(newValue) => {
              setPacienteAGineco({
                ...pacienteAGineco,
                fup: newValue,
              });
              setBtnGrabar(false);
            }}
            renderInput={(params) => <TextField {...params} />}
          />

          <TextField
            fullWidth
            size="small"
            name="fup_t"
            variant="outlined"
            label="Datos Último Parto"
            value={pacienteAGineco?.fup_t}
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
          value={pacienteAGineco?.notas}
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
            onClick={() => setBtnEstado({ ...btnEstado, btnAGineco: false })}
          >
            Cerrar
          </Button>
        </Stack>
      </form>
      <Divider style={{ margin: 10 }} />
    </Paper>
  );
};

export default AGineco;
