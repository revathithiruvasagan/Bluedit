// // screens/ChatScreen.js
// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   TextInput,
//   FlatList,
//   Text,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";

// import {
//   joinRoom,
//   sendMessage as apiSendMessage,
//   getMessages,
//   joinAsAdmin,
// } from "../services/api";

// export default function ChatScreen({ route }) {
//   const { community, username = "Revathi", userId, created_by } = route.params; // ensure userId and community.created_by are passed
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const flatListRef = useRef(null);

//   // Join room and load previous messages
//   useEffect(() => {
//     const init = async () => {
//       try {
//         await joinRoom(username, community.name);

//         // If current user is the community creator (admin), call join-as-admin to ensure membership
//         if (userId && created_by && userId === created_by) {
//           await joinAsAdmin(community.id || community.name, userId, userId);
//         }

//         const res = await getMessages(community.name);
//         // getMessages returns either { messages: [...] } or array depending on backend wrapper
//         const msgs = Array.isArray(res) ? res : res.messages || res.data || [];
//         setMessages(msgs);
//       } catch (err) {
//         console.error("Error initializing chat:", err);
//       }
//     };
//     init();
//   }, [community.name]);

//   // Poll backend for new messages every 3 seconds
//   useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         const res = await getMessages(community.name);
//         const msgs = Array.isArray(res) ? res : res.messages || res.data || [];
//         setMessages(msgs);
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       }
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [community.name]);

//   // Scroll to bottom whenever messages update
//   useEffect(() => {
//     flatListRef.current?.scrollToEnd({ animated: true });
//   }, [messages]);

//   // Send message
//   const sendMessage = async () => {
//     if (message.trim() === "") return;

//     const newMessage = {
//       id: Date.now().toString(),
//       text: message,
//       sender: username,
//       timestamp: new Date().toLocaleTimeString(),
//     };

//     // Update local state immediately
//     setMessages((prev) => [...prev, newMessage]);
//     setMessage("");

//     // Send to backend
//     try {
//       await apiSendMessage(community.name, username, message);
//       // Optionally re-fetch messages to get server-assigned ids/timestamps
//       const res = await getMessages(community.name);
//       const msgs = Array.isArray(res) ? res : res.messages || res.data || [];
//       setMessages(msgs);
//     } catch (err) {
//       console.error("Failed to send message:", err);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <Text style={styles.header}>{community.name} </Text>

//       <FlatList
//         ref={flatListRef}
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View
//             style={[
//               styles.messageBubble,
//               item.sender === username ? styles.userBubble : styles.otherBubble,
//             ]}
//           >
//             <Text style={styles.sender}>{item.sender}</Text>
//             <Text style={styles.text}>{item.text}</Text>
//             <Text style={styles.timestamp}>{item.timestamp}</Text>
//           </View>
//         )}
//       />

//       <View style={styles.inputContainer}>
//         <TextInput
//           value={message}
//           onChangeText={setMessage}
//           placeholder="Type a message..."
//           style={styles.input}
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
//           <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 15,
//     backgroundColor: "#f9f9f9",
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   messageBubble: {
//     padding: 10,
//     borderRadius: 10,
//     marginVertical: 4,
//     maxWidth: "80%",
//   },
//   userBubble: {
//     backgroundColor: "#007bff",
//     alignSelf: "flex-end",
//   },
//   otherBubble: {
//     backgroundColor: "#e0e0e0",
//     alignSelf: "flex-start",
//   },
//   sender: {
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   text: {
//     color: "#fff",
//     marginTop: 2,
//   },
//   timestamp: {
//     fontSize: 10,
//     marginTop: 2,
//     color: "#ddd",
//     textAlign: "right",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     borderRadius: 25,
//     backgroundColor: "#fff",
//     marginRight: 10,
//   },
//   sendButton: {
//     backgroundColor: "#007bff",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
// });

// screens/ChatScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  joinRoom,
  sendMessage as apiSendMessage,
  getMessages,
  joinAsAdmin,
} from "../services/api";

export default function ChatScreen({ route }) {
  const { community, username, userId, created_by } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  // Join room + load messages
  useEffect(() => {
    const init = async () => {
      try {
        await joinRoom(username, community.name);

        // Admin auto-join
        if (userId && created_by && userId === created_by) {
          await joinAsAdmin(community.id, userId, userId);
        }

        const res = await getMessages(community.name);
        const msgs = res?.messages ?? res ?? [];
        setMessages(msgs);
      } catch (err) {
        console.error("Error initializing chat:", err);
      }
    };

    init();
  }, [community.id, community.name]);

  // Poll messages every 3 secs
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await getMessages(community.id);
        const msgs = res?.messages ?? res ?? [];
        setMessages(msgs);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [community.name]);

  // Auto-scroll on update
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!message.trim()) return;

    const localMessage = {
      id: Date.now().toString(),
      text: message,
      sender: username,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, localMessage]);
    const textToSend = message;
    setMessage("");

    try {
      await apiSendMessage({
        room: community.id,
        user_id: userId,
        content: textToSend,
      });

      const res = await getMessages(community.id);
      const msgs = res?.messages ?? res ?? [];
      setMessages(msgs);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.header}>{community.name}</Text>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === username ? styles.userBubble : styles.otherBubble,
            ]}
          >
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.text}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9f9f9" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    maxWidth: "80%",
  },
  userBubble: { backgroundColor: "#007bff", alignSelf: "flex-end" },
  otherBubble: { backgroundColor: "#e0e0e0", alignSelf: "flex-start" },
  sender: { fontWeight: "bold" },
  text: { marginTop: 2 },
  timestamp: { fontSize: 10, marginTop: 2, textAlign: "right" },
  inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#fff",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
});
