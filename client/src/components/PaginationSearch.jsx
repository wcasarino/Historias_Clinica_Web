import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination, PaginationItem, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { getPacientesBySearch } from "../actions/pacientes";
import useStyles from "./styles";
import { useVolverContext } from "../contexts/volverContext";

const Paginate = ({ page }) => {
  const { numberOfPages, documentos } = useSelector((state) => state.pacientes);
  const dispatch = useDispatch();

  const classes = useStyles();
  const { contextVolver, setContextVolver } = useVolverContext();

  const {
    vista,
    searchQuery,
    tags,
    anomesStr,
    fechaAte1,
    volver,
    diagnosticos,
    practicas,
  } = contextVolver;

  const search = searchQuery ? searchQuery : "";
  const user = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    if (page) {
      if (!volver) {
        dispatch(
          getPacientesBySearch({
            search,
            tags: tags.join(","),
            page:
              numberOfPages > page
                ? page > 0
                  ? page
                  : 1
                : numberOfPages > 0
                ? numberOfPages
                : 1,
            vista,
            fechaAte1,
            anomesStr,
            diagnosticos,
            practicas,
          })
        );
      }
      setContextVolver({
        ...contextVolver,
        page:
          numberOfPages > page
            ? page > 0
              ? page
              : 1
            : numberOfPages > 0
            ? numberOfPages
            : 1,
        volver: false,
      });
    }
  }, [
    search,
    tags,
    vista,
    fechaAte1,
    anomesStr,
    page,
    diagnosticos,
    practicas,
  ]);

  return (
    <>
      <Pagination
        classes={{ ul: classes.ul }}
        count={numberOfPages}
        page={Number(page) || 1}
        variant="outlined"
        color="primary"
        renderItem={(item) => (
          <PaginationItem
            {...item}
            component={Link}
            to={`/pacientes/search?searchQuery=${
              search || "9a69dc7e834f617"
            }&tags=${tags.join(",")}&page=${
              item.page
            }&vista=${vista}&fechaAte1=${fechaAte1}&anomesStr=${anomesStr}&diagnosticos=${diagnosticos.join(
              ","
            )}&practicas=${practicas.join(",")}`}
          />
        )}
      />
      <Typography variant="body2" style={{ textAlign: "center" }}>
        Total de Pacientes: {documentos}
      </Typography>
    </>
  );
};

export default Paginate;
