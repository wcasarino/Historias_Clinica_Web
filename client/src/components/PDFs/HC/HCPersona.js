import React from 'react'
import { Font, Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';


const HCPersona = ({ paciente, pdfPersona, pdfDomicilio }) => {


  Font.register({
    family: 'Lato Bold',
    src: 'https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf',
  });

  Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
  });

  const styles = StyleSheet.create({
    title: {
      marginTop: 18,
      fontSize: 24,
      textAlign: 'center',
      fontFamily: 'Oswald'
    },
    subtitle: {
      fontSize: 18,
      marginTop: 8,
      //fontFamily: 'Oswald'
      fontFamily: 'Lato Bold'
    },
    subtitle1: {
      fontSize: 12,
      textAlign: 'left',
      fontFamily: 'Lato Bold'
    },
    text: {
      //margin: 12,
      fontSize: 14,
      textAlign: 'justify',
      fontFamily: 'Times-Roman'
    },
    text1: {
      //marginTop: 8,
      fontSize: 12,
      textAlign: 'left',
      fontFamily: 'Lato Bold'
    },
  });

  if (!paciente) {
    return null;
  }

  return (
    <View >
      {pdfPersona || pdfDomicilio ? (<>
        <Text style={styles.title} >Datos del Paciente</Text>

        {paciente.persona && pdfPersona ? (
          <>
            {typeof paciente.persona.sexo !== 'undefined' && paciente.persona.sexo !== '' ?
              <Text style={styles.subtitle1}>Sexo:
                <Text style={styles.text}> {paciente.persona.sexo} </Text>
              </Text>
              : null}

            {typeof paciente.persona.estado_civil !== 'undefined' && paciente.persona.estado_civil !== '' ?
              <Text style={styles.text1}>Estado Civil:
                <Text style={styles.text}> {paciente.persona.estado_civil} </Text>
              </Text>
              : null}

            {typeof paciente.persona.fecha_nac !== 'undefined' && paciente.persona.fecha_nac !== null ?
              <Text style={styles.text1}>Fecha de Nacimiento:
                <Text style={styles.text}> {moment(paciente.persona.fecha_nac).format("DD/MM/YYYY")} </Text>
              </Text>
              : null}

            {typeof paciente.persona.obra_social !== 'undefined' && paciente.persona.obra_social !== '' ?
              <Text style={styles.text1}>Obra social:
                <Text style={styles.text}> {paciente.persona.obra_social} </Text>
              </Text>
              : null}

            {typeof paciente.persona.familograma !== 'undefined' && paciente.persona.familograma !== '' ?
              <Text style={styles.text1}>Familograma:
                <Text style={styles.text}> {paciente.persona.familograma} </Text>
              </Text>
              : null}
          </>
        ) : null}

        {paciente.domicilio && pdfDomicilio ? (
          <>
            <Text style={styles.subtitle} >Domicilio del Paciente: </Text>

            {typeof paciente.domicilio.calle !== 'undefined' && paciente.domicilio.calle !== '' ?
              <Text style={styles.text1}>Calle:
                <Text style={styles.text}> {paciente.domicilio.calle} </Text>
              </Text>
              : null}

            {typeof paciente.domicilio.barrio !== 'undefined' && paciente.domicilio.barrio !== '' ?
              <Text style={styles.text1}>Barrio:
                <Text style={styles.text}> {paciente.domicilio.barrio} </Text>
              </Text>
              : null}

            {typeof paciente.domicilio.departamento !== 'undefined' && paciente.domicilio.departamento !== '' ?
              <Text style={styles.text1}>Departamento:
                <Text style={styles.text}> {paciente.domicilio.departamento} </Text>
              </Text>
              : null}

            {typeof paciente.domicilio.telefono !== 'undefined' && paciente.domicilio.telefono !== '' ?
              <Text style={styles.text1}>Teléfono:
                <Text style={styles.text}> {paciente.domicilio.telefono} </Text>
              </Text>
              : null}

            {typeof paciente.domicilio.notas !== 'undefined' && paciente.domicilio.notas !== '' ?
              <Text style={styles.text1}>Notas:
                <Text style={styles.text}> {paciente.domicilio.notas} </Text>
              </Text>
              : null}

          </>)
          : null}
      </>) : null}
    </View>
  )
}

export default HCPersona