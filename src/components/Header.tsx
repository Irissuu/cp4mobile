import React from 'react';
import { View } from 'react-native';
import BotaoTema from './BotaoTema';
import BotaoIdioma from './BotaoIdioma';

export default function HeaderActions({ top = 10 }: { top?: number }) {

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        right: 16,
        top,
        zIndex: 100,      
        elevation: 100,
        flexDirection: 'row',
        gap: 8,
      }}
    >

      <BotaoIdioma style={{ position: 'relative', right: 0, top: 0 }} />
      <BotaoTema   style={{ position: 'relative', right: 0, top: 0 }} />
    </View>
  );
}
