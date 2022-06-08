/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination, PaginationItem, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { getPacientes } from "../actions/pacientes";
import useStyles from "./styles";
import { useVolverContext } from "../contexts/volverContext";

const Paginate = () => {
  const { numberOfPages, documentos } = useSelector((state) => state.pacientes);
  const dispatch = useDispatch();

  const classes = useStyles();
  const { contextVolver } = useVolverContext();
  const { page } = contextVolver;

  useEffect(() => {
    if (page) {
      dispatch(getPacientes(page));
    }
  }, [dispatch, page]);

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
            to={`/pacientes?page=${item.page}`}
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
