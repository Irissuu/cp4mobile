import React from 'react';
import { ScrollView, TouchableOpacity, Text, ViewStyle } from 'react-native';

export default function CategoriesBar<T extends string>({
  options,
  value,
  onChange,
  bg = '#EEE',
  fg = '#222',
  activeBg = '#222',
  activeFg = '#FFF',
  style,
  labels,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  bg?: string; fg?: string; activeBg?: string; activeFg?: string;
  style?: ViewStyle;
  labels?: string[]; 
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[{}, style]}
      contentContainerStyle={{ gap: 8 }}
    >
      {options.map((opt, i) => {
        const active = value === opt;
        const label = labels?.[i] ?? (String(opt[0]).toUpperCase() + String(opt).slice(1));
        return (
          <TouchableOpacity
            key={String(opt)}
            onPress={() => onChange(opt)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: active ? activeBg : bg,
            }}
          >
            <Text style={{ color: active ? activeFg : fg, fontWeight: '700' }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
