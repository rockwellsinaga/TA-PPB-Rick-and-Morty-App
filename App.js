import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
  useFonts,
} from '@expo-google-fonts/space-grotesk';
import {
  Orbitron_700Bold,
  Orbitron_800ExtraBold,
} from '@expo-google-fonts/orbitron';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { FavoritesProvider } from './src/context/FavoritesContext';
import AboutScreen from './src/pages/AboutScreen';
import CompareScreen from './src/pages/CompareScreen';
import DetailScreen from './src/pages/DetailScreen';
import DiscoverScreen from './src/pages/DiscoverScreen';
import EpisodeDetailScreen from './src/pages/EpisodeDetailScreen';
import EpisodeScreen from './src/pages/EpisodeScreen';
import FavoritesScreen from './src/pages/FavoritesScreen';
import GlobalSearchScreen from './src/pages/GlobalSearchScreen';
import HomeScreen from './src/pages/HomeScreen';
import LabScreen from './src/pages/LabScreen';
import LocationDetailScreen from './src/pages/LocationDetailScreen';
import LocationScreen from './src/pages/LocationScreen';
import ProfileScreen from './src/pages/ProfileScreen';
import QuizScreen from './src/pages/QuizScreen';
import RelationshipScreen from './src/pages/RelationshipScreen';
import StatisticsScreen from './src/pages/StatisticsScreen';
import { colors, fonts } from './src/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    border: colors.border,
    card: colors.surface,
    primary: colors.portal,
    text: colors.text,
  },
  fonts: {
    ...DarkTheme.fonts,
    bold: { fontFamily: fonts.bodyBold, fontWeight: '700' },
    heavy: { fontFamily: fonts.display, fontWeight: '700' },
    medium: { fontFamily: fonts.bodyMedium, fontWeight: '500' },
    regular: { fontFamily: fonts.body, fontWeight: '400' },
  },
};

const tabIcons = {
  Home: ['planet-outline', 'planet'],
  Search: ['search-outline', 'search'],
  Lab: ['flask-outline', 'flask'],
  Quiz: ['game-controller-outline', 'game-controller'],
  Saved: ['bookmark-outline', 'bookmark'],
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.backgroundSoft },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: fonts.display, fontSize: 15 },
        tabBarActiveTintColor: colors.portal,
        tabBarBackground: () => (
          <LinearGradient colors={['#101b1def', '#081012f8']} style={{ flex: 1 }} />
        ),
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: colors.mutedDark,
        tabBarLabelStyle: { fontFamily: fonts.bodyBold, fontSize: 10, marginBottom: 6 },
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopColor: colors.border,
          height: 70,
          paddingTop: 7,
          position: 'absolute',
        },
        tabBarIcon: ({ color, focused, size }) => (
          <Ionicons color={color} name={tabIcons[route.name][focused ? 1 : 0]} size={size} />
        ),
      })}
    >
      <Tab.Screen component={DiscoverScreen} name="Home" options={{ title: 'Portal HQ' }} />
      <Tab.Screen component={GlobalSearchScreen} name="Search" options={{ title: 'Portal Search' }} />
      <Tab.Screen component={LabScreen} name="Lab" options={{ title: 'Multiverse Lab' }} />
      <Tab.Screen component={QuizScreen} name="Quiz" options={{ title: 'Brainalyzer' }} />
      <Tab.Screen component={FavoritesScreen} name="Saved" />
    </Tab.Navigator>
  );
}

const detailOptions = {
  headerBackTitle: 'Back',
  headerShadowVisible: false,
  headerStyle: { backgroundColor: colors.backgroundSoft },
  headerTintColor: colors.text,
  headerTitleStyle: { fontFamily: fonts.display, fontSize: 14 },
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Orbitron_700Bold,
    Orbitron_800ExtraBold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync().catch(() => {});
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <FavoritesProvider>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="light" />
        <RootStack.Navigator screenOptions={detailOptions}>
          <RootStack.Screen component={MainTabs} name="Main" options={{ headerShown: false }} />
          <RootStack.Screen component={HomeScreen} name="Characters" options={{ title: 'Character Index' }} />
          <RootStack.Screen component={LocationScreen} name="Locations" options={{ title: 'Location Atlas' }} />
          <RootStack.Screen component={EpisodeScreen} name="Episodes" options={{ title: 'Episode Archive' }} />
          <RootStack.Screen component={CompareScreen} name="Compare" options={{ title: 'Comparison Lab' }} />
          <RootStack.Screen component={StatisticsScreen} name="Statistics" options={{ title: 'Galactic Statistics' }} />
          <RootStack.Screen component={RelationshipScreen} name="Relationships" options={{ title: 'Relationship Explorer' }} />
          <RootStack.Screen
            component={DetailScreen}
            name="CharacterDetail"
            options={({ route }) => ({ title: route.params?.character?.name ?? 'Character' })}
          />
          <RootStack.Screen
            component={LocationDetailScreen}
            name="LocationDetail"
            options={({ route }) => ({ title: route.params?.title ?? route.params?.location?.name ?? 'Location' })}
          />
          <RootStack.Screen
            component={EpisodeDetailScreen}
            name="EpisodeDetail"
            options={({ route }) => ({ title: route.params?.episode?.name ?? 'Episode' })}
          />
          <RootStack.Screen component={AboutScreen} name="About" options={{ title: 'About the Explorer' }} />
          <RootStack.Screen component={ProfileScreen} name="Profile" options={{ title: 'Developer' }} />
        </RootStack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
