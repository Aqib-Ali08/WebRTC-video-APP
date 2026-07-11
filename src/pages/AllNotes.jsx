// src/pages/AllNotes.jsx
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  Chip,
  InputAdornment,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LabelIcon from "@mui/icons-material/Label";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  handleListConnectedUsers,
  handleCreateNote,
  handleUpdateNote,
  handleDeleteNote,
  handleShareNote,
  handleGetSharedNotes,
} from "../services";
import {
  NOTE_CATEGORIES,
  NOTE_COLORS,
  MOCK_CONNECTIONS,
} from "../utils/notesHelper";

export default function AllNotes({ notes, onRefresh }) {
  // Dialog State
  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [mode, setMode] = useState("view"); // "view" | "create" | "edit"
  
  // Note Form State
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "Work",
    color: "#ffffff",
  });

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Sharing Dialog State
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [noteToShare, setNoteToShare] = useState(null);
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [sharedStatusMap, setSharedStatusMap] = useState({}); // { [friendId]: boolean }
  const [sharingLoading, setSharingLoading] = useState({}); // { [friendId]: boolean }

  // Fetch connections list from backend
  const { data: connectionsResponse } = useQuery({
    queryKey: ["connection", 1, 100],
    queryFn: () => handleListConnectedUsers(1, 100),
    retry: false,
  });

  const connections = connectionsResponse?.data || MOCK_CONNECTIONS;

  // Filter notes based on active category and search text
  const filteredNotes = notes.filter((note) => {
    const matchesCategory =
      activeCategory === "All" || note.category === activeCategory;
    const matchesSearch =
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Card Clicks
  const handleCardClick = (note) => {
    setSelectedNote(note);
    setMode("view");
    setOpen(true);
  };

  const handleCreateClick = () => {
    setForm({
      title: "",
      subtitle: "",
      description: "",
      category: "Work",
      color: "#ffffff",
    });
    setMode("create");
    setOpen(true);
  };

  const handleEditClick = (note) => {
    setForm({
      title: note.title || "",
      subtitle: note.subtitle || "",
      description: note.description || "",
      category: note.category || "Work",
      color: note.color || "#ffffff",
    });
    setSelectedNote(note);
    setMode("edit");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNote(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;

    try {
      if (mode === "create") {
        await handleCreateNote(form);
      } else {
        await handleUpdateNote(selectedNote._id || selectedNote.id, form);
      }
      onRefresh();
      handleClose();
    } catch (err) {
      console.error("Save note failed:", err);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await handleDeleteNote(noteId);
      onRefresh();
    } catch (err) {
      console.error("Delete note failed:", err);
    }
  };

  // Sharing handlers
  const handleShareClick = async (note) => {
    setNoteToShare(note);
    setFriendSearchQuery("");
    
    // Check who it was already shared with by calling backend shared notes
    try {
      const currentShared = await handleGetSharedNotes();
      const map = {};
      
      // Mark friends who we've already shared this note with (sent notes)
      (currentShared?.sent || []).forEach((item) => {
        const itemNoteId = item.noteId?._id || item.noteId;
        if (itemNoteId === (note._id || note.id)) {
          map[item.toId] = true;
        }
      });

      setSharedStatusMap(map);
      setShareDialogOpen(true);
    } catch (err) {
      console.error("Failed to load sharing status:", err);
      setShareDialogOpen(true);
    }
  };

  const handleShareWithFriend = async (friend) => {
    if (!noteToShare) return;
    const noteId = noteToShare._id || noteToShare.id;
    
    setSharingLoading((prev) => ({ ...prev, [friend._id]: true }));
    try {
      await handleShareNote(noteId, friend._id);
      setSharedStatusMap((prev) => ({ ...prev, [friend._id]: true }));
      onRefresh();
    } catch (err) {
      console.error("Failed to share note:", err);
    } finally {
      setSharingLoading((prev) => ({ ...prev, [friend._id]: false }));
    }
  };

  const filteredFriends = connections.filter((friend) =>
    friend.full_name?.toLowerCase().includes(friendSearchQuery.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Search, Filter Category and Actions Panel */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        {/* Search Bar */}
        <TextField
          placeholder="Search note titles, descriptions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{
            minWidth: { xs: "100%", md: 350 },
            backgroundColor: "background.paper",
            borderRadius: 2.5,
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchQuery("")} size="small">
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Action Button */}
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={handleCreateClick}
          sx={{
            backgroundColor: "primary.main",
            textTransform: "none",
            fontWeight: 700,
            py: 1,
            px: 2.5,
            borderRadius: 2.5,
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            boxShadow: "0 4px 12px rgba(129, 140, 248, 0.2)",
          }}
        >
          Create Note
        </Button>
      </Box>

      {/* Category Pills Slider */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mb: 4,
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 10,
          },
        }}
      >
        {NOTE_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setActiveCategory(cat)}
              sx={{
                fontSize: "0.9rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#fff" : "text.secondary",
                backgroundColor: isActive ? "primary.main" : "background.paper",
                border: isActive ? "none" : "1px solid rgba(255, 255, 255, 0.05)",
                px: 1.5,
                py: 2,
                cursor: "pointer",
                borderRadius: 2,
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: isActive ? "primary.dark" : "rgba(255, 255, 255, 0.05)",
                  transform: "translateY(-1px)",
                },
              }}
            />
          );
        })}
      </Box>

      {/* Grid of Notes with Animations */}
      {filteredNotes.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
            backgroundColor: "background.paper",
            borderRadius: 3,
            border: "1px dashed rgba(255, 255, 255, 0.15)",
          }}
        >
          <Typography variant="h6" color="text.secondary" fontWeight={600} mb={1}>
            No notes found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? "Try refining your search keyword." : "Create your first note to get started!"}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <Grid item xs={12} sm={6} lg={4} key={note._id || note.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -6, boxShadow: "0 12px 24px -10px rgba(0,0,0,0.12)" }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    onClick={() => handleCardClick(note)}
                    sx={{
                      cursor: "pointer",
                      height: 220,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      backgroundColor: "background.paper",
                      borderRadius: 3,
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderLeft: `6px solid ${note.color || "#818cf8"}`,
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                  >
                    <CardContent sx={{ p: 2.5, pb: 1, overflow: "hidden" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Chip
                          label={note.category || "Work"}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(129, 140, 248, 0.1)",
                            color: "primary.main",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            borderRadius: 1.5,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(note.updatedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </Typography>
                      </Box>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          lineHeight: 1.3,
                          color: "text.primary",
                          mb: 0.5,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {note.title}
                      </Typography>
                      
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "text.secondary",
                          mb: 1.5,
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {note.subtitle}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: 1.5,
                          color: "text.secondary",
                        }}
                      >
                        {note.description}
                      </Typography>
                    </CardContent>

                    <CardActions
                      sx={{
                        p: 1.5,
                        pt: 0,
                        justifyContent: "flex-end",
                        borderTop: "1px solid rgba(255,255,255,0.03)",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Tooltip title="Edit Note">
                        <IconButton
                          size="small"
                          sx={{ color: "text.secondary" }}
                          onClick={() => handleEditClick(note)}
                        >
                          <EditNoteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Note">
                        <IconButton
                          size="small"
                          sx={{ color: "#ef4444" }}
                          onClick={() => handleDelete(note._id || note.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Share with Friends">
                        <IconButton
                          size="small"
                          sx={{ color: "primary.main" }}
                          onClick={() => handleShareClick(note)}
                        >
                          <ShareIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {/* Editor & View Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1,
          },
        }}
      >
        {mode === "view" && selectedNote && (
          <>
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pb: 1,
              }}
            >
              <Typography variant="h5" fontWeight={800} color="text.primary">
                {selectedNote.title}
              </Typography>
              <Chip
                label={selectedNote.category}
                sx={{
                  backgroundColor: "rgba(129, 140, 248, 0.15)",
                  color: "primary.main",
                  fontWeight: 700,
                }}
              />
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight={600}
                gutterBottom
              >
                {selectedNote.subtitle}
              </Typography>
              <Typography
                variant="body1"
                color="text.primary"
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                  mt: 2,
                }}
              >
                {selectedNote.description}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={handleClose}
                variant="contained"
                sx={{
                  backgroundColor: "primary.main",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": { backgroundColor: "primary.dark" },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}

        {(mode === "create" || mode === "edit") && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant="h5" fontWeight={800} color="text.primary">
                {mode === "create" ? "Create Note" : "Edit Note"}
              </Typography>
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
              <TextField
                margin="dense"
                label="Note Title"
                name="title"
                value={form.title}
                onChange={handleFormChange}
                fullWidth
                required
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Subtitle / Brief Summary"
                name="subtitle"
                value={form.subtitle}
                onChange={handleFormChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />

              {/* Tag Picker */}
              <Typography
                variant="subtitle2"
                fontWeight={700}
                color="text.secondary"
                sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
              >
                <LabelIcon sx={{ fontSize: 16 }} /> Category
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
                {NOTE_CATEGORIES.filter((c) => c !== "All").map((cat) => {
                  const isSel = form.category === cat;
                  return (
                    <Chip
                      key={cat}
                      label={cat}
                      onClick={() => setForm((p) => ({ ...p, category: cat }))}
                      sx={{
                        cursor: "pointer",
                        fontWeight: 600,
                        backgroundColor: isSel ? "primary.main" : "rgba(255, 255, 255, 0.05)",
                        color: isSel ? "#fff" : "text.secondary",
                        "&:hover": {
                          backgroundColor: isSel ? "primary.dark" : "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    />
                  );
                })}
              </Box>

              {/* Color Selector */}
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>
                Choose Note Color
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
                {NOTE_COLORS.map((col) => {
                  const isSel = form.color === col.value;
                  return (
                    <Tooltip title={col.name} key={col.name}>
                      <Box
                        onClick={() => setForm((p) => ({ ...p, color: col.value }))}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          backgroundColor: col.value,
                          border: isSel ? "2px solid" : "1px solid rgba(255, 255, 255, 0.15)",
                          borderColor: isSel ? "primary.main" : "rgba(255,255,255,0.15)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "transform 0.1s",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        {isSel && (
                          <CheckCircleIcon sx={{ fontSize: 16, color: "primary.main" }} />
                        )}
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>

              <TextField
                margin="dense"
                label="Note Content"
                name="description"
                value={form.description}
                onChange={handleFormChange}
                fullWidth
                multiline
                rows={5}
                variant="outlined"
              />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  color: "text.secondary",
                  "&:hover": { borderColor: "rgba(255, 255, 255, 0.3)" },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                disabled={!form.title.trim()}
                sx={{
                  backgroundColor: "primary.main",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": { backgroundColor: "primary.dark" },
                }}
              >
                Save Note
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Share note dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 4, p: 1 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={800} color="text.primary">
            Share Note
          </Typography>
          <Typography variant="caption" color="text.secondary">
            "{noteToShare?.title}"
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
          {/* Contact Search */}
          <TextField
            placeholder="Search connections..."
            value={friendSearchQuery}
            onChange={(e) => setFriendSearchQuery(e.target.value)}
            size="small"
            fullWidth
            sx={{
              mb: 2,
              backgroundColor: "background.paper",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />

          <List sx={{ maxHeight: 300, overflowY: "auto" }}>
            {filteredFriends.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" py={4}>
                No connections found.
              </Typography>
            ) : (
              filteredFriends.map((friend) => {
                const isShared = sharedStatusMap[friend._id];
                const isLoading = sharingLoading[friend._id];
                return (
                  <ListItem
                    key={friend._id}
                    secondaryAction={
                      isShared ? (
                        <Button
                          disabled
                          size="small"
                          startIcon={<CheckCircleIcon color="success" />}
                          sx={{
                            color: "green !important",
                            fontWeight: 700,
                            textTransform: "none",
                          }}
                        >
                          Shared
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          disabled={isLoading}
                          onClick={() => handleShareWithFriend(friend)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderColor: "primary.main",
                            color: "primary.main",
                            "&:hover": {
                              backgroundColor: "rgba(129, 140, 248, 0.08)",
                              borderColor: "primary.dark",
                            },
                          }}
                        >
                          {isLoading ? "Sharing..." : "Share"}
                        </Button>
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={friend.profilePic}
                        sx={{
                          backgroundColor: "primary.main",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                        }}
                      >
                        {friend.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={friend.full_name}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: "text.primary",
                      }}
                    />
                  </ListItem>
                );
              })
            )}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setShareDialogOpen(false)}
            variant="contained"
            sx={{
              backgroundColor: "primary.main",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { backgroundColor: "primary.dark" },
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
