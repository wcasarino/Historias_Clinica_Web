import React, { useState, useRef, useEffect } from "react";
import { TextField, Button, Typography, Divider } from "@mui/material";
import DateTimePicker from "@mui/lab/DateTimePicker";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PageviewIcon from "@mui/icons-material/Pageview";
import DownloadIcon from "@mui/icons-material/Download";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import swal from "sweetalert";

//import useFileDownloader from "../../hooks/useFileDownloader";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import useStyles from "./styles";
import {
  AddAtencion,
  UpdateAtencion,
  DeleteAtencion,
  DeleteFileAtencion,
} from "../../actions/pacientes";
import { getFileDownload } from "../../actions/download";

import { Box } from "@mui/system";

const AtencionSection = () => {
  const { paciente } = useSelector((state) => state.pacientes);
  const user = JSON.parse(localStorage.getItem("profile"));

  //const { fileDownload } = useSelector((state) => state.fileDownload);

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
    diagnostico: "",
    practica: "",
    userId: user?.result?._id || "",
  });

  const [atencionId, setAtencionId] = useState(0);
  const dispatch = useDispatch();
  const atencionesRef = useRef();
  const { id } = useParams();
  const [btnGrabar, setBtnGrabar] = useState(true);
  const [archivos, setArchivos] = useState(null);
  const [btnAte, setBtnAte] = useState(false);
  const [viewAteId, setViewAteId] = useState(0);

  /*
  const [downloadFile, downloaderComponentUI] = useFileDownloader();
  
  const download = (file) => downloadFile(file);
  const [fileDwn, setFileDwn] = useState({
    name: "",
    thumb: "",
    file: "",
    filename: "",
  });
  */

  useEffect(() => {
    if (paciente) {
      setAtenciones(paciente?.atenciones);
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
      diagnostico: "",
      practica: "",
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
    console.log(archivos);
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
        axios
          .post(
            `http://localhost:5001/upload/${id}/UpdateSelectedFilesAtencion`,
            data
          )
          .then((res) => {
            const newAtenciones2 = res.data.atenciones;

            /*
            let newAte = {};
            res.data.atenciones.forEach((ate) => {
              if (ate._id === newAtenciones[0]._id) {
                newAte = ate;
              }
            });
            
            if (newAte) {
              const newSelectedFiles = newAte.selectedFiles;
              setAtencion({ ...atencion, selectedFiles: newSelectedFiles });
            }
            */

            setAtenciones(newAtenciones2);
          })
          .catch((err) => console.log(err));
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
        diagnostico: atencion.diagnostico,
        practica: atencion.practica,
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
        axios
          .post(
            `http://localhost:5001/upload/${id}/UpdateSelectedFilesAtencion`,
            data
          )
          .then((res) => {
            const newAtenciones2 = res.data.atenciones;

            let newAte = {};
            res.data.atenciones.forEach((ate) => {
              if (ate._id === atencionId) {
                newAte = ate;
              }
            });
            if (newAte) {
              const newSelectedFiles = newAte.selectedFiles;
              setAtencion({ ...atencion, selectedFiles: newSelectedFiles });
            }

            setAtenciones(newAtenciones2);
          })
          .catch((err) => console.log(err));
      }
      setBtnAte(true);
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

  const handleEdit = (c) => {
    setAtencion({
      fecha: c.fecha,
      notas: c.notas,
      selectedFiles: c.selectedFiles,
      diaStr: c.diaStr,
      anomesStr: c.anomesStr,
      diagnostico: c.diagnostico,
      practica: c.practica,
      userId: c.userId,
    });
    setAtencionId(c._id);
    setBtnGrabar(true);
    setBtnAte(true);
    setViewAteId(0);
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
        diagnostico: "",
        practica: "",
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
    console.log(e.target.files);
    console.log(e.target.files[0]);
    setArchivos(e.target.files);
    setBtnGrabar(false);
    setBtnAte(true);
  };

  const handleDeleteFile = async (file) => {
    const respuesta = await swal({
      title: "Eliminar Archivo",
      text: "Estas seguro que desea eliminar este archivo?",
      icon: "warning",
      buttons: ["No", "Si"],
    });
    if (respuesta) {
      const newAtenciones = await dispatch(
        DeleteFileAtencion({ _id: atencionId, selectedFile: file }, id)
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

  const handleDeleteFile1 = async (file) => {
    const respuesta = await swal({
      title: "Eliminar Archivo",
      text: "Estas seguro que desea eliminar este archivo?",
      icon: "warning",
      buttons: ["No", "Si"],
    });
    if (respuesta) {
      const newAtenciones = await dispatch(
        DeleteFileAtencion({ _id: viewAteId, selectedFile: file }, id)
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

  const handleDowloadFile = async (file) => {
    const filename = file.substr(15, file.length - 15);
    const respuesta = await dispatch(getFileDownload(id, atencionId, file));
    if (respuesta.data.type === "application/json") {
      return null;
    }
    const url = window.URL.createObjectURL(
      new Blob([respuesta.data], {
        type: respuesta.headers["content-type"],
      })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  };

  const handleDowloadFile1 = async (file) => {
    const filename = file.substr(15, file.length - 15);
    const respuesta = await dispatch(getFileDownload(id, viewAteId, file));
    if (respuesta.data.type === "application/json") {
      return null;
    }
    const url = window.URL.createObjectURL(
      new Blob([respuesta.data], {
        type: respuesta.headers["content-type"],
      })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    /*
    download({
      name: file.substr(15, file.length - 15),
      thumb: "",
      file: `http://localhost:5001/uploads/${id}/${viewAteId}/${file}`,
      filename: file.substr(15, file.length - 15),
    });
    */
  };

  return (
    <div>
      <div className={classes.atencionesOuterContainer}>
        <div
          className={classes.atencionesInnerContainer}
          style={{ width: "40%" }}
        >
          <Typography gutterBottom variant="h6">
            Atenciones registradas: <strong> {atenciones?.length} </strong>
          </Typography>
          {atenciones ? sortByFecha(atenciones) : null}
          {atenciones.map((c, i) => (
            <Typography key={c._id} gutterBottom variant="subtitle1">
              {moment(c.fecha).format("DD-MM-YY h:mm a")} -{" "}
              <strong>
                Dx:{" "}
                {c.diagnostico?.length > 10
                  ? c.diagnostico.substring(0, 10) + "... "
                  : c.diagnostico}
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
                    Dx: <strong> {c.diagnostico}</strong>
                  </Typography>
                  <Typography>Práctica: {c.practica}</Typography>
                  <Typography>Notas: {c.notas}</Typography>
                  {c?.selectedFiles?.length > 0 && (
                    <TableContainer component={Paper}>
                      <Table
                        sx={{ minWidth: 450 }}
                        size="small"
                        aria-label="simple table"
                      >
                        <TableBody>
                          {c?.selectedFiles.map((f, i) => (
                            <TableRow
                              key={i}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell width="50%" component="th" scope="row">
                                {f.substr(15, f.length - 15)}
                              </TableCell>
                              <TableCell width="10%" align="right">
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="primary"
                                  onClick={() => handleDowloadFile1(f)}
                                >
                                  <DownloadIcon fontSize="small" />
                                </Button>
                              </TableCell>
                              <TableCell width="10%" align="right">
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="secondary"
                                  onClick={() => handleDeleteFile1(f)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {/* {downloaderComponentUI} */}
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
        </div>

        <div
          style={{ width: "60%" }}
          className={`${classes.root} ${classes.form}`}
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
            />
          </form>

          <TextField
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
          <div
            style={{ width: "50%" }}
            className={`${classes.root} ${classes.form}`}
          >
            <TextField
              fullWidth
              variant="outlined"
              label="Diagnóstico presuntivo"
              value={atencion.diagnostico}
              onChange={(e) => {
                setAtencion({ ...atencion, diagnostico: e.target.value });
                e.target.value ? setBtnGrabar(false) : setBtnGrabar(true);
                e.target.value ? setBtnAte(true) : setBtnAte(false);
              }}
            />
          </div>

          <div
            style={{ width: "50%" }}
            className={`${classes.root} ${classes.form}`}
          >
            <TextField
              fullWidth
              variant="outlined"
              label="Práctica"
              value={atencion.practica}
              onChange={(e) => {
                setAtencion({ ...atencion, practica: e.target.value });
                e.target.value ? setBtnGrabar(false) : setBtnGrabar(true);
                e.target.value ? setBtnAte(true) : setBtnAte(false);
              }}
            />
          </div>

          <Button
            style={{ marginTop: "10px" }}
            disabled={btnGrabar}
            variant="contained"
            color="primary"
            size="small"
            onClick={handleClick}
          >
            {atencionId ? "Actualizar" : "Crear"}
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

          <Divider style={{ width: "100%", marginBottom: "20px" }} />
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
                  {atencion?.selectedFiles?.map((f, i) => (
                    <TableRow
                      key={i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell width="80%" component="th" scope="row">
                        {f.substr(15, f.length - 15)}
                      </TableCell>
                      <TableCell width="10%" align="right">
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => handleDowloadFile(f)}
                        >
                          <DownloadIcon fontSize="small" />
                        </Button>
                      </TableCell>
                      <TableCell width="10%" align="right">
                        <Button
                          variant="contained"
                          size="small"
                          color="secondary"
                          onClick={() => handleDeleteFile(f)}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* {downloaderComponentUI} */}
            </TableContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AtencionSection;
