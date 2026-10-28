import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import { navigationTheme } from './src/theme';

export default function App() {
  return <SafeAreaProvider><AppProvider><NavigationContainer theme={navigationTheme}><StatusBar style="dark" /><AppNavigator /></NavigationContainer></AppProvider></SafeAreaProvider>;
}
