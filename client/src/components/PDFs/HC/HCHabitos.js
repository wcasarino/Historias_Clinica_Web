import React from 'react'
import { Font, Text, View, StyleSheet } from '@react-pdf/renderer';

const HCHabitos = ({ paciente }) => {
 
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
      <Text style={styles.title} >Hábitos</Text>

{paciente.antecedentes.habitos ? (
  <>

      {typeof paciente.antecedentes.habitos.tabaco  !== 'undefined' && paciente.antecedentes.habitos.tabaco !== '' ?
        <Text style={styles.text1}>Tabaco:  
          <Text style={styles.text}> {paciente.antecedentes.habitos.tabaco } </Text>
        </Text> 
      : null}

      {typeof paciente.antecedentes.habitos.alcohol_habi  !== 'undefined' && paciente.antecedentes.habitos.alcohol_habi !== '' ?
        <Text style={styles.text1}>Alcohol:  
          <Text style={styles.text}> {paciente.antecedentes.habitos.alcohol_habi } </Text>
        </Text> 
      : null}

    {typeof paciente.antecedentes.habitos.drogas  !== 'undefined' && paciente.antecedentes.habitos.drogas !== '' ?
        <Text style={styles.text1}>Drogas:  
          <Text style={styles.text}> {paciente.antecedentes.habitos.drogas } </Text>
        </Text> 
      : null}

    {typeof paciente.antecedentes.habitos.sedentarismo  !== 'undefined' && paciente.antecedentes.habitos.sedentarismo !== null ?
        <Text style={styles.subtitle1}>Sedentarismo:  
          <Text style={styles.text}> {paciente.antecedentes.habitos.sedentarismo ? "SI" : "NO"} </Text>
        </Text> 
      : null}      

    {typeof paciente.antecedentes.habitos.fisico  !== 'undefined' && paciente.antecedentes.habitos.fisico !== '' ?
        <Text style={styles.text1}>Actividad física:  
          <Text style={styles.text}> {paciente.antecedentes.habitos.fisico } </Text>
        </Text> 
      : null}

    {typeof paciente.antecedentes.habitos.alimentacion  !== 'undefined' && paciente.antecedentes.habitos.alimentacion !== '' ?
        <Text style={styles.text1}>Alimentacion:  
          <Text style={styles.text}> {paciente.antecedentes.habitos.alimentacion } </Text>
        </Text> 
      : null}

    {typeof paciente.antecedentes.habitos.cinturon  !== 'undefined' && paciente.antecedentes.habitos.cinturon !== '' ?
        <Text style={styles.text1}>Usa cinturón de seguridad o casco:  
          <Text style={styles.text}> {paciente.antecedentes.habitos.cinturon } </Text>
        </Text> 
      : null}

      {typeof paciente.antecedentes.habitos.notas  !== 'undefined' && paciente.antecedentes.habitos.notas !== '' ?
        <Text style={styles.text1}>Notas:  
          <Text style={styles.text}> {paciente.antecedentes.habitos.notas } </Text>
        </Text> 
      : null}

      </>
      ) :  null}


    </View>
  )
}

export default HCHabitos
