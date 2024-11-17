import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
// import MainPageScreen from '../../screens/MainPageScreen';
// import AccountScreen from '../../screens/AccountScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="MainPage" component={MainPageScreen} />
        <Stack.Screen name="Account" component={AccountScreen} /> */}
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

<Stack.Navigator initialRouteName="SignUp">
  <Stack.Screen name="SignUp" component={SignUpScreen} />
</Stack.Navigator>


export default Navigation;
