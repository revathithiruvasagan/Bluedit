// import axios from "axios";

// const API_BASE_URL = "http://10.18.18.191:5000"; // Change to your server IP

// // ✅ User Login
// export const loginUser = async (email, password) => {
//   try {
//     const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
//     return res.data; // Should include { success, user?, message }
//   } catch (err) {
//     console.error("Login error:", err?.response || err.message);
//     return {
//       success: false,
//       message:
//         err?.response?.data?.message || "Invalid credentials or server error",
//     };
//   }
// };

// // ✅ Join a chat room
// export const joinRoom = async (username, room) => {
//   try {
//     const res = await axios.post(`${API_BASE_URL}/join_room`, {
//       username,
//       room,
//     });
//     return res.data;
//   } catch (err) {
//     console.error("Error joining room:", err?.response || err.message);
//     return {
//       success: false,
//       message: "Failed to join room",
//     };
//   }
// };

// // ✅ Send a message
// export const sendMessage = async (room, username, content, type = "text") => {
//   try {
//     const res = await axios.post(`${API_BASE_URL}/send_message`, {
//       room,
//       username,
//       content,
//       type,
//     });
//     return res.data;
//   } catch (err) {
//     console.error("Error sending message:", err?.response || err.message);
//     return {
//       success: false,
//       message: "Failed to send message",
//     };
//   }
// };

// // ✅ Get messages
// export const getMessages = async (room) => {
//   try {
//     const res = await axios.get(`${API_BASE_URL}/get_messages/${room}`);
//     return res.data;
//   } catch (err) {
//     console.error("Error fetching messages:", err?.response || err.message);
//     return {
//       success: false,
//       message: "Failed to fetch messages",
//       messages: [],
//     };
//   }
// };

// // Fetch all communities
// export const getCommunities = async () => {
//   try {
//     const res = await axios.get(`${API_BASE_URL}/communities`);
//     return res.data.communities || [];
//   } catch (err) {
//     return [];
//   }
// };

// // Create a new community
// export const createCommunity = async (name, userId) => {
//   try {
//     const res = await axios.post(`${API_BASE_URL}/communities`, {
//       name,
//       user_id: userId,
//     });
//     return res.data;
//   } catch (err) {
//     return { success: false, message: "Failed to create community" };
//   }
// };

// export const getCommunityRequests = async (communityId, adminId) => {
//   const res = await axios.get(
//     `${BASE_URL}/communities/${communityId}/requests`,
//     {
//       params: { admin_id: adminId },
//     }
//   );
//   return res.data;
// };

// // Approve/Reject a request
// export const handleRequest = async (
//   communityId,
//   requestId,
//   adminId,
//   action
// ) => {
//   const res = await axios.post(
//     `${BASE_URL}/communities/${communityId}/requests/${requestId}`,
//     { admin_id: adminId, action }
//   );
//   return res.data;
// };

import axios from "axios";

const API_BASE_URL = "http://10.18.18.191:5000"; // ✅ your server IP

// ✅ Login User
export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return res.data;
  } catch (err) {
    console.error("Login error:", err?.response || err.message);
    return {
      success: false,
      message:
        err?.response?.data?.message || "Invalid credentials or server error",
    };
  }
};

// ❌ Removed joinRoom — because not in backend

// ✅ Send Message — ✅ Correct Payload
export const sendMessage = async ({ room, user_id, content }) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/send_message`, {
      room,
      user_id,
      content,
    });
    return res.data;
  } catch (err) {
    console.error("Error sending message:", err?.response || err.message);
    return { success: false, message: "Failed to send message" };
  }
};

// ✅ Get Messages (community_id)
export const getMessages = async (roomId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/get_messages/${roomId}`);
    return res.data; // {messages: []}
  } catch (err) {
    console.error("Error fetching messages:", err?.response || err.message);
    return { success: false, messages: [] };
  }
};

// ✅ fetch communities
export const getCommunities = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/communities`);
    return res.data.communities || [];
  } catch (err) {
    return [];
  }
};

// ✅ Create community
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

// ✅ Admin auto-join
export const joinAsAdmin = async (communityId, userId) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/communities/${communityId}/join`,
      { user_id: userId, role: "admin" }
    );
    return res.data;
  } catch (err) {
    console.error("joinAsAdmin error:", err);
    return { success: false };
  }
};

// ✅ Send Join Request
export const sendJoinRequest = async (communityId, userId) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/communities/${communityId}/join_request`,
      { user_id: userId }
    );
    return res.data; // expected: {success, message}
  } catch (err) {
    console.error("Send join request error:", err?.response || err.message);
    return { success: false, message: "Failed to send request" };
  }
};

export const getCommunityRequests = async (communityId, adminId) => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/communities/${communityId}/requests`,
      { params: { admin_id: adminId } }
    );
    return res.data;
  } catch (err) {
    console.error("Fetch requests error:", err);
    return [];
  }
};

// ✅ Admin handles request Approval/Reject
export const handleRequest = async (
  communityId,
  requestId,
  adminId,
  action
) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/communities/${communityId}/requests/${requestId}`,
      { admin_id: adminId, action }
    );
    return res.data;
  } catch (err) {
    console.error("Handle request error:", err);
    return { success: false };
  }
};
