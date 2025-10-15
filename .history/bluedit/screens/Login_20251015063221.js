// import React, { useState } from "react";
// import { View, TextInput, Button, Text, Alert } from "react-native";
// import { loginUser } from "../services/api";

// export default function LoginScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert("Error", "Please enter both email and password");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await loginUser(email, password);

//       if (response.success) {
//         const user = response.user;
//         console.log("Logged in user:", user);
//         navigation.navigate("CommunityScreen", { user });
//       } else {
//         // Handle server-side errors
//         Alert.alert("Login Failed", response.message || "Unknown error");
//       }
//     } catch (err) {
//       // Handle network / Axios errors
//       console.error("Login error:", err);
//       Alert.alert(
//         "Network Error",
//         err.response?.data?.message || err.message || "Server not reachable"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Email:</Text>
//       <TextInput
//         value={email}
//         onChangeText={setEmail}
//         placeholder="Enter email"
//         style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
//         autoCapitalize="none"
//       />
//       <Text>Password:</Text>
//       <TextInput
//         value={password}
//         onChangeText={setPassword}
//         placeholder="Enter password"
//         secureTextEntry
//         style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
//       />
//       <Button
//         title={loading ? "Logging in..." : "Login"}
//         onPress={handleLogin}
//         disabled={loading}
//       />
//     </View>
//   );
// }
import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { loginUser } from "../services/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    const response = await loginUser(email, password);

    if (response.success) {
      const user = response.user;
      console.log("Logged in user:", user);
      navigation.navigate("CommunityScreen", { user });
    } else {
      // Show a popup for login error (server error, 401, network, etc.)
      Alert.alert("Login Failed", response.message || "Unknown error");
    }
    setLoading(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
        autoCapitalize="none"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}
