import React from 'react'
import { Font, Text, View, StyleSheet } from '@react-pdf/renderer';


const HCPersona = ({ paciente }) => {

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
      marginTop: 8,
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
      <Text style={styles.title} >Antecedentes Familiares</Text>

      {typeof paciente.antecedentes.familiares.hta !== 'undefined' && paciente.antecedentes.familiares.hta !== null ?
        <Text style={styles.subtitle1}>Hipertensión arterial:
          <Text style={styles.text}> {paciente.antecedentes.familiares.hta ? "SI" : "NO"} </Text>
        </Text>
        : null}

      {typeof paciente.antecedentes.familiares.cardiaca !== 'undefined' && paciente.antecedentes.familiares.cardiaca !== null ?
        <Text style={styles.subtitle1}>Enfermedades cardíacas antes de los 55 años:
          <Text style={styles.text}> {paciente.antecedentes.familiares.cardiaca ? "SI" : "NO"} </Text>
        </Text>
        : null}

      {typeof paciente.antecedentes.familiares.dbt !== 'undefined' && paciente.antecedentes.familiares.dbt !== null ?
        <Text style={styles.subtitle1}>Diabetes:
          <Text style={styles.text}> {paciente.antecedentes.familiares.dbt ? "SI" : "NO"} </Text>
        </Text>
        : null}

      {typeof paciente.antecedentes.familiares.acv !== 'undefined' && paciente.antecedentes.familiares.acv !== null ?
        <Text style={styles.subtitle1}>Accidente cerebro vascular:
          <Text style={styles.text}> {paciente.antecedentes.familiares.acv ? "SI" : "NO"} </Text>
        </Text>
        : null}

      {typeof paciente.antecedentes.familiares.celiaca !== 'undefined' && paciente.antecedentes.familiares.celiaca !== null ?
        <Text style={styles.subtitle1}>Enfermedad celíaca:
          <Text style={styles.text}> {paciente.antecedentes.familiares.celiaca ? "SI" : "NO"} </Text>
        </Text>
        : null}

      {typeof paciente.antecedentes.familiares.drogas !== 'undefined' && paciente.antecedentes.familiares.drogas !== null ?
        <Text style={styles.subtitle1}>Abuso de drogas:
          <Text style={styles.text}> {paciente.antecedentes.familiares.drogas ? "SI" : "NO"} </Text>
        </Text>
        : null}

      {typeof paciente.antecedentes.familiares.alcohol !== 'undefined' && paciente.antecedentes.familiares.alcohol !== null ?
        <Text style={styles.subtitle1}>Abuso de alcohol:
          <Text style={styles.text}> {paciente.antecedentes.familiares.alcohol ? "SI" : "NO"} </Text>
        </Text>
        : null}

      {typeof paciente.antecedentes.familiares.depresion !== 'undefined' && paciente.antecedentes.familiares.depresion !== null ?
        <Text style={styles.subtitle1}>Depresión:
          <Text style={styles.text}> {paciente.antecedentes.familiares.depresion ? "SI" : "NO"} </Text>
        </Text>
        : null}

      {typeof paciente.antecedentes.familiares.cancer !== 'undefined' && paciente.antecedentes.familiares.cancer !== '' ?
        <Text style={styles.text1}>Cáncer en la familia:
          <Text style={styles.text}> {paciente.antecedentes.familiares.cancer} </Text>
        </Text>
        : null}

      {typeof paciente.antecedentes.familiares.notas !== 'undefined' && paciente.antecedentes.familiares.notas !== '' ?
        <Text style={styles.text1}>Notas:
          <Text style={styles.text}> {paciente.antecedentes.familiares.notas} </Text>
        </Text>
        : null}

    </View>
  )
}

export default HCPersona