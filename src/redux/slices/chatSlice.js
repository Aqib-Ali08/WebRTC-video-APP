// src/store/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  usersStatus: {},
  // Shape:
  // {
  //   "userId1": { online: true, lastSeen: null },
  //   "userId2": { online: false, lastSeen: "2025-08-17T12:34:00Z" }
  // }
  typingStatus: {},
  //Shape :
  // {
  // "conversationId" :
  // {
  //     "userId" :
  //     {
  //         typing: true
  //     }
  // }
  // }
  lastMessages: {},
  // Shape:
  // {
  //   "conversationId1": {
  //     messageId: "msg123",
  //     content: "hey",
  //     sender: "userA",
  //     createdAt: "2025-08-17T12:34:00Z",
  //     status: "sent", // "sent" | "delivered" | "read"
  //     readBy: ["userB"] // array of userIds
  //   }
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

    // Displaying of "typing..."  for one-to-one (direct chat) & many-to-one (group chat)
    setTypingStatus: (state, action) => {
      const { conversationId, userId, typing } = action.payload;

      state.typingStatus = {
        ...state.typingStatus,
        [conversationId]: {
          ...(state.typingStatus[conversationId] || {}),
          [userId]: { typing },
        },
      };
    },
    setLastMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      state.lastMessages = {
        ...state.lastMessages,
        [conversationId]: {
          messageId: message.message_id,
          content: message.content,
          sender: message.sender._id,
          createdAt: message.createdAt,
          status: message.status || "sent", // default
          readBy: message.readBy || [],
        },
      };
    },

    updateLastMessageStatus: (state, action) => {
      const { conversationId, messageId, status, userId } = action.payload;
      const lastMsg = state.lastMessages[conversationId];
      if (!lastMsg) return;

      if (lastMsg.messageId === messageId) {
        state.lastMessages[conversationId] = {
          ...lastMsg,
          status,
          readBy: lastMsg.readBy.includes(userId)
            ? lastMsg.readBy
            : [...lastMsg.readBy, userId],
        };
      }
    },

  },
});

export const {
  setUsersStatus,
  setUserOnline,
  setUserOffline,
  resetUsersStatus,
  setTypingStatus,
  setLastMessage,
  updateLastMessageStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
