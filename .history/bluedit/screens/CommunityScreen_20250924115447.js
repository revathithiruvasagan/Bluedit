// screens/CommunityScreen.js
import React from "react";
import { View, Text, Button, FlatList } from "react-native";

const communities = [
  { id: "1", name: "AI Research" },
  { id: "2", name: "Cybersecurity" },
  { id: "3", name: "Blockchain" },
];

export default function CommunityScreen({ navigation }) {
  const joinCommunity = (community) => {
    // Navigate to chat screen (we'll add this later)
    navigation.navigate("ChatScreen", { community });
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
    </View>
  );
}
