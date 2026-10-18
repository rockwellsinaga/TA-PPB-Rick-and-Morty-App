import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fonts } from '../theme';
import { selectionFeedback } from '../utils/feedback';

export function FilterChip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={() => {
        selectionFeedback();
        onPress();
      }}
      style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function FilterChips({ label, options, value, onChange }) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chipRow}>
          {options.map((option) => (
            <FilterChip
              key={option.value}
              label={option.label}
              onPress={() => onChange(option.value)}
              selected={value === option.value}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export function FilterField({ label, value, onChangeText, placeholder }) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 14,
  },
  label: {
    color: colors.muted,
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    letterSpacing: 1.1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: colors.portal,
    borderColor: colors.portal,
  },
  chipText: {
    color: colors.text,
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
  },
  chipTextSelected: {
    color: colors.ink,
  },
  input: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontFamily: fonts.body,
    minHeight: 46,
    paddingHorizontal: 14,
  },
  pressed: {
    opacity: 0.76,
  },
});
