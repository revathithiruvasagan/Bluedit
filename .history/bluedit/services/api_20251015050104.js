export const loginUser = async (email, password) => {
  if (email === "test@user.com" && password === "123456") {
    return { success: true };
  } else {
    return { success: false, message: "Invalid credentials" };
  }
};

// src/api/api.js
import axios from "axios";

const API_BASE_URL = "http://192.168.1.10:5000"; // change to your Flask server IP

// Join a chat room
export const joinRoom = async (username, room) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/join_room`, {
      username,
      room,
    });
    return res.data;
  } catch (err) {
    console.error("Error joining room:", err);
    throw err;
  }
};

// Send a message
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
    console.error("Error sending message:", err);
    throw err;
  }
};

// Get messages for a room
export const getMessages = async (room) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/get_messages/${room}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching messages:", err);
    throw err;
  }
};
