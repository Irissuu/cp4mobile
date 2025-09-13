import React, { useCallback, useState } from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import i18n, { changeLanguage } from '../i18n/lang';

type Props = { style?: ViewStyle };

export default function BotaoIdioma({ style }: Props) {
  const { colors } = useTheme();

  const initial = (i18n.language || i18n.resolvedLanguage || 'pt').toLowerCase();
  const [lng, setLng] = useState<'pt' | 'en'>(initial.startsWith('en') ? 'en' : 'pt');

  const toggle = useCallback(async () => {
    const next: 'pt' | 'en' = lng === 'pt' ? 'en' : 'pt';
    await changeLanguage(next);  
    setLng(next);
  }, [lng]);

  return (
    <TouchableOpacity
      onPress={toggle}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[
        {
          backgroundColor: colors.card,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.border,
          zIndex: 101,
        },
        style,
      ]}
    >
      <Text style={{ color: colors.text, fontWeight: '800' }}>
        {lng === 'pt' ? 'PT' : 'EN'}
      </Text>
    </TouchableOpacity>
  );
}
