// src/pages/HomePage.jsx

import React, { useState } from "react";
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
} from "@mui/material";
import { Icon } from "@iconify/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slices/appSlice";

const analyticsData = [
  {
    title: "Total Meetings",
    value: "24",
    icon: "material-symbols:video-call-outline",
    color: "#6366F1",
  },
  {
    title: "Active Chats",
    value: "8",
    icon: "material-symbols:chat-bubble-outline",
    color: "#38BDF8",
  },
  {
    title: "Users Online",
    value: "5",
    icon: "material-symbols:person-outline",
    color: "#10B981",
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
  { label: "Create Event", icon: "material-symbols:event-note-outline" },
  { label: "Set Reminder", icon: "material-symbols:alarm-add-outline" },
  { label: "Book Slot", icon: "material-symbols:schedule-send-outline" },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(new Date());

  return (
    <Box p={3}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600} mb={1.5}>
            Welcome Back, User 👋
          </Typography>
        </Box>
      </Box>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Here's an overview of your activity.
      </Typography>
      {/* Quick Actions */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
        <Button
          variant="contained"
          startIcon={
            <Icon icon="material-symbols:add-circle-outline-rounded" />
          }
        >
          Create Meeting
        </Button>
        <Button
          variant="contained"
          startIcon={<Icon icon="material-symbols:chat-add-on-outline" />}
        >
          New Chat
        </Button>
        <Button
           variant="contained"
          startIcon={<Icon icon="basil:user-plus-solid" />}
        >
          Add New Connections
        </Button>
      </Stack>

      {/* Analytics Cards */}
      <Grid container spacing={3} mb={4}>
        {analyticsData.map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Icon icon={item.icon} width="36" color={item.color} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.title}
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {item.value}
                  </Typography>
                </Box>
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
              <Icon
                icon="material-symbols:calendar-month"
                width="24"
                color="#6366F1"
              />
            </Box>

            {upcomingMeetings.map((meeting, index) => (
              <Box key={index} mb={2}>
                <Typography fontWeight={600}>{meeting.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {meeting.time}
                </Typography>
              </Box>
            ))}

            <Button variant="contained" fullWidth>
              View All
            </Button>
          </Paper>
        </Grid>

        {/* Recent Chats */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Recent Chats</Typography>
              <Icon icon="material-symbols:chat" width="24" color="#6366F1" />
            </Box>

            <List>
              {recentChats.map((chat, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar>{chat.avatar}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={chat.name} secondary={chat.message} />
                </ListItem>
              ))}
            </List>

            <Button variant="outlined" fullWidth>
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
              <Icon
                icon="material-symbols:bolt-outline"
                width="24"
                color="#6366F1"
              />
            </Box>

            <Stack spacing={2}>
              {scheduleShortcuts.map((shortcut, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  startIcon={<Icon icon={shortcut.icon} />}
                  fullWidth
                >
                  {shortcut.label}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
