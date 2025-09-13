import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Task } from '../services/TasksService';

export default function Edit({
  visible,
  task,
  onClose,
  onSave,
}: {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (patch: { title: string; note: string }) => void | Promise<void>;
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    setTitle(task?.title ?? '');
    setNote((task as any)?.note ?? '');
  }, [task, visible]);

  function handleSave() {
    const tt = title.trim();
    if (!tt) {
      Alert.alert(t('edit.errorEmptyTitle'));
      return;
    }
    const p = Promise.resolve(onSave({ title: tt, note }));
    onClose();
    p.catch((e) => Alert.alert(t('edit.errorOnSave'), e?.message ?? String(e)));
  }

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 }}>
       
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={StyleSheet.absoluteFillObject} />
        <View style={{ backgroundColor: '#f1e5dd', borderRadius: 14, padding: 16, gap: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: '700' }}>{t('edit.title')}</Text>

          <TextInput
            placeholder={t('edit.titlePlaceholder')}
            value={title}
            onChangeText={setTitle}
            onSubmitEditing={handleSave}
            returnKeyType="done"
            style={{ backgroundColor: '#f1e5dd', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#ADA0A3' }}
          />
          <TextInput
            placeholder={t('edit.descPlaceholder')}
            value={note}
            onChangeText={setNote}
            style={{ backgroundColor: '#f1e5dd', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#ADA0A3' }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
            <TouchableOpacity onPress={onClose} style={{ paddingVertical: 10, paddingHorizontal: 16 }}>
              <Text>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={{ backgroundColor: '#664E57', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 }}
            >
              <Text style={{ color: '#f1e5dd', fontWeight: '700' }}>{t('edit.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
