import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import type { Task } from '../services/TasksService';
import { Timestamp } from 'firebase/firestore';
import { useTheme } from '../contexts/ThemeContext';
import { CAT_COLORS, CAT_LABELS } from './Categories';

export default function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: (v: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { colors } = useTheme();


  let due: Date | null = null;
  const raw = (task as any).dueAt;

  if (raw) {
    if (raw instanceof Timestamp) {
      due = raw.toDate();
    } else if (raw instanceof Date) {
      due = raw;
    } else if (typeof raw?.toDate === 'function') {
      due = raw.toDate();
    } else {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) due = d;
    }
  }

  const pillBg = CAT_COLORS[task.category];
  const pillFg =
    (() => {
      const r = parseInt(pillBg.slice(1, 3), 16);
      const g = parseInt(pillBg.slice(3, 5), 16);
      const b = parseInt(pillBg.slice(5, 7), 16);
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return luminance > 180 ? '#2A2430' : '#FFFFFF';
    })();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Switch value={task.done} onValueChange={onToggle} />

      <View style={{ flex: 1, opacity: task.done ? 0.55 : 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }} numberOfLines={1}>
            {task.title}
          </Text>

          <View
            style={{
              backgroundColor: pillBg,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 999,
            }}
          >
            <Text style={{ color: pillFg, fontSize: 12 }}>
              {CAT_LABELS[task.category]}
            </Text>
          </View>
        </View>

        {!!task.note && (
          <Text style={{ color: colors.subtext, marginTop: 4 }} numberOfLines={2}>
            {task.note}
          </Text>
        )}

        {due && (
          <Text style={{ marginTop: 6, fontSize: 12, color: colors.subtext }}>
            vence: {due.toLocaleDateString()} {due.toLocaleTimeString().slice(0, 5)}
          </Text>
        )}
      </View>

      <View style={{ gap: 6 }}>
        <TouchableOpacity
          onPress={onEdit}
          style={{
            backgroundColor: colors.input,
            padding: 8,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.text }}>✎</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDelete}
          style={{
            backgroundColor: '#FFEBEE',
            padding: 8,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#C62828' }}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
