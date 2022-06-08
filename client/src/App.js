import React from 'react';
import { Container } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import es from 'date-fns/locale/es'

import PacienteDetails from './components/PacienteDetails/PacienteDetails';
import Navbar from './components/Navbar/Navbar';
//import Home from './components/Home/Home';
import HomeAte from './components/Home/HomeAte'
import Auth from './components/Auth/Auth';
import HomePac from './components/Home/HomePac';

const theme = createTheme();

const App = () => {
  const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={es} >
        <BrowserRouter>
          <Container maxWidth="xxl">
            <Navbar />
            <Routes>
              {!user
                ?
                <>
                  <Route path="/" element={<Auth />} />
                  <Route path="/auth" element={<Auth />} />
                </>
                :
                <><Route path="/" element={<HomePac />} />
                  <Route path="/auth" element={<HomePac />} /></>
              }
              <Route path="/" element={(!user ? <Auth /> : <Navigate to="/pacientes" replace={true} />)} />
              <Route path="/pacientes" element={<HomePac />} />
              <Route path="/pacientes/search" element={<HomePac />} />
              <Route path="/atenciones" element={<HomeAte />} />
              <Route path="/atenciones/search" element={<HomeAte />} />
              <Route path="/pacientes/:id" element={<PacienteDetails />} />
            </Routes>
          </Container>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
