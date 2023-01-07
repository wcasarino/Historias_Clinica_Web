import React, { useEffect, useState, useMemo } from "react";
import { Grid, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";

import useStyles from "./styles";
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

const CalendarioTodos = () => {
  const { calendario, isLoading } = useSelector((state) => state.calendario);
  const classes = useStyles();
  const navigate = useNavigate();

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
    if (calendario.length > 0) {
      calendario.map(
        (cal) =>
          (event2 = [
            ...event2,
            {
              title: cal.apellidos,
              start: new Date(cal.fecha),
              end: new Date(cal.fecha),
              idPac: cal.idPac,
              idAte: cal.idAte,
              color: "black",
              colorEvento: "yellow",
              prox: cal.prox,
            },
          ])
      );
      setAllEvents(event2);
    }
  }, [calendario]);

  if (!calendario.length && !isLoading) return "No hay atenciones";

  const openPaciente = (cal) => {
    //console.log(cal)
    navigate(`/pacientes/${cal.idPac}/${cal.idAte}`);
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
        onDoubleClickEvent={openPaciente}
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

export default CalendarioTodos;
