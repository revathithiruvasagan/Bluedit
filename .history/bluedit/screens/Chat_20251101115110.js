// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   View,
// //   TextInput,
// //   FlatList,
// //   Text,
// //   KeyboardAvoidingView,
// //   Platform,
// //   TouchableOpacity,
// //   StyleSheet,
// // } from "react-native";

// // import {
// //   sendMessage as apiSendMessage,
// //   getMessages,
// //   joinAsAdmin,
// // } from "../services/api";

// // export default function ChatScreen({ route }) {
// //   const { community, username, userId, created_by } = route.params;
// //   const [message, setMessage] = useState("");
// //   const [messages, setMessages] = useState([]);
// //   const flatListRef = useRef(null);

// //   useEffect(() => {
// //     const initChat = async () => {
// //       try {
// //         // Admin auto-join (register in DB)
// //         if (userId && created_by && userId === created_by) {
// //           await joinAsAdmin(community.id, userId);
// //         }

// //         const response = await getMessages(community.id);
// //         setMessages(response?.messages ?? []);
// //       } catch (err) {
// //         console.error("Init chat failed:", err);
// //       }
// //     };
// //     initChat();
// //   }, [community.id]);

// //   useEffect(() => {
// //     const interval = setInterval(async () => {
// //       try {
// //         const res = await getMessages(community.id);
// //         setMessages(res?.messages ?? []);
// //       } catch (err) {
// //         console.error("Fetch messages failed:", err);
// //       }
// //     }, 3000);
// //     return () => clearInterval(interval);
// //   }, [community.id]);

// //   useEffect(() => {
// //     flatListRef.current?.scrollToEnd({ animated: true });
// //   }, [messages]);

// //   const sendMessage = async () => {
// //     if (!message.trim()) return;

// //     const localMsg = {
// //       id: Date.now().toString(),
// //       text: message,
// //       sender: username,
// //       timestamp: new Date().toISOString(),
// //     };

// //     setMessages((prev) => [...prev, localMsg]);
// //     const contentToSend = message;
// //     setMessage("");

// //     try {
// //       await apiSendMessage({
// //         room: community.id,
// //         user_id: userId,
// //         content: contentToSend,
// //       });

// //       const res = await getMessages(community.id);
// //       setMessages(res?.messages ?? []);
// //     } catch (err) {
// //       console.error("Send message error:", err);
// //     }
// //   };

// //   return (
// //     <KeyboardAvoidingView
// //       style={styles.container}
// //       behavior={Platform.OS === "ios" ? "padding" : "height"}
// //     >
// //       <Text style={styles.header}>{community.name}</Text>

// //       <FlatList
// //         ref={flatListRef}
// //         data={messages}
// //         keyExtractor={(item) => item.id?.toString()}
// //         renderItem={({ item }) => (
// //           <View
// //             style={[
// //               styles.messageBubble,
// //               item.sender === username ? styles.userBubble : styles.otherBubble,
// //             ]}
// //           >
// //             <Text style={styles.sender}>{item.sender}</Text>
// //             <Text style={styles.text}>{item.text}</Text>
// //             <Text style={styles.timestamp}>
// //               {new Date(item.timestamp).toLocaleTimeString()}
// //             </Text>
// //           </View>
// //         )}
// //       />

// //       <View style={styles.inputContainer}>
// //         <TextInput
// //           value={message}
// //           onChangeText={setMessage}
// //           placeholder="Type a message..."
// //           style={styles.input}
// //         />
// //         <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
// //           <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </KeyboardAvoidingView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, padding: 15, backgroundColor: "#f9f9f9" },
// //   header: {
// //     fontSize: 22,
// //     fontWeight: "bold",
// //     marginBottom: 10,
// //     textAlign: "center",
// //   },
// //   messageBubble: {
// //     padding: 10,
// //     borderRadius: 10,
// //     marginVertical: 4,
// //     maxWidth: "80%",
// //   },
// //   userBubble: {
// //     backgroundColor: "#007bff",
// //     alignSelf: "flex-end",
// //   },
// //   otherBubble: {
// //     backgroundColor: "#e0e0e0",
// //     alignSelf: "flex-start",
// //   },
// //   sender: { fontWeight: "bold", color: "#fff" },
// //   text: { marginTop: 2, color: "#fff" },
// //   timestamp: {
// //     fontSize: 10,
// //     marginTop: 2,
// //     color: "#f8f8f8",
// //     textAlign: "right",
// //   },
// //   inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
// //   input: {
// //     flex: 1,
// //     borderWidth: 1,
// //     borderColor: "#ccc",
// //     padding: 10,
// //     borderRadius: 25,
// //     backgroundColor: "#fff",
// //     marginRight: 10,
// //   },
// //   sendButton: {
// //     backgroundColor: "#007bff",
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 25,
// //   },
// // });

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
//   Alert,
// } from "react-native";
// import {
//   sendMessage as apiSendMessage,
//   getMessages,
//   joinAsAdmin,
//   checkMemberStatus,
// } from "../services/api";

// export default function ChatScreen({ route, navigation }) {
//   const { community, user } = route.params;
//   const { id: userId, username } = user;
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const flatListRef = useRef(null);

//   useEffect(() => {
//     const initChat = async () => {
//       const status = await checkMemberStatus(community.id, userId);

//       if (community.created_by === userId) {
//         await joinAsAdmin(community.id, userId);
//       } else if (status === "pending") {
//         Alert.alert("⏳ Pending Approval", "You cannot chat yet.");
//         return navigation.goBack();
//       } else if (status !== "approved") {
//         Alert.alert("❌ Not a member", "Request to join first.");
//         return navigation.goBack();
//       }

//       const response = await getMessages(community.id);
//       setMessages(response.messages ?? []);
//     };

//     initChat();
//   }, []);

//   const sendMessage = async () => {
//     if (!message.trim()) return;
//     const content = message;
//     setMessage("");

//     const localMsg = {
//       id: Date.now().toString(),
//       text: content,
//       sender: username,
//       timestamp: new Date().toISOString(),
//     };
//     setMessages((prev) => [...prev, localMsg]);

//     await apiSendMessage({
//       room: community.id,
//       user_id: userId,
//       content,
//     });

//     setMessages((await getMessages(community.id)).messages);
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <Text style={styles.header}>{community.name}</Text>

//       <FlatList
//         ref={flatListRef}
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View
//             style={[
//               styles.messageBubble,
//               item.sender === username ? styles.me : styles.them,
//             ]}
//           >
//             <Text style={styles.text}>{item.text}</Text>
//           </View>
//         )}
//       />

//       <View style={styles.inputRow}>
//         <TextInput
//           style={styles.input}
//           placeholder="Type message..."
//           value={message}
//           onChangeText={setMessage}
//         />
//         <TouchableOpacity style={styles.send} onPress={sendMessage}>
//           <Text style={{ color: "#fff" }}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 10 },
//   header: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
//   messageBubble: { padding: 10, marginVertical: 4, borderRadius: 10 },
//   me: { backgroundColor: "#007bff", alignSelf: "flex-end" },
//   them: { backgroundColor: "#aaa", alignSelf: "flex-start" },
//   text: { color: "#fff" },
//   inputRow: { flexDirection: "row", alignItems: "center" },
//   input: {
//     flex: 1,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     padding: 10,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   send: { backgroundColor: "blue", padding: 12, borderRadius: 20 },
// });

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
  Alert,
} from "react-native";
import io from "socket.io-client";
import { getMessages, joinAsAdmin, checkMemberStatus } from "../services/api";

const SOCKET_URL = "http://10.18.18.191:5000";

export default function ChatScreen({ route, navigation }) {
  const { community, user } = route.params;
  const { id: userId, username } = user;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    const setup = async () => {
      const status = await checkMemberStatus(community.id, userId);

      if (community.created_by === userId) {
        await joinAsAdmin(community.id, userId);
      } else if (status === "pending") {
        Alert.alert("⏳ Pending Approval", "You cannot chat yet.");
        return navigation.goBack();
      } else if (status !== "approved") {
        Alert.alert("❌ Not a member", "Request to join first.");
        return navigation.goBack();
      }

      const history = await getMessages(community.id);
      setMessages(history ?? []);

      socketRef.current = io(SOCKET_URL);

      socketRef.current.emit("join_room", community.id);

      socketRef.current.on("receive_message", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    };

    setup();

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave_room", community.id);
        socketRef.current.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    const content = message;
    setMessage("");

    const newMessage = {
      id: Date.now().toString(),
      text: content,
      sender_id: userId,
      sender: username,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    socketRef.current.emit("send_message", {
      room: community.id,
      message: content,
      user_id: userId,
      username: username,
    });
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
        keyExtractor={(item) => item.id}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === username ? styles.me : styles.them,
            ]}
          >
            <Text style={styles.text}>{item.message}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.send} onPress={sendMessage}>
          <Text style={{ color: "#fff" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  messageBubble: { padding: 10, marginVertical: 4, borderRadius: 10 },
  me: { backgroundColor: "#007bff", alignSelf: "flex-end" },
  them: { backgroundColor: "#aaa", alignSelf: "flex-start" },
  text: { color: "#fff" },
  inputRow: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  send: { backgroundColor: "blue", padding: 12, borderRadius: 20 },
});
