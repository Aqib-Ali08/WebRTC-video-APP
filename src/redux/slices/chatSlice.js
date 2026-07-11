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
  //     sender: {_id:"userA"},
  //     createdAt: "2025-08-17T12:34:00Z",
  //     status: "sent", // "sent" | "delivered" | "read"
  //     readBy: ["userB"] // array of userIds
  //   }
  // }
  unreadCounts: {}, // { conversationId: number }
  totalUnread: 0, // will not use this in UI
  activeChatId: null,
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

      if (!message) {
        // 🔹 Clear last message for this conversation
        const { [conversationId]: _, ...rest } = state.lastMessages;
        state.lastMessages = rest;
        return;
      }

      state.lastMessages = {
        ...state.lastMessages,
        [conversationId]: {
          messageId: message.message_id,
          content: message.content,
          sender: message.sender,
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
    setUnreadCount: (state, action) => {
      const { conversationId, count } = action.payload;
      // const prevCount = state.unreadCounts[conversationId] || 0;
      state.unreadCounts[conversationId] = count;
      state.totalUnread = state.totalUnread + count;
    },
    incrementUnread: (state, action) => {
      const { conversationId } = action.payload;
      state.unreadCounts[conversationId] =
        (state.unreadCounts[conversationId] || 0) + 1;
      state.totalUnread += 1;
    },
    clearUnread: (state, action) => {
      const { conversationId } = action.payload;
      const count = state.unreadCounts[conversationId] || 0;
      state.totalUnread -= count;
      delete state.unreadCounts[conversationId];
    },
    resetAllUnread: (state) => {
      state.unreadCounts = {};
      state.totalUnread = 0;
    },
    setActiveChatId: (state, action) => {
      state.activeChatId = action.payload;
    },
    clearActiveChatId: (state) => {
      state.activeChatId = null;
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
  setUnreadCount,
  incrementUnread,
  clearUnread,
  resetAllUnread,
  setActiveChatId,
  clearActiveChatId,
} = chatSlice.actions;

export default chatSlice.reducer;
