import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './components/navigation';
import SplashScreen from './Screens/splashScreen';
import FarmProfileSettingsScreen from './Screens/farmProfileSettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false, // Hides headers globally
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="App" component={BottomTabNavigator} />
        <Stack.Screen name="FarmProfileSettings" component={FarmProfileSettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}