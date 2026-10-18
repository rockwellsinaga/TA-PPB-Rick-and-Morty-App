import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { FavoritesProvider } from './src/context/FavoritesContext';
import AboutScreen from './src/pages/AboutScreen';
import DetailScreen from './src/pages/DetailScreen';
import DiscoverScreen from './src/pages/DiscoverScreen';
import EpisodeDetailScreen from './src/pages/EpisodeDetailScreen';
import EpisodeScreen from './src/pages/EpisodeScreen';
import FavoritesScreen from './src/pages/FavoritesScreen';
import HomeScreen from './src/pages/HomeScreen';
import LocationDetailScreen from './src/pages/LocationDetailScreen';
import LocationScreen from './src/pages/LocationScreen';
import ProfileScreen from './src/pages/ProfileScreen';
import { colors } from './src/theme';

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
};

const tabIcons = {
  Discover: ['planet-outline', 'planet'],
  Characters: ['people-outline', 'people'],
  Locations: ['compass-outline', 'compass'],
  Episodes: ['film-outline', 'film'],
  Saved: ['bookmark-outline', 'bookmark'],
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        tabBarActiveTintColor: colors.portal,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '800', marginBottom: 5 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 68,
          paddingTop: 6,
        },
        tabBarIcon: ({ color, focused, size }) => (
          <Ionicons color={color} name={tabIcons[route.name][focused ? 1 : 0]} size={size} />
        ),
      })}
    >
      <Tab.Screen component={DiscoverScreen} name="Discover" options={{ title: 'Portal HQ' }} />
      <Tab.Screen component={HomeScreen} name="Characters" />
      <Tab.Screen component={LocationScreen} name="Locations" />
      <Tab.Screen component={EpisodeScreen} name="Episodes" />
      <Tab.Screen component={FavoritesScreen} name="Saved" />
    </Tab.Navigator>
  );
}

const detailOptions = {
  headerBackTitle: 'Back',
  headerShadowVisible: false,
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
};

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="light" />
        <RootStack.Navigator screenOptions={detailOptions}>
          <RootStack.Screen component={MainTabs} name="Main" options={{ headerShown: false }} />
          <RootStack.Screen
            component={DetailScreen}
            name="CharacterDetail"
            options={({ route }) => ({ title: route.params?.title ?? route.params?.character?.name ?? 'Character' })}
          />
          <RootStack.Screen
            component={LocationDetailScreen}
            name="LocationDetail"
            options={({ route }) => ({ title: route.params?.title ?? route.params?.location?.name ?? 'Location' })}
          />
          <RootStack.Screen
            component={EpisodeDetailScreen}
            name="EpisodeDetail"
            options={({ route }) => ({ title: route.params?.title ?? route.params?.episode?.name ?? 'Episode' })}
          />
          <RootStack.Screen component={AboutScreen} name="About" options={{ title: 'About the Explorer' }} />
          <RootStack.Screen component={ProfileScreen} name="Profile" options={{ title: 'Developer' }} />
        </RootStack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
