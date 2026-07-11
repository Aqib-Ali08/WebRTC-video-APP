// src/pages/HomePage.jsx
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
import {
  Avatar,
  Badge,
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  Popover,
  Divider,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUserFullName,
  handleGetNotifications,
  handleMarkNotificationAsRead,
  handleMarkAllNotificationsAsRead,
} from "../services";
import { useSocket } from "../context/socketContext";
import SocketEvents from "../constants/socketEvent";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Load Dayjs relative time plugin
dayjs.extend(relativeTime);

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
  const socket = useSocket();

  const fullName = getCurrentUserFullName();

  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  // Load user notifications from DB
  const loadNotifications = async () => {
    try {
      const data = await handleGetNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Listen for socket notification events to reload counts live
  useEffect(() => {
    if (!socket) return;

    const handleNotify = () => {
      loadNotifications();
    };

    socket.on(SocketEvents.NOTIFY, handleNotify);

    return () => {
      socket.off(SocketEvents.NOTIFY, handleNotify);
    };
  }, [socket]);

  // Click handlers
  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notification) => {
    try {
      await handleMarkNotificationAsRead(notification._id);
      loadNotifications();
      
      // If notification is a note update, redirect user to schedules/notes
      if (notification.type === "note_update") {
        navigate("/dashboard/schedule");
      }
      handleClosePopover();
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await handleMarkAllNotificationsAsRead();
      loadNotifications();
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const popoverOpen = Boolean(anchorEl);

  return (
    <Box
      p={3}
      sx={{
        height: "100vh",
        overflowY: "auto",
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: "-0.5px" }}>
          <span
            style={{
              background: "linear-gradient(90deg, #818cf8, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome Back,
          </span>{" "}
          {fullName} 👋
        </Typography>

        {/* Interactive Notifications Bell */}
        <Tooltip title="Notifications">
          <IconButton onClick={handleBellClick}>
            <Badge badgeContent={unreadCount} color="error" max={99}>
              <Notifications sx={{ color: "primary.main", fontSize: 28 }} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Notifications Popover Dropdown */}
        <Popover
          open={popoverOpen}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              width: 360,
              maxHeight: 480,
              borderRadius: 3.5,
              mt: 1.5,
              boxShadow: "0 10px 30px -5px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          {/* Popover Header */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={700} color="text.primary">
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                startIcon={<DoneAllIcon sx={{ fontSize: 16 }} />}
                onClick={handleMarkAllRead}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  color: "primary.main",
                  "&:hover": { bgcolor: "rgba(129, 140, 248, 0.08)" },
                }}
              >
                Mark all read
              </Button>
            )}
          </Box>
          <Divider />

          {/* Popover Scrollable List */}
          <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
            {notifications.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No notifications yet.
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {notifications.map((item) => (
                  <ListItemButton
                    key={item._id}
                    onClick={() => handleMarkAsRead(item)}
                    sx={{
                      p: 2,
                      alignItems: "flex-start",
                      backgroundColor: item.isRead ? "transparent" : "rgba(129, 140, 248, 0.05)",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                      transition: "background-color 0.2s",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                      },
                    }}
                  >
                    <ListItemAvatar sx={{ mt: 0.5 }}>
                      <Avatar
                        src={item.senderId?.profilePic}
                        sx={{
                          backgroundColor: "primary.main",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          width: 36,
                          height: 36,
                        }}
                      >
                        {item.senderId?.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "S"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.message}
                      secondary={dayjs(item.createdAt).fromNow()}
                      primaryTypographyProps={{
                        fontWeight: item.isRead ? 500 : 700,
                        fontSize: "0.88rem",
                        color: "text.primary",
                        mb: 0.5,
                      }}
                      secondaryTypographyProps={{
                        fontSize: "0.75rem",
                        color: "text.secondary",
                      }}
                    />
                    {!item.isRead && (
                      <CircleIcon
                        sx={{
                          color: "primary.main",
                          fontSize: 10,
                          mt: 1.5,
                          ml: 1,
                        }}
                      />
                    )}
                  </ListItemButton>
                ))}
              </List>
            )}
          </Box>
        </Popover>
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
          sx={{
            backgroundColor: "primary.main",
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 700,
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          Create Meeting
        </Button>
        <Button
          variant="contained"
          startIcon={<MarkUnreadChatAlt />}
          onClick={() => navigate("/dashboard/messages")}
          sx={{
            backgroundColor: "primary.main",
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 700,
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          New Chat
        </Button>
        <Button
          variant="contained"
          startIcon={<PersonAddAlt1 />}
          onClick={() => navigate("/dashboard/connections")}
          sx={{
            backgroundColor: "primary.main",
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 700,
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          Add New Connections
        </Button>
      </Stack>

      {/* Analytics Cards */}
      <Grid container spacing={3} mb={4}>
        {analyticsData.map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
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
          <Paper elevation={2} sx={{ p: 3, height: "100%", borderRadius: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight={700}>Upcoming Meetings</Typography>
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
              onClick={() => navigate("/dashboard/meetings")}
              sx={{
                borderColor: "primary.main",
                color: "primary.main",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "primary.main",
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
          <Paper elevation={2} sx={{ p: 3, height: "100%", borderRadius: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight={700}>Schedule Shortcuts</Typography>
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
                  onClick={() => navigate("/dashboard/schedule")}
                  sx={{
                    borderColor: "primary.main",
                    color: "primary.main",
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "white",
                      "& .MuiSvgIcon-root": { color: "white" },
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
          <Paper elevation={2} sx={{ p: 3, height: "100%", borderRadius: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight={700}>Recent Chats</Typography>
              <Chat sx={{ color: "#fdba74" }} />
            </Box>

            <List>
              {recentChats.map((chat, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: "primary.main" }}>
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
              onClick={() => navigate("/dashboard/messages")}
              sx={{
                borderColor: "primary.main",
                color: "primary.main",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "primary.main",
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
