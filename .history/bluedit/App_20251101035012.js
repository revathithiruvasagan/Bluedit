import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NotificationProvider } from "./components/Notification";
import LoginScreen from "./screens/Login";
import CommunityScreen from "./screens/CommunityScreen";
import ChatScreen from "./screens/Chat";
//import AdminRequestsScreen from "./screens/AdminRequestsScreen"; // <-- import

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NotificationProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ title: "Login" }}
          />
          <Stack.Screen
            name="CommunityScreen"
            component={CommunityScreen}
            options={{ title: "Communities" }}
          />
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={{ title: "Chat Room" }}
          />
          <Stack.Screen
            name="AdminRequestsScreen"
            component={AdminRequestsScreen}
            options={{ title: "Join Requests" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NotificationProvider>
  );
}
