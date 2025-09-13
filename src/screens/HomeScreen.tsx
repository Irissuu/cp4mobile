import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import BotaoTema from '../components/BotaoTema';
import BotaoIdioma from '../components/BotaoIdioma';
import DateField from '../components/DateField';
import TaskCard from '../components/TaskCard';
import CategoriesBar from '../components/CategoriesBar';
import EditTaskModal from '../components/Edit';
import { addTask, listenUserTasks, removeTask, toggleTaskDone, updateTask, Task } from '../services/TasksService';

const CATS = ['trabalhos', 'projetos', 'pessoal', 'estudos', 'consultas', 'tarefas'] as const;
type Cat = typeof CATS[number];
const FILTERS = ['todos', ...CATS] as const;
type Filter = typeof FILTERS[number];

export default function HomeScreen() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('todos');

  const [formKey, setFormKey] = useState(0);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [cat, setCat] = useState<Cat>('trabalhos');
  const [projectDate, setProjectDate] = useState<Date | null>(null);

  const [editing, setEditing] = useState<Task | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    return listenUserTasks(user.uid, setTasks);
  }, [user?.uid]);

  const filtered = useMemo(
    () => (filter === 'todos' ? tasks : tasks.filter(tk => (tk as any).category === filter)),
    [tasks, filter]
  );

  async function handleAdd() {
    const tt = title.trim();
    if (!tt) return Alert.alert(t('home.validateTitle'));
    if (!projectDate) return Alert.alert(t('home.validateDate'));

    await addTask(user!.uid, { title: tt, note, dueAt: projectDate, category: cat } as any);

    setTitle(''); setNote(''); setProjectDate(null);
    setFormKey(k => k + 1);
    Keyboard.dismiss();
  }

  function handleDelete(task: Task) {
    Alert.alert(t('common.delete'), t('home.removeConfirm', { title: task.title }), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: () => removeTask(task.id) },
    ]);
  }

  function onSaveEdit(patch: { title: string; note: string }) {
    if (!editing) return;
    return updateTask(editing.id, { title: patch.title, note: patch.note } as any);
  }

  const catLabels = CATS.map(k => t(`cats.${k}`));
  const filterLabels = FILTERS.map(k => t(`cats.${k}`));

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View
        pointerEvents="box-none"
        style={{ position: 'absolute', right: 16, top: 24, zIndex: 200, flexDirection: 'row', gap: 8 }}
      >
        <BotaoIdioma />
        <BotaoTema />
      </View>

      <View style={{ padding: 16, paddingBottom: 6 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>
          {t('home.hello', { name: user?.displayName ?? user?.email ?? 'Ana' })}
        </Text>
      </View>

      <View style={{ height: 48 }} />

      <View
        key={formKey}
        style={{
          backgroundColor: colors.card,
          marginHorizontal: 16,
          padding: 12,
          borderRadius: 14,
          gap: 8,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <TextInput
          key={`title-${formKey}`}
          placeholder={t('home.titlePlaceholder')}
          placeholderTextColor={colors.subtext}
          value={title}
          onChangeText={setTitle}
          style={{
            backgroundColor: colors.input,
            color: colors.text,
            borderRadius: 10,
            padding: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />

        <TextInput
          key={`note-${formKey}`}
          placeholder={t('home.descPlaceholder')}
          placeholderTextColor={colors.subtext}
          value={note}
          onChangeText={setNote}
          style={{
            backgroundColor: colors.input,
            color: colors.text,
            borderRadius: 10,
            padding: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />

        <CategoriesBar
          options={CATS}
          value={cat}
          onChange={setCat}
          bg={colors.chipBg}
          fg={colors.chipFg}
          activeBg={colors.chipActiveBg}
          activeFg={colors.chipActiveFg}
          labels={catLabels}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <DateField
              key={`date-${formKey}`}
              value={projectDate}
              onChange={setProjectDate}
              mode="datetime"
              label={t('home.dateLabel')}
            />
          </View>

          <TouchableOpacity
            onPress={handleAdd}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 18,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: colors.primaryText, fontWeight: '800' }}>
              {t('common.add')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <CategoriesBar
          options={FILTERS}
          value={filter}
          onChange={setFilter}
          bg={colors.chipBg}
          fg={colors.chipFg}
          activeBg={colors.chipActiveBg}
          activeFg={colors.chipActiveFg}
          labels={filterLabels}
        />
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={v => toggleTaskDone(item, v)}
            onEdit={() => setEditing(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: colors.subtext, marginTop: 24 }}>
            {t('home.noTasks')}
          </Text>
        }
      />

      <View style={{ padding: 16 }}>
        <TouchableOpacity
          onPress={logout}
          style={{
            backgroundColor: colors.danger,
            padding: 14,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.primaryText, fontWeight: '800' }}>
            {t('home.logout')}
          </Text>
        </TouchableOpacity>
      </View>

      <EditTaskModal
        visible={!!editing}
        task={editing}
        onSave={onSaveEdit}
        onClose={() => setEditing(null)}
      />
    </KeyboardAvoidingView>
  );
}
