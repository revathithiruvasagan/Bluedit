import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TextInput, Alert } from "react-native";
import { getCommunities, createCommunity } from "../services/api";

export default function CommunityScreen({ navigation, route }) {
  const { user } = route.params; // Logged-in user
  const [communities, setCommunities] = useState([]);
  const [newCommunity, setNewCommunity] = useState("");

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const data = await getCommunities();
      setCommunities(data);
    } catch (err) {
      Alert.alert("Error", "Failed to load communities");
    }
  };

  const handleCreateCommunity = async () => {
    if (!newCommunity) return Alert.alert("Error", "Enter a community name");

    try {
      const res = await createCommunity(newCommunity, user.id);
      if (res.success) {
        setCommunities((prev) => [...prev, res.community]);
        setNewCommunity("");
      } else {
        Alert.alert("Error", res.message);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to create community");
    }
  };

  const joinCommunity = (community) => {
    navigation.navigate("ChatScreen", { community, user });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Communities</Text>

      <FlatList
        data={communities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>{item.name}</Text>
            <Button title="Join" onPress={() => joinCommunity(item)} />
          </View>
        )}
      />

      <TextInput
        placeholder="New Community"
        value={newCommunity}
        onChangeText={setNewCommunity}
        style={{ borderWidth: 1, padding: 5, marginTop: 20 }}
      />
      <Button title="Create Community" onPress={handleCreateCommunity} />
    </View>
  );
}
