import React from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@mui/material/';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert'

import { deletePaciente } from '../../../actions/pacientes';
import useStyles from './styles';

import hombrePensando from '../../../images/pensando.jpg';

const Paciente = ({ paciente, setCurrentId }) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  //const userId = user?.result.googleId || user?.result?._id;

  const openPaciente = (e) => {
    navigate(`/pacientes/${paciente._id}`);
  };

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

  const proxima = (pFecha) => {
    if (pFecha) {
      if (moment(pFecha) > moment(new Date())) {
        return moment(pFecha).format("DD/MM/YY")
      }
      return 'Vencida'
    } else {
      return null
    }
  }

  const deletePacienteBtn = async (id) => {
    if (paciente.atenciones?.length > 0) {
      swal({
        title: "Eliminar Paciente",
        text: "El Paciente registra atenciones, No se puede eliminar.",
        icon: "error",
        timer: "5000"
      })
      return null
    }
    const respuesta = await swal({
      title: "Eliminar Paciente",
      text: "Estas seguro de desea eliminar este Paciente?",
      icon: "warning",
      buttons: ["No", "Si"]
    })
    if (respuesta) {

      dispatch(deletePaciente(id))
      swal({
        title: "Eliminar Paciente",
        text: "El Paciente fue elininado con éxito",
        icon: "success",
        timer: "2000"
      })
    }
  }

  return (
    <Card className={classes.card} raised elevation={6}>
      <ButtonBase
        component="span"
        name="test"
        className={classes.cardAction}
        onClick={openPaciente}
      >
        <CardMedia className={classes.media} image={paciente.foto || hombrePensando} title={paciente.apellidos} />
        <div className={classes.overlay}>
          <Typography variant="h6">{paciente.apellidos?.split(" ").splice(0, 1).join(" ")}, {paciente.nombres?.split(" ").splice(0, 1).join(" ")}</Typography>
          <Typography variant="body2">Cantidad de visitas: {paciente.atenciones.length}
          </Typography>
          {paciente.atenciones ? sortByFecha(paciente.atenciones) : null}
          {
            paciente.atenciones.length > 0
              ?
              <Typography variant="body2">Última visita: {moment(paciente.atenciones[0].fecha).format("DD/MM/YY")}
              </Typography>
              :
              null
          }
          {
            paciente.proximaAtencion && <Typography variant='body2'>Próxima Visita {proxima(paciente.proximaAtencion)}</Typography>
          }


        </div>
        {(user?.result?.googleId === paciente?.userId || user?.result?._id === paciente?.userId) && (
          <div className={classes.overlay2} name="edit">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentId(paciente._id);
              }}
              style={{ color: 'white' }}
              size="small"
            >
              <MoreHorizIcon fontSize="default" />
            </Button>
          </div>
        )}
        <div className={classes.details}>
          <Typography variant="body2" color="textSecondary" component="h2">{paciente.tags.map((tag) => `#${tag} `)}</Typography>
        </div>
        <Typography className={classes.title} gutterBottom variant="h5" component="h2">{paciente.dni}</Typography>
        <CardContent>

          <Typography variant="body2" color="textSecondary" component="p">{paciente.resumen?.length > 40 ? paciente.resumen.substring(0, 40) + "..." : paciente.resumen}</Typography>
        </CardContent>
      </ButtonBase>
      <CardActions className={classes.cardActions}>
        {(user?.result?.googleId === paciente?.userId || user?.result?._id === paciente?.userId) && (
          <Button size="small" color="secondary" onClick={() => deletePacienteBtn(paciente._id)}>
            <DeleteIcon fontSize="small" /> &nbsp; Eliminar
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Paciente;
