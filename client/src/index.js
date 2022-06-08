import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { VolverContextProvider } from "./contexts/volverContext";
import { reducers } from './reducers';
import App from './App';
import './index.css';

const store = createStore(reducers, {}, compose(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <VolverContextProvider>
      <App />
    </VolverContextProvider>
  </Provider>,
  document.getElementById('root'),
);
