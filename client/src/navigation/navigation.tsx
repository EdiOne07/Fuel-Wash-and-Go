import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import SignUpScreen from "../screens/SignUpScreen";
import LogInScreen from "../screens/LogInScreen";
import HomePageScreen from "../screens/HomePageScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { RadiusProvider } from "../components/RadiusContext";
import StationDetailsScreen from "../screens/StationsDetailsScreen";
import { RootStackParamList } from "./RootStackParam";
import WashingStationDetailsScreen from "../screens/WashingStationDetailsScreen";

const Stack = createStackNavigator<RootStackParamList>(); // Use RootStackParamList to type the navigator

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <RadiusProvider>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LogInScreen}
            options={{ title: "Log In" }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ title: "Register" }}
          />
          <Stack.Screen
            name="Home"
            component={HomePageScreen}
            options={{ title: "Home" }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: "Profile" }}
          />
          <Stack.Screen
            name="StationDetails"
            component={StationDetailsScreen}
            options={{ title: "Station Details" }}
          />
           <Stack.Screen
            name="WashingStationDetails"
            component={WashingStationDetailsScreen}
            options={{ title: "Washing Station Details" }}
          />
        </Stack.Navigator>
      </RadiusProvider>
    </NavigationContainer>
  );
};

export default Navigation;
