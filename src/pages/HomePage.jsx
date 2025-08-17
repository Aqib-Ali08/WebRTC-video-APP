// src/pages/HomePage.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material";
import "react-calendar/dist/Calendar.css";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slices/appSlice";
import { useNavigate } from "react-router-dom";
import {
  AccessAlarm,
  AddCircleOutline,
  CalendarMonth,
  Chat,
  ChatBubbleOutline,
  MarkUnreadChatAlt,
  Notifications,
  Person,
  PersonAddAlt1,
  ScheduleSend,
  Shortcut,
  Upcoming,
  VideoCameraFront,
} from "@mui/icons-material";

const analyticsData = [
  {
    title: "Total Meetings",
    value: "24",
    icon: <VideoCameraFront sx={{ color: "#c026d3", fontSize: 30 }} />,
  },
  {
    title: "Active Chats",
    value: "8",
    icon: <ChatBubbleOutline sx={{ color: "#38BDF8", fontSize: 30 }} />,
  },
  {
    title: "Users Online",
    value: "5",
    icon: <Person sx={{ color: "#10B981", fontSize: 30 }} />,
  },
];

const upcomingMeetings = [
  { title: "Team Sync", time: "Today • 3:00 PM" },
  { title: "Client Demo", time: "Tomorrow • 11:00 AM" },
];

const recentChats = [
  { name: "Arjun Sen", message: "Let's connect soon!", avatar: "A" },
  { name: "Priya Das", message: "Shared the document.", avatar: "P" },
];

const scheduleShortcuts = [
  { label: "Create Event", icon: <CalendarMonth /> },
  { label: "Set Reminder", icon: <AccessAlarm /> },
  { label: "Book Slot", icon: <ScheduleSend /> },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const sessionStorageData = sessionStorage.getItem("authData");
    const localStorageData = localStorage.getItem("authData");

    if (sessionStorageData || localStorageData) {
      try {
        const authData = JSON.parse(sessionStorageData || localStorageData);
        const user = authData.user;
        console.log("user", user);
        setFirstName(user);
      } catch (e) {
        console.log(
          "Error parsing username from session storage or local storage",
          e
        );
      }
    }
  }, []);

  return (
    <Box
      p={3}
      sx={{
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // pushes text left, icon right
        }}
      >
        <Typography variant="h4" fontWeight={600} mb={1.5}>
          <span
            style={{
              background: "linear-gradient(90deg, #115e59, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome Back,
          </span>{" "}
          {firstName.toUpperCase()} 👋
        </Typography>

        <Tooltip title="Notifications">
          <IconButton>
            <Badge badgeContent={4} color="primary">
              <Notifications />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>

      <Typography variant="body1" color="text.secondary" mb={3}>
        Here's an overview of your activity.
      </Typography>
      {/* Quick Actions */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
        <Button
          variant="contained"
          startIcon={<AddCircleOutline />}
          onClick={() => navigate("/dashboard/meetings")}
        >
          Create Meeting
        </Button>
        <Button
          variant="contained"
          startIcon={<MarkUnreadChatAlt />}
          onClick={() => navigate("/dashboard/messages")}
        >
          New Chat
        </Button>
        <Button
          variant="contained"
          startIcon={<PersonAddAlt1 />}
          onClick={() => navigate("/dashboard/connections")}
        >
          Add New Connections
        </Button>
      </Stack>

      {/* Analytics Cards */}
      <Grid container spacing={3} mb={4}>
        {analyticsData.map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  {item.icon}
                  <Typography variant="body1" color="text.secondary">
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight={600}>
                  {item.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Overview Sections */}
      <Grid container spacing={3}>
        {/* Upcoming Meetings */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Upcoming Meetings</Typography>
              <Upcoming sx={{ color: "#fdba74" }} />
            </Box>

            {upcomingMeetings.map((meeting, index) => (
              <Box key={index} mb={2}>
                <Typography fontWeight={600}>{meeting.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {meeting.time}
                </Typography>
              </Box>
            ))}

            <Button
              variant="outlined"
              fullWidth
              size="small"
              sx={{
                "&:hover": {
                  // backgroundColor: "#6366F1",
                  backgroundColor: "#0e7490",
                  color: "white",
                },
                marginTop: "2.5rem",
              }}
            >
              View All
            </Button>
          </Paper>
        </Grid>

        {/* Schedule Shortcuts */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Schedule Shortcuts</Typography>
              <Shortcut sx={{ color: "#fdba74" }} />
            </Box>

            <Stack spacing={2} sx={{ marginTop: "3rem" }}>
              {scheduleShortcuts.map((shortcut, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  startIcon={shortcut.icon}
                  fullWidth
                  size="small"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#0e7490",
                      color: "white",
                      "& .MuiSvgIcon-root": { color: "white" }, // make icon white on hover
                    },
                  }}
                >
                  {shortcut.label}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Recent Chats */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              // mb={2}
            >
              <Typography variant="h6">Recent Chats</Typography>
              <Chat sx={{ color: "#fdba74" }} />
            </Box>

            <List>
              {recentChats.map((chat, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: "#0e7490" }}>
                      {chat.avatar}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={chat.name} secondary={chat.message} />
                </ListItem>
              ))}
            </List>

            <Button
              variant="outlined"
              fullWidth
              size="small"
              sx={{
                "&:hover": {
                  // backgroundColor: "#6366F1",
                  backgroundColor: "#0e7490",
                  color: "white",
                },
                marginTop: "1rem",
              }}
            >
              View All
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
