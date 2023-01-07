import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import generateExcel from "zipcelx";
import { ProgressBar } from "react-bootstrap";

import { getAllPacientes } from "../../actions/pacientes";

export const ExpoPacientes = ({ setExpoValue }) => {
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
    exportarPacientes();
  }, []);

  const proxima = (pFecha) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (pFecha) {
      if (moment(pFecha) > moment(today)) {
        return moment(pFecha).format("DD/MM/YY");
      }
      return "Vencida";
    } else {
      return null;
    }
  };

  const exportarPacientes = async () => {
    const user = JSON.parse(localStorage.getItem("profile"));
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
      filename: "Pacientes",
      sheet: {
        data: [],
      },
    };

    const dataSet = config.sheet.data;

    //Titulos
    const headerRow = [];

    headerRow.push({ value: "dni", type: "string" });
    headerRow.push({ value: "Paciente", type: "string" });
    headerRow.push({ value: "Etiquetas", type: "string" });
    headerRow.push({ value: "Atenciones", type: "string" });
    headerRow.push({ value: "Última Atención", type: "string" });
    headerRow.push({ value: "Próxima Atención", type: "string" });
    headerRow.push({ value: "Resumen", type: "string" });

    //Datos Persona
    headerRow.push({ value: "cuit", type: "string" });
    headerRow.push({ value: "sexo", type: "string" });
    headerRow.push({ value: "fecha_nac", type: "string" });
    headerRow.push({ value: "estado_civil", type: "string" });
    headerRow.push({ value: "obra_social", type: "string" });
    headerRow.push({ value: "familograma", type: "string" });

    //Datos Domicilio
    headerRow.push({ value: "calle", type: "string" });
    headerRow.push({ value: "barrio", type: "string" });
    headerRow.push({ value: "departamento", type: "string" });
    headerRow.push({ value: "telefono", type: "string" });
    headerRow.push({ value: "notas", type: "string" });

    // Datos Antecedentes Familiares
    headerRow.push({ value: "hta", type: "string" });
    headerRow.push({ value: "cardiaca", type: "string" });
    headerRow.push({ value: "dbt", type: "string" });
    headerRow.push({ value: "acv", type: "string" });
    headerRow.push({ value: "cancer", type: "string" });
    headerRow.push({ value: "celiaca", type: "string" });
    headerRow.push({ value: "drogas", type: "string" });
    headerRow.push({ value: "alcohol", type: "string" });
    headerRow.push({ value: "depresion", type: "string" });
    headerRow.push({ value: "notas", type: "string" });

    // Datos Antecedentes medicos
    headerRow.push({ value: "app", type: "string" });
    headerRow.push({ value: "alergias", type: "string" });
    headerRow.push({ value: "alergias_medicamentos", type: "string" });
    headerRow.push({ value: "internaciones", type: "string" });
    headerRow.push({ value: "transfusiones", type: "string" });
    headerRow.push({ value: "sexual", type: "string" });
    headerRow.push({ value: "notas", type: "string" });

    // Datos Antecedentes gineco
    headerRow.push({ value: "fum", type: "string" });
    headerRow.push({ value: "menarca", type: "string" });
    headerRow.push({ value: "irs", type: "string" });
    headerRow.push({ value: "gestas", type: "string" });
    headerRow.push({ value: "partos", type: "string" });
    headerRow.push({ value: "cesareas", type: "string" });
    headerRow.push({ value: "abortos", type: "string" });
    headerRow.push({ value: "ciclos", type: "string" });
    headerRow.push({ value: "menopuasia", type: "string" });
    headerRow.push({ value: "anticoncepcion_q", type: "string" });
    headerRow.push({ value: "anticoncepcion_t", type: "string" });
    headerRow.push({ value: "diu", type: "string" });
    headerRow.push({ value: "diu_t", type: "string" });
    headerRow.push({ value: "implante", type: "string" });
    headerRow.push({ value: "fup", type: "string" });
    headerRow.push({ value: "fup_t", type: "string" });
    headerRow.push({ value: "notas", type: "string" });

    // Datos Antecedentes habitos
    headerRow.push({ value: "tabaco", type: "string" });
    headerRow.push({ value: "alcohol_habitos", type: "string" });
    headerRow.push({ value: "drogas", type: "string" });
    headerRow.push({ value: "sedentarismo", type: "string" });
    headerRow.push({ value: "fisico", type: "string" });
    headerRow.push({ value: "alimentacion", type: "string" });
    headerRow.push({ value: "cinturon", type: "string" });
    headerRow.push({ value: "notas", type: "string" });

    // Datos Antecedentes psicosocial
    headerRow.push({ value: "violencia_familiar", type: "string" });
    headerRow.push({ value: "duelo", type: "string" });
    headerRow.push({ value: "separacion", type: "string" });
    headerRow.push({ value: "perdida_de_trabajo", type: "string" });
    headerRow.push({ value: "traslado", type: "string" });
    headerRow.push({ value: "nacimiento", type: "string" });
    headerRow.push({ value: "empleo_estable", type: "string" });
    headerRow.push({ value: "a_quien_recurre", type: "string" });
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

        const dataRow = [];

        dataRow.push({ value: pac.dni, type: "string" });
        dataRow.push({
          value: pac.apellidos + ", " + pac.nombres,
          type: "string",
        });
        dataRow.push({
          value: pac.tags.map((tag) => `${tag} `),
          type: "string",
        });
        dataRow.push({ value: pac.atenciones.length, type: "number" });
        dataRow.push({
          value:
            pac.atenciones.length > 0
              ? moment(pac.atenciones[0].fecha).format("DD/MM/YY")
              : "",
          type: "string",
        });
        dataRow.push({
          value: pac.proximaAtencion ? proxima(pac.proximaAtencion) : "",
          type: "string",
        });
        dataRow.push({ value: pac.resumen, type: "string" });

        //Datos Persona
        dataRow.push({ value: pac.persona?.cuit || "", type: "string" });
        dataRow.push({ value: pac.persona?.sexo || "", type: "string" });
        dataRow.push({
          value: pac.persona?.fecha_nac
            ? moment(pac.persona?.fecha_nac).format("DD/MM/YY")
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.persona?.estado_civil || "",
          type: "string",
        });
        dataRow.push({ value: pac.persona?.obra_social || "", type: "string" });
        dataRow.push({ value: pac.persona?.familograma || "", type: "string" });

        //Datos Domicilio
        dataRow.push({ value: pac.domicilio?.calle || "", type: "string" });
        dataRow.push({ value: pac.domicilio?.barrio || "", type: "string" });
        dataRow.push({
          value: pac.domicilio?.departamento || "",
          type: "string",
        });
        dataRow.push({ value: pac.domicilio?.telefono || "", type: "string" });
        dataRow.push({ value: pac.domicilio?.notas || "", type: "string" });

        // Datos Antecedentes Familiares
        dataRow.push({
          value: pac.antecedentes?.familiares?.hta
            ? "SI"
            : pac.antecedentes?.familiares?.hta === false
            ? "NO"
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.familiares?.cardiaca
            ? "SI"
            : pac.antecedentes?.familiares?.cardiaca === false
            ? "NO"
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.familiares?.dbt
            ? "SI"
            : pac.antecedentes?.familiares?.dbt === false
            ? "NO"
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.familiares?.acv
            ? "SI"
            : pac.antecedentes?.familiares?.acv === false
            ? "NO"
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.familiares?.cancer || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.familiares?.celiaca
            ? "SI"
            : pac.antecedentes?.familiares?.celiaca === false
            ? "NO"
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.familiares?.drogas
            ? "SI"
            : pac.antecedentes?.familiares?.drogas === false
            ? "NO"
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.familiares?.alcohol
            ? "SI"
            : pac.antecedentes?.familiares?.alcohol === false
            ? "NO"
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.familiares?.depresion
            ? "SI"
            : pac.antecedentes?.familiares?.depresion === false
            ? "NO"
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.familiares?.notas || "",
          type: "string",
        });

        // Datos Antecedentes medicos
        dataRow.push({
          value: pac.antecedentes?.medicos?.app || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.medicos?.alergias || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.medicos?.alergias_medicamentos || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.medicos?.internaciones || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.medicos?.transfusiones || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.medicos?.sexual || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.medicos?.notas || "",
          type: "string",
        });

        // Datos Antecedentes gineco
        dataRow.push({
          value: pac.antecedentes?.gineco?.fum
            ? moment(pac.antecedentes?.gineco?.fum).format("DD/MM/YY")
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.gineco?.menarca || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.gineco?.irs || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.gineco?.gestas || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.gineco?.partos || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.gineco?.cesareas || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.gineco?.abortos || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.gineco?.ciclos || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.gineco?.menopuasia || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.gineco?.anticoncepcion_q
            ? "SI"
            : pac.antecedentes?.gineco?.anticoncepcion_q === false
            ? "NO"
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.gineco?.anticoncepcion_t || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.gineco?.diu
            ? "SI"
            : pac.antecedentes?.gineco?.diu === false
            ? "NO"
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.gineco?.diu_t || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.gineco?.implante
            ? "SI"
            : pac.antecedentes?.gineco?.implante === false
            ? "NO"
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.gineco?.fup
            ? moment(pac.antecedentes?.gineco?.fup).format("DD/MM/YY")
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.gineco?.fup_t || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.gineco?.notas || "",
          type: "string",
        });

        // Datos Antecedentes habitos
        dataRow.push({
          value: pac.antecedentes?.habitos?.tabaco || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.habitos?.alcohol_habi || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.habitos?.drogas || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.habitos?.sedentarismo
            ? "SI"
            : pac.antecedentes?.habitos?.sedentarismo === false
            ? "NO"
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.habitos?.fisico || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.habitos?.alimentacion || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.habitos?.cinturon || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.habitos?.notas || "",
          type: "string",
        });

        // Datos Antecedentes psicosocial
        dataRow.push({
          value: pac.antecedentes?.psicosocial?.violencia || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.psicosocial?.duelo
            ? "SI"
            : pac.antecedentes?.psicosocial?.duelo === false
            ? "NO"
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.psicosocial?.separacion
            ? "SI"
            : pac.antecedentes?.psicosocial?.separacion === false
            ? "NO"
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.psicosocial?.trabajo
            ? "SI"
            : pac.antecedentes?.psicosocial?.trabajo === false
            ? "NO"
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.psicosocial?.traslado
            ? "SI"
            : pac.antecedentes?.psicosocial?.traslado === false
            ? "NO"
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.psicosocial?.nacimiento
            ? "SI"
            : pac.antecedentes?.psicosocial?.nacimiento === false
            ? "NO"
            : "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.psicosocial?.empleo || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.psicosocial?.recurre || "",
          type: "string",
        });
        dataRow.push({
          value: pac.antecedentes?.psicosocial?.notas || "",
          type: "string",
        });

        dataSet.push(dataRow);
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
