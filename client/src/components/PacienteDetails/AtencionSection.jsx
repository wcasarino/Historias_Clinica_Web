import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Divider,
  Box,
  Grid,
  Stack,
  Chip,
} from "@mui/material";
import DateTimePicker from "@mui/lab/DateTimePicker";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PageviewIcon from "@mui/icons-material/Pageview";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";
import swal from "sweetalert";
import AddIcon from "@mui/icons-material/Add";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { BlobProvider } from "@react-pdf/renderer";

import useStyles from "./styles";
import {
  AddAtencion,
  UpdateAtencion,
  DeleteAtencion,
  DeleteFileAtencion,
} from "../../actions/pacientes";
import HCReducido from "../PDFs/HC/HCReducido";
import useFileDownloader from "../../hooks/useFileDownloader";
import useFileUploader from "../../hooks/useFileUploader";

const AtencionSection = () => {
  const { paciente } = useSelector((state) => state.pacientes);
  const user = JSON.parse(localStorage.getItem("profile"));

  const [pdfId, setPdfId] = useState({ cid: null, pdfVer: false });
  const [dxAdd, setDxAdd] = useState("");
  const [practicasAdd, setPracticasAdd] = useState("");

  const fechaToString = () => {
    let anoAte = 0;
    let mesAte = 0;
    let diaAte = 0;

    anoAte = parseInt(new Date().getFullYear());
    mesAte = parseInt(new Date().getMonth()) + 1;
    diaAte = parseInt(new Date().getDate());

    diaAte = ("0" + diaAte).slice(-2);
    mesAte = ("0" + mesAte).slice(-2);
    return `${anoAte}${mesAte}${diaAte}`;
  };

  const anomesToString = () => {
    let anoAte = 0;
    let mesAte = 0;

    anoAte = parseInt(new Date().getFullYear());
    mesAte = parseInt(new Date().getMonth()) + 1;
    mesAte = ("0" + mesAte).slice(-2);
    return `${anoAte}${mesAte}`;
  };

  const classes = useStyles();
  const [atenciones, setAtenciones] = useState(paciente?.atenciones || []);
  const [atencion, setAtencion] = useState({
    fecha: new Date(),
    notas: "",
    selectedFiles: [],
    diaStr: fechaToString(),
    anomesStr: anomesToString(),
    diagnosticos: [],
    practicas: [],
    userId: user?.result?._id || "",
  });

  const [atencionId, setAtencionId] = useState(0);
  const dispatch = useDispatch();
  const atencionesRef = useRef();
  const { id, ateId } = useParams();
  const [btnGrabar, setBtnGrabar] = useState(true);
  const [archivos, setArchivos] = useState(null);
  const [btnAte, setBtnAte] = useState(false);
  const [viewAteId, setViewAteId] = useState(0);

  const [downloadFile, downloaderComponentUI] = useFileDownloader();
  const download = (file) => downloadFile(file);

  const [uploadFile, uploaderComponentUI] = useFileUploader();
  const upload = (file) => uploadFile(file);

  const handleEdit = (c) => {
    setAtencion({
      fecha: c.fecha,
      notas: c.notas,
      selectedFiles: c.selectedFiles,
      diaStr: c.diaStr,
      anomesStr: c.anomesStr,
      diagnosticos: c.diagnosticos,
      practicas: c.practicas,
      userId: c.userId,
    });
    setAtencionId(c._id);
    setBtnGrabar(true);
    setBtnAte(true);
    setViewAteId(0);
  };

  useEffect(() => {
    if (paciente) {
      setAtenciones(paciente?.atenciones);
      paciente.atenciones.map((c) => c._id === ateId && handleEdit(c));
    }
  }, [paciente]);

  if (!paciente) {
    return null;
  }

  const clear = () => {
    setAtencionId(0);
    setAtencion({
      fecha: new Date(),
      notas: "",
      selectedFiles: [],
      diaStr: fechaToString(),
      anomesStr: anomesToString(),
      diagnosticos: [],
      practicas: [],
      userId: user?.result?._id || "",
    });
    setArchivos(null);
    document.getElementById("inputFile").value = "";
    setBtnGrabar(true);
    setBtnAte(false);
  };

  const handleFecha = (newValue) => {
    setBtnGrabar(true);
    setBtnAte(true);
    let anoAte = 0;
    let mesAte = 0;
    let diaAte = 0;
    if (newValue && !isNaN(newValue.getTime())) {
      if (isNaN(parseInt(String(newValue).substring(0, 4)))) {
        anoAte = parseInt(newValue.getFullYear());
        mesAte = parseInt(newValue.getMonth()) + 1;
        diaAte = parseInt(newValue.getDate());
      } else {
        anoAte = parseInt(String(newValue).substring(0, 4));
        mesAte = parseInt(String(newValue).substring(5, 7));
        diaAte = parseInt(String(newValue).substring(8, 10));
      }
      diaAte = ("0" + diaAte).slice(-2);
      mesAte = ("0" + mesAte).slice(-2);
      setAtencion({
        ...atencion,
        fecha: newValue,
        diaStr: `${anoAte}${mesAte}${diaAte}`,
        anomesStr: `${anoAte}${mesAte}`,
      });
      setBtnGrabar(false);
    } else {
      setAtencion({
        ...atencion,
        fecha: new Date(),
        diaStr: fechaToString(),
        anomesStr: anomesToString(),
      });
    }
  };

  const handleClick = async (e) => {
    if (atencionId === 0) {
      const newAtenciones = await dispatch(AddAtencion(atencion, id));
      setAtenciones(newAtenciones);
      //setAtencionId(newAtenciones[0]._id);
      // Agrego los archivos a upload Simpre que hayas archivos
      if (archivos) {
        const data = new FormData();
        data.append("atencionId", newAtenciones[0]._id);
        for (let index = 0; index < archivos.length; index++) {
          data.append("myFile", archivos[index]);
        }
        await upload({
          idPaciente: id,
          IdAtencion: newAtenciones[0]._id,
          data,
          setAtenciones,
          setAtencion,
          atencion,
          viejaAte: false,
          cantArch: archivos.length,
        });
      }
      setBtnAte(false);
      clear();
    } else {
      const newAtencion = {
        _id: atencionId,
        fecha: atencion.fecha,
        notas: atencion.notas,
        selectedFiles: atencion.selectedFiles,
        diaStr: atencion.diaStr,
        anomesStr: atencion.anomesStr,
        diagnosticos: atencion.diagnosticos,
        practicas: atencion.practicas,
        userId: atencion.userId,
      };
      const newAtenciones = await dispatch(UpdateAtencion(newAtencion, id));
      setAtenciones(newAtenciones);

      // Agrego los archivos a upload Simpre que hayas archivos
      if (archivos) {
        const data = new FormData();
        data.append("atencionId", atencionId);
        for (let index = 0; index < archivos.length; index++) {
          data.append("myFile", archivos[index]);
        }
        await upload({
          idPaciente: id,
          IdAtencion: atencionId,
          data,
          setAtenciones,
          setAtencion,
          atencion,
          viejaAte: true,
          cantArch: archivos.length,
        });
      }
      // setBtnAte(true);
      setBtnAte(false);
      clear();
    }
    setArchivos(null);
    document.getElementById("inputFile").value = "";
    setBtnGrabar(true);
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

  const handleViewAte = (idAtencion) => {
    if (viewAteId === idAtencion) {
      setViewAteId(0);
    } else {
      setViewAteId(idAtencion);
    }
  };

  const handleDelete = async (idAtencion) => {
    const respuesta = await swal({
      title: "Eliminar Atención",
      text: "Estas seguro que desea eliminar la atención?",
      icon: "warning",
      buttons: ["No", "Si"],
    });
    if (respuesta) {
      const newAtenciones = await dispatch(DeleteAtencion(idAtencion, id));
      setAtenciones(newAtenciones);
      setAtencion({
        fecha: new Date(),
        notas: "",
        selectedFiles: [],
        diaStr: fechaToString(),
        anomesStr: anomesToString(),
        diagnosticos: [],
        practicas: [],
        userId: user?.result?._id || "",
      });
      setBtnGrabar(true);
      setViewAteId(0);
      clear();

      swal({
        title: "Eliminar Atención",
        text: "La atención fue eliminada con éxito",
        icon: "success",
        timer: "2000",
      });
    }
  };

  const subirArchivos = (e) => {
    const cantArchivos = atencion?.selectedFiles?.length || 0;
    if (cantArchivos + e.target.files.length > 3) {
      swal({
        title: "Subir Archivos",
        text: "La atención no puede tener más de 100 archivos",
        icon: "error",
        timer: "5000",
      });
      setArchivos(null);
      document.getElementById("inputFile").value = "";
      return null;
    }
    const maxSizeFile = 30 * 1024 * 1024;
    let accSizeFile = 0;
    for (let index = 0; index < e.target.files.length; index++) {
      accSizeFile += e.target.files[index].size;
    }
    if (accSizeFile > maxSizeFile) {
      swal({
        title: "Subir Archivos",
        text: "El tamaño de los archivos no puede superar los 30 Mb",
        icon: "error",
        timer: "5000",
      });
      setArchivos(null);
      document.getElementById("inputFile").value = "";
      return null;
    }
    setArchivos(e.target.files);
    setBtnGrabar(false);
    setBtnAte(true);
  };

  const handleDeleteFile = async (file, IdAtencion) => {
    const respuesta = await swal({
      title: "Eliminar Archivo",
      text: "Estas seguro que desea eliminar este archivo?",
      icon: "warning",
      buttons: ["No", "Si"],
    });
    if (respuesta) {
      const newAtenciones = await dispatch(
        DeleteFileAtencion({ _id: IdAtencion, selectedFile: file }, id)
      );
      //Borro file de atencion
      const newSelectedFiles = atencion.selectedFiles.filter(
        (filev) => filev !== file
      );
      setAtencion({ ...atencion, selectedFiles: newSelectedFiles });
      setAtenciones(newAtenciones);

      swal({
        title: "Eliminar Archivo",
        text: "el archivo fue eliminado con éxito",
        icon: "success",
        timer: "2000",
      });
    }
  };

  const handleDowloadFile = async (file, IdAtencion) => {
    const filename = file.substr(15, file.length - 15);
    download({
      name: filename,
      idPaciente: id,
      IdAtencion,
      file,
    });
  };

  const openPDF = (url) => {
    window.open(url, "_blank");
    setPdfId({ cid: null, pdfVer: false });
  };

  const handleChangeDxAdd = (e) => {
    e.preventDefault();
    setDxAdd(e.target.value.toLowerCase());
    setBtnGrabar(false);
    setBtnAte(true);
  };

  const handleChangePracticasAdd = (e) => {
    e.preventDefault();
    setPracticasAdd(e.target.value.toLowerCase());
    setBtnGrabar(false);
    setBtnAte(true);
  };

  const handleSubmitDx = (e) => {
    e.preventDefault();
    if (dxAdd) {
      setAtencion({
        ...atencion,
        diagnosticos: [...atencion.diagnosticos, dxAdd.trim()],
      });
      setDxAdd("");
    }
    setBtnGrabar(false);
    setBtnAte(true);
  };

  const handleSubmitPracticas = (e) => {
    e.preventDefault();
    if (practicasAdd) {
      setAtencion({
        ...atencion,
        practicas: [...atencion.practicas, practicasAdd.trim()],
      });
      setPracticasAdd("");
    }
    setBtnGrabar(false);
    setBtnAte(true);
  };

  const hdelDx = (chipToDelete) => {
    setAtencion({
      ...atencion,
      diagnosticos: atencion.diagnosticos.filter((dx) => dx !== chipToDelete),
    });
    setBtnGrabar(false);
    setBtnAte(true);
  };

  const hdelPractias = (chipToDelete) => {
    setAtencion({
      ...atencion,
      practicas: atencion.practicas.filter(
        (practica) => practica !== chipToDelete
      ),
    });
    setBtnGrabar(false);
    setBtnAte(true);
  };

  return (
    <Grid
      container
      justify="space-between"
      alignItems="stretch"
      spacing={3}
      className={classes.gridContainer}
    >
      <Grid item xs={12} sm={12} md={4} xl={2}>
        <Typography gutterBottom variant="h6">
          Atenciones registradas: <strong> {atenciones?.length} </strong>
        </Typography>
        {atenciones ? sortByFecha(atenciones) : null}
        {atenciones.map((c, i) => (
          <Typography key={c._id} gutterBottom variant="subtitle1">
            {moment(c.fecha).format("DD-MM-YY h:mm a")} -{" "}
            <strong>
              Dx:{" "}
              {c.diagnosticos?.length > 0
                ? c.diagnosticos.map((dx, index) =>
                    index === 0 ? `${dx}` : `, ${dx}`
                  )
                : null}
              {" - "}
            </strong>
            <strong>
              {c.notas?.length > 40
                ? c.notas.substring(0, 40) + "..."
                : c.notas}
            </strong>
            {viewAteId === c._id && (
              <Box>
                <Typography>
                  Dx:{" "}
                  <strong>
                    {" "}
                    {c.diagnosticos?.length > 0
                      ? c.diagnosticos.map((dx, index) =>
                          index === 0 ? `${dx}` : `, ${dx}`
                        )
                      : null}
                  </strong>
                </Typography>
                <Typography>
                  Práctica:{" "}
                  {c.practicas?.length > 0
                    ? c.practicas.map((pra, index) =>
                        index === 0 ? `${pra}` : `, ${pra}`
                      )
                    : null}
                </Typography>
                <Typography>Notas: {c.notas}</Typography>
                {c?.selectedFiles?.length > 0 && (
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: 450 }}
                      size="small"
                      aria-label="simple table"
                    >
                      <TableBody>
                        {c?.selectedFiles.map(
                          (f, i) =>
                            f !== null && (
                              <TableRow
                                key={i}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell
                                  width="50%"
                                  component="th"
                                  scope="row"
                                >
                                  {f.substr(15, f.length - 15)}
                                </TableCell>
                                <TableCell width="10%" align="right">
                                  <Button
                                    variant="contained"
                                    size="small"
                                    color="primary"
                                    onClick={() =>
                                      handleDowloadFile(f, viewAteId)
                                    }
                                  >
                                    <DownloadIcon fontSize="small" />
                                  </Button>
                                </TableCell>
                                <TableCell width="10%" align="right">
                                  <Button
                                    variant="contained"
                                    size="small"
                                    color="secondary"
                                    onClick={() =>
                                      handleDeleteFile(f, viewAteId)
                                    }
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                        )}
                      </TableBody>
                    </Table>
                    {downloaderComponentUI}
                  </TableContainer>
                )}
                <Divider style={{ width: "100%", marginBottom: "20px" }} />
              </Box>
            )}
            <div className={classes.toolbar}>
              <Button
                variant="contained"
                size="small"
                color="primary"
                disabled={btnAte}
                onClick={() => handleEdit(c)}
              >
                <EditIcon fontSize="small" />
              </Button>
              <Button
                variant="contained"
                size="small"
                color="secondary"
                disabled={btnAte}
                onClick={() => handleDelete(c._id)}
              >
                <DeleteIcon fontSize="small" />
              </Button>
              <Button
                variant="contained"
                size="small"
                color="success"
                onClick={() => handleViewAte(c._id)}
              >
                <PageviewIcon fontSize="small" />
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => setPdfId({ cid: c._id, pdfVer: !pdfId.pdfVer })}
              >
                <PictureAsPdfIcon fontSize="small" />
              </Button>
              {(pdfId.cid === c._id) & pdfId.pdfVer ? (
                <BlobProvider
                  document={
                    <HCReducido
                      paciente={paciente}
                      pdfPaciente={true}
                      pdfDomicilio={false}
                      pdfFamiliares={false}
                      pdfGineco={false}
                      pdfHabitos={false}
                      pdfMedicos={false}
                      pdfPsicoSocial={false}
                      pdfPersona={false}
                      vistaPdf="id"
                      periodo={c._id}
                    />
                  }
                >
                  {({ url, blob, loading }) => (
                    <Button
                      variant="contained"
                      size="small"
                      color="warning"
                      onClick={() => openPDF(url)}
                    >
                      <PictureAsPdfIcon fontSize="small" />
                    </Button>
                  )}
                </BlobProvider>
              ) : null}

              {c.selectedFiles?.length > 0 && (
                <Typography>
                  {" "}
                  Contiene <strong> {c.selectedFiles?.length} </strong>{" "}
                  {c.selectedFiles?.length > 1 ? <>Archivos</> : <>Archivo</>}{" "}
                </Typography>
              )}
            </div>
          </Typography>
        ))}

        <div ref={atencionesRef} />
      </Grid>

      <Grid item xs={12} sm={12} md={8} xl={10}>
        <Stack
          direction={{ xs: "column", sm: "column", md: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
        >
          <DateTimePicker
            className={classes.camposAtencion}
            label="Fecha y hora"
            size="small"
            value={atencion.fecha ? atencion.fecha : new Date()}
            onChange={(newValue) => handleFecha(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />

          <form action="#">
            <input
              id="inputFile"
              type="file"
              name="MyFile"
              multiple
              onChange={(e) => subirArchivos(e)}
              accept="video/*,image/*,.pdf,.xlsx,.docx"
            />
          </form>
        </Stack>

        <TextField
          style={{ marginTop: "10px" }}
          fullWidth
          rows={4}
          variant="outlined"
          label="Atencion"
          multiline
          value={atencion.notas}
          onChange={(e) => {
            setAtencion({ ...atencion, notas: e.target.value });
            e.target.value ? setBtnGrabar(false) : setBtnGrabar(true);
            e.target.value ? setBtnAte(true) : setBtnAte(false);
          }}
        />

        <Stack
          direction={{ xs: "column", sm: "column", md: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          justifyContent="space-between"
          alignItems="center"
          style={{ marginTop: "10px" }}
        >
          <form
            autoComplete="off"
            noValidate
            style={{ width: "50%", marginBottom: "20px" }}
          >
            <Box
              sx={{
                display: "grid",
                gridAutoFlow: "row",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
              }}
            >
              {atencion.diagnosticos.length > 0
                ? atencion.diagnosticos?.map((data, i) => (
                    <Chip key={i} label={data} onDelete={() => hdelDx(data)} />
                  ))
                : null}
            </Box>

            <TextField
              name="DxAdd"
              variant="outlined"
              label="Diagnóstico presuntivo"
              value={dxAdd}
              onChange={handleChangeDxAdd}
              className={classes.textTags}
            />

            <Button
              className={classes.buttonSubmit}
              variant="contained"
              color="primary"
              size="small"
              type="submit"
              onClick={handleSubmitDx}
            >
              <AddIcon fontSize="small" />
            </Button>
          </form>
          <form
            autoComplete="off"
            noValidate
            style={{ width: "50%", marginBottom: "20px" }}
          >
            <Box
              sx={{
                display: "grid",
                gridAutoFlow: "row",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
              }}
            >
              {atencion.practicas.length > 0
                ? atencion.practicas.map((data, i) => (
                    <Chip
                      key={i}
                      label={data}
                      onDelete={() => hdelPractias(data)}
                    />
                  ))
                : null}
            </Box>

            <TextField
              name="PracticasAdd"
              variant="outlined"
              label="Prácticas"
              value={practicasAdd}
              onChange={handleChangePracticasAdd}
              className={classes.textTags}
            />

            <Button
              className={classes.buttonSubmit}
              variant="contained"
              color="primary"
              size="small"
              type="submit"
              onClick={handleSubmitPracticas}
            >
              <AddIcon fontSize="small" />
            </Button>
          </form>
        </Stack>

        <Button
          style={{ marginTop: "10px" }}
          disabled={btnGrabar}
          variant="contained"
          color="primary"
          size="small"
          onClick={handleClick}
        >
          {atencionId ? "Grabar" : "Crear"}
        </Button>

        <Button
          style={{ marginTop: "10px", marginLeft: "10px" }}
          variant="contained"
          color="secondary"
          size="small"
          onClick={clear}
        >
          {atencionId ? "Volver" : "Limpiar"}
        </Button>

        {uploaderComponentUI}
        <Divider
          style={{ width: "100%", marginBottom: "20px", marginTop: "10px" }}
        />
        {atencion?.selectedFiles.length > 0 && (
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell width="80%">Archivo</TableCell>
                  <TableCell width="10%" align="right">
                    Descargar
                  </TableCell>
                  <TableCell width="10%" align="right">
                    Eliminar
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {atencion?.selectedFiles?.map(
                  (f, i) =>
                    f !== null && (
                      <TableRow
                        key={i}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell width="80%" component="th" scope="row">
                          {f.substr(15, f.length - 15)}
                        </TableCell>
                        <TableCell width="10%" align="right">
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() => handleDowloadFile(f, atencionId)}
                          >
                            <DownloadIcon fontSize="small" />
                          </Button>
                        </TableCell>
                        <TableCell width="10%" align="right">
                          <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            onClick={() => handleDeleteFile(f, atencionId)}
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                )}
              </TableBody>
            </Table>
            {downloaderComponentUI}
          </TableContainer>
        )}
      </Grid>
    </Grid>
  );
};

export default AtencionSection;
