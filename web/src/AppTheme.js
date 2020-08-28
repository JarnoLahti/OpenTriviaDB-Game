import React from 'react';
import { ThemeProvider } from 'styled-components';

const theme = {
  BACKGROUND: '#3C3836',
  FOREGROUND: '#EBDBB2',
  GREEN: '#B8BB26',
  GREEN_DARK: '#98971A',
  RED: '#FB4934',
  RED_DARK: '#CC241D',
  YELLOW: '#FABD2F',
  YELLOW_DARK: '#D79921',
  BLUE: '#83A598',
  BLUE_DARK: '#83A598',
  ORANGE: '#FE8019',
  ORANGE_DARK: '#D65D0E',
};

const AppTheme = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default AppTheme;
