import React, { useEffect, useState, useMemo } from "react";
import { Grid, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import swal from "sweetalert";

import useStyles from "./styles";
import { proximaAtencionPaciente } from "../../actions/pacientes";
import { getCalendarioProximo } from "../../actions/calendarioProximo";
import { useCalendarioContext } from "../../contexts/CalendarioContext";

const localizer = momentLocalizer(moment);

const culture = "es";
const lang = {
  es: {
    week: "Semana",
    work_week: "Semana de trabajo",
    day: "Día",
    month: "Mes",
    previous: "Atrás",
    next: "Después",
    today: "Hoy",
    agenda: "Agenda",

    showMore: (total) => `+${total} más`,
  },
};

const CalendarioProximos = ({ id, setBtnBuscar }) => {
  const { calendarioProximo, isLoading } = useSelector(
    (state) => state.calendarioProximo
  );
  const dispatch = useDispatch();
  const classes = useStyles();

  const { messages } = useMemo(
    () => ({
      messages: lang[culture],
    }),
    []
  );
  const { contextCalendario } = useCalendarioContext();
  const { stepc, hini, hfin } = contextCalendario;

  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    setAllEvents([]);
    let event2 = [];
    if (calendarioProximo.length > 0) {
      calendarioProximo.map(
        (cal) =>
          (event2 = [
            ...event2,
            {
              title: cal.apellidos,
              start: new Date(cal.fecha),
              end: new Date(cal.fecha),
              idPac: cal.idPac,
              color: "black",
              colorEvento: "yellow",
              prox: cal.prox,
            },
          ])
      );
      setAllEvents(event2);
    }
  }, [calendarioProximo]);

  //if (!calendarioProximo.length && !isLoading) return "No hay Próximas Atenciones";

  const handleSelectSlot = async (fecha) => {
    if (fecha.getHours() === 0) return null;
    const respuesta = await swal({
      title: "Próxima Atención",
      text: `Asignar a ${moment(fecha).format("DD-MM-YY h:mm a")}?`,
      icon: "warning",
      buttons: ["No", "Si"],
    });
    if (respuesta) {
      await dispatch(proximaAtencionPaciente(fecha, id));
      await dispatch(getCalendarioProximo());
      setBtnBuscar(false);
    }
  };

  return isLoading ? (
    <CircularProgress />
  ) : (
    <Grid
      className={classes.container}
      container
      alignItems="stretch"
      spacing={3}
    >
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        timeslots={1}
        step={stepc}
        min={
          !hini
            ? new Date(1968, 5, 2, 0, 0, 0)
            : new Date(1968, 5, 2, hini, 0, 0)
        }
        max={
          !hfin || hfin === "24"
            ? new Date(1968, 5, 2, 23, 59, 59)
            : new Date(1968, 5, 2, hfin, 0, 0)
        }
        onSelectSlot={(slotInfo) => {
          console.log(slotInfo.start.getHours());
          console.log(slotInfo.start);
          handleSelectSlot(slotInfo.start);
        }}
        selectable
        popup={true}
        messages={messages}
        culture={culture}
        style={{ height: 500, margin: "50px" }}
        BackgroundWrapper="grey"
        eventPropGetter={(allEvents) => {
          const backgroundColor = allEvents.prox ? allEvents.colorEvento : [];
          const color = allEvents.prox ? allEvents.color : [];
          return { style: { backgroundColor, color } };
        }}
      />
    </Grid>
  );
};

export default CalendarioProximos;
