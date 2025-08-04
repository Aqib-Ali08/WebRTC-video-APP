// src/config/socket.js
import { io } from 'socket.io-client';
import { getTokenFromLocalStorage } from '../services';
const token = getTokenFromLocalStorage();

const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:3000", {
    auth: {
        token: token,
    },
});
export default socket;
