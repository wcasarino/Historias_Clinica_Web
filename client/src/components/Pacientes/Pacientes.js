import React, { useState } from "react";
import {
  Grid,
  CircularProgress,
  Button,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Collapse,
  IconButton,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
//import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import swal from "sweetalert";

import { deletePaciente } from "../../actions/pacientes";
import useStyles from "./styles";
import { useVolverContext } from "../../contexts/volverContext";
import ExcelPacientes from "../../helpers/ExcelPacientes";

const Pacientes = () => {
  const { pacientes, isLoading } = useSelector((state) => state.pacientes);
  const { contextVolver } = useVolverContext();
  const { vista, anomesStr, fechaAte1 } = contextVolver;

  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!pacientes.length && !isLoading) return "No hay Pacientes";

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const sortByFecha = (atenciones) => {
    atenciones.sort(function (a, b) {
      if (a.fecha > b.fecha) {
        return -1;
      }
      if (a.fecha < b.fecha) {
        return 1;
      }
      return 0;
    });
  };

  const proxima = (pFecha) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (pFecha) {
      if (moment(pFecha) >= moment(today)) {
        return moment(pFecha).format("DD/MM/YY");
      }
      return "Vencida";
    } else {
      return null;
    }
  };

  const contarAteMes = (ates) => {
    if (ates.length > 0) {
      const atesMes = ates.filter((ate) => ate.anomesStr === anomesStr);
      return atesMes.length;
    }
    return 0;
  };

  const contarAteDia = (ates) => {
    if (ates.length > 0) {
      const atesDia = ates.filter((ate) => ate.diaStr === fechaAte1);
      return atesDia.length;
    }
    return 0;
  };

  const openPaciente = (pac) => {
    navigate(`/pacientes/${pac._id}`);
  };

  const deletePacienteBtn = async (pac, id) => {
    if (pac.atenciones?.length > 0) {
      swal({
        title: "Eliminar Paciente",
        text: "El Paciente registra atenciones, No se puede eliminar.",
        icon: "error",
        timer: "5000",
      });
      return null;
    }
    const respuesta = await swal({
      title: "Eliminar Paciente",
      text: "Estas seguro de desea eliminar este Paciente?",
      icon: "warning",
      buttons: ["No", "Si"],
    });
    if (respuesta) {
      dispatch(deletePaciente(id));
      swal({
        title: "Eliminar Paciente",
        text: "El Paciente fue elininado con éxito",
        icon: "success",
        timer: "2000",
      });
    }
  };

  // const nombreArchivo = (pac) => {
  //   return `${pac.apellidos}-${pac.nombres}.pdf`
  // }

  // const openPDF = (url) => {
  //   window.open(url, '_blank');
  // };

  const Row = (props) => {
    const { pac } = props;
    const [open, setOpen] = useState(false);
    return (
      <>
        <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <StyledTableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </IconButton>
          </StyledTableCell>
          <StyledTableCell width="12%" component="th" scope="row">
            <Typography variant="body2">{pac.dni}</Typography>
          </StyledTableCell>
          <StyledTableCell width="25%" component="th" scope="row">
            {pac.apellidos}, {pac.nombres}
          </StyledTableCell>
          <StyledTableCell width="25%" component="th" scope="row">
            {pac.tags.map((tag) => `#${tag} `)}
          </StyledTableCell>
          <StyledTableCell width="5%" component="th" scope="row">
            {pac.atenciones.length}
          </StyledTableCell>
          {vista === "anomes" && (
            <StyledTableCell width="5%" component="th" scope="row">
              {contarAteMes(pac.atenciones)}
            </StyledTableCell>
          )}
          {vista === "dia" && (
            <StyledTableCell width="5%" component="th" scope="row">
              {contarAteDia(pac.atenciones)}
            </StyledTableCell>
          )}
          <StyledTableCell width="8%" component="th" scope="row">
            {pac.atenciones ? sortByFecha(pac.atenciones) : null}
            {pac.atenciones.length > 0 && (
              <Typography variant="body2">
                {moment(pac.atenciones[0].fecha).format("DD/MM/YY")}
              </Typography>
            )}
          </StyledTableCell>
          <StyledTableCell width="8%" component="th" scope="row">
            {pac.proximaAtencion && (
              <Typography variant="body2">
                {proxima(pac.proximaAtencion)}
              </Typography>
            )}
          </StyledTableCell>
          <StyledTableCell width="8%" align="right">
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => openPaciente(pac)}
            >
              <EditIcon fontSize="small" />
            </Button>
          </StyledTableCell>
          {/*
          <StyledTableCell width="8%" align="right">

             <BlobProvider
              document={<HCReducido paciente={pac} pdfPaciente={true}
                pdfDomicilio={true}
                pdfFamiliares={true}
                pdfGineco={true}
                pdfHabitos={true}
                pdfMedicos={true}
                pdfPsicoSocial={true}
                pdfPersona={true}
                vistaPdf='todos'
                periodo=''
              />}
            >
              {({ url, blob, loading }) => {
                return (
                  <Button
                    variant="contained"
                    size="small"
                    color="warning"
                    onClick={() => openPDF(url)}
                  >
                    <PictureAsPdfIcon fontSize="small" />
                  </Button>
                );
              }}
            </BlobProvider> 


          </StyledTableCell>
          */}

          <StyledTableCell width="8%" align="right">
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => deletePacienteBtn(pac, pac._id)}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          </StyledTableCell>
        </StyledTableRow>

        <StyledTableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table size="small" aria-label="notas">
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell component="th" scope="row">
                      {pac.resumen}
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </StyledTableRow>
      </>
    );
  };

  return isLoading ? (
    <CircularProgress />
  ) : (
    <Grid
      className={classes.container}
      container
      alignItems="stretch"
      spacing={3}
    >
      <Button onClick={() => ExcelPacientes(pacientes)}>Descargar Lista</Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
              <StyledTableCell width="5%">Ver Resumen</StyledTableCell>
              <StyledTableCell width="12%">DNI</StyledTableCell>
              <StyledTableCell width="25%">Apellidos y Nombres</StyledTableCell>
              <StyledTableCell width="25%">Etiquetas</StyledTableCell>
              <StyledTableCell width="5%">Ate Tot</StyledTableCell>
              {vista === "anomes" && (
                <StyledTableCell width="5%">Ate Mes</StyledTableCell>
              )}
              {vista === "dia" && (
                <StyledTableCell width="5%">Ate Día</StyledTableCell>
              )}
              <StyledTableCell width="8%">Última</StyledTableCell>
              <StyledTableCell width="8%">Próxima</StyledTableCell>
              <StyledTableCell width="8%" align="center">
                Modificar
              </StyledTableCell>
              {/* <StyledTableCell width="8%" align="center">
                  Descargar
                </StyledTableCell> */}
              <StyledTableCell width="8%" align="center">
                Eliminar
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pacientes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((pac, i) => (
                <Row key={i} pac={pac} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[20]}
        component="div"
        count={pacientes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Grid>
  );
};

export default Pacientes;
