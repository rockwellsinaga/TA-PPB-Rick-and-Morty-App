import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { shareResource } from '../utils/share';
import { selectionFeedback } from '../utils/feedback';
import { colors, fonts } from '../theme';

export default function ShareButton({ resourceType, item }) {
  const handlePress = () => {
    selectionFeedback();
    shareResource(resourceType, item).catch(() => {});
  };

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Ionicons color={colors.cyan} name="share-social-outline" size={18} />
      <Text style={styles.label}>Share</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', borderColor: colors.cyan, borderRadius: 999, borderWidth: 1, flexDirection: 'row', gap: 7, marginTop: 16, paddingHorizontal: 16, paddingVertical: 10 },
  label: { color: colors.cyan, fontFamily: fonts.bodyBold },
  pressed: { opacity: 0.72 },
});
