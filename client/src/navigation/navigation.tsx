import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SignUpScreen from '../screens/SignUpScreen';
import LogInScreen  from '../screens/LogInScreen';
import HomePageScreen from '../screens/HomePageScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LogInScreen} 
          options={{ title: 'Log In' }} 
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{title:'Register'}}
          />
           <Stack.Screen 
          name="Home" 
          component={HomePageScreen} 
          options={{ title: 'Home' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
