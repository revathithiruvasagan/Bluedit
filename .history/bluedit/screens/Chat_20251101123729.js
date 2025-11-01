// // // import React, { useState, useEffect, useRef } from "react";
// // // import {
// // //   View,
// // //   TextInput,
// // //   FlatList,
// // //   Text,
// // //   KeyboardAvoidingView,
// // //   Platform,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // // } from "react-native";

// // // import {
// // //   sendMessage as apiSendMessage,
// // //   getMessages,
// // //   joinAsAdmin,
// // // } from "../services/api";

// // // export default function ChatScreen({ route }) {
// // //   const { community, username, userId, created_by } = route.params;
// // //   const [message, setMessage] = useState("");
// // //   const [messages, setMessages] = useState([]);
// // //   const flatListRef = useRef(null);

// // //   useEffect(() => {
// // //     const initChat = async () => {
// // //       try {
// // //         // Admin auto-join (register in DB)
// // //         if (userId && created_by && userId === created_by) {
// // //           await joinAsAdmin(community.id, userId);
// // //         }

// // //         const response = await getMessages(community.id);
// // //         setMessages(response?.messages ?? []);
// // //       } catch (err) {
// // //         console.error("Init chat failed:", err);
// // //       }
// // //     };
// // //     initChat();
// // //   }, [community.id]);

// // //   useEffect(() => {
// // //     const interval = setInterval(async () => {
// // //       try {
// // //         const res = await getMessages(community.id);
// // //         setMessages(res?.messages ?? []);
// // //       } catch (err) {
// // //         console.error("Fetch messages failed:", err);
// // //       }
// // //     }, 3000);
// // //     return () => clearInterval(interval);
// // //   }, [community.id]);

// // //   useEffect(() => {
// // //     flatListRef.current?.scrollToEnd({ animated: true });
// // //   }, [messages]);

// // //   const sendMessage = async () => {
// // //     if (!message.trim()) return;

// // //     const localMsg = {
// // //       id: Date.now().toString(),
// // //       text: message,
// // //       sender: username,
// // //       timestamp: new Date().toISOString(),
// // //     };

// // //     setMessages((prev) => [...prev, localMsg]);
// // //     const contentToSend = message;
// // //     setMessage("");

// // //     try {
// // //       await apiSendMessage({
// // //         room: community.id,
// // //         user_id: userId,
// // //         content: contentToSend,
// // //       });

// // //       const res = await getMessages(community.id);
// // //       setMessages(res?.messages ?? []);
// // //     } catch (err) {
// // //       console.error("Send message error:", err);
// // //     }
// // //   };

// // //   return (
// // //     <KeyboardAvoidingView
// // //       style={styles.container}
// // //       behavior={Platform.OS === "ios" ? "padding" : "height"}
// // //     >
// // //       <Text style={styles.header}>{community.name}</Text>

// // //       <FlatList
// // //         ref={flatListRef}
// // //         data={messages}
// // //         keyExtractor={(item) => item.id?.toString()}
// // //         renderItem={({ item }) => (
// // //           <View
// // //             style={[
// // //               styles.messageBubble,
// // //               item.sender === username ? styles.userBubble : styles.otherBubble,
// // //             ]}
// // //           >
// // //             <Text style={styles.sender}>{item.sender}</Text>
// // //             <Text style={styles.text}>{item.text}</Text>
// // //             <Text style={styles.timestamp}>
// // //               {new Date(item.timestamp).toLocaleTimeString()}
// // //             </Text>
// // //           </View>
// // //         )}
// // //       />

// // //       <View style={styles.inputContainer}>
// // //         <TextInput
// // //           value={message}
// // //           onChangeText={setMessage}
// // //           placeholder="Type a message..."
// // //           style={styles.input}
// // //         />
// // //         <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
// // //           <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
// // //         </TouchableOpacity>
// // //       </View>
// // //     </KeyboardAvoidingView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, padding: 15, backgroundColor: "#f9f9f9" },
// // //   header: {
// // //     fontSize: 22,
// // //     fontWeight: "bold",
// // //     marginBottom: 10,
// // //     textAlign: "center",
// // //   },
// // //   messageBubble: {
// // //     padding: 10,
// // //     borderRadius: 10,
// // //     marginVertical: 4,
// // //     maxWidth: "80%",
// // //   },
// // //   userBubble: {
// // //     backgroundColor: "#007bff",
// // //     alignSelf: "flex-end",
// // //   },
// // //   otherBubble: {
// // //     backgroundColor: "#e0e0e0",
// // //     alignSelf: "flex-start",
// // //   },
// // //   sender: { fontWeight: "bold", color: "#fff" },
// // //   text: { marginTop: 2, color: "#fff" },
// // //   timestamp: {
// // //     fontSize: 10,
// // //     marginTop: 2,
// // //     color: "#f8f8f8",
// // //     textAlign: "right",
// // //   },
// // //   inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
// // //   input: {
// // //     flex: 1,
// // //     borderWidth: 1,
// // //     borderColor: "#ccc",
// // //     padding: 10,
// // //     borderRadius: 25,
// // //     backgroundColor: "#fff",
// // //     marginRight: 10,
// // //   },
// // //   sendButton: {
// // //     backgroundColor: "#007bff",
// // //     paddingVertical: 10,
// // //     paddingHorizontal: 20,
// // //     borderRadius: 25,
// // //   },
// // // });

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
// //   Alert,
// // } from "react-native";
// // import {
// //   sendMessage as apiSendMessage,
// //   getMessages,
// //   joinAsAdmin,
// //   checkMemberStatus,
// // } from "../services/api";

// // export default function ChatScreen({ route, navigation }) {
// //   const { community, user } = route.params;
// //   const { id: userId, username } = user;
// //   const [message, setMessage] = useState("");
// //   const [messages, setMessages] = useState([]);
// //   const flatListRef = useRef(null);

// //   useEffect(() => {
// //     const initChat = async () => {
// //       const status = await checkMemberStatus(community.id, userId);

// //       if (community.created_by === userId) {
// //         await joinAsAdmin(community.id, userId);
// //       } else if (status === "pending") {
// //         Alert.alert("⏳ Pending Approval", "You cannot chat yet.");
// //         return navigation.goBack();
// //       } else if (status !== "approved") {
// //         Alert.alert("❌ Not a member", "Request to join first.");
// //         return navigation.goBack();
// //       }

// //       const response = await getMessages(community.id);
// //       setMessages(response.messages ?? []);
// //     };

// //     initChat();
// //   }, []);

// //   const sendMessage = async () => {
// //     if (!message.trim()) return;
// //     const content = message;
// //     setMessage("");

// //     const localMsg = {
// //       id: Date.now().toString(),
// //       text: content,
// //       sender: username,
// //       timestamp: new Date().toISOString(),
// //     };
// //     setMessages((prev) => [...prev, localMsg]);

// //     await apiSendMessage({
// //       room: community.id,
// //       user_id: userId,
// //       content,
// //     });

// //     setMessages((await getMessages(community.id)).messages);
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
// //         keyExtractor={(item) => item.id}
// //         renderItem={({ item }) => (
// //           <View
// //             style={[
// //               styles.messageBubble,
// //               item.sender === username ? styles.me : styles.them,
// //             ]}
// //           >
// //             <Text style={styles.text}>{item.text}</Text>
// //           </View>
// //         )}
// //       />

// //       <View style={styles.inputRow}>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Type message..."
// //           value={message}
// //           onChangeText={setMessage}
// //         />
// //         <TouchableOpacity style={styles.send} onPress={sendMessage}>
// //           <Text style={{ color: "#fff" }}>Send</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </KeyboardAvoidingView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, padding: 10 },
// //   header: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
// //   messageBubble: { padding: 10, marginVertical: 4, borderRadius: 10 },
// //   me: { backgroundColor: "#007bff", alignSelf: "flex-end" },
// //   them: { backgroundColor: "#aaa", alignSelf: "flex-start" },
// //   text: { color: "#fff" },
// //   inputRow: { flexDirection: "row", alignItems: "center" },
// //   input: {
// //     flex: 1,
// //     borderColor: "#ccc",
// //     borderWidth: 1,
// //     padding: 10,
// //     borderRadius: 20,
// //     marginRight: 10,
// //   },
// //   send: { backgroundColor: "blue", padding: 12, borderRadius: 20 },
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
// import io from "socket.io-client";
// import { getMessages, joinAsAdmin, checkMemberStatus } from "../services/api";

// const SOCKET_URL = "http://10.18.18.191:5000";

// export default function ChatScreen({ route, navigation }) {
//   const { community, user } = route.params;
//   const { id: userId, username } = user;

//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   const socketRef = useRef(null);
//   const flatListRef = useRef(null);

//   useEffect(() => {
//     const setup = async () => {
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

//       const history = await getMessages(community.id);
//       setMessages(history ?? []);

//       socketRef.current = io(SOCKET_URL);

//       socketRef.current.emit("join_room", community.id);

//       socketRef.current.on("receive_message", (msg) => {
//         setMessages((prev) => [...prev, msg]);
//       });
//     };

//     setup();

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.emit("leave_room", community.id);
//         socketRef.current.disconnect();
//       }
//     };
//   }, []);

//   const sendMessage = () => {
//     if (!message.trim()) return;
//     const content = message;
//     setMessage("");

//     const newMessage = {
//       id: Date.now().toString(),
//       text: content,
//       sender_id: userId,
//       sender: username,
//       timestamp: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, newMessage]);

//     socketRef.current.emit("send_message", {
//       room: community.id,
//       message: content,
//       user_id: userId,
//       username: username,
//     });
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
//         onContentSizeChange={() =>
//           flatListRef.current?.scrollToEnd({ animated: true })
//         }
//         renderItem={({ item }) => (
//           <View
//             style={[
//               styles.messageBubble,
//               item.sender === username ? styles.me : styles.them,
//             ]}
//           >
//             <Text style={styles.text}>{item.message}</Text>
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
  ActivityIndicator,
  Animated,
} from "react-native";
import * as Location from "expo-location";
import { BlurView } from "expo-blur";
import MapView, { Circle, Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import io from "socket.io-client";
import { getMessages, joinAsAdmin, checkMemberStatus } from "../services/api";

const SOCKET_URL = "http://10.18.18.191:5000";

// ✅ Allowed Location (Hardcoded)
const ALLOWED_LAT = 40.7128;
const ALLOWED_LNG = -74.006;
const ALLOWED_RADIUS_KM = 3;

// ✅ Distance Calculation
const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function ChatScreen({ route, navigation }) {
  const { community, user } = route.params;
  const { id: userId, username } = user;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [distance, setDistance] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  const blurAnim = useRef(new Animated.Value(0)).current;

  // ✅ Animate blur overlay
  const animateBlur = (visible) => {
    Animated.timing(blurAnim, {
      toValue: visible ? 1 : 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  // ✅ Location check every 10 seconds
  useEffect(() => {
    const checkLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Location Required", "Please enable location to chat.");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation(loc.coords);

        const dist = getDistanceKm(
          loc.coords.latitude,
          loc.coords.longitude,
          ALLOWED_LAT,
          ALLOWED_LNG
        );

        setDistance(dist.toFixed(2));
        const inside = dist <= ALLOWED_RADIUS_KM;
        setIsWithinRange(inside);
        animateBlur(!inside);
      } catch (err) {
        console.log("Location Error:", err);
      } finally {
        setLoadingLocation(false);
      }
    };

    checkLocation();
    const interval = setInterval(checkLocation, 10000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Socket + Chat setup
  useEffect(() => {
    const setup = async () => {
      const status = await checkMemberStatus(community.id, userId);

      if (community.created_by === userId) {
        await joinAsAdmin(community.id, userId);
      } else if (status === "pending") {
        Alert.alert("Pending Approval", "You cannot chat yet!");
        return navigation.goBack();
      } else if (status !== "approved") {
        Alert.alert("Not a member", "Request to join first!");
        return navigation.goBack();
      }

      const history = await getMessages(community.id);
      setMessages(history ?? []);

      socketRef.current = io(SOCKET_URL);
      socketRef.current.emit("join_room", community.id);

      socketRef.current.on("receive_message", (msg) =>
        setMessages((prev) => [...prev, msg])
      );
    };

    setup();

    return () => {
      socketRef.current?.emit("leave_room", community.id);
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    if (!isWithinRange)
      return Alert.alert("Location Restricted", "Enter campus to chat!");

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender_id: userId,
      sender: username,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    socketRef.current.emit("send_message", {
      room: community.id,
      message,
      user_id: userId,
      username,
    });

    setMessage("");
  };

  if (loadingLocation) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Fetching your location...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.header}>{community.name}</Text>

      <Text style={styles.distanceText}>
        📍 You are {distance} km away {isWithinRange ? "✅" : "❌"}
      </Text>

      {userLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={userLocation} title="You" />
          <Circle
            center={{ latitude: ALLOWED_LAT, longitude: ALLOWED_LNG }}
            radius={ALLOWED_RADIUS_KM * 1000}
          />
        </MapView>
      )}

      <View style={{ flex: 1 }}>
        {/* Chat List */}
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

        {/* 🔐 Blur Overlay */}
        {!isWithinRange && (
          <Animated.View style={[styles.blurWrapper, { opacity: blurAnim }]}>
            <BlurView
              intensity={80}
              tint="dark"
              style={StyleSheet.absoluteFill}
            >
              <View style={styles.lockContainer}>
                <Ionicons name="lock-closed" size={40} color="#fff" />
                <Text style={styles.restrictedText}>
                  Campus restricted chat
                </Text>
              </View>
            </BlurView>
          </Animated.View>
        )}
      </View>

      {/* Input Box */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type message..."
          value={message}
          onChangeText={setMessage}
          editable={isWithinRange}
        />
        <TouchableOpacity
          style={[
            styles.send,
            { backgroundColor: isWithinRange ? "blue" : "gray" },
          ]}
          onPress={sendMessage}
          disabled={!isWithinRange}
        >
          <Text style={{ color: "#fff" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  distanceText: {
    textAlign: "center",
    marginVertical: 4,
    fontWeight: "bold",
    color: "#333",
  },
  map: {
    height: 150,
    marginVertical: 10,
    borderRadius: 10,
  },
  messageBubble: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 10,
  },
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
  send: { padding: 12, borderRadius: 20 },
  blurWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  lockContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  restrictedText: {
    color: "#fff",
    marginTop: 6,
    fontWeight: "bold",
  },
});
