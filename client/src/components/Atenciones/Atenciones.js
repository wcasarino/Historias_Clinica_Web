import React, { useEffect, useState } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import useStyles from "./styles";
import ExcelAtencionesLista from "../../helpers/ExcelAtencionesLista";
import { useVolverContext } from "../../contexts/volverContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Atenciones = () => {
  const { atenciones, isLoading } = useSelector((state) => state.atenciones);
  const classes = useStyles();
  const query = useQuery();
  const pageIni = Number(query.get("page")) || 0;
  const { contextVolver, setContextVolver } = useVolverContext();
  const [page, setPage] = useState(pageIni);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    setContextVolver({ ...contextVolver, page: page || 0 });
  }, [page]);

  if (!atenciones.length && !isLoading) return "No hay atenciones";

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
      if (a.fecha < b.fecha) {
        return -1;
      }
      if (a.fecha > b.fecha) {
        return 1;
      }
      return 0;
    });
  };

  const asignarDiaIni = (atenciones) => {
    if (atenciones.length > 0) {
      let diaIniTran = "";
      let fec2 = new Date();
      let diaIniTran1 = "";

      atenciones.forEach((ate) => {
        fec2 = new Date(ate.fecha);
        diaIniTran1 = fec2.toLocaleDateString("es-AR", {
          day: "2-digit",
          year: "numeric",
          month: "2-digit",
        });

        if (diaIniTran !== diaIniTran1) {
          ate.diaIni = true;
          diaIniTran = fec2.toLocaleDateString("es-AR", {
            day: "2-digit",
            year: "numeric",
            month: "2-digit",
          });
        }
      });
    }
  };

  const cambiarFecha = (fec) => {
    const fec1 = new Date(fec);
    return fec1.toLocaleDateString("es-AR", {
      day: "2-digit",
      year: "numeric",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openPaciente = (ate) => {
    navigate(`/pacientes/${ate.idPac}/${ate.idAte}`);
  };

  const descargarExcel = () => {
    ExcelAtencionesLista(atenciones);
  };

  const Row = (props) => {
    const { ate } = props;

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
            <Typography
              variant="body2"
              style={{
                backgroundColor: ate.diaIni ? "green" : null,
                color: ate.diaIni && "white",
                marginLeft: ate.diaIni ? "0px" : "10px",
              }}
            >
              {cambiarFecha(ate.fecha)}
            </Typography>
          </StyledTableCell>
          <StyledTableCell width="20%" component="th" scope="row">
            {ate.apellidos}, {ate.nombres}
          </StyledTableCell>
          <StyledTableCell width="10%" component="th" scope="row">
            {ate.dni}
          </StyledTableCell>
          <StyledTableCell width="10%" component="th" scope="row">
            {ate.tags.map((tag) => `#${tag} `)}
          </StyledTableCell>
          <StyledTableCell width="15%" component="th" scope="row">
            {ate.diagnosticos.map((dx) => `#${dx} `)}
          </StyledTableCell>
          <StyledTableCell width="15%" component="th" scope="row">
            {ate.practicas.map((pra) => `#${pra} `)}
          </StyledTableCell>
          <StyledTableCell width="5%" component="th" scope="row">
            {ate.archivos}
          </StyledTableCell>
          <StyledTableCell width="8%" align="right">
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => openPaciente(ate)}
            >
              <EditIcon fontSize="small" />
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
                      {ate.notas}
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
      <Button onClick={() => descargarExcel()}>Descargar Lista</Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
              <StyledTableCell width="5%">Ver Notas</StyledTableCell>
              <StyledTableCell width="12%">Día y hora</StyledTableCell>
              <StyledTableCell width="20%">Paciente</StyledTableCell>
              <StyledTableCell width="10%">DNI</StyledTableCell>
              <StyledTableCell width="10%">Etiquetas</StyledTableCell>
              <StyledTableCell width="15%">Diagnóstico</StyledTableCell>
              <StyledTableCell width="15%">Práctica</StyledTableCell>
              <StyledTableCell width="5%">Archivos</StyledTableCell>
              <StyledTableCell width="8%" align="center">
                Editar
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {atenciones ? sortByFecha(atenciones) : null}
            {atenciones ? asignarDiaIni(atenciones) : null}
            {atenciones
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((ate, i) => (
                <Row key={i} ate={ate} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[20]}
        component="div"
        count={atenciones.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Grid>
  );
};

export default Atenciones;
