import React from 'react'
import {
  Text,
  Font,
  Page,
  View,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';

import Header from './HCHeader';
import HCPersona from './HCPersona';
import HCFamiliares from './HCFamiliares'
import HCGineco from './HCGineco';
import HCMedicos from './HCMedicos';
import HCHabitos from './HCHabitos';
import HCPsicosocial from './HCPsicosocial';
import HCAtenciones from './HCAtenciones';
//import Skills from './Skills';
//import Education from './Education';
//import Experience from './Experience';

Font.register({
  family: 'Open Sans',
  src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf',
});

Font.register({
  family: 'Lato',
  src: 'https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf',
});

Font.register({
  family: 'Lato Italic',
  src: 'https://fonts.gstatic.com/s/lato/v16/S6u8w4BMUTPHjxsAXC-v.ttf',
});

Font.register({
  family: 'Lato Bold',
  src: 'https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf',
});

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const styles = StyleSheet.create({
  detailContainer: {
    flexDirection: 'row',
  },
  page: {
    padding: 30,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    '@media max-width: 400': {
      flexDirection: 'column',
    },
  },
  image: {
    marginBottom: 10,
  },
  leftColumn: {
    flexDirection: 'column',
    width: 170,
    paddingTop: 30,
    paddingRight: 15,
    '@media max-width: 400': {
      width: '100%',
      paddingRight: 0,
    },
    '@media orientation: landscape': {
      width: 200,
    },
  },
  footer: {
    fontSize: 12,
    fontFamily: 'Lato Bold',
    textAlign: 'center',
    marginTop: 15,
    paddingTop: 5,
    borderWidth: 3,
    borderColor: 'gray',
    borderStyle: 'dashed',
    '@media orientation: landscape': {
      marginTop: 10,
    },
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Oswald'
  },
  author: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 12,
    //fontFamily: 'Oswald'
    fontFamily: 'Lato Bold'
  },
  text: {
    //margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman'
  },
});



const HCReducido = ({ paciente, pdfPaciente, pdfDomicilio, pdfFamiliares, pdfGineco, pdfHabitos, pdfMedicos, pdfPsicoSocial, pdfPersona, }) => {

  if (!paciente) {
    return null;
  }

  return (
    <Document
      author="Ing. Walter Casarino"
      keywords="Historia Clìnica de Pacientes"
      subject="La Historia Clínica"
      title="Historia Clínica"
    >
      <Page size="A4" style={styles.page}>
        <Header paciente={paciente} />

        {paciente.resumen && pdfPaciente ? (
          <>
            <Text style={styles.subtitle} >Resumen Clínico: </Text>
            <Text style={styles.text} >{paciente.resumen} </Text>
          </>
        ) : null}
        {typeof paciente.persona !== 'undefined' || typeof paciente.domicilio !== 'undefined' ? <HCPersona paciente={paciente}
          pdfPersona={pdfPersona}
          pdfDomicilio={pdfDomicilio}
        /> : null}
        {typeof paciente.antecedentes?.familiares !== 'undefined' && pdfFamiliares ? <HCFamiliares paciente={paciente} /> : null}
        {typeof paciente.antecedentes?.gineco !== 'undefined' && pdfGineco ? <HCGineco paciente={paciente} /> : null}
        {typeof paciente.antecedentes?.medicos !== 'undefined' && pdfMedicos ? <HCMedicos paciente={paciente} /> : null}
        {typeof paciente.antecedentes?.habitos !== 'undefined' && pdfHabitos ? <HCHabitos paciente={paciente} /> : null}
        {typeof paciente.antecedentes?.psicosocial !== 'undefined' && pdfPsicoSocial ? <HCPsicosocial paciente={paciente} /> : null}
        {paciente.atenciones.length > 0 ? <HCAtenciones paciente={paciente} /> : null}

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  )
}

export default HCReducido