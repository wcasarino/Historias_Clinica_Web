import React, { useState } from 'react';
import { Grid, CircularProgress, Button, Typography, Table, TableBody, TableContainer, TableHead, TableRow, Paper, TablePagination, Collapse, IconButton } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import generateExcel from "zipcelx";

import useStyles from './styles';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Atenciones = ({ setCurrentId }) => {
  const { atenciones, isLoading } = useSelector((state) => state.atenciones);
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const query = useQuery();
  const navigate = useNavigate();

  if (!atenciones.length && !isLoading) return 'No hay atenciones';




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
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
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
      let diaIniTran = ''
      let fec2 = new Date()
      let diaIniTran1 = ''

      atenciones.forEach((ate) => {
        fec2 = new Date(ate.fecha)
        diaIniTran1 = fec2.toLocaleDateString('es-AR', { day: '2-digit', year: 'numeric', month: '2-digit' })

        if (diaIniTran !== diaIniTran1) {
          ate.diaIni = true
          diaIniTran = fec2.toLocaleDateString('es-AR', { day: '2-digit', year: 'numeric', month: '2-digit' })
        }
      })
    }
  }

  const cambiarFecha = (fec) => {
    const fec1 = new Date(fec)
    return fec1.toLocaleDateString('es-AR', { day: '2-digit', year: 'numeric', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  const openPaciente = (ate) => {
    navigate(`/pacientes/${ate.idPac}`);
  };


  const Row = (props) => {
    const { ate } = props;
    //const ate = row
    const [open, setOpen] = useState(false);

    return (
      <>
        <StyledTableRow
          sx={{ '& > *': { borderBottom: 'unset' } }}

        >
          <StyledTableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </IconButton>
          </StyledTableCell>
          <StyledTableCell width="12%" component="th" scope="row"  >
            <Typography
              variant='body2'
              style={{
                backgroundColor:
                  ((ate.diaIni ? 'green' : null)),
                color:
                  ((ate.diaIni && 'white')),
                marginLeft:
                  ((ate.diaIni ? '0px' : '10px'))
              }}
            >
              {cambiarFecha(ate.fecha)}
            </Typography>
          </StyledTableCell>
          <StyledTableCell width="20%" component="th" scope="row">
            {ate.apellidos}, {ate.nombres}
          </StyledTableCell>
          <StyledTableCell width="20%" component="th" scope="row">
            {ate.diagnostico}
          </StyledTableCell>
          <StyledTableCell width="20%" component="th" scope="row">
            {ate.practica}
          </StyledTableCell>
          <StyledTableCell width="10%" align="right">
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

        <StyledTableRow >
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
    )
  }

  const getFileName = () => {
    let nameFin = ''
    const searchQuery = query.get('searchQuery');
    if (searchQuery !== '9a69dc7e834f617' && searchQuery !== null) {
      nameFin = ' - con FILTROS'
    }
    const tags = !query.get('tags') ? [] : query?.get('tags').split(',')
    if (tags.length > 0) nameFin = ' - con FILTROS'
    const fechaAteStr = query.get('fechaAte1') || 'null'
    const anomesStr = query.get('anomesStr') || 'null'
    if (anomesStr !== 'null') return 'Atenciones-Mes-' + anomesStr + nameFin
    if (fechaAteStr !== 'null') return 'Atenciones-Dia-' + fechaAteStr + nameFin
    return 'Atenciones' + nameFin
  }

  const descargarArchivo = () => {

    let filtros = null
    let search = ''
    const searchQuery = query.get('searchQuery');
    if (searchQuery !== '9a69dc7e834f617' && searchQuery !== null) {
      filtros = ' - con FILTROS'
      search = searchQuery
    }
    const tags = !query.get('tags') ? [] : query?.get('tags').split(',')
    if (tags.length > 0) {
      filtros = ' - con FILTROS'
    }
    const tagsStr = tags.join(" ")

    const config = {
      filename: getFileName(),
      sheet: {
        data: []
      }
    };

    const dataSet = config.sheet.data;

    //Filtros
    if (filtros) {
      dataSet.push([{ value: 'FILTROS', type: 'string' }])
      dataSet.push([{ value: 'DNI o Nombre: ' + search, type: 'string' }])
      dataSet.push([{ value: 'Etiquetas: ' + tagsStr, type: 'string' }])
      dataSet.push([{ value: '', type: 'string' }])
    }

    //Titulos
    const headerRow = [];

    headerRow.push({ value: 'Día y hora', type: 'string' })
    headerRow.push({ value: 'Paciente', type: 'string' })
    headerRow.push({ value: 'Diagnóstico', type: 'string' })
    headerRow.push({ value: 'Práctica', type: 'string' })
    headerRow.push({ value: 'Notas', type: 'string' })
    dataSet.push(headerRow);

    // Filas
    if (atenciones.length > 0) {
      sortByFecha(atenciones)
      asignarDiaIni(atenciones)
      atenciones.forEach(ate => {
        const dataRow = [];
        dataRow.push({ value: cambiarFecha(ate.fecha), type: 'string' })
        dataRow.push({ value: ate.apellidos + ", " + ate.nombres, type: 'string' })
        dataRow.push({ value: ate.diagnostico, type: 'string' })
        dataRow.push({ value: ate.practica, type: 'string' })
        dataRow.push({ value: ate.notas, type: 'string' })
        dataSet.push(dataRow);
      });
    } else {
      dataSet.push([
        {
          value: "Sin Datos",
          type: "string"
        }
      ]);
    }

    return generateExcel(config);

  }


  return (
    isLoading ? <CircularProgress /> : (
      <Grid className={classes.container} container alignItems="stretch" spacing={3}>
        <Button onClick={() => descargarArchivo()}>Descargar Lista</Button>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table" >
            <TableHead >
              <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <StyledTableCell width="5%">
                  Ver Notas
                </StyledTableCell>
                <StyledTableCell width="12%">Día y hora</StyledTableCell>
                <StyledTableCell width="20%">Paciente</StyledTableCell>
                <StyledTableCell width="20%">Diagnóstico</StyledTableCell>
                <StyledTableCell width="20%">Práctica</StyledTableCell>
                <StyledTableCell width="10%" align="center">
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
    )
  );
};

export default Atenciones;
