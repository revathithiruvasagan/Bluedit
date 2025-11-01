import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TextInput, Alert } from "react-native";
import {
  getCommunities,
  createCommunity,
  sendJoinRequest,
} from "../services/api";

export default function CommunityScreen({ navigation, route }) {
  const { user } = route.params;
  const [communities, setCommunities] = useState([]);
  const [newCommunity, setNewCommunity] = useState("");

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const data = await getCommunities();
      setCommunities(data);
    } catch {
      Alert.alert("Error", "Failed to load communities");
    }
  };

  const handleCreateCommunity = async () => {
    if (!newCommunity) return Alert.alert("Error", "Enter a community name");
    try {
      const res = await createCommunity(newCommunity, user.id);
      if (res.success) {
        setCommunities((prev) => [...prev, res.community]);
        setNewCommunity("");
      } else {
        Alert.alert("Error", res.message);
      }
    } catch {
      Alert.alert("Error", "Failed to create community");
    }
  };

  const joinCommunity = (community) => {
    if (community.created_by === user.id) {
      // Admin can directly join
      navigation.navigate("ChatScreen", { community, user });
    } else {
      // Non-admin: send join request
      Alert.alert("Request Access", "You are not admin. Send join request?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Request",
          onPress: async () => {
            try {
              const res = await sendJoinRequest(community.id, user.id);
              Alert.alert(res.message);
            } catch {
              Alert.alert("Error", "Failed to send request");
            }
          },
        },
      ]);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Communities</Text>

      <FlatList
        data={communities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>{item.name}</Text>
            <Button title="Join" onPress={() => joinCommunity(item)} />
          </View>
        )}
      />

      <TextInput
        placeholder="New Community"
        value={newCommunity}
        onChangeText={setNewCommunity}
        style={{ borderWidth: 1, padding: 5, marginTop: 20 }}
      />
      <Button title="Create Community" onPress={handleCreateCommunity} />
    </View>
  );
}



# ✅ Get pending join requests — Admin only
@community_bp.route("/communities/<community_id>/requests", methods=["GET"])
def get_join_requests(community_id):
    admin_id = request.args.get("admin_id")

    if not admin_id:
        return jsonify({"success": False, "message": "Missing admin_id"}), 400

    try:
        # ✅ Check admin role
        role_check = supabase.table("community_members") \
            .select("role") \
            .eq("community_id", community_id) \
            .eq("user_id", admin_id) \
            .execute()

        if not role_check.data or role_check.data[0]["role"] != "admin":
            return jsonify({"success": False, "message": "Not authorized"}), 403

        # ✅ Get pending requests
        requests_data = supabase.table("join_request") \
            .select("*") \
            .eq("community_id", community_id) \
            .eq("status", "pending") \
            .execute()

        join_requests = requests_data.data or []

        # ✅ Fetch usernames for each user
        user_ids = list(set(req["user_id"] for req in join_requests if req.get("user_id")))

        users_map = {}
        if user_ids:
            users_resp = supabase.table("users") \
                .select("id, username") \
                .in_("id", user_ids) \
                .execute()

            users_map = {user["id"]: user["username"] for user in users_resp.data}

        # ✅ Attach username
        for req in join_requests:
            req["username"] = users_map.get(req["user_id"], "Unknown")

        return jsonify({"success": True, "requests": join_requests}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ✅ Approve / Reject Join request
@community_bp.route("/communities/<community_id>/requests/<request_id>", methods=["POST"])
def handle_join_request(community_id, request_id):
    data = request.get_json()
    admin_id = data.get("admin_id")
    action = data.get("action")  # approve | reject

    if not admin_id or not action:
        return jsonify({"success": False, "message": "Missing fields"}), 400

    try:
        # ✅ Check if sender is admin
        role_check = supabase.table("community_members") \
            .select("role") \
            .eq("community_id", community_id) \
            .eq("user_id", admin_id) \
            .execute()

        if not role_check.data or role_check.data[0]["role"] != "admin":
            return jsonify({"success": False, "message": "Not authorized"}), 403

        # ✅ Fetch the request to find user ID
        req_resp = supabase.table("join_request") \
            .select("*") \
            .eq("id", request_id) \
            .execute()

        if not req_resp.data:
            return jsonify({"success": False, "message": "Request not found"}), 404

        request_data = req_resp.data[0]
        user_id = request_data["user_id"]

        # ✅ Perform action
        status = "approved" if action == "approve" else "rejected"

        # ✅ Update join_request status
        supabase.table("join_request") \
            .update({
                "status": status,
                "handled_at": datetime.utcnow().isoformat()
            }) \
            .eq("id", request_id) \
            .execute()

        # ✅ If approved → add user to community_members
        if status == "approved":
            supabase.table("community_members").insert({
                "community_id": community_id,
                "user_id": user_id,
                "role": "member"
            }).execute()

        return jsonify({"success": True, "message": f"Request {status}!"}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
