import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

import i18n, { ensureI18n } from './src/i18n/lang';
import { I18nextProvider } from 'react-i18next';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        await ensureI18n(); 
      } finally {
        if (!canceled) setReady(true);
      }
    })();
    return () => { canceled = true; };
  }, []);

  if (!ready) return <View />;

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}
