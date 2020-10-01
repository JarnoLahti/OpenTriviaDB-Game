import React from 'react';
import { ThemeProvider } from 'styled-components';

const theme = {
  APP_BLACK: '#1D2021',
  APP_WHITE: '#F9F5D7',
  BACKGROUND: '#3C3836',
  BACKGROUND_LIGHT: '#665C54',
  FOREGROUND: '#EBDBB2',
  FOREGROUND_LIGHT: '#FBF1C7',
  GREEN: '#B8BB26',
  GREEN_DARK: '#98971A',
  RED: '#FB4934',
  RED_DARK: '#CC241D',
  YELLOW: '#FABD2F',
  YELLOW_DARK: '#D79921',
  BLUE: '#83A598',
  BLUE_DARK: '#458588',
  ORANGE: '#FE8019',
  ORANGE_DARK: '#D65D0E',
};

const AppTheme = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default AppTheme;
