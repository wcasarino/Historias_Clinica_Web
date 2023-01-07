import generateExcel from "zipcelx";
import moment from 'moment';

import { sortByFecha } from './Fechas'

const ExcelAtenciones = (pacientes) => {


  const cambiarFecha = (fec) => {
    const fec1 = new Date(fec)
    return fec1.toLocaleDateString('es-AR', { day: '2-digit', year: 'numeric', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  const config = {
    filename: 'Atenciones',
    sheet: {
      data: []
    }
  };

  const dataSet = config.sheet.data;

  //Titulos
  const headerRow = [];

  headerRow.push({ value: 'Paciente', type: 'string' })
  headerRow.push({ value: 'Dni', type: 'string' })
  headerRow.push({ value: 'Etiquetas', type: 'string' })

  //Datos Atenciones
  headerRow.push({ value: 'Fecha', type: 'string' })
  headerRow.push({ value: 'Hora', type: 'string' })
  headerRow.push({ value: 'Diagnóstico', type: 'string' })
  headerRow.push({ value: 'Práctica', type: 'string' })
  headerRow.push({ value: 'Notas', type: 'string' })

  dataSet.push(headerRow);

  // Filas
  if (pacientes.length > 0) {
    pacientes.forEach(pac => {
      if (pac.atenciones) {
        sortByFecha(pac.atenciones)
        pac.atenciones.forEach(ate => {
          const dataRow = [];

          dataRow.push({ value: pac.apellidos + ", " + pac.nombres, type: 'string' })
          dataRow.push({ value: pac.dni, type: 'string' })
          dataRow.push({ value: pac.tags.map((tag) => `${tag} `), type: 'string' })
          dataRow.push({ value: cambiarFecha(ate.fecha).slice(0, 10), type: 'string' })
          dataRow.push({ value: cambiarFecha(ate.fecha).slice(12), type: 'string' })

          dataRow.push({ value: ate.diagnosticos.map((dx) => ` ${dx} `), type: 'string' })
          dataRow.push({ value: ate.practicas.map((pra) => ` ${pra} `), type: 'string' })

          dataRow.push({ value: ate.notas || '', type: 'string' })

          dataSet.push(dataRow);
        })

      }

    });
  } else {
    dataSet.push([
      {
        value: "Sin Datos",
        type: "string"
      }
    ]);
  }
  generateExcel(config);
}

export default ExcelAtenciones;