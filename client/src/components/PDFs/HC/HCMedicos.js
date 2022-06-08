import React from 'react'
import { Font, Text, View, StyleSheet } from '@react-pdf/renderer';

const HCMedicos = ({ paciente }) => {

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
      marginTop: 8,
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
      <Text style={styles.title} >Antecedentes Médicos</Text>

      {paciente.antecedentes.medicos ? (
        <>

          {typeof paciente.antecedentes.medicos.app !== 'undefined' && paciente.antecedentes.medicos.app !== '' ?
            <Text style={styles.text1}>Antecedentes Personales Patológicos:
              <Text style={styles.text}> {paciente.antecedentes.medicos.app} </Text>
            </Text>
            : null}

          {typeof paciente.antecedentes.medicos.alergias !== 'undefined' && paciente.antecedentes.medicos.alergias !== '' ?
            <Text style={styles.text1}>Alergias:
              <Text style={styles.text}> {paciente.antecedentes.medicos.alergias} </Text>
            </Text>
            : null}

          {typeof paciente.antecedentes.medicos.alergias_medicamentos !== 'undefined' && paciente.antecedentes.medicos.alergias_medicamentos !== '' ?
            <Text style={styles.text1}>Alergias a los medicamentos:
              <Text style={styles.text}> {paciente.antecedentes.medicos.alergias_medicamentos} </Text>
            </Text>
            : null}

          {typeof paciente.antecedentes.medicos.internaciones !== 'undefined' && paciente.antecedentes.medicos.internaciones !== '' ?
            <Text style={styles.text1}>Internaciones, operaciones, accidentes:
              <Text style={styles.text}> {paciente.antecedentes.medicos.internaciones} </Text>
            </Text>
            : null}

          {typeof paciente.antecedentes.medicos.transfusiones !== 'undefined' && paciente.antecedentes.medicos.transfusiones !== '' ?
            <Text style={styles.text1}>Transfusiones de sangre:
              <Text style={styles.text}> {paciente.antecedentes.medicos.transfusiones} </Text>
            </Text>
            : null}

          {typeof paciente.antecedentes.medicos.sexual !== 'undefined' && paciente.antecedentes.medicos.sexual !== '' ?
            <Text style={styles.text1}>Infecciones de transmisión sexual:
              <Text style={styles.text}> {paciente.antecedentes.medicos.sexual} </Text>
            </Text>
            : null}

          {typeof paciente.antecedentes.medicos.notas !== 'undefined' && paciente.antecedentes.medicos.notas !== '' ?
            <Text style={styles.text1}>Notas:
              <Text style={styles.text}> {paciente.antecedentes.medicos.notas} </Text>
            </Text>
            : null}

        </>
      ) : null}


    </View>
  )
}

export default HCMedicos
