import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Mode = 'light' | 'dark';

export type Colors = {
  bg: string; card: string; text: string; subtext: string;
  input: string; border: string;
  primary: string; primaryText: string;
  danger: string;
  chipBg: string; chipFg: string; chipActiveBg: string; chipActiveFg: string;
};

const LIGHT: Colors = {
  bg: '#F8F0FF',
  card: '#F6F0FF',
  text: '#3B2F66',
  subtext: '#55428C',
  input: '#F7F0FF',
  border: '#DCC7FF',
  primary: '#C09EFF',
  primaryText: '#231F2C',
  danger: '#C62828',
  chipBg: '#F0E9F8',
  chipFg: '#3B2F66',
  chipActiveBg: '#997CD9',
  chipActiveFg: '#231F2C',
};

const DARK: Colors = {
  bg: '#231F2C',
  card: '#352E45',
  text: '#F0E9F8',
  subtext: '#C8B5E8',
  input: '#483D5B',
  border: '#61527E',
  primary: '#C09EFF',
  primaryText: '#231F2C',
  danger: '#E57373',
  chipBg: '#483D5B',
  chipFg: '#F0E9F8',
  chipActiveBg: '#A689DC',
  chipActiveFg: '#231F2C',
};


type Ctx = { mode: Mode; colors: Colors; toggle: () => void; set: (m: Mode) => void; };
const ThemeContext = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('light');

  useEffect(() => { AsyncStorage.getItem('@theme').then(v => { if (v === 'dark' || v === 'light') setMode(v as Mode); }); }, []);
  useEffect(() => { AsyncStorage.setItem('@theme', mode).catch(() => {}); }, [mode]);

  const colors = mode === 'light' ? LIGHT : DARK;
  const toggle = () => setMode(m => (m === 'light' ? 'dark' : 'light'));
  const value = useMemo(() => ({ mode, colors, toggle, set: setMode }), [mode, colors]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('ThemeProvider ausente');
  return ctx;
}
