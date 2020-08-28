import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AppGlobalStyle from './AppGlobalStyle';
import AppTheme from './AppTheme';

ReactDOM.render(
  <React.StrictMode>
    <AppTheme>
      <AppGlobalStyle />
      <App />
    </AppTheme>
  </React.StrictMode>,
  document.getElementById('root')
);
