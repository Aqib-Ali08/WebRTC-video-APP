// src/store/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    usersStatus: {},
    // Shape:
    // {
    //   "userId1": { online: true, lastSeen: null },
    //   "userId2": { online: false, lastSeen: "2025-08-17T12:34:00Z" }
    // }
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        // Initialize presence state from an array of online userIds
        setUsersStatus: (state, action) => {
            const users = action.payload; // array of userIds
            const newStatus = {};
            users.forEach((userId) => {
                newStatus[userId] = { online: true, lastSeen: null };
            });
            state.usersStatus = { ...newStatus }; // new reference
        },

        // Mark a single user online
        setUserOnline: (state, action) => {
            const { user_id } = action.payload;
            state.usersStatus = {
                ...state.usersStatus,
                [user_id]: { online: true, lastSeen: null },
            };
        },

        // Mark one or multiple users offline
        setUserOffline: (state, action) => {
            const { user_id, last_seen } = action.payload;

            state.usersStatus = {
                ...state.usersStatus,
                [user_id]: { online: false, lastSeen: last_seen },
            };
        },
        // Reset all users' status
        resetUsersStatus: (state) => {
            state.usersStatus = {};
        },
    },
});

export const {
    setUsersStatus,
    setUserOnline,
    setUserOffline,
    resetUsersStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
