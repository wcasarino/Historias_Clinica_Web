import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination, PaginationItem, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { getPacientesBySearch } from "../actions/pacientes";
import useStyles from "./styles";
import { useVolverContext } from "../contexts/volverContext";

const Paginate = () => {
  const { numberOfPages, documentos } = useSelector((state) => state.pacientes);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  const classes = useStyles();
  const { contextVolver } = useVolverContext();

  const { vista, searchQuery, page, tags, anomesStr, fechaAte1 } =
    contextVolver;

  const search = searchQuery ? searchQuery : "";

  useEffect(() => {
    if (page) {
      dispatch(
        getPacientesBySearch({
          search,
          tags: tags.join(","),
          page,
          vista,
          fechaAte1,
          anomesStr,
        })
      );
    }
  }, [dispatch, search, tags, vista, fechaAte1, anomesStr, page]);

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
            }&vista=${vista}&fechaAte1=${fechaAte1}&anomesStr=${anomesStr}`}
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
