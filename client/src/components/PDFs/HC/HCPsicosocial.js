import React from 'react'
import { Font, Text, View, StyleSheet } from '@react-pdf/renderer';

const HCPsicosocial = ({ paciente }) => {

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
      <Text style={styles.title} >Antecedentes Psico-Sociales</Text>

      {paciente.antecedentes.psicosocial ? (
        <>

          {typeof paciente.antecedentes.psicosocial.violencia !== 'undefined' && paciente.antecedentes.psicosocial.violencia !== '' ?
            <Text style={styles.text1}>Violencia Familiar:
              <Text style={styles.text}> {paciente.antecedentes.psicosocial.violencia} </Text>
            </Text>
            : null}

          {typeof paciente.antecedentes.psicosocial.duelo !== 'undefined' && paciente.antecedentes.psicosocial.duelo !== null ?
            <Text style={styles.subtitle1}>Duelo:
              <Text style={styles.text}> {paciente.antecedentes.psicosocial.duelo ? "SI" : "NO"} </Text>
            </Text>
            : null}

          {typeof paciente.antecedentes.psicosocial.separacion !== 'undefined' && paciente.antecedentes.psicosocial.separacion !== null ?
            <Text style={styles.subtitle1}>Separación:
              <Text style={styles.text}> {paciente.antecedentes.psicosocial.separacion ? "SI" : "NO"} </Text>
            </Text>
            : null}

          {typeof paciente.antecedentes.psicosocial.trabajo !== 'undefined' && paciente.antecedentes.psicosocial.trabajo !== null ?
            <Text style={styles.subtitle1}>Pérdida del trabajo:
              <Text style={styles.text}> {paciente.antecedentes.psicosocial.trabajo ? "SI" : "NO"} </Text>
            </Text>
            : null}

          {typeof paciente.antecedentes.psicosocial.traslado !== 'undefined' && paciente.antecedentes.psicosocial.traslado !== null ?
            <Text style={styles.subtitle1}>Traslado:
              <Text style={styles.text}> {paciente.antecedentes.psicosocial.traslado ? "SI" : "NO"} </Text>
            </Text>
            : null}

          {typeof paciente.antecedentes.psicosocial.nacimiento !== 'undefined' && paciente.antecedentes.psicosocial.nacimiento !== null ?
            <Text style={styles.subtitle1}>Nacimientos:
              <Text style={styles.text}> {paciente.antecedentes.psicosocial.nacimiento ? "SI" : "NO"} </Text>
            </Text>
            : null}

          {typeof paciente.antecedentes.psicosocial.empleo !== 'undefined' && paciente.antecedentes.psicosocial.empleo !== '' ?
            <Text style={styles.text1}>Empleo estable en la familia:
              <Text style={styles.text}> {paciente.antecedentes.psicosocial.empleo} </Text>
            </Text>
            : null}

          {typeof paciente.antecedentes.psicosocial.recurre !== 'undefined' && paciente.antecedentes.psicosocial.recurre !== '' ?
            <Text style={styles.text1}>Ante un problema personal a quien recurre:
              <Text style={styles.text}> {paciente.antecedentes.psicosocial.recurre} </Text>
            </Text>
            : null}

          {typeof paciente.antecedentes.psicosocial.notas !== 'undefined' && paciente.antecedentes.psicosocial.notas !== '' ?
            <Text style={styles.text1}>Notas:
              <Text style={styles.text}> {paciente.antecedentes.psicosocial.notas} </Text>
            </Text>
            : null}

        </>
      ) : null}


    </View>
  )
}

export default HCPsicosocial
