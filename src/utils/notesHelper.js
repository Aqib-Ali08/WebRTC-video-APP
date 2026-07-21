// src/utils/notesHelper.js
import { getCurrentUserFullName } from "../services";

const DEFAULT_NOTES = [
  {
    id: "note-1",
    title: "Syncora Dashboard Polish",
    subtitle: "Frontend Aesthetics",
    description: "Structure components with MUI, use framer-motion for smooth transitions, and handle state persistence via localStorage until the backend routes are integrated.",
    category: "Work",
    color: "#e0f2fe", // soft blue
    updatedAt: "2026-07-11T10:00:00.000Z"
  },
  {
    id: "note-2",
    title: "Weekly Shopping List",
    subtitle: "Grocery Essentials",
    description: "- Almond milk\n- Whole wheat bread\n- Organic spinach\n- Avocados\n- Dark chocolate (85%)",
    category: "Personal",
    color: "#fef8c3", // soft yellow
    updatedAt: "2026-07-11T11:30:00.000Z"
  },
  {
    id: "note-3",
    title: "WebRTC Video Call Ideas",
    subtitle: "Brainstorming",
    description: "Explore implementing face filters, virtual backgrounds, and screen sharing enhancements using WebRTC dual-stream setup.",
    category: "Ideas",
    color: "#f3e8ff", // soft purple
    updatedAt: "2026-07-11T09:15:00.000Z"
  },
  {
    id: "note-4",
    title: "Daily Scrum Tasks",
    subtitle: "To-do list",
    description: "1. Complete dashboard integration.\n2. Fix sockets reconnect issues.\n3. Polish schedules notes layout with responsive flex grid.",
    category: "To-do",
    color: "#dcfce7", // soft green
    updatedAt: "2026-07-11T08:00:00.000Z"
  }
];

const DEFAULT_SHARED_NOTES = [
  {
    id: "shared-1",
    noteId: "note-3",
    title: "WebRTC Video Call Ideas",
    description: "Explore implementing face filters, virtual backgrounds, and screen sharing enhancements using WebRTC dual-stream setup.",
    from: "Victoria King",
    fromId: "user-victoria",
    to: "Bob Williams",
    toId: "user-bob",
    sharedAt: "2026-07-11T10:00:00.000Z",
    isIncoming: true
  },
  {
    id: "shared-2",
    noteId: "note-1",
    title: "Syncora Dashboard Polish",
    description: "Structure components with MUI, use framer-motion for smooth transitions, and handle state persistence via localStorage.",
    from: "Victoria King",
    fromId: "me",
    to: "Hannah Scott",
    toId: "user-hannah",
    sharedAt: "2026-07-11T08:30:00.000Z",
    isIncoming: false
  }
];

export const MOCK_CONNECTIONS = [
  { _id: "user-victoria", full_name: "Victoria King", profilePic: "" },
  { _id: "user-bob", full_name: "Bob Williams", profilePic: "" },
  { _id: "user-hannah", full_name: "Hannah Scott", profilePic: "" },
  { _id: "user-john", full_name: "John Doe", profilePic: "" },
  { _id: "user-alice", full_name: "Alice Green", profilePic: "" }
];

export const NOTE_CATEGORIES = ["All", "Work", "Personal", "Ideas", "To-do"];

export const NOTE_COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Blue", value: "#e0f2fe" }, // soft sky-blue
  { name: "Green", value: "#dcfce7" }, // soft mint-green
  { name: "Yellow", value: "#fef8c3" }, // soft light-yellow
  { name: "Purple", value: "#f3e8ff" }, // soft lavender-purple
  { name: "Red", value: "#fee2e2" } // soft rose-red
];

// Get current notes from localStorage
export function getLocalNotes() {
  const notes = localStorage.getItem("syncora_notes");
  if (!notes) {
    localStorage.setItem("syncora_notes", JSON.stringify(DEFAULT_NOTES));
    return DEFAULT_NOTES;
  }
  try {
    return JSON.parse(notes);
  } catch (error) {
    console.error("Failed to parse notes", error);
    return DEFAULT_NOTES;
  }
}

// Save notes to localStorage
export function saveLocalNotes(notes) {
  localStorage.setItem("syncora_notes", JSON.stringify(notes));
}

// Get shared notes from localStorage
export function getLocalSharedNotes() {
  const shared = localStorage.getItem("syncora_shared_notes");
  if (!shared) {
    localStorage.setItem("syncora_shared_notes", JSON.stringify(DEFAULT_SHARED_NOTES));
    return DEFAULT_SHARED_NOTES;
  }
  try {
    return JSON.parse(shared);
  } catch (error) {
    console.error("Failed to parse shared notes", error);
    return DEFAULT_SHARED_NOTES;
  }
}

// Save shared notes to localStorage
export function saveLocalSharedNotes(sharedNotes) {
  localStorage.setItem("syncora_shared_notes", JSON.stringify(sharedNotes));
}

// Share a note with a connection
export function shareNoteWithConnection(note, friend) {
  const sharedNotes = getLocalSharedNotes();
  const userName = getCurrentUserFullName() || "Me";
  
  const newShare = {
    id: `shared-${Date.now()}`,
    noteId: note.id,
    title: note.title,
    description: note.description,
    from: userName,
    fromId: "me",
    to: friend.full_name,
    toId: friend._id,
    sharedAt: new Date().toISOString(),
    isIncoming: false
  };

  sharedNotes.unshift(newShare);
  saveLocalSharedNotes(sharedNotes);
  return newShare;
}

// Unsend/unshare a note
export function unshareNote(sharedId) {
  const sharedNotes = getLocalSharedNotes();
  const filtered = sharedNotes.filter(n => n.id !== sharedId);
  saveLocalSharedNotes(filtered);
  return filtered;
}
