import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/lang';

type Mode = 'date' | 'time' | 'datetime';

type Props = {
  value: Date | null;
  onChange: (d: Date | null) => void;
  mode?: Mode;
  label?: string;
};

export default function DateField({ value, onChange, mode = 'date', label }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'date' | 'time'>('date');

  const placeholder = t('task.addDate'); // << i18n
  const displayText = value
    ? `${value.toLocaleDateString()}${mode !== 'date' ? ' ' + value.toLocaleTimeString().slice(0, 5) : ''}`
    : placeholder;

  function handleAndroidChange(e: DateTimePickerEvent, d?: Date) {
    if (e.type === 'dismissed') { setOpen(false); setStep('date'); return; }
    const picked = d ?? value ?? new Date();

    if (mode === 'datetime') {
      if (step === 'date') {
        const base = value ?? new Date();
        const merged = new Date(
          picked.getFullYear(), picked.getMonth(), picked.getDate(),
          base.getHours(), base.getMinutes()
        );
        onChange(merged);
        setStep('time');
      } else {
        const base = value ?? new Date();
        const merged = new Date(
          base.getFullYear(), base.getMonth(), base.getDate(),
          picked.getHours(), picked.getMinutes()
        );
        onChange(merged);
        setOpen(false);
        setStep('date');
      }
    } else {
      onChange(picked);
      setOpen(false);
      setStep('date');
    }
  }

  const labelText = label ?? placeholder;

  return (
    <View>
      {!!labelText && (
        <Text style={{ color: colors.text, marginBottom: 6 }}>
          {labelText}
        </Text>
      )}

      <TouchableOpacity
        key={i18n.language}                
        onPress={() => setOpen(true)}
        accessibilityLabel={placeholder}
        style={{
          backgroundColor: colors.input,
          borderRadius: 10,
          padding: 12,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text style={{ color: value ? colors.text : colors.subtext }}>
          {displayText}
        </Text>
      </TouchableOpacity>

      {open && Platform.OS === 'android' && (
        <DateTimePicker
          key={`picker-${i18n.language}-${step}`} // idem
          value={value ?? new Date()}
          mode={mode === 'datetime' ? (step === 'date' ? 'date' : 'time') : mode}
          display="default"
          onChange={handleAndroidChange}
        />
      )}

      {Platform.OS === 'ios' && open && (
        <View style={{
          backgroundColor: colors.card, padding: 12, borderRadius: 10, marginTop: 8,
          borderWidth: 1, borderColor: colors.border,
        }}>
          <DateTimePicker
            key={`picker-ios-${i18n.language}-${step}`}
            value={value ?? new Date()}
            mode={mode === 'datetime' ? (step === 'date' ? 'date' : 'time') : mode}
            display="inline"
            onChange={handleAndroidChange}
          />
        </View>
      )}
    </View>
  );
}
