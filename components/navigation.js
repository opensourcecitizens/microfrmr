import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Details from '../Farmers-Choice-FrontEnd/Screens/Screens/detailsScreen';
import Dashboard from '../Farmers-Choice-FrontEnd/Screens/Screens/dashboard';
import AddItem from '../Farmers-Choice-FrontEnd/Screens/Screens/addItemScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          // Responsive icon sizing
          const iconSize = Platform.OS === 'ios' ? wp('7%') : wp('6.5%');

          if (route.name === 'Details') {
            iconName = 'home';
          } else if (route.name === 'Dashboard') {
            iconName = 'bar-chart';
          } else if (route.name === 'AddItem') {
            iconName = 'plus-square'; // Changed to add-post icon
          }

          return (
            <Icon 
              name={iconName} 
              size={iconSize} 
              color={focused ? '#45cca3' : '#000'} 
              style={{ marginTop: Platform.OS === 'ios' ? hp('0.5%') : 0 }}
            />
          );
        },
        tabBarLabelStyle: {
          fontSize: wp('3.2%'),
          marginBottom: Platform.OS === 'ios' ? hp('-0.8%') : 0,
          fontWeight: '500',
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#45cca3',
          height: Platform.OS === 'ios' ? hp('11%') : hp('9%'),
          paddingBottom: Platform.OS === 'ios' ? hp('2.5%') : hp('1.5%'),
        },
        tabBarActiveTintColor: '#45cca3',
        tabBarInactiveTintColor: '#000',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Details" 
        component={Details} 
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{ tabBarLabel: 'Stats' }}
      />
      <Tab.Screen 
        name="AddItem" 
        component={AddItem} 
        options={{ tabBarLabel: 'New Post' }}
      />
    </Tab.Navigator>
  );
}