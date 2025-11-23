import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext({ dark: false, toggle: () => {}, colors: {} });

const light = {
  background: '#f7f8fb',
  card: '#ffffff',
  text: '#1f2937',
  muted: '#6b7280',
  primary: '#0ea5a4',
  accent: '#f97316',
  border: '#e6e9ef',
};

const darkTheme = {
  background: '#0b1220',
  card: '#0f1724',
  text: '#e6eef6',
  muted: '#9aa4b2',
  primary: '#2dd4bf',
  accent: '#fb923c',
  border: '#172033',
};

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('@sv_theme').then((v) => { if (v) setDark(v === '1'); }).catch(() => {});
  }, []);

  useEffect(() => { AsyncStorage.setItem('@sv_theme', dark ? '1' : '0'); }, [dark]);

  const toggle = () => setDark((d) => !d);

  const colors = useMemo(() => (dark ? darkTheme : light), [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
