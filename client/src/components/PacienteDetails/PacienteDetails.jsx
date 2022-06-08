import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Divider,
  TextField,
  Button,
  Grid,
  IconButton,
  Stack,
} from "@mui/material/";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "moment/locale/es";
import DatePicker from "@mui/lab/DatePicker";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import SmokingRoomsIcon from "@mui/icons-material/SmokingRooms";
import PsychologyIcon from "@mui/icons-material/Psychology";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Checkbox from "@mui/material/Checkbox";
import { useParams, useNavigate } from "react-router-dom";
import { BlobProvider } from "@react-pdf/renderer";

import AtencionSection from "./AtencionSection";
import {
  getPaciente,
  resumenPaciente,
  proximaAtencionPaciente,
} from "../../actions/pacientes";
import useStyles from "./styles";
import { PacienteDoc } from "../../constants/pacienteDoc";

import Personal from "./DatosPaciente/Personal";
import Domicilio from "./DatosPaciente/Domicilio";
import AFamiliares from "./DatosPaciente/AFamiliares";
import AGineco from "./DatosPaciente/AGineco";
import AHabitos from "./DatosPaciente/AHabitos";
import AMedicos from "./DatosPaciente/AMedicos";
import APsicosocial from "./DatosPaciente/APsicosocial";
import DatosPaciente from "./DatosPaciente/DatosPaciente";

import hombrePensando from "../../images/pensando.jpg";
import { useVolverContext } from "../../contexts/volverContext";
import HCReducido from "../PDFs/HC/HCReducido";

const PacienteDetails = () => {
  const { paciente } = useSelector((state) => state.pacientes);
  const { contextVolver } = useVolverContext();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const locale = moment.locale("es");

  const { vista, menu, page, searchQuery, tags, solo, anomesStr, fechaAte1 } =
    contextVolver;

  const [pacienteData, setPacienteData] = useState(PacienteDoc);

  // const [btnDatosPaciente, setBtnDatosPaciente] = useState(false);
  // const [btnDomicilio, setBtnDomicilio] = useState(false);
  // const [btnAFamiliares, setBtnAFamiliares] = useState(false);
  // const [btnAGineco, setBtnAGineco] = useState(false);
  // const [btnAHabitos, setBtnAHabitos] = useState(false);
  // const [btnAMedicos, setBtnAMedicos] = useState(false);
  // const [btnAPsicosocial, setBtnAPsicosocial] = useState(false);
  // const [btnPersona, setBtnPersona] = useState(false);

  const [btnEstado, setBtnEstado] = useState({
    btnDatosPaciente: false,
    btnDomicilio: false,
    btnAFamiliares: false,
    btnAGineco: false,
    btnAHabitos: false,
    btnAMedicos: false,
    btnAPsicosocial: false,
    btnPersona: false,
  });

  const [btnPdf, setBtnPdf] = useState(false);
  const [pdfEstado, setPdfEstado] = useState({
    pdfPaciente: true,
    pdfDomicilio: true,
    pdfFamiliares: true,
    pdfGineco: true,
    pdfHabitos: true,
    pdfMedicos: true,
    pdfPsicoSocial: true,
    pdfPersona: true,
  });

  const [resumen, setResumen] = useState("nadaW");
  const [proximaAtencion, setProximaAtencion] = useState(null);
  const [btnBuscar, setBtnBuscar] = useState(false);

  const classes = useStyles();
  //const user = JSON.parse(localStorage.getItem("profile"));
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPaciente(id));
  }, [id]);

  useEffect(() => {
    if (paciente) {
      setPacienteData(paciente);
      if (paciente.proximaAtencion) {
        const anoAte = parseInt(
          String(paciente.proximaAtencion).substring(0, 4)
        );
        const mesAte = parseInt(
          String(paciente.proximaAtencion).substring(5, 7)
        );
        const diaAte = parseInt(
          String(paciente.proximaAtencion).substring(8, 10)
        );
        setProximaAtencion(new Date(anoAte, mesAte - 1, diaAte));
      } else {
        setProximaAtencion(null);
      }
    }
  }, [paciente]);

  if (!paciente) {
    return null;
  }

  const handleClick = async () => {
    if (resumen !== "nadaW") {
      await dispatch(resumenPaciente(resumen, id));
    }
    if (proximaAtencion && !isNaN(moment(proximaAtencion))) {
      await dispatch(proximaAtencionPaciente(proximaAtencion, id));
    } else {
      if (!proximaAtencion) {
        await dispatch(proximaAtencionPaciente(proximaAtencion, id));
      }
    }
    setBtnBuscar(false);
  };

  const handleResumen = (e) => {
    e.preventDefault();
    setResumen(e.target.value);
    setBtnBuscar(true);
  };

  const volver = () => {
    if (menu === "1") {
      if (solo) {
        navigate(`/pacientes?page=${page}`);
      } else {
        const search = searchQuery;
        if (
          search.trim() ||
          tags.length > 0 ||
          vista ||
          fechaAte1 ||
          anomesStr
        ) {
          /*
          dispatch(
            getPacientesBySearch({
              search,
              tags,
              page,
              vista,
              fechaAte1,
              anomesStr,
            })
          );
          */
          navigate(
            `/pacientes/search?searchQuery=${
              search || "9a69dc7e834f617"
            }&tags=${tags}&page=${page}&vista=${vista}&fechaAte1=${fechaAte1}&anomesStr=${anomesStr}`
          );
        } else {
          navigate("/");
        }
      }
    } else {
      if (solo) {
        navigate(`/atenciones`);
      } else {
        const search = searchQuery;
        if (search.trim() || tags.length > 0 || anomesStr || fechaAte1) {
          /*
          dispatch(
            getAtencionesBySearch({
              search,
              tags,
              page,
              vista,
              anomesStr,
              fechaAte1,
            })
          );
          */
          navigate(
            `/atenciones/search?searchQuery=${
              search || "9a69dc7e834f617"
            }&tags=${tags}&page=${page}&vista=${vista}&anomesStr=${anomesStr}&fechaAte1=${fechaAte1}`
          );
        } else {
          navigate("/atenciones");
        }
      }
    }
  };

  const handleCheck = (e) => {
    setPdfEstado({
      ...pdfEstado,
      [e.target.name]: e.target.checked,
    });
  };

  const handleBtnEstado = ({ name, value }) => {
    setBtnEstado({ ...btnEstado, [name]: value });
  };

  const {
    pdfPaciente,
    pdfDomicilio,
    pdfFamiliares,
    pdfGineco,
    pdfHabitos,
    pdfMedicos,
    pdfPsicoSocial,
    pdfPersona,
  } = pdfEstado;

  const {
    btnDatosPaciente,
    btnDomicilio,
    btnAFamiliares,
    btnAGineco,
    btnAHabitos,
    btnAMedicos,
    btnAPsicosocial,
    btnPersona,
  } = btnEstado;

  const openPDF = (url) => {
    console.log(pdfEstado);
    window.open(url, "_blank");
  };
  return (
    <Paper style={{ padding: "20px", borderRadius: "15px" }} elevation={6}>
      <div className={classes.card}>
        <Grid
          container
          justify="space-between"
          alignItems="stretch"
          spacing={3}
          className={classes.gridContainer}
        >
          <Grid item xll={12} xl={12} xs={12} sm={6} md={12}>
            <div className={classes.section}>
              <div className={classes.card}>
                <Grid item xs={12} sm={6} md={10}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={volver}
                      style={{ maxHeight: "50px" }}
                    >
                      <ArrowBackIcon fontSize="medium" />
                    </Button>
                    <img
                      className={classes.media}
                      src={pacienteData.foto || hombrePensando}
                      alt={pacienteData.apellidos}
                    />

                    <Typography variant="h4" component="h3">
                      {paciente.dni} - {paciente.apellidos}, {paciente.nombres}
                      <Typography
                        gutterBottom
                        variant="h6"
                        color="textSecondary"
                        component="h3"
                      >
                        {paciente.tags.length > 0
                          ? paciente.tags.map((tag) => `#${tag} `)
                          : null}
                      </Typography>
                      <IconButton
                        variant="outlined"
                        color={btnDatosPaciente ? "secondary" : "success"}
                        onClick={() =>
                          handleBtnEstado({
                            name: "btnDatosPaciente",
                            value: !btnDatosPaciente,
                          })
                        }
                        aria-label="Datos Paciente"
                        size="large"
                      >
                        <PersonIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        style={{ marginLeft: "10px" }}
                        variant="contained"
                        color={btnPersona ? "secondary" : "primary"}
                        onClick={() =>
                          handleBtnEstado({
                            name: "btnPersona",
                            value: !btnPersona,
                          })
                        }
                        aria-label="Datos Personales"
                        size="large"
                      >
                        <AccountCircleIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        style={{ marginLeft: "10px" }}
                        variant="contained"
                        color={btnDomicilio ? "secondary" : "primary"}
                        onClick={() =>
                          handleBtnEstado({
                            name: "btnDomicilio",
                            value: !btnDomicilio,
                          })
                        }
                        aria-label="Domicilio"
                        size="large"
                      >
                        <HomeIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        style={{ marginLeft: "10px" }}
                        variant="contained"
                        color={btnAFamiliares ? "secondary" : "primary"}
                        onClick={() =>
                          handleBtnEstado({
                            name: "btnAFamiliares",
                            value: !btnAFamiliares,
                          })
                        }
                        aria-label="A. Familiares"
                        size="large"
                      >
                        <FamilyRestroomIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        style={{ marginLeft: "10px" }}
                        variant="contained"
                        color={btnAGineco ? "secondary" : "primary"}
                        onClick={() =>
                          handleBtnEstado({
                            name: "btnAGineco",
                            value: !btnAGineco,
                          })
                        }
                        aria-label="A. Ginecológicos"
                        size="large"
                      >
                        <PregnantWomanIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        style={{ marginLeft: "10px" }}
                        variant="contained"
                        color={btnAMedicos ? "secondary" : "primary"}
                        onClick={() =>
                          handleBtnEstado({
                            name: "btnAMedicos",
                            value: !btnAMedicos,
                          })
                        }
                        aria-label="A. Médicos"
                        size="large"
                      >
                        <MedicalServicesIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        style={{ marginLeft: "10px" }}
                        variant="contained"
                        color={btnAHabitos ? "secondary" : "primary"}
                        onClick={() =>
                          handleBtnEstado({
                            name: "btnAHabitos",
                            value: !btnAHabitos,
                          })
                        }
                        aria-label="Hábitos"
                        size="large"
                      >
                        <SmokingRoomsIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        style={{ marginLeft: "10px" }}
                        variant="contained"
                        color={btnAPsicosocial ? "secondary" : "primary"}
                        onClick={() =>
                          handleBtnEstado({
                            name: "btnAPsicosocial",
                            value: !btnAPsicosocial,
                          })
                        }
                        aria-label="Hábitos"
                        size="large"
                      >
                        <PsychologyIcon fontSize="inherit" />
                      </IconButton>
                    </Typography>
                  </Stack>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={2}
                  style={{
                    alignSelf: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}
                  >
                    <Button
                      variant="contained"
                      color={btnPdf ? "secondary" : "primary"}
                      onClick={() => setBtnPdf(!btnPdf)}
                      aria-label="Ver PDF"
                      size="large"
                      fullWidth
                    >
                      <PictureAsPdfIcon />
                    </Button>
                  </Stack>
                  {btnPdf && (
                    <>
                      <Checkbox
                        checked={pdfPaciente}
                        icon={
                          <PersonIcon fontSize="inherit" color="secondary" />
                        }
                        checkedIcon={
                          <PersonIcon fontSize="inherit" color="primary" />
                        }
                        onChange={handleCheck}
                        name="pdfPaciente"
                      />
                      <Checkbox
                        checked={pdfPersona}
                        icon={
                          <AccountCircleIcon
                            fontSize="inherit"
                            color="secondary"
                          />
                        }
                        checkedIcon={
                          <AccountCircleIcon
                            fontSize="inherit"
                            color="primary"
                          />
                        }
                        onChange={handleCheck}
                        name="pdfPersona"
                      />
                      <Checkbox
                        checked={pdfDomicilio}
                        icon={<HomeIcon fontSize="inherit" color="secondary" />}
                        checkedIcon={
                          <HomeIcon fontSize="inherit" color="primary" />
                        }
                        onChange={handleCheck}
                        name="pdfDomicilio"
                      />
                      <Checkbox
                        checked={pdfFamiliares}
                        icon={
                          <FamilyRestroomIcon
                            fontSize="inherit"
                            color="secondary"
                          />
                        }
                        checkedIcon={
                          <FamilyRestroomIcon
                            fontSize="inherit"
                            color="primary"
                          />
                        }
                        onChange={handleCheck}
                        name="pdfFamiliares"
                      />
                      <Checkbox
                        checked={pdfGineco}
                        icon={
                          <PregnantWomanIcon
                            fontSize="inherit"
                            color="secondary"
                          />
                        }
                        checkedIcon={
                          <PregnantWomanIcon
                            fontSize="inherit"
                            color="primary"
                          />
                        }
                        onChange={handleCheck}
                        name="pdfGineco"
                      />
                      <Checkbox
                        checked={pdfMedicos}
                        icon={
                          <MedicalServicesIcon
                            fontSize="inherit"
                            color="secondary"
                          />
                        }
                        checkedIcon={
                          <MedicalServicesIcon
                            fontSize="inherit"
                            color="primary"
                          />
                        }
                        onChange={handleCheck}
                        name="pdfMedicos"
                      />
                      <Checkbox
                        checked={pdfHabitos}
                        icon={
                          <SmokingRoomsIcon
                            fontSize="inherit"
                            color="secondary"
                          />
                        }
                        checkedIcon={
                          <SmokingRoomsIcon
                            fontSize="inherit"
                            color="primary"
                          />
                        }
                        onChange={handleCheck}
                        name="pdfHabitos"
                      />
                      <Checkbox
                        checked={pdfPsicoSocial}
                        icon={
                          <PsychologyIcon
                            fontSize="inherit"
                            color="secondary"
                          />
                        }
                        checkedIcon={
                          <PsychologyIcon fontSize="inherit" color="primary" />
                        }
                        onChange={handleCheck}
                        name="pdfPsicoSocial"
                      />
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={{ xs: 1, sm: 2, md: 4 }}
                        style={{
                          alignSelf: "center",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <BlobProvider
                          document={
                            <HCReducido
                              paciente={paciente}
                              pdfPaciente={pdfPaciente}
                              pdfDomicilio={pdfDomicilio}
                              pdfFamiliares={pdfFamiliares}
                              pdfGineco={pdfGineco}
                              pdfHabitos={pdfHabitos}
                              pdfMedicos={pdfMedicos}
                              pdfPsicoSocial={pdfPsicoSocial}
                              pdfPersona={pdfPersona}
                            />
                          }
                        >
                          {({ url, blob, loading }) => {
                            return (
                              <Button
                                variant="contained"
                                size="small"
                                color="warning"
                                onClick={() => openPDF(url)}
                              >
                                Ver PDF HC
                              </Button>
                            );
                          }}
                        </BlobProvider>
                      </Stack>
                    </>
                  )}
                </Grid>
              </div>
              <div style={{ width: "100%", marginBottom: "20px" }}>
                <Typography gutterBottom variant="h6">
                  Escribe un Resumen Clínico:
                </Typography>
                <TextField
                  rows={4}
                  style={{ width: "80%", marginRight: "20px" }}
                  variant="outlined"
                  label="Resumen Clínico"
                  multiline
                  value={resumen !== "nadaW" ? resumen : pacienteData?.resumen}
                  onChange={handleResumen}
                />

                <DatePicker
                  mask="__/__/____"
                  label="Próxima Atención."
                  value={
                    proximaAtencion
                      ? proximaAtencion
                      : pacienteData?.proximaAtencion
                  }
                  onChange={(newValue) => {
                    setProximaAtencion(newValue);
                    setBtnBuscar(true);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
              <div style={{ width: "100%", marginBottom: "20px" }}>
                <Button
                  style={{ marginTop: "10px" }}
                  disabled={!btnBuscar}
                  variant="contained"
                  onClick={handleClick}
                  color="primary"
                  fullWidth
                >
                  Guardar Resumen y/o Próxima Atención
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
      <Grid
        container
        justify="space-between"
        alignItems="stretch"
        spacing={3}
        className={classes.gridContainer}
      >
        <Grid item xs={12} sm={6} md={12}>
          {btnDatosPaciente && (
            <DatosPaciente setBtnEstado={setBtnEstado} btnEstado={btnEstado} />
          )}
          {btnPersona && (
            <Personal setBtnEstado={setBtnEstado} btnEstado={btnEstado} />
          )}
          {btnDomicilio && (
            <Domicilio setBtnEstado={setBtnEstado} btnEstado={btnEstado} />
          )}
          {btnAFamiliares && (
            <AFamiliares setBtnEstado={setBtnEstado} btnEstado={btnEstado} />
          )}
          {btnAGineco && (
            <AGineco setBtnEstado={setBtnEstado} btnEstado={btnEstado} />
          )}
          {btnAMedicos && (
            <AMedicos setBtnEstado={setBtnEstado} btnEstado={btnEstado} />
          )}
          {btnAHabitos && (
            <AHabitos setBtnEstado={setBtnEstado} btnEstado={btnEstado} />
          )}
          {btnAPsicosocial && (
            <APsicosocial setBtnEstado={setBtnEstado} btnEstado={btnEstado} />
          )}
          <Divider style={{ width: "100%", marginBottom: "20px" }} />
          <div className={classes.section}>
            <div className={classes.card}>{<AtencionSection />}</div>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PacienteDetails;
