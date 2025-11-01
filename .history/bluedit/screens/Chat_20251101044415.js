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
//   sendMessage as apiSendMessage,
//   getMessages,
//   joinAsAdmin,
// } from "../services/api";

// export default function ChatScreen({ route }) {
//   const { community, username, userId, created_by } = route.params;
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const flatListRef = useRef(null);

//   useEffect(() => {
//     const initChat = async () => {
//       try {
//         // Admin auto-join (register in DB)
//         if (userId && created_by && userId === created_by) {
//           await joinAsAdmin(community.id, userId);
//         }

//         const response = await getMessages(community.id);
//         setMessages(response?.messages ?? []);
//       } catch (err) {
//         console.error("Init chat failed:", err);
//       }
//     };
//     initChat();
//   }, [community.id]);

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         const res = await getMessages(community.id);
//         setMessages(res?.messages ?? []);
//       } catch (err) {
//         console.error("Fetch messages failed:", err);
//       }
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [community.id]);

//   useEffect(() => {
//     flatListRef.current?.scrollToEnd({ animated: true });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!message.trim()) return;

//     const localMsg = {
//       id: Date.now().toString(),
//       text: message,
//       sender: username,
//       timestamp: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, localMsg]);
//     const contentToSend = message;
//     setMessage("");

//     try {
//       await apiSendMessage({
//         room: community.id,
//         user_id: userId,
//         content: contentToSend,
//       });

//       const res = await getMessages(community.id);
//       setMessages(res?.messages ?? []);
//     } catch (err) {
//       console.error("Send message error:", err);
//     }
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
//         keyExtractor={(item) => item.id?.toString()}
//         renderItem={({ item }) => (
//           <View
//             style={[
//               styles.messageBubble,
//               item.sender === username ? styles.userBubble : styles.otherBubble,
//             ]}
//           >
//             <Text style={styles.sender}>{item.sender}</Text>
//             <Text style={styles.text}>{item.text}</Text>
//             <Text style={styles.timestamp}>
//               {new Date(item.timestamp).toLocaleTimeString()}
//             </Text>
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
//           <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 15, backgroundColor: "#f9f9f9" },
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
//   sender: { fontWeight: "bold", color: "#fff" },
//   text: { marginTop: 2, color: "#fff" },
//   timestamp: {
//     fontSize: 10,
//     marginTop: 2,
//     color: "#f8f8f8",
//     textAlign: "right",
//   },
//   inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
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

