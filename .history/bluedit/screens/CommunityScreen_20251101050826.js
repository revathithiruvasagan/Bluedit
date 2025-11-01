// // import React, { useEffect, useState } from "react";
// // import { View, Text, Button, FlatList, TextInput, Alert } from "react-native";
// // import {
// //   getCommunities,
// //   createCommunity,
// //   sendJoinRequest,
// // } from "../services/api";

// // export default function CommunityScreen({ navigation, route }) {
// //   const { user } = route.params;
// //   const [communities, setCommunities] = useState([]);
// //   const [newCommunity, setNewCommunity] = useState("");

// //   useEffect(() => {
// //     fetchCommunities();
// //   }, []);

// //   const fetchCommunities = async () => {
// //     try {
// //       const data = await getCommunities();
// //       setCommunities(data);
// //     } catch {
// //       Alert.alert("Error", "Failed to load communities");
// //     }
// //   };

// //   const handleCreateCommunity = async () => {
// //     if (!newCommunity) return Alert.alert("Error", "Enter a community name");
// //     try {
// //       const res = await createCommunity(newCommunity, user.id);
// //       if (res.success) {
// //         setCommunities((prev) => [...prev, res.community]);
// //         setNewCommunity("");
// //       } else {
// //         Alert.alert("Error", res.message);
// //       }
// //     } catch {
// //       Alert.alert("Error", "Failed to create community");
// //     }
// //   };

// //   const joinCommunity = (community) => {
// //     if (community.created_by === user.id) {
// //       // Admin can directly join
// //       navigation.navigate("ChatScreen", { community, user });
// //     } else {
// //       // Non-admin: send join request
// //       Alert.alert("Request Access", "You are not admin. Send join request?", [
// //         { text: "Cancel", style: "cancel" },
// //         {
// //           text: "Send Request",
// //           onPress: async () => {
// //             try {
// //               const res = await sendJoinRequest(community.id, user.id);
// //               Alert.alert(res.message);
// //             } catch {
// //               Alert.alert("Error", "Failed to send request");
// //             }
// //           },
// //         },
// //       ]);
// //     }
// //   };

// //   return (
// //     <View style={{ padding: 20 }}>
// //       <Text style={{ fontSize: 20, marginBottom: 10 }}>Communities</Text>

// //       <FlatList
// //         data={communities}
// //         keyExtractor={(item) => item.id}
// //         renderItem={({ item }) => (
// //           <View style={{ marginBottom: 10 }}>
// //             <Text>{item.name}</Text>
// //             <Button title="Join" onPress={() => joinCommunity(item)} />
// //           </View>
// //         )}
// //       />

// //       <TextInput
// //         placeholder="New Community"
// //         value={newCommunity}
// //         onChangeText={setNewCommunity}
// //         style={{ borderWidth: 1, padding: 5, marginTop: 20 }}
// //       />
// //       <Button title="Create Community" onPress={handleCreateCommunity} />
// //     </View>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { View, Text, Button, FlatList, TextInput, Alert } from "react-native";
// import {
//   getCommunities,
//   createCommunity,
//   sendJoinRequest,
//   checkMemberStatus,
// } from "../services/api";

// export default function CommunityScreen({ navigation, route }) {
//   const { user } = route.params;
//   const [communities, setCommunities] = useState([]);
//   const [newCommunity, setNewCommunity] = useState("");

//   useEffect(() => {
//     fetchCommunities();
//   }, []);

//   const fetchCommunities = async () => {
//     try {
//       const data = await getCommunities();

//       const updated = await Promise.all(
//         data.map(async (com) => {
//           const status = await checkMemberStatus(com.id, user.id);
//           return { ...com, memberStatus: status };
//         })
//       );

//       setCommunities(updated);
//     } catch {
//       Alert.alert("Error", "Failed to load communities");
//     }
//   };

//   const handleCreateCommunity = async () => {
//     if (!newCommunity.trim()) return Alert.alert("Error", "Enter a name");

//     try {
//       const res = await createCommunity(newCommunity, user.id);
//       if (res.success) {
//         setCommunities([...communities, res.community]);
//         setNewCommunity("");
//       } else {
//         Alert.alert("Error", res.message);
//       }
//     } catch {
//       Alert.alert("Error", "Failed to create");
//     }
//   };

//   const handleJoinPress = async (community) => {
//     const isAdmin = community.created_by === user.id;
//     const status = await checkMemberStatus(community.id, user.id);

//     if (isAdmin) {
//       return navigation.navigate("ChatScreen", { community, user });
//     }

//     if (status === "approved") {
//       return navigation.navigate("ChatScreen", { community, user });
//     }

//     if (status === "pending") {
//       return Alert.alert("⏳ Pending", "Wait for admin approval.");
//     }

//     Alert.alert("Join Community", "Send a join request?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Send",
//         onPress: async () => {
//           try {
//             const res = await sendJoinRequest(community.id, user.id);
//             Alert.alert("✅ Request Sent", "Waiting for approval");
//             await fetchCommunities();
//           } catch {
//             Alert.alert("Error", "Request failed");
//           }
//         },
//       },
//     ]);
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 20, fontWeight: "bold" }}>Communities</Text>

//       <FlatList
//         data={communities}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={{ marginVertical: 10 }}>
//             <Text>{item.name}</Text>
//             <Button title="Join / Open" onPress={() => handleJoinPress(item)} />
//           </View>
//         )}
//       />

//       <TextInput
//         placeholder="New Community"
//         value={newCommunity}
//         onChangeText={setNewCommunity}
//         style={{ borderWidth: 1, marginTop: 20, padding: 10 }}
//       />
//       <Button title="Create" onPress={handleCreateCommunity} />
//     </View>
//   );
// }
