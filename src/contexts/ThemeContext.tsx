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
  bg: '#FFEBF0',
  card: '#FFF0F1',
  text: '#3E3742',
  subtext: '#6F6676',
  input: '#FFF0F2',
  border: '#E8DADF',
  primary: '#8C6C77',
  primaryText: '#FFEBF0',
  danger: '#C62828',
  chipBg: '#EEDDE3',
  chipFg: '#3E3742',
  chipActiveBg: '#8C6C77',
  chipActiveFg: '#FFEBF0',
};

const DARK: Colors = {
  bg: '#1B171B',
  card: '#2C2729',
  text: '#F8E9EB',
  subtext: '#DCCBCF',
  input: '#433E40',
  border: '#5B5556',
  primary: '#ADA0A3',
  primaryText: '#1B171B',
  danger: '#E57373',
  chipBg: '#433E40',
  chipFg: '#F8E9EB',
  chipActiveBg: '#ADA0A3',
  chipActiveFg: '#1B171B',
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
