import React, { useState } from 'react'
import { Font, Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';

const HCAtenciones = ({ paciente }) => {
  const [atenciones, setAtenciones] = useState(paciente?.atenciones || []);

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
      marginBottom: 18,
      fontSize: 24,
      textAlign: 'center',
      fontFamily: 'Oswald',
      borderBottomWidth: 2,
      borderBottomColor: '#112131',
      borderBottomStyle: 'solid',
      borderTopWidth: 2,
      borderTopColor: '#112131',
      borderTopStyle: 'solid',
    },
    linea: {
      marginTop: 8,
      borderBottomWidth: 2,
      borderBottomColor: '#112131',
      borderBottomStyle: 'solid',
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

  const sortByFecha = (atenciones) => {
    atenciones.sort(function (a, b) {
      if (a.fecha > b.fecha) {
        return -1;
      }
      if (a.fecha < b.fecha) {
        return 1;
      }
      return 0;
    });
  };


  if (!paciente) {
    return null;
  }

  return (
    <View >
      <Text style={styles.title} > Atenciones {atenciones.length}</Text>

      {atenciones ? (
        <>
          {atenciones ? sortByFecha(atenciones) : null}
          {atenciones.map((c, i) => (
            <View key={i}>
              <Text style={styles.text1}>Fecha:
                <Text style={styles.text}> {moment(c.fecha).format("DD-MM-YY")} </Text>
              </Text>

              <Text style={styles.text1}>Diagnóstico presuntivo:
                <Text style={styles.text}> {c.diagnostico} </Text>
              </Text>

              <Text style={styles.text1}>Práctica realizada:
                <Text style={styles.text}> {c.practica} </Text>
              </Text>

              <Text style={styles.text1}>Notas:
                <Text style={styles.text}> {c.notas} </Text>
              </Text>

              <Text style={styles.linea}></Text>

            </View>
          ))}

        </>
      ) : null}


    </View>
  )
}

export default HCAtenciones
