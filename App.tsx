import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  BebasNeue_400Regular,
} from '@expo-google-fonts/bebas-neue';
import {
  DMMono_400Regular,
  DMMono_500Medium,
} from '@expo-google-fonts/dm-mono';

import { ScannerScreen } from './src/screens/ScannerScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { ProductScreen } from './src/screens/ProductScreen';
import { CompanyScreen } from './src/screens/CompanyScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { colors } from './src/constants/colors';
import { RootStackParamList, TabParamList } from './src/types';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

function ScanIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
      {/* Barcode scan icon approximation with React Native View */}
      <View style={{ width: 18, height: 14, borderWidth: 1.5, borderColor: color, borderRadius: 2 }}>
        <View style={{ position: 'absolute', left: 3, top: 2, bottom: 2, width: 1.5, backgroundColor: color }} />
        <View style={{ position: 'absolute', left: 7, top: 2, bottom: 2, width: 1, backgroundColor: color }} />
        <View style={{ position: 'absolute', left: 10, top: 2, bottom: 2, width: 2, backgroundColor: color }} />
        <View style={{ position: 'absolute', left: 14, top: 2, bottom: 2, width: 1, backgroundColor: color }} />
      </View>
    </View>
  );
}

function HistoryIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: 16, height: 12, borderWidth: 1.5, borderColor: color, borderRadius: 2 }}>
        <View style={{ position: 'absolute', left: 2, top: 2.5, right: 2, height: 1.5, backgroundColor: color }} />
        <View style={{ position: 'absolute', left: 2, top: 5.5, right: 6, height: 1.5, backgroundColor: color }} />
        <View style={{ position: 'absolute', left: 2, top: 8, right: 4, height: 1.5, backgroundColor: color }} />
      </View>
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 9,
          textTransform: 'uppercase',
          fontFamily: 'DMMono_400Regular',
        },
      }}
    >
      <Tab.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{
          tabBarIcon: ({ color }) => <ScanIcon color={color} />,
          tabBarLabel: 'Scan',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color }) => <HistoryIcon color={color} />,
          tabBarLabel: 'History',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    DMMono_400Regular,
    DMMono_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={NavTheme}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.textSecondary,
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: 'DMMono_500Medium', fontSize: 13 },
          }}
        >
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Product"
            component={ProductScreen}
            options={{ title: 'Analysis', headerBackTitle: 'SCAN' }}
          />
          <Stack.Screen
            name="Company"
            component={CompanyScreen}
            options={{ title: 'Corporation', headerBackTitle: 'BACK' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Settings', headerBackTitle: 'BACK' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
