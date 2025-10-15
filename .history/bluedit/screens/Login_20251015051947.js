import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { loginUser } from "../services/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await loginUser(email, password);
    if (response.success) {
      // Store user ID for later tracking
      const user = response.user;
      console.log("Logged in user:", user);
      navigation.navigate("CommunityScreen", { user });
    } else {
      Alert.alert("Login Failed", response.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
