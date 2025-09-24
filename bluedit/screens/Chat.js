// screens/ChatScreen.js
import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text } from "react-native";

export default function ChatScreen({ route }) {
  const { community } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (message.trim() === "") return;
    setMessages([...messages, { id: Date.now().toString(), text: message }]);
    setMessage("");
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        {community.name} Chat
      </Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 5,
              padding: 5,
              backgroundColor: "#eee",
              borderRadius: 5,
            }}
          >
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message"
        style={{ borderWidth: 1, padding: 5, marginVertical: 10 }}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}
