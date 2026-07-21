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
import { alpha, useTheme } from "@mui/material/styles";
import CircleIcon from "@mui/icons-material/Circle";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUserFullName,
  handleGetNotifications,
  handleMarkNotificationAsRead,
  handleMarkAllNotificationsAsRead,
  handleGetMeetings,
  handleGetUsersChat,
  handleListConnectedUsers
} from "../services";
import { useSocket } from "../context/socketContext";
import SocketEvents from "../constants/socketEvent";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Load Dayjs relative time plugin
dayjs.extend(relativeTime);



const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const socket = useSocket();

  const fullName = getCurrentUserFullName();

  // Dynamic Data States
  const [meetings, setMeetings] = useState([]);
  const [chats, setChats] = useState([]);
  const [connections, setConnections] = useState([]);

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
    const fetchData = async () => {
      try {
        const [meetingsRes, chatsRes, friendsRes] = await Promise.all([
          handleGetMeetings(),
          handleGetUsersChat(),
          handleListConnectedUsers(1, 100)
        ]);
        
        if (meetingsRes?.success && Array.isArray(meetingsRes.data)) {
          setMeetings(meetingsRes.data);
        }
        if (Array.isArray(chatsRes)) {
          setChats(chatsRes);
        }
        if (friendsRes?.data && Array.isArray(friendsRes.data)) {
          setConnections(friendsRes.data);
        }
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      }
    };
    fetchData();
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

  const upcomingMeetingsList = meetings
    .filter(m => dayjs(m.startTime).isAfter(dayjs()))
    .sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime)))
    .slice(0, 3)
    .map(m => ({
      title: m.title,
      time: dayjs(m.startTime).format("MMM DD • hh:mm A")
    }));

  const recentChatsList = chats
    .slice(0, 3)
    .map(c => {
      const isDirect = c.type === "direct";
      const participant = c.participants?.[0];
      const name = isDirect ? participant?.full_name : c.groupName;
      const message = c.lastMessage?.content || "No message yet";
      const avatar = (isDirect ? participant?.full_name?.[0] : c.groupName?.[0]) || "U";
      return { name, message, avatar };
    });

  const analyticsData = [
    {
      title: "Total Meetings",
      value: meetings.length.toString(),
      icon: <VideoCameraFront sx={{ color: "#c026d3", fontSize: 30 }} />,
    },
    {
      title: "Active Chats",
      value: chats.length.toString(),
      icon: <ChatBubbleOutline sx={{ color: "#38BDF8", fontSize: 30 }} />,
    },
    {
      title: "Connections",
      value: connections.length.toString(),
      icon: <Person sx={{ color: "#10B981", fontSize: 30 }} />,
    },
  ];

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      p={{ xs: 2, md: 4, lg: 5 }}
      sx={{
        height: "100vh",
        overflowY: "auto",
        backgroundColor: "background.default",
        overflowX: "hidden",
      }}
    >
      <Box
        component={motion.div}
        variants={itemVariants}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: "-0.5px" }}>
          <span
            style={{
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome Back,
          </span>{" "}
          <Box component="span" sx={{ color: "text.primary" }}>
            {fullName} 👋
          </Box>
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

      <Typography component={motion.p} variants={itemVariants} variant="body1" color="text.secondary" mb={4}>
        Here's an overview of your activity.
      </Typography>
      {/* Quick Actions */}
      <Stack component={motion.div} variants={itemVariants} direction={{ xs: "column", sm: "row" }} spacing={2} mb={5}>
        <Button
          variant="contained"
          startIcon={<AddCircleOutline />}
          onClick={() => navigate("/dashboard/meetings")}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
            borderRadius: 8,
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            transition: "all 0.3s ease",
            "&:hover": { 
              transform: "translateY(-3px)",
              boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.6)}`,
            },
          }}
        >
          Create Meeting
        </Button>
        <Button
          variant="contained"
          startIcon={<MarkUnreadChatAlt />}
          onClick={() => navigate("/dashboard/messages")}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
            boxShadow: `0 8px 24px ${alpha(theme.palette.info.main, 0.4)}`,
            borderRadius: 8,
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            transition: "all 0.3s ease",
            "&:hover": { 
              transform: "translateY(-3px)",
              boxShadow: `0 12px 28px ${alpha(theme.palette.info.main, 0.6)}`,
            },
          }}
        >
          New Chat
        </Button>
        <Button
          variant="contained"
          startIcon={<PersonAddAlt1 />}
          onClick={() => navigate("/dashboard/connections")}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
            boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.4)}`,
            borderRadius: 8,
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            transition: "all 0.3s ease",
            "&:hover": { 
              transform: "translateY(-3px)",
              boxShadow: `0 12px 28px ${alpha(theme.palette.success.main, 0.6)}`,
            },
          }}
        >
          Add New Connections
        </Button>
      </Stack>

      {/* Analytics Cards */}
      <Grid container spacing={3} mb={5} component={motion.div} variants={containerVariants}>
        {analyticsData.map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box
              component={motion.div}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              sx={{
                p: 3.5,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.4)})`,
                backdropFilter: "blur(12px)",
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.05)}`,
                transition: "all 0.3s ease",
              }}
            >
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
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.background.default, 0.6),
                      boxShadow: `inset 0 2px 10px ${alpha(theme.palette.background.paper, 0.5)}`
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="body1" fontWeight={600} color="text.secondary">
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={800} color="text.primary">
                  {item.value}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Overview Sections */}
      <Grid container spacing={3} component={motion.div} variants={containerVariants}>
        {/* Upcoming Meetings */}
        <Grid item xs={12} md={6}>
          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{
              p: 3,
              height: "100%",
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.5)})`,
              backdropFilter: "blur(12px)",
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight={700}>Upcoming Meetings</Typography>
              <Upcoming sx={{ color: theme.palette.warning.main, fontSize: 28 }} />
            </Box>

            {upcomingMeetingsList.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No upcoming meetings.</Typography>
            ) : upcomingMeetingsList.map((meeting, index) => (
              <Box key={index} mb={2.5} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ width: 4, height: 40, borderRadius: 2, bgcolor: 'primary.main' }} />
                <Box>
                  <Typography fontWeight={700} color="text.primary">{meeting.title}</Typography>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    {meeting.time}
                  </Typography>
                </Box>
              </Box>
            ))}

            <Button
              variant="outlined"
              fullWidth
              size="small"
              onClick={() => navigate("/dashboard/meetings")}
              sx={{
                borderColor: alpha(theme.palette.primary.main, 0.5),
                color: "primary.main",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 3,
                mt: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: "white",
                  borderColor: "transparent",
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
              }}
            >
              View All
            </Button>
          </Box>
        </Grid>

        {/* Recent Chats */}
        <Grid item xs={12} md={6}>
          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{
              p: 3,
              height: "100%",
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.5)})`,
              backdropFilter: "blur(12px)",
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6" fontWeight={700}>Recent Chats</Typography>
              <Chat sx={{ color: theme.palette.success.main, fontSize: 28 }} />
            </Box>

            <List sx={{ px: 0 }}>
              {recentChatsList.length === 0 ? (
                 <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>No recent chats.</Typography>
              ) : recentChatsList.map((chat, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                      fontWeight: 700 
                    }}>
                      {chat.avatar}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={<Typography fontWeight={600} fontSize="0.95rem">{chat.name}</Typography>}
                    secondary={chat.message} 
                    secondaryTypographyProps={{ sx: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 500 } }} 
                  />
                </ListItem>
              ))}
            </List>

            <Button
              variant="outlined"
              fullWidth
              size="small"
              onClick={() => navigate("/dashboard/messages")}
              sx={{
                borderColor: alpha(theme.palette.success.main, 0.5),
                color: "success.main",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 3,
                mt: 1.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                  color: "white",
                  borderColor: "transparent",
                  boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.4)}`,
                },
              }}
            >
              View All
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
