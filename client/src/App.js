import React from "react";
import { Container } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import es from "date-fns/locale/es";
import { useDispatch } from "react-redux";

import PacienteDetails from "./components/PacienteDetails/PacienteDetails";
import Navbar from "./components/Navbar/Navbar";
import HomeAte from "./components/Home/HomeAte";
import Auth from "./components/Auth/Auth";
import HomePac from "./components/Home/HomePac";
import HomeCalendar from "./components/Home/HomeCalendar";

import { getAnoAtenciones } from "./actions/atenciones";

const theme = createTheme();

const App = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const dispatch = useDispatch();
  dispatch(getAnoAtenciones());

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
        <BrowserRouter>
          <Container maxWidth="xxl">
            <Navbar />
            <Routes>
              <Route path="/" element={!user ? <Auth /> : <HomePac />} />
              <Route path="/auth" element={!user ? <Auth /> : <HomePac />} />
              <Route path="/pacientes" element={<HomePac />} />
              <Route path="/pacientes/search" element={<HomePac />} />
              <Route path="/atenciones" element={<HomeAte />} />
              <Route path="/atenciones/search" element={<HomeAte />} />
              <Route path="/calendario" element={<HomeCalendar />} />
              <Route path="/calendario/search" element={<HomeCalendar />} />
              <Route path="/pacientes/:id" element={<PacienteDetails />} />
              <Route
                path="/pacientes/:id/:ateId"
                element={<PacienteDetails />}
              />
            </Routes>
          </Container>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
