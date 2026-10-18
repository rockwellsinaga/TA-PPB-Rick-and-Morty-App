import { useEffect, useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import AmbientBackground from '../components/AmbientBackground';
import { LoadingState, MessageState } from '../components/ScreenState';
import { colors, fonts } from '../theme';

const PROFILE_URL = 'https://api.github.com/users/rockwellsinaga';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const loadProfile = async () => {
    setError(null);
    try {
      const response = await fetch(PROFILE_URL);
      if (!response.ok) {
        throw new Error(`GitHub request failed (${response.status})`);
      }
      setProfile(await response.json());
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (!profile && !error) {
    return (
      <View style={styles.screen}>
        <AmbientBackground />
        <LoadingState label="Loading developer profile..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.screen}>
        <AmbientBackground />
        <MessageState
          actionLabel="Try again"
          message={error}
          onAction={loadProfile}
          title="Unable to load profile"
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
      <Text style={styles.name}>{profile.name || profile.login}</Text>
      <Text style={styles.username}>@{profile.login}</Text>
      {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
      <Pressable
        onPress={() => Linking.openURL(profile.html_url)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Open GitHub profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  avatar: {
    borderColor: colors.portal,
    borderRadius: 90,
    borderWidth: 3,
    height: 180,
    width: 180,
  },
  name: {
    color: colors.text,
    fontFamily: fonts.displayHeavy,
    fontSize: 26,
    marginTop: 20,
  },
  username: {
    color: colors.cyan,
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    marginTop: 4,
  },
  bio: {
    color: colors.muted,
    fontFamily: fonts.body,
    lineHeight: 22,
    marginTop: 14,
    maxWidth: 420,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.portal,
    borderRadius: 12,
    marginTop: 22,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  buttonText: {
    color: colors.background,
    fontFamily: fonts.bodyBold,
  },
});
