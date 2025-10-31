import axios from "axios";

const API_BASE_URL = "http://10.18.18.191:5000"; // Change to your server IP

// ✅ User Login
export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return res.data; // Should include { success, user?, message }
  } catch (err) {
    console.error("Login error:", err?.response || err.message);
    return {
      success: false,
      message:
        err?.response?.data?.message || "Invalid credentials or server error",
    };
  }
};

// ✅ Join a chat room
export const joinRoom = async (username, room) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/join_room`, {
      username,
      room,
    });
    return res.data;
  } catch (err) {
    console.error("Error joining room:", err?.response || err.message);
    return {
      success: false,
      message: "Failed to join room",
    };
  }
};

// ✅ Send a message
export const sendMessage = async (room, username, content, type = "text") => {
  try {
    const res = await axios.post(`${API_BASE_URL}/send_message`, {
      room,
      username,
      content,
      type,
    });
    return res.data;
  } catch (err) {
    console.error("Error sending message:", err?.response || err.message);
    return {
      success: false,
      message: "Failed to send message",
    };
  }
};

// ✅ Get messages
export const getMessages = async (room) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/get_messages/${room}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching messages:", err?.response || err.message);
    return {
      success: false,
      message: "Failed to fetch messages",
      messages: [],
    };
  }
};

// Admin: join an existing community immediately (backend should verify admin)
export const joinAsAdmin = async (communityId, adminId, userId) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/communities/${communityId}/join-as-admin`,
      {
        admin_id: adminId,
        user_id: userId,
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error joining as admin:", err?.response || err.message);
    return { success: false, message: "Failed to join as admin" };
  }
};

// Fetch all communities
export const getCommunities = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/communities`);
    return res.data.communities || [];
  } catch (err) {
    return [];
  }
};

// Create a new community
export const createCommunity = async (name, userId) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/communities`, {
      name,
      user_id: userId,
    });
    return res.data;
  } catch (err) {
    return { success: false, message: "Failed to create community" };
  }
};

export const getCommunityRequests = async (communityId, adminId) => {
  const res = await axios.get(
    `${BASE_URL}/communities/${communityId}/requests`,
    {
      params: { admin_id: adminId },
    }
  );
  return res.data;
};

// Approve/Reject a request
export const handleRequest = async (
  communityId,
  requestId,
  adminId,
  action
) => {
  const res = await axios.post(
    `${BASE_URL}/communities/${communityId}/requests/${requestId}`,
    { admin_id: adminId, action }
  );
  return res.data;
};
