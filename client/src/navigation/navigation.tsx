import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp">
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={{ title: 'Register' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
