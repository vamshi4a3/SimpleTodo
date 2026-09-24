import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Todo } from '../types';
import { colors } from '../theme';

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
};

export default function TodoItem({ todo, onToggle, onEdit, onDelete }: Props) {
  return (
    <View style={styles.row} testID={`todo-item-${todo.id}`}>
      <Pressable
        testID={`toggle-${todo.id}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.completed }}
        onPress={() => onToggle(todo.id)}
        style={[styles.box, todo.completed && styles.boxDone]}
      >
        {todo.completed && <Text style={styles.tick}>✓</Text>}
      </Pressable>
      <Text style={[styles.title, todo.completed && styles.titleDone]}>
        {todo.title}
      </Text>
      <Pressable
        testID={`edit-${todo.id}`}
        accessibilityLabel={`Edit ${todo.title}`}
        onPress={() => onEdit(todo)}
        style={styles.action}
      >
        <Text style={styles.edit}>Edit</Text>
      </Pressable>
      <Pressable
        testID={`delete-${todo.id}`}
        accessibilityLabel={`Delete ${todo.title}`}
        onPress={() => onDelete(todo)}
        style={styles.action}
      >
        <Text style={[styles.delete, { color: 'red' }]}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  box: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  boxDone: { backgroundColor: colors.primary },
  tick: { color: '#fff', fontWeight: '900' },
  title: { flex: 1, fontSize: 16, color: colors.text },
  titleDone: { textDecorationLine: 'line-through', color: colors.muted },
  action: { paddingHorizontal: 8, paddingVertical: 6 },
  edit: { color: colors.primary, fontWeight: '600' },
  delete: { color: colors.danger, fontWeight: '600' },
});
