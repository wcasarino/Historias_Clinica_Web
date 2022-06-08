import React from 'react'
import { Font, Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';

const HCGineco = ({ paciente }) => {
 
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
      <Text style={styles.title} >Antecedentes Gineco-Obstétricos</Text>

{paciente.antecedentes.gineco ? (
  <>
      {typeof paciente.antecedentes.gineco.fum  !== 'undefined' && paciente.antecedentes.gineco.fum !== null ?
        <Text style={styles.text1}>Fecha de última mestruación:  
          <Text style={styles.text}> {moment(paciente.antecedentes.gineco.fum).format("DD/MM/YYYY")} </Text>
        </Text> 
      : null}

      {typeof paciente.antecedentes.gineco.menarca  !== 'undefined' && paciente.antecedentes.gineco.menarca !== '' ?
        <Text style={styles.text1}>Menarca:  
          <Text style={styles.text}> {paciente.antecedentes.gineco.menarca } </Text>
        </Text> 
      : null}

      {typeof paciente.antecedentes.gineco.irs  !== 'undefined' && paciente.antecedentes.gineco.irs !== '' ?
        <Text style={styles.text1}>I. R. S.:  
          <Text style={styles.text}> {paciente.antecedentes.gineco.irs } </Text>
        </Text> 
      : null}

    {typeof paciente.antecedentes.gineco.gestas  !== 'undefined' && paciente.antecedentes.gineco.gestas !== '' ?
        <Text style={styles.text1}>Gestas:  
          <Text style={styles.text}> {paciente.antecedentes.gineco.gestas } </Text>
        </Text> 
      : null}

    {typeof paciente.antecedentes.gineco.partos  !== 'undefined' && paciente.antecedentes.gineco.partos !== '' ?
        <Text style={styles.text1}>Partos:  
          <Text style={styles.text}> {paciente.antecedentes.gineco.partos } </Text>
        </Text> 
      : null}

    {typeof paciente.antecedentes.gineco.cesareas  !== 'undefined' && paciente.antecedentes.gineco.cesareas !== '' ?
        <Text style={styles.text1}>Cesáreas:  
          <Text style={styles.text}> {paciente.antecedentes.gineco.cesareas } </Text>
        </Text> 
      : null}

    {typeof paciente.antecedentes.gineco.abortos  !== 'undefined' && paciente.antecedentes.gineco.abortos !== '' ?
        <Text style={styles.text1}>Abortos:  
          <Text style={styles.text}> {paciente.antecedentes.gineco.abortos } </Text>
        </Text> 
      : null}

    {typeof paciente.antecedentes.gineco.ciclos  !== 'undefined' && paciente.antecedentes.gineco.ciclos !== '' ?
        <Text style={styles.text1}>Ciclos:  
          <Text style={styles.text}> {paciente.antecedentes.gineco.ciclos } </Text>
        </Text> 
      : null}

    {typeof paciente.antecedentes.gineco.menopuasia  !== 'undefined' && paciente.antecedentes.gineco.menopuasia !== '' ?
        <Text style={styles.text1}>Menopausia:  
          <Text style={styles.text}> {paciente.antecedentes.gineco.menopuasia } </Text>
        </Text> 
      : null}

    {typeof paciente.antecedentes.gineco.anticoncepcion_q  !== 'undefined' && paciente.antecedentes.gineco.anticoncepcion_q !== null ?
        <Text style={styles.subtitle1}>Anticoncepción quirúrgica:  
          <Text style={styles.text}> {paciente.antecedentes.gineco.anticoncepcion_q  ? "SI" : "NO" } </Text>
        </Text> 
      : null}

    {typeof paciente.antecedentes.gineco.anticoncepcion_t  !== 'undefined' && paciente.antecedentes.gineco.anticoncepcion_t !== '' ?
        <Text style={styles.text1}>Notas anticoncepción quirúrgica: 
          <Text style={styles.text}> {paciente.antecedentes.gineco.anticoncepcion_t } </Text>
        </Text> 
      : null}

    {typeof paciente.antecedentes.gineco.diu  !== 'undefined' && paciente.antecedentes.gineco.diu !== null ?
        <Text style={styles.subtitle1}>Dispositivo intrauterino:  
          <Text style={styles.text}> {paciente.antecedentes.gineco.diu  ? "SI" : "NO" } </Text>
        </Text> 
      : null}

    {typeof paciente.antecedentes.gineco.diu_t  !== 'undefined' && paciente.antecedentes.gineco.diu_t !== '' ?
        <Text style={styles.text1}>Notas dispositivo intrauterino: 
          <Text style={styles.text}> {paciente.antecedentes.gineco.diu_t } </Text>
        </Text> 
      : null}

    {typeof paciente.antecedentes.gineco.implante  !== 'undefined' && paciente.antecedentes.gineco.implante !== null ?
        <Text style={styles.subtitle1}>Implante:  
          <Text style={styles.text}> {paciente.antecedentes.gineco.implante  ? "SI" : "NO" } </Text>
        </Text> 
      : null}

    {typeof paciente.antecedentes.gineco.fup  !== 'undefined' && paciente.antecedentes.gineco.fup !== null ?
        <Text style={styles.text1}>Fecha de último parto:  
          <Text style={styles.text}> {moment(paciente.antecedentes.gineco.fup).format("DD/MM/YYYY")} </Text>
        </Text> 
      : null}

      {typeof paciente.antecedentes.gineco.fup_t  !== 'undefined' && paciente.antecedentes.gineco.fup_t !== '' ?
        <Text style={styles.text1}>Notas fecha de último parto:  
          <Text style={styles.text}> {paciente.antecedentes.gineco.fup_t } </Text>
        </Text> 
      : null}

      {typeof paciente.antecedentes.gineco.notas  !== 'undefined' && paciente.antecedentes.gineco.notas !== '' ?
        <Text style={styles.text1}>Notas:  
          <Text style={styles.text}> {paciente.antecedentes.gineco.notas } </Text>
        </Text> 
      : null}

      </>
      ) :  null}


    </View>
  )
}

export default HCGineco
