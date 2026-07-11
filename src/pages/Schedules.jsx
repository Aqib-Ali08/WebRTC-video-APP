// src/pages/Schedules.jsx
import { Box, Paper, Tab, Tabs, Typography, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NoteIcon from "@mui/icons-material/Note";
import ShareIcon from "@mui/icons-material/Share";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import AllNotes from "./AllNotes";
import SharedNotes from "../components/SharedNotes";
import { handleGetNotes, handleGetSharedNotes } from "../services";

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Schedules() {
  const [tabIndex, setTabIndex] = useState(0);
  const [notes, setNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notes and shared notes from backend APIs
  const loadData = async () => {
    try {
      const [notesData, sharedData] = await Promise.all([
        handleGetNotes(),
        handleGetSharedNotes()
      ]);
      setNotes(notesData || []);
      
      const combinedShared = [
        ...(sharedData?.received || []),
        ...(sharedData?.sent || [])
      ];
      setSharedNotes(combinedShared);
    } catch (error) {
      console.error("Failed to load notes data from backend:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen for custom events to refresh stats/data if triggered elsewhere
    const handleSync = () => loadData();
    window.addEventListener("syncora_notes_updated", handleSync);
    return () => {
      window.removeEventListener("syncora_notes_updated", handleSync);
    };
  }, []);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
        overflowY: "auto",
        boxSizing: "border-box"
      }}
    >
      {/* Header Panel with Premium Stats Card */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg, #4f46e5 0%, #075985 100%)",
            color: "white",
            boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.3)"
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: "-0.5px" }}>
                Notes & Collaboration
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 400 }}>
                Draft personal reminders, capture ideas, and share them instantly with your connections.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  justifyContent: { xs: "flex-start", md: "flex-end" }
                }}
              >
                <Box
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2.5,
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: 2
                  }}
                >
                  <NoteIcon sx={{ fontSize: 32, color: "#a5f3fc" }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1 }}>
                      {loading ? "..." : notes.length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      Total Notes
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2.5,
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: 2
                  }}
                >
                  <FolderSharedIcon sx={{ fontSize: 32, color: "#a5f3fc" }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1 }}>
                      {loading ? "..." : sharedNotes.length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      Shared Items
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Main Content Area */}
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabIndex}
            onChange={(e, newIndex) => setTabIndex(newIndex)}
            textColor="inherit"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "primary.main",
                height: 3,
                borderRadius: "3px 3px 0 0"
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                fontSize: "1.05rem",
                color: "text.secondary",
                px: 3,
                minHeight: 48,
                transition: "color 0.2s",
                "&.Mui-selected": {
                  color: "primary.main"
                }
              }
            }}
          >
            <Tab label="My Notes" icon={<NoteIcon sx={{ fontSize: 20 }} />} iconPosition="start" />
            <Tab label="Shared Notes Hub" icon={<ShareIcon sx={{ fontSize: 20 }} />} iconPosition="start" />
          </Tabs>
        </Box>

        <AnimatePresence mode="wait">
          <motion.div
            key={tabIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            style={{ width: "100%" }}
          >
            <TabPanel value={tabIndex} index={0}>
              <AllNotes
                notes={notes}
                onRefresh={loadData}
              />
            </TabPanel>

            <TabPanel value={tabIndex} index={1}>
              <SharedNotes
                sharedNotes={sharedNotes}
                onRefresh={loadData}
              />
            </TabPanel>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
