import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from '../components/navigation';
import SplashScreen from './Screens/Screens/splashScreen';
import UserLogin from './Screens/Screens/userLogin';
import CreateAccount from './Screens/Screens/createAccount';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function check() {
      const token = await AsyncStorage.getItem('token');
      setAuthenticated(!!token);
      setLoading(false);
    }
    check();
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={authenticated ? 'App' : 'Login'} screenOptions={{ headerShown: false }}>
        {!authenticated ? (
          <>
            <Stack.Screen name="Login" component={UserLogin} />
            <Stack.Screen name="CreateAccount" component={CreateAccount} />
          </>
        ) : null}
        <Stack.Screen name="App" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}