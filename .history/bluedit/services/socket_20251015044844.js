// src/services/socket.js
import { io } from "socket.io-client";

const socket = io("http://<YOUR_BACKEND_IP>:5000", {
  transports: ["websocket"],
  reconnection: true,
});

export default socket;
