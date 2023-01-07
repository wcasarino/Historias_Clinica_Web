import { createContext, useState, useContext } from "react";

export const CalendarioContext = createContext();

export function CalendarioContextProvider(props) {
  const [contextCalendario, setContextCalendario] = useState({
    hini: "07",
    hfin: "20", 
    stepc: "15",
  });
  const value = { contextCalendario, setContextCalendario };
  return (
    <CalendarioContext.Provider value={value}>
      {props.children}
    </CalendarioContext.Provider>
  );
}

export function useCalendarioContext() {
  const context = useContext(CalendarioContext);
  if (!context) {
    throw new Error(
      "useCalendarioContext debe ser usado dentro de un CalendarioContextProvider"
    );
  }
  return context;
}
