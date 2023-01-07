import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import generateExcel from "zipcelx";
import { ProgressBar } from "react-bootstrap";

import { getAllPacientes } from "../../actions/pacientes";

export const ExpoAtenciones = ({ setExpoValue }) => {
  const { isLoading } = useSelector((state) => state.pacientes);

  return (
    <div
      className="uploader"
      style={{
        width: "500px",
        minHeight: "128px",
        position: "fixed",
        right: "18px",
        top: "18px",
        maxHeight: "700px",
        overflowY: "auto",
      }}
    >
      <div className="card">
        <div
          className="card-header"
          style={{
            color: "#fff",
            backgroundColor: "rgb(93 11 11 / 92%)",
          }}
        >
          Creando Archivo
        </div>
        <ul
          className="list-group list-group-flush"
          style={{ maxHeight: "300px", overflow: "hidden", overflowY: "auto" }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            <ArmaArchivo setExpoValue={setExpoValue} />
          )}
        </ul>
      </div>
    </div>
  );
};

const ArmaArchivo = ({ setExpoValue }) => {
  const [fileInfo, setFileInfo] = useState({
    progress: 0,
    completed: false,
    total: 0,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    exportarAtenciones();
  }, []);

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

  const exportarAtenciones = async () => {
    const data = await dispatch(getAllPacientes());
    const pacientes = data;
    if (!pacientes) {
      setFileInfo((info) => ({
        ...info,
        completed: true,
      }));
      setExpoValue(null);
      return null;
    }

    const config = {
      filename: "Atenciones",
      sheet: {
        data: [],
      },
    };

    const dataSet = config.sheet.data;

    //Titulos
    const headerRow = [];

    headerRow.push({ value: "Paciente", type: "string" });
    headerRow.push({ value: "dni", type: "string" });

    //Datos Atenciones
    headerRow.push({ value: "fecha", type: "string" });
    headerRow.push({ value: "diagnostico", type: "string" });
    headerRow.push({ value: "practica", type: "string" });
    headerRow.push({ value: "notas", type: "string" });

    dataSet.push(headerRow);

    // Filas
    if (pacientes.length > 0) {
      setFileInfo((info) => ({
        ...info,
        total: pacientes.length,
      }));
      let loaded = 0;
      let total = pacientes.length;
      pacientes.forEach((pac) => {
        loaded += 1;
        setFileInfo({
          progress: Math.floor((loaded * 100) / total),
          total,
          completed: false,
        });

        if (pac.atenciones) {
          sortByFecha(pac.atenciones);
          pac.atenciones.forEach((ate) => {
            const dataRow = [];

            dataRow.push({
              value: pac.apellidos + ", " + pac.nombres,
              type: "string",
            });
            dataRow.push({ value: pac.dni, type: "string" });
            dataRow.push({
              value: ate.fecha ? moment(ate.fecha).format("DD/MM/YY") : "",
              type: "string",
            });
            dataRow.push({
              value: ate.diagnosticos.map((dx) => `${dx} `),
              type: "string",
            });
            dataRow.push({
              value: ate.practicas.map((pra) => `${pra} `),
              type: "string",
            });
            dataRow.push({ value: ate.notas || "", type: "string" });

            dataSet.push(dataRow);
          });
        }
      });
    } else {
      dataSet.push([
        {
          value: "Sin Datos",
          type: "string",
        },
      ]);
    }

    setFileInfo((info) => ({
      ...info,
      completed: true,
    }));
    setExpoValue(null);
    return generateExcel(config);
  };

  return (
    <li className="list-group-item">
      <div className="row">
        <div className="col-12 d-flex">
          <div className="d-inline font-weight-bold text-truncate"></div>
          <div className="d-inline ml-10">
            <small>
              {fileInfo.loaded > 0 && (
                <>
                  <span className="text-success">{fileInfo.loaded}</span>/{" "}
                  {fileInfo.total}
                </>
              )}

              {fileInfo.loaded === 0 && <>Creando...</>}
            </small>
          </div>
          <div className="d-inline ml-10">
            {fileInfo.completed && (
              <span className="text-success">Completado</span>
            )}
            {fileInfo.error && (
              <span className="text-danger bg-dark">
                Errores al Crear el Archivo
              </span>
            )}
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 mt-2">
            <ProgressBar
              variant="success"
              now={fileInfo.progress}
              striped={true}
              label={`${fileInfo.progress}%`}
            />
          </div>
        </div>
      </div>
    </li>
  );
};
