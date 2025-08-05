// src/config/socket.js
import { io } from 'socket.io-client';
import { getTokenFromLocalStorage } from '../services';
const token = getTokenFromLocalStorage();

const socket = io(import.meta.env.VITE_SERVER_URL || "https://webrtc-backend-xmll.onrender.com", {
    auth: {
        token: token,
    },
});
export default socket;
