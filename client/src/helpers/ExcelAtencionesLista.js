import generateExcel from "zipcelx";

const ExcelAtencionesLista = (atenciones) => {
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

  const config = {
    filename: "Atenciones",
    sheet: {
      data: [],
    },
  };

  const dataSet = config.sheet.data;

  //Titulos
  const headerRow = [];

  headerRow.push({ value: "Día", type: "string" });
  headerRow.push({ value: "Hora", type: "string" });
  headerRow.push({ value: "Paciente", type: "string" });
  headerRow.push({ value: "Dni", type: "string" });
  headerRow.push({ value: "Etiquetas", type: "string" });
  headerRow.push({ value: "Diagnóstico", type: "string" });
  headerRow.push({ value: "Práctica", type: "string" });
  headerRow.push({ value: "Notas", type: "string" });
  dataSet.push(headerRow);

  // Filas
  if (atenciones.length > 0) {
    sortByFecha(atenciones);
    atenciones.forEach((ate) => {
      const dataRow = [];
      dataRow.push({
        value: cambiarFecha(ate.fecha).slice(0, 10),
        type: "string",
      });
      dataRow.push({
        value: cambiarFecha(ate.fecha).slice(12),
        type: "string",
      });
      dataRow.push({
        value: ate.apellidos + ", " + ate.nombres,
        type: "string",
      });
      dataRow.push({ value: ate.dni, type: "string" });
      dataRow.push({ value: ate.tags.map((tag) => `${tag} `), type: "string" });
      dataRow.push({
        value: ate.diagnosticos.map((dx) => ` ${dx} `),
        type: "string",
      });
      dataRow.push({
        value: ate.practicas.map((pra) => ` ${pra} `),
        type: "string",
      });
      dataRow.push({ value: ate.notas, type: "string" });
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

  return generateExcel(config);
};

export default ExcelAtencionesLista;
