import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import { VolverContextProvider } from "./contexts/volverContext";
import { CalendarioContextProvider } from "./contexts/CalendarioContext";
import { reducers } from "./reducers";
import App from "./App";
import "./index.css";

const store = createStore(reducers, {}, compose(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <VolverContextProvider>
      <CalendarioContextProvider>
        <App />
      </CalendarioContextProvider>
    </VolverContextProvider>
  </Provider>,
  document.getElementById("root")
);
