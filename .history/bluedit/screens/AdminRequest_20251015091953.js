import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Alert } from "react-native";
import { getCommunityRequests, handleRequest } from "../services/api";

export default function AdminRequestsScreen({ navigation, route }) {
  const { user, community } = route.params; // Admin and community info
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await getCommunityRequests(community.id, user.id);
      if (res.success) setRequests(res.requests);
      else Alert.alert("Error", res.message);
    } catch {
      Alert.alert("Error", "Failed to load requests");
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      const res = await handleRequest(community.id, requestId, user.id, action);
      if (res.success) {
        Alert.alert(res.message);
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
      } else {
        Alert.alert("Error", res.message);
      }
    } catch {
      Alert.alert("Error", "Failed to update request");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Pending Join Requests
      </Text>
      {requests.length === 0 ? (
        <Text>No pending requests</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 15, padding: 10, borderWidth: 1 }}>
              <Text>User ID: {item.user_id}</Text>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <Button
                  title="Approve"
                  onPress={() => handleAction(item.id, "approve")}
                />
                <View style={{ width: 10 }} />
                <Button
                  title="Reject"
                  color="red"
                  onPress={() => handleAction(item.id, "reject")}
                />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
