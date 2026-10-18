import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors, fonts } from '../theme';

export default function SearchBar({ value, onChangeText, onSubmit, placeholder, disabled = false }) {
  return (
    <View style={styles.container}>
      <View style={styles.inputShell}>
        <Ionicons color={colors.muted} name="search" size={20} />
        <TextInput
          accessibilityLabel={placeholder}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!disabled}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          returnKeyType="search"
          style={styles.input}
          value={value}
        />
      </View>
      <Pressable
        accessibilityLabel="Search"
        accessibilityRole="button"
        disabled={disabled}
        onPress={onSubmit}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          disabled && styles.buttonDisabled,
        ]}
      >
        <Ionicons color={colors.ink} name="arrow-forward" size={22} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  inputShell: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    minHeight: 52,
    paddingLeft: 14,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.portal,
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
  },
  buttonPressed: {
    backgroundColor: colors.portalDark,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
