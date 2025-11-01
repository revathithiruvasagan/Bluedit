// import React, { useEffect, useState } from "react";
// import { View, Text, Button, FlatList, TextInput, Alert } from "react-native";
// import {
//   getCommunities,
//   createCommunity,
//   sendJoinRequest,
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
//       setCommunities(data);
//     } catch {
//       Alert.alert("Error", "Failed to load communities");
//     }
//   };

//   const handleCreateCommunity = async () => {
//     if (!newCommunity) return Alert.alert("Error", "Enter a community name");
//     try {
//       const res = await createCommunity(newCommunity, user.id);
//       if (res.success) {
//         setCommunities((prev) => [...prev, res.community]);
//         setNewCommunity("");
//       } else {
//         Alert.alert("Error", res.message);
//       }
//     } catch {
//       Alert.alert("Error", "Failed to create community");
//     }
//   };

//   const joinCommunity = (community) => {
//     if (community.created_by === user.id) {
//       Alert.alert("Admin Access", "Enter as admin?", [
//         {
//           text: "Enter",
//           onPress: () => navigation.navigate("ChatScreen", { community, user }),
//         },
//       ]);
//     } else {
//       Alert.alert("Request Access", "You are not admin. Send join request?", [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Send Request",
//           onPress: async () => {
//             try {
//               const res = await sendJoinRequest(community.id, user.id);
//               Alert.alert(res.message);
//             } catch {
//               Alert.alert("Error", "Failed to send request");
//             }
//           },
//         },
//       ]);
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 20, marginBottom: 10 }}>Communities</Text>

//       <FlatList
//         data={communities}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={{ marginBottom: 10 }}>
//             <Text>{item.name}</Text>
//             <Button title="Join" onPress={() => joinCommunity(item)} />

//             {item.created_by === user.id && (
//               <Button
//                 title="Manage Requests"
//                 onPress={() =>
//                   navigation.navigate("AdminRequestsScreen", {
//                     communityId: item.id,
//                     adminId: user.id,
//                   })
//                 }
//               />
//             )}
//           </View>
//         )}
//       />

//       <TextInput
//         placeholder="New Community"
//         value={newCommunity}
//         onChangeText={setNewCommunity}
//         style={{ borderWidth: 1, padding: 5, marginTop: 20 }}
//       />
//       <Button title="Create Community" onPress={handleCreateCommunity} />
//     </View>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  getCommunities,
  sendJoinRequest,
  checkMemberStatus,
} from "../services/api";

export default function CommunityScreen({ navigation, route }) {
  const { username, userId } = route.params;
  const [loading, setLoading] = useState(true);
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    setLoading(true);
    const data = await getCommunities();

    const updated = await Promise.all(
      data.map(async (com) => {
        const status = await checkMemberStatus(com.id, userId);
        return { ...com, memberStatus: status };
      })
    );

    setCommunities(updated);
    setLoading(false);
  };

  const handleJoinClick = async (community) => {
    try {
      const res = await sendJoinRequest(community.id, userId);

      if (res.message === "Already a member") {
        navigation.navigate("ChatScreen", {
          community,
          username,
          userId,
          created_by: community.user_id,
        });
        return;
      }

      if (res.message === "Request already pending") {
        alert("⏳ Request Pending Approval");
        await loadCommunities();
        return;
      }

      if (res.success && res.message === "Join request sent") {
        alert("✅ Join request sent!");
        await loadCommunities();
        return;
      }

      alert(res.message || "Something went wrong");
    } catch (e) {
      console.log(e);
      alert("Something went wrong");
    }
  };

  const renderCommunity = ({ item }) => {
    const isAdmin = item.user_id === userId;

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.name}</Text>

        {isAdmin || item.memberStatus === "approved" ? (
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() =>
              navigation.navigate("ChatScreen", {
                community: item,
                username,
                userId,
                created_by: item.user_id,
              })
            }
          >
            <Text style={styles.chatText}>Open Chat</Text>
          </TouchableOpacity>
        ) : item.memberStatus === "pending" ? (
          <View style={styles.pendingBox}>
            <Text style={styles.pendingText}>⏳ Waiting Approval</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => handleJoinClick(item)}
          >
            <Text style={styles.joinText}>Join Request</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={communities}
          keyExtractor={(item) => item.id}
          renderItem={renderCommunity}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  joinButton: {
    backgroundColor: "#0066ff",
    padding: 10,
    borderRadius: 8,
  },
  joinText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  pendingBox: {
    padding: 10,
    backgroundColor: "#ffa500",
    borderRadius: 8,
  },
  pendingText: { fontWeight: "600", textAlign: "center", color: "#fff" },
  chatButton: {
    backgroundColor: "#22a122",
    padding: 10,
    borderRadius: 8,
  },
  chatText: { color: "#fff", fontWeight: "600", textAlign: "center" },
});
