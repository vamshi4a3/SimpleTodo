import React, { useCallback, useEffect, useReducer, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TodoItem from '../components/TodoItem';
import { loadTodos, saveTodos } from '../storage';
import { makeId, todoReducer } from '../todoReducer';
import { colors } from '../theme';
import { Todo } from '../types';

export default function TodoScreen() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadTodos().then(saved => {
      dispatch({ type: 'LOAD', todos: saved });
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      saveTodos(todos);
    }
  }, [todos, loaded]);

  const submit = useCallback(() => {
    if (!text.trim()) {
      return;
    }
    if (editingId) {
      dispatch({ type: 'EDIT', id: editingId, title: text });
      setEditingId(null);
    } else {
      dispatch({ type: 'ADD', id: makeId(), title: text, now: Date.now() });
    }
    setText('');
  }, [text, editingId]);

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setText(todo.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setText('');
  };

  const confirmDelete = (todo: Todo) => {
    Alert.alert('Delete task', `Delete "${todo.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch({ type: 'DELETE', id: todo.id });
          if (editingId === todo.id) {
            cancelEdit();
          }
        },
      },
    ]);
  };

  const remaining = todos.filter(t => !t.completed).length;
  const hasCompleted = todos.some(t => t.completed);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>My Tasks</Text>
          <Text style={styles.sub} testID="remaining-count">
            {remaining} remaining
          </Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            testID="todo-input"
            style={styles.input}
            placeholder={editingId ? 'Edit task…' : 'Add a new task…'}
            placeholderTextColor={colors.muted}
            value={text}
            onChangeText={setText}
            onSubmitEditing={submit}
            returnKeyType="done"
            maxLength={200}
          />
          <Pressable testID="submit-button" style={styles.btn} onPress={submit}>
            <Text style={styles.btnText}>{editingId ? 'Save' : 'Add'}</Text>
          </Pressable>
        </View>
        {editingId && (
          <Pressable testID="cancel-edit" onPress={cancelEdit}>
            <Text style={styles.cancel}>Cancel editing</Text>
          </Pressable>
        )}

        <FlatList
          data={todos}
          keyExtractor={t => t.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              onToggle={id => dispatch({ type: 'TOGGLE', id })}
              onEdit={startEdit}
              onDelete={confirmDelete}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty} testID="empty-text">
              No tasks yet. Add your first one above!
            </Text>
          }
        />

        {hasCompleted && (
          <Pressable
            testID="clear-completed"
            style={styles.clear}
            onPress={() => dispatch({ type: 'CLEAR_COMPLETED' })}
          >
            <Text style={styles.clearText}>Clear completed</Text>
          </Pressable>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: { padding: 20, paddingBottom: 8 },
  heading: { fontSize: 30, fontWeight: '800', color: colors.primaryDark },
  sub: { fontSize: 14, color: colors.muted, marginTop: 2 },
  inputRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 8 },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.text,
    height: 48,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    marginLeft: 10,
    justifyContent: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancel: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  list: { padding: 20 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40 },
  clear: { alignItems: 'center', padding: 14 },
  clearText: { color: colors.danger, fontWeight: '700' },
});
