// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
// } from "react-native";
// import {
//   getCommunities,
//   sendJoinRequest,
//   checkMemberStatus,
// } from "../services/api";

// export default function CommunityScreen({ navigation, route }) {
//   const { username, userId } = route.params;
//   const [loading, setLoading] = useState(true);
//   const [communities, setCommunities] = useState([]);

//   useEffect(() => {
//     loadCommunities();
//   }, []);

//   const loadCommunities = async () => {
//     setLoading(true);
//     const data = await getCommunities();

//     // ✅ Check membership status for each community
//     const updated = await Promise.all(
//       data.map(async (com) => {
//         const status = await checkMemberStatus(com.id, userId);
//         return { ...com, memberStatus: status };
//       })
//     );

//     setCommunities(updated);
//     setLoading(false);
//   };

//   const handleJoinClick = async (community) => {
//     try {
//       const res = await sendJoinRequest(community.id, userId);

//       // ✅ If already a member → Open Chat Immediately
//       if (res.message === "Already a member") {
//         navigation.navigate("ChatScreen", {
//           community,
//           username,
//           userId,
//           created_by: community.user_id,
//         });
//         return;
//       }

//       // ✅ If already pending → Show pending state
//       if (res.message === "Request already pending") {
//         alert("⏳ Request Pending Approval");
//         await loadCommunities();
//         return;
//       }

//       // ✅ When a brand-new join request is sent
//       if (res.success && res.message === "Join request sent") {
//         alert("✅ Join request sent!");
//         await loadCommunities();
//         return;
//       }

//       // ❌ Any unexpected case
//       alert(res.message || "Something went wrong");
//     } catch (e) {
//       console.log(e);
//       alert("Something went wrong");
//     }
//   };

//   const renderCommunity = ({ item }) => {
//     const isAdmin = item.user_id === userId;

//     return (
//       <View style={styles.card}>
//         <Text style={styles.title}>{item.name}</Text>

//         {/* ✅ Action Buttons */}
//         {isAdmin || item.memberStatus === "approved" ? (
//           <TouchableOpacity
//             style={styles.chatButton}
//             onPress={() =>
//               navigation.navigate("ChatScreen", {
//                 community: item,
//                 username,
//                 userId,
//                 created_by: item.user_id,
//               })
//             }
//           >
//             <Text style={styles.chatText}>Open Chat</Text>
//           </TouchableOpacity>
//         ) : item.memberStatus === "pending" ? (
//           <View style={styles.pendingBox}>
//             <Text style={styles.pendingText}>⏳ Waiting Approval</Text>
//           </View>
//         ) : (
//           <TouchableOpacity
//             style={styles.joinButton}
//             onPress={() => handleJoinClick(item)}
//           >
//             <Text style={styles.joinText}>Join Request</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" style={{ marginTop: 20 }} />
//       ) : (
//         <FlatList
//           data={communities}
//           keyExtractor={(item) => item.id}
//           renderItem={renderCommunity}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 15, backgroundColor: "#fff" },
//   card: {
//     backgroundColor: "#f2f2f2",
//     padding: 15,
//     marginVertical: 8,
//     borderRadius: 12,
//   },
//   title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
//   joinButton: {
//     backgroundColor: "#0066ff",
//     padding: 10,
//     borderRadius: 8,
//   },
//   joinText: { color: "#fff", fontWeight: "600", textAlign: "center" },
//   pendingBox: {
//     padding: 10,
//     backgroundColor: "#ffa500",
//     borderRadius: 8,
//   },
//   pendingText: { fontWeight: "600", textAlign: "center", color: "#fff" },
//   chatButton: {
//     backgroundColor: "#22a122",
//     padding: 10,
//     borderRadius: 8,
//   },
//   chatText: { color: "#fff", fontWeight: "600", textAlign: "center" },
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
} from "react-native";
import {
  sendMessage as apiSendMessage,
  getMessages,
  joinAsAdmin,
  checkMemberStatus,
} from "../services/api";

export default function ChatScreen({ route, navigation }) {
  const { community, username, userId, created_by } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const status = await checkMemberStatus(community.id, userId);

      if (userId === created_by) {
        await joinAsAdmin(community.id, userId);
      } else if (status === "none") {
        alert("🚫 You must join first!");
        return navigation.goBack();
      } else if (status === "pending") {
        alert("⏳ Waiting for approval");
        return navigation.goBack();
      }

      const res = await getMessages(community.id);
      setMessages(res?.messages ?? []);
    };

    init();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const localMsg = {
      id: Date.now().toString(),
      text: message,
      sender: username,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, localMsg]);
    const msg = message;
    setMessage("");

    try {
      await apiSendMessage({
        room: community.id,
        user_id: userId,
        content: msg,
      });

      const res = await getMessages(community.id);
      setMessages(res?.messages ?? []);
    } catch (err) {
      console.error("Message send failed", err);
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
        keyExtractor={(item) => item.id}
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
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
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
  userBubble: {
    backgroundColor: "#007bff",
    alignSelf: "flex-end",
  },
  otherBubble: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
  },
  sender: { fontWeight: "bold", color: "#fff" },
  text: { marginTop: 2, color: "#fff" },
  timestamp: {
    fontSize: 10,
    marginTop: 2,
    color: "#f8f8f8",
    textAlign: "right",
  },
  inputContainer: { flexDirection: "row", alignItems: "center" },
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
