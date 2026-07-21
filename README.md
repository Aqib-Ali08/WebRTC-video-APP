# Syncora 🎥💬

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![WebRTC](https://img.shields.io/badge/WebRTC-Enabled-brightgreen.svg)](https://webrtc.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-black.svg)](https://socket.io/)

> **Syncora** is a comprehensive Video Conferencing & Messaging Application. Designed as a full-stack solution, it provides seamless real-time communication, robust video/audio meetings, instant messaging, and a suite of productivity features to keep users connected and organized.

---

## 📸 Sneak Peek
*(Add a few high-quality screenshots or a GIF of your app here to instantly grab a recruiter's attention)*
- **Dashboard / Home:** `![Dashboard](./public/screenshots/dashboard.png)`
- **Video Meeting Room:** `![Meeting Room](./public/screenshots/meeting.png)`
- **Real-time Chat:** `![Chat](./public/screenshots/chat.png)`

---

## 💡 Why I Built This (The Problem it Solves)
With remote work and digital collaboration becoming the norm, I wanted to build a unified platform that combines **video conferencing** and **persistent messaging** into one seamless experience. Building Syncora challenged me to dive deep into real-time web protocols (WebRTC & WebSockets) and complex state management in React.

## 🚀 Key Features

- **Real-Time Video Meetings**: High-quality, low-latency video and audio peer-to-peer conferencing powered by WebRTC.
- **Instant Messaging**: Real-time chat functionality, individual and group conversations, with rich text and emoji support.
- **Connection Management**: Easily add, accept, and manage contacts (connections).
- **Meeting Scheduling**: Schedule upcoming meetings and keep track of your calendar.
- **Notes System**: Built-in functionality to create and organize personal or meeting-related notes.
- **Secure Authentication**: User registration, login, and secure session management.
- **Responsive & Modern UI**: A sleek, user-friendly interface built with Material UI (MUI) and animated with Framer Motion.

## 🧠 Technical Architecture & Core Concepts

- **Signaling Server**: Uses **Socket.io** to exchange connection data (SDP offers/answers and ICE candidates) between peers before establishing a direct connection.
- **Peer-to-Peer Mesh Network**: Utilizes **simple-peer** (WebRTC) to stream media directly between users, reducing server load and minimizing latency for video/audio.
- **State Management Architecture**: 
  - **Redux Toolkit** handles global UI state (modals, user preferences, active chats).
  - **React Query** manages server state, caching, and background data synchronization.
- **Optimized Rendering**: Uses React hooks (`useMemo`, `useCallback`) to prevent unnecessary re-renders during high-frequency events like socket message emissions.

## 🛠️ Technology Stack

**Frontend & UI**
- **React (v18)** & **Vite**
- **Material-UI (MUI)** & **Emotion**
- **Framer Motion** (Micro-interactions & animations)
- **Lottie React** (Vector-based animations)

**State Management & Data**
- **Redux Toolkit**
- **React Query (TanStack Query)**
- **Axios**

**Real-Time & Communication**
- **Socket.io-client**
- **Simple-Peer** (WebRTC)

## 📈 Challenges & Learnings

- **WebRTC Connection States:** Managing the complexities of ICE candidate gathering and NAT traversal. I learned how to properly handle socket events to orchestrate the signaling process before WebRTC takes over.
- **State Synchronization:** Ensuring that real-time chat messages arriving via WebSockets accurately update the React Query cache and Redux store without causing race conditions or UI lag.
- **Media Stream Handling:** Managing user permissions for camera/microphone and gracefully handling cases where hardware is disconnected or unavailable.

## 📂 Project Structure (Highlights)

```
src/
├── components/   # Highly reusable and decoupled UI elements
├── hooks/        # Custom hooks (e.g., useWebRTC, useSocket)
├── pages/        # Application routes (MeetingRoom, ChatRoom, Home)
├── services/     # API integration layer for clean data fetching
└── sockets/      # Centralized socket event listeners and emitters
```

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd WebRTC-video-APP
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🔮 Future Enhancements
- Screen sharing capabilities.
- Meeting recording to cloud storage.
- End-to-end encryption for chat messages.