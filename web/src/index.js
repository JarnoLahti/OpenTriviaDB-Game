import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AppGlobalStyle from './AppGlobalStyle'

ReactDOM.render(
  <React.StrictMode>
    <AppGlobalStyle/>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
