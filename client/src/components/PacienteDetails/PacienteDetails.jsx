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
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
} from "@mui/material/";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "moment/locale/es";
import DateTimePicker from "@mui/lab/DateTimePicker";
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
import TodayIcon from '@mui/icons-material/Today';
import Checkbox from "@mui/material/Checkbox";
import { useParams, useNavigate } from "react-router-dom";
import { BlobProvider } from "@react-pdf/renderer";
import { styled } from "@mui/material/styles";
import swal from "sweetalert";

import AtencionSection from "./AtencionSection";
import {
  getPaciente,
  resumenPaciente,
  proximaAtencionPaciente,
} from "../../actions/pacientes";
import { getCalendarioProximo } from "../../actions/calendarioProximo";
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

//import hombrePensando from "../../images/pensando.jpg";
import { useVolverContext } from "../../contexts/volverContext";
import { useCalendarioContext } from "../../contexts/CalendarioContext";
import HCReducido from "../PDFs/HC/HCReducido";

import CalendarioProximos from "../Calendario/CalendarioProximos"

const PacienteDetails = () => {
  const { paciente } = useSelector((state) => state.pacientes);
  const hinis = ['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12','13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
  const hfins = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12','13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23','24']

  const { contextVolver, setContextVolver } = useVolverContext();
  const { contextCalendario, setContextCalendario } = useCalendarioContext();
  const { stepc, hini, hfin } = contextCalendario;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const locale = moment.locale("es");

  const {
    vista,
    menu,
    page,
    searchQuery,
    tags,
    solo,
    anomesStr,
    fechaAte1,
    diagnosticos,
    practicas,
  } = contextVolver;

  const [vistaPdf, setVistaPdf] = useState("todos");
  const [periodo, setPeriodo] = useState("");

  const [pacienteData, setPacienteData] = useState(PacienteDoc);

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
  const [btnCalendarioProximo, setBtnCalendarioProximo] = useState(false)

  const classes = useStyles();
  const { id } = useParams();

  useEffect( () => {
     dispatch(getCalendarioProximo());
  }, []);


  useEffect(() => {
     dispatch(getPaciente(id));
  }, [id]);

  useEffect(() => {
    if (paciente) {
      setPacienteData(paciente);
      paciente.proximaAtencion ? setProximaAtencion(paciente.proximaAtencion) : setProximaAtencion(null)
    }
  }, [paciente]);

  if (!paciente) {
    return null;
  }


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

  const handleClick = async () => {
    if (resumen !== "nadaW") {
      await dispatch(resumenPaciente(resumen, id));
    }
    if (proximaAtencion && !isNaN(moment(proximaAtencion))) {
      await dispatch(proximaAtencionPaciente(proximaAtencion, id));
      await dispatch(getCalendarioProximo());
    } else {
      if (!proximaAtencion) {
        await dispatch(proximaAtencionPaciente(proximaAtencion, id));
        await dispatch(getCalendarioProximo());
      }
    }
    setBtnBuscar(false);
  };

  const handleResumen = (e) => {
    e.preventDefault();
    setResumen(e.target.value);
    setBtnBuscar(true);
  };

  const volverPag = () => {
    setContextVolver({ ...contextVolver, volver: true });

    switch (menu) {
      case '3':
        if (solo) {
          navigate(`/calendario`);
        } else {
          const search = searchQuery;
          if (
            search.trim() ||
            tags.length > 0 ||
            diagnosticos.length > 0 ||
            practicas.length > 0
          ) {
            navigate(
              `/calendario/search?searchQuery=${
                search || "9a69dc7e834f617"
              }&tags=${tags.join(
                ","
              )}&diagnosticos=${diagnosticos.join(
                ","
              )}&practicas=${practicas.join(",")}`
            );
          } else {
            navigate("/calendario");
          }
        }
        break;

        case '2':
          if (solo) {
            navigate(`/atenciones`);
          } else {
            const search = searchQuery;
            if (
              search.trim() ||
              tags.length > 0 ||
              anomesStr ||
              fechaAte1 ||
              diagnosticos.length > 0 ||
              practicas.length > 0
            ) {
              navigate(
                `/atenciones/search?searchQuery=${
                  search || "9a69dc7e834f617"
                }&tags=${tags.join(
                  ","
                )}&page=${page}&vista=${vista}&anomesStr=${anomesStr}&fechaAte1=${fechaAte1}&diagnosticos=${diagnosticos.join(
                  ","
                )}&practicas=${practicas.join(",")}`
              );
            } else {
              navigate("/atenciones");
            }
          }
          break;        
         
          default:
            if (solo) {
              navigate(`/pacientes?page=${page}`);
            } else {
              const search = searchQuery;
              if (
                search.trim() ||
                tags.length > 0 ||
                vista ||
                fechaAte1 ||
                anomesStr ||
                diagnosticos.length > 0 ||
                practicas.length > 0
              ) {
                navigate(
                  `/pacientes/search?searchQuery=${
                    search || "9a69dc7e834f617"
                  }&tags=${tags.join(
                    ","
                  )}&page=${page}&vista=${vista}&fechaAte1=${fechaAte1}&anomesStr=${anomesStr}&diagnosticos=${diagnosticos.join(
                    ","
                  )}&practicas=${practicas.join(",")}`
                );
              } else {
                navigate("/");
              }
            }
            break;
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
    window.open(url, "_blank");
  };

  const handleVistaPdf = (event, newVista) => {
    newVista !== null ? setVistaPdf(newVista) : setVistaPdf("todos");
  };


  const handleCalendarioProximo = () => setBtnCalendarioProximo(!btnCalendarioProximo)
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
                      onClick={volverPag}
                      style={{ maxHeight: "50px" }}
                    >
                      <ArrowBackIcon fontSize="medium" />
                    </Button>
                    {/* <img
                      className={classes.media}
                      src={pacienteData.foto || hombrePensando}
                      alt={pacienteData.apellidos}
                    /> */}
                    <div className={classes.section}>
                      <Typography variant="h4" component="h3">
                        {paciente.dni} - {paciente.apellidos},{" "}
                        {paciente.nombres}
                      </Typography>
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
                    </div>
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
                        <StyledToggleButtonGroup
                          color="success"
                          value={vistaPdf}
                          size="small"
                          exclusive
                          onChange={handleVistaPdf}
                          style={{
                            marginBottom: "20px",
                            alignSelf: "center",
                            border: 5,
                          }}
                        >
                          <ToggleButton size="small" value="todos">
                            T
                          </ToggleButton>
                          <ToggleButton size="small" value="anomes">
                            M
                          </ToggleButton>
                          <ToggleButton size="small" value="dia">
                            D
                          </ToggleButton>
                        </StyledToggleButtonGroup>
                        <TextField
                          variant="standard"
                          disabled={
                            vistaPdf === "todos" || vistaPdf === null
                              ? true
                              : false
                          }
                          label={
                            vistaPdf === "anomes"
                              ? "AAAAMM"
                              : vistaPdf === "dia"
                              ? "AAAAMMDD"
                              : "Todos"
                          }
                          size="small"
                          value={periodo}
                          onChange={(e) => setPeriodo(e.target.value)}
                        />
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
                              vistaPdf={vistaPdf}
                              periodo={periodo}
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
              <Typography gutterBottom variant="h6">
                Escribe un Resumen Clínico:
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "column", md: "row" }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
              >
                <TextField
                  rows={4}
                  style={{ width: "80%", marginRight: "20px" }}
                  variant="outlined"
                  label="Resumen Clínico"
                  multiline
                  value={resumen !== "nadaW" ? resumen : pacienteData?.resumen}
                  onChange={handleResumen}
                />

              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }}
                        spacing={{ xs: 1, sm: 2, md: 4 }}
                        style={{
                          alignSelf: "center",
                          alignContent: "center",
                          alignItems: "center",
                          marginTop: "10px"
                        }}>
              <Button
                  style={{ marginTop: "10px" }}
                  //disabled={!btnBuscar}
                  variant="contained"
                  onClick={handleCalendarioProximo}
                  color={btnCalendarioProximo ?  "secondary" : "primary" }
                  aria-label="Ver PDF"
                  
                >
                  <TodayIcon />
                </Button>
                <DateTimePicker
                style={{ margin: "10px" }}
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
                </Stack>
                { btnCalendarioProximo && 
                <>
                
                <CalendarioProximos 
                  id={id} setBtnBuscar={setBtnBuscar} />
                <Stack direction={{ xs: "column", sm: "row" }}
                        spacing={{ xs: 1, sm: 2, md: 4 }}
                        style={{
                          alignSelf: "center",
                          alignContent: "center",
                          alignItems: "center",
                        }}>
                  <Typography style={{ marginBottom: '10px' }} variant="subtitle1" alignSelf="center" >
                    Intérvalo:
                  </Typography>

                  <StyledToggleButtonGroup
                    color="success"
                    value={stepc}
                    size='small'
                    exclusive
                    onChange={(event, newValue) => {
                      setContextCalendario({
                        ...contextCalendario,
                        stepc: newValue,
                      });
                    }}
                    style={{ marginBottom: '20px', alignSelf: "center", border: 5 }}

                  >
                    <ToggleButton size='small' value="15" defaultChecked >15</ToggleButton>
                    <ToggleButton size='small' value="30" >30</ToggleButton>
                    <ToggleButton size='small' value="60">60</ToggleButton>
                  </StyledToggleButtonGroup>
                
                
                  <Autocomplete
                  style={{ width: 100 }}
                  value={hini}
                  size='small'
                  isOptionEqualToValue={(option, value) => option === value}
                  onChange={(event, newValue) => {
                    
                    if (newValue >= hfin) {
                      return (swal({
                        title: "Hora de Inicio",
                        text: "Hora de Inicio inválida, verifique",
                        icon: "danger",
                        timer: "3000",
                      }))
                    }
                    setContextCalendario({
                      ...contextCalendario,
                      hini: newValue,
                    });
                  }}
                  id="hini"
                  options={hinis}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Hora inicial" />}
                />
                  <Autocomplete
                  style={{ width: 100 }}
                  value={hfin}
                  size='small'
                  isOptionEqualToValue={(option, value) => option === value}
                  onChange={(event, newValue) => {
                    if (newValue <= hini) {
                      return (swal({
                        title: "Hora de Fin",
                        text: "Hora de Fin inválida, verifique",
                        icon: "danger",
                        timer: "3000",
                      }))
                    }
                    setContextCalendario({
                      ...contextCalendario,
                      hfin: newValue,
                    });
                  }}
                  id="hfin"
                  options={hfins}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Hora Final" />}
                />
                
                </Stack>
                  </>
                }
                
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
