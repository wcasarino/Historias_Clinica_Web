import moment from "moment";

export const proxima = (pFecha) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (pFecha) {
    if (moment(pFecha) > moment(today)) {
      return moment(pFecha).format("DD/MM/YY");
    }
    return "Vencida";
  } else {
    return null;
  }
};

export const sortByFecha = (arreglo) => {
  arreglo.sort(function (a, b) {
    if (a.fecha > b.fecha) {
      return -1;
    }
    if (a.fecha < b.fecha) {
      return 1;
    }
    return 0;
  });
  return arreglo;
};
