export const PacienteDoc = {
  dni: '',
  userId: '',
  apellidos: '',
  nombres: '',
  tags: [],
  resumen: '',
  persona: {
    cuit: '',
    sexo: '',
    fecha_nac: null,
    estado_civil: '',
    obra_social: '',
    familograma: '',
  },
  domicilio: {
    calle: '',
    barrio: '',
    departamento: '',
    telefono: '',
    notas: '',
  },
  antecedentes: {
    familiares: {
      hta: null,
      cardiaca: null,
      dbt: null,
      acv: null,
      cancer: null,
      celiaca: null,
      drogas: null,
      alcohol: null,
      depresion: null,
      notas: '',
    },
    medicos: {
      alergias: '',
      alergias_medicamentos: '',
      internaciones: '',
      transfusiones: '',
      sexual: '',
      notas: '',
    },
    gineco: {
      fum: null,
      menarca: '',
      irs: '',
      gestas: '',
      partos: '',
      cesareas: '',
      abortos: '',
      ciclos: '',
      menopuasia: '',
      anticoncepcion_q: null,
      diu: null,
      implante: null,
      madre_sola: null,
      notas: '',
    },
    habitos: {
      tabaco: '',
      alcohol_habi: '',
      drogas: '',
      sedentarismo: null,
      fisico: '',
      alimentacion: '',
      cinturon: '',
      notas: '',
    },
    psicosocial: {
      violencia: '',
      duelo: null,
      separacion: null,
      trabajo: null,
      traslado: null,
      nacimiento: null,
      empleo: '',
      recurre: '',
      notas: '',
    },
  },
  atenciones: [{ fecha: null, notas: '', selectedFiles: [], diaStr: '', anomesStr: '', diagnosticos: [], practicas: [], userId: '', }],
}