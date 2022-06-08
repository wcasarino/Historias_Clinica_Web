import { createContext, useState, useContext } from "react";

const fechaAteStrInicial = () => {
  const nuevaFecha = new Date();
  let anoAte = parseInt(nuevaFecha.getFullYear());
  let mesAte = parseInt(nuevaFecha.getMonth()) + 1;
  let diaAte = parseInt(nuevaFecha.getDate());
  diaAte = ("0" + diaAte).slice(-2);
  mesAte = ("0" + mesAte).slice(-2);
  return `${anoAte}${mesAte}${diaAte}`;
};

export const VolverContext = createContext();

export function VolverContextProvider(props) {
  const [contextVolver, setContextVolver] = useState({
    vista: "todos",
    menu: "1", //"1" pacientes, "2" atenciones
    page: "1",
    searchQuery: "",
    tags: [],
    solo: true,
    anomesStr: null,
    fechaAte1: fechaAteStrInicial(),
  });
  const value = { contextVolver, setContextVolver };
  return (
    <VolverContext.Provider value={value}>
      {props.children}
    </VolverContext.Provider>
  );
}

export function useVolverContext() {
  const context = useContext(VolverContext);
  if (!context) {
    throw new Error(
      "useVolverContext debe ser usado dentro de un VolverContextProvider"
    );
  }
  return context;
}
