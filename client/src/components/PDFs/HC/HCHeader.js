import React from 'react'
import { Font, Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';


const HCHeader = ({ paciente }) => {

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
    container: {
      flexDirection: 'row',
      borderBottomWidth: 2,
      borderBottomColor: '#112131',
      borderBottomStyle: 'solid',
      alignItems: 'stretch',
    },
    detailColumn: {
      flexDirection: 'column',
      flexGrow: 9,
      textTransform: 'uppercase',
    },
    linkColumn: {
      flexDirection: 'column',
      flexGrow: 2,
      alignSelf: 'flex-end',
      justifySelf: 'flex-end',
    },
    name: {
      fontSize: '10px',
      fontFamily: 'Lato Bold',
    },
    subtitle: {
      fontSize: '8px',
      justifySelf: 'flex-end',
      fontFamily: 'Lato',
    },
    link: {
      fontFamily: 'Lato',
      fontSize: '10px',
      color: 'black',
      textDecoration: 'none',
      alignSelf: 'flex-end',
      justifySelf: 'flex-end',
    },
  });


  return (
    <View style={styles.container}>
      <View style={styles.detailColumn}>
        <Text style={styles.name} >{paciente.apellidos}, {paciente.nombres}</Text>
        <Text style={styles.name} >D.N.I.: {paciente.dni}</Text>
      </View>
      <View style={styles.linkColumn} >
        <Text style={styles.name} > Historia Clínica</Text>
        <Text style={styles.subtitle} >{moment(new Date()).format("DD/MM/YYYY")}</Text>
      </View>
    </View>
  )
}

export default HCHeader