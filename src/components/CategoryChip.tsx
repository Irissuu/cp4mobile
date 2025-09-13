import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { CATEGORIES, Category, CAT_LABELS } from './Categories';
import { useTheme } from '../contexts/ThemeContext';

type ChipsValue = Category | 'todos';

export default function CategoryChips({
  value,
  onChange,
  includeAll = false,
  variant = 'form',
  disabled = false,
  containerStyle,
}: {
  value: ChipsValue;
  onChange: (next: ChipsValue) => void;
  includeAll?: boolean;
  variant?: 'form' | 'filter';
  disabled?: boolean;
  containerStyle?: ViewStyle;
}) {
  const { colors } = useTheme();

  const items: ChipsValue[] = includeAll ? (['todos', ...CATEGORIES] as ChipsValue[]) : (CATEGORIES as ChipsValue[]);

  const chipBg = colors.chipBg ?? '#4b3a42';
  const chipFg = colors.chipFg ?? '#f1e5dd';
  const chipActiveBg = colors.chipActiveBg ?? '#cfb6a8';
  const chipActiveFg = colors.chipActiveFg ?? '#2a2430';

  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, containerStyle]}>
      {items.map((it) => {
        const selected = value === it;
        const label = it === 'todos' ? 'Todos' : CAT_LABELS[it];
        return (
          <TouchableOpacity
            key={it}
            disabled={disabled}
            onPress={() => onChange(it)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: variant === 'filter' ? 6 : 8,
              borderRadius: 999,
              opacity: disabled ? 0.6 : 1,
              backgroundColor: selected ? chipActiveBg : chipBg,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ color: selected ? chipActiveFg : chipFg, fontWeight: '700' }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
