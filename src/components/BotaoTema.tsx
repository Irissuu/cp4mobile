import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

type Props = { style?: StyleProp<ViewStyle> };

export default function BotaoTema({ style }: Props) {
  const { mode, toggle, colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggle}
      activeOpacity={0.8}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[
        styles.btn,
        { backgroundColor: colors.primary, borderColor: colors.border },
        style,
      ]}
    >
      <Ionicons
        name={mode === 'dark' ? 'sunny' : 'moon'}
        size={18}
        color={colors.primaryText}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    zIndex: 101,
  },
});
