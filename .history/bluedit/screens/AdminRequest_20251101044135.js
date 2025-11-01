import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { getCommunityRequests, handleRequest } from "../api";

export default function AdminRequestsScreen({ route, navigation }) {
  const { communityId, adminId } = route.params;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const res = await getCommunityRequests(communityId, adminId);
    console.log("Requests Response:", res);

    if (res.success && res.requests) {
      setRequests(res.requests);
    } else {
      setRequests([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const onHandleRequest = async (requestId, action) => {
    const res = await handleRequest(communityId, requestId, adminId, action);

    if (res.success) {
      fetchRequests(); // refresh UI
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noText}>No pending requests ✅</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.username}>{item.username}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "green" }]}
                onPress={() => onHandleRequest(item.id, "approve")}
              >
                <Text style={styles.buttonText}>Approve ✅</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "red" }]}
                onPress={() => onHandleRequest(item.id, "reject")}
              >
                <Text style={styles.buttonText}>Reject ❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  card: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  username: { fontSize: 18, marginBottom: 8 },
  actions: { flexDirection: "row", gap: 10 },
  button: {
    padding: 8,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noText: {
    fontSize: 18,
    color: "#666",
  },
});
