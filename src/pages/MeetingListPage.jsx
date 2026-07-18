import {
  Box,
  Typography,
  Button,
  Avatar,
  AvatarGroup,
  Card,
  Grid,
  Divider,
  useTheme,
  alpha,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { motion } from "framer-motion";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  Add,
  EventAvailable,
  EventBusy,
  EventRepeat,
  MoreVert,
  Delete,
  Edit
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleGetMeetings, handleCreateMeeting, handleListConnectedUsers, handleUpdateMeeting, handleDeleteMeeting } from "../services";
import dayjs from "dayjs";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const MeetingCard = ({ meeting, onJoin, onEdit, onDelete }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Highlight if it starts in less than an hour
  const isSoon = dayjs(meeting.startTime).diff(dayjs(), 'minute') > 0 && dayjs(meeting.startTime).diff(dayjs(), 'minute') < 60;

  return (
    <Card
      component={motion.div}
      variants={itemVariants}
      whileHover={{ y: -6, scale: 1.01 }}
      sx={{
        p: 2.5,
        position: "relative",
        overflow: "visible",
        background: isSoon
          ? `linear-gradient(145deg, ${alpha(theme.palette.primary.dark, 0.4)}, ${alpha(theme.palette.background.paper, 0.8)})`
          : alpha(theme.palette.background.paper, 0.6),
        backdropFilter: "blur(12px)",
        border: `1px solid ${isSoon ? theme.palette.primary.main : alpha(theme.palette.divider, 0.08)}`,
        borderRadius: 4,
        boxShadow: isSoon ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}` : "0 4px 20px rgba(0,0,0,0.1)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: isSoon
            ? `0 12px 40px ${alpha(theme.palette.primary.main, 0.3)}`
            : `0 12px 28px rgba(0,0,0,0.2)`,
          borderColor: theme.palette.primary.light
        }
      }}
    >
      {isSoon && (
        <Box
          sx={{
            position: "absolute",
            top: -6,
            right: 24,
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: theme.palette.primary.main,
            boxShadow: `0 0 12px ${theme.palette.primary.main}`
          }}
        />
      )}

      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="h6" fontWeight="700" color="text.primary">
          {meeting.title}
        </Typography>
        <IconButton size="small" sx={{ color: "text.secondary" }} onClick={handleClick}>
          <MoreVert fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{ sx: { borderRadius: 2, minWidth: 120 } }}
        >
          <MenuItem onClick={() => { handleClose(); onEdit(meeting); }}>
            <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { handleClose(); onDelete(meeting._id); }} sx={{ color: 'error.main' }}>
            <ListItemIcon><Delete fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

      <Box display="inline-block" mt={1} px={1.5} py={0.5} borderRadius={2} bgcolor={alpha(theme.palette.primary.main, 0.1)}>
        <Typography variant="caption" fontWeight="600" color="primary.light">
          {dayjs(meeting.startTime).format("MMM DD, hh:mm A")}
        </Typography>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
      >
        <Box>
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            {meeting.members?.length > 0 ? `${meeting.members.length} Members` : "No members joined yet"}
          </Typography>
          {meeting.members?.length > 0 && (
            <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 30, height: 30, fontSize: "0.8rem", borderColor: theme.palette.background.paper } }}>
              {meeting.members.map((member, idx) => (
                <Avatar key={idx} src={member.profilePic} />
              ))}
            </AvatarGroup>
          )}
        </Box>
      </Box>
      <Button
        variant={isSoon ? "contained" : "outlined"}
        size="small"
        fullWidth
        onClick={() => onJoin(meeting.roomId)}
        sx={{
          mt: 3,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: "600",
          ...(isSoon && {
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
          })
        }}
      >
        Join Meeting
      </Button>
    </Card>
  );
};

const MeetingListPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState(null);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [newReminderText, setNewReminderText] = useState("");
  const [editMeetingId, setEditMeetingId] = useState(null);

  const fetchMeetings = async () => {
    try {
      const res = await handleGetMeetings();
      if (res.success) {
        setMeetings(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMeetings();
    const fetchFriends = async () => {
      try {
        const res = await handleListConnectedUsers(1, 100);
        if (res.data) {
          setFriends(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch friends", err);
      }
    };
    fetchFriends();
  }, []);

  const handleCreate = async () => {
    if (!newTitle || !newTime) return;
    try {
      const memberIds = selectedFriends.map(f => f._id);
      if (editMeetingId) {
        await handleUpdateMeeting(editMeetingId, { title: newTitle, startTime: newTime ? newTime.toISOString() : "", members: memberIds });
      } else {
        await handleCreateMeeting({ title: newTitle, startTime: newTime ? newTime.toISOString() : "", members: memberIds });
      }
      setIsModalOpen(false);
      setNewTitle("");
      setNewTime(null);
      setSelectedFriends([]);
      setEditMeetingId(null);
      fetchMeetings(); // Refresh list
    } catch (err) {
      console.error("Failed to save meeting", err);
    }
  };

  const handleEditClick = (meeting) => {
    setEditMeetingId(meeting._id);
    setNewTitle(meeting.title);
    setNewTime(dayjs(meeting.startTime));
    setSelectedFriends(meeting.members || []);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (meetingId) => {
    if(window.confirm("Are you sure you want to delete this meeting?")) {
      try {
        await handleDeleteMeeting(meetingId);
        fetchMeetings();
      } catch (err) {
        console.error("Failed to delete meeting", err);
      }
    }
  };

  const handleJoin = (roomId) => {
    navigate(`/dashboard/meeting/${roomId}`);
  };

  return (
    <Box
      display="flex"
      bgcolor="background.default"
      sx={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Main Content */}
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        flex={1}
        p={{ xs: 2, md: 4 }}
        sx={{ overflowY: "auto", pr: 2 }}
      >
        <Typography
          variant="h4"
          fontWeight="800"
          component={motion.h4}
          variants={itemVariants}
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.info.light})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 4
          }}
        >
          Schedule Meetings
        </Typography>

        <Grid container spacing={3} component={motion.div} variants={containerVariants}>
          {[
            {
              icon: <EventAvailable sx={{ fontSize: 32, color: "#4ade80" }} />,
              label: "Scheduled",
              count: meetings.length,
              glow: "rgba(74, 222, 128, 0.2)"
            },
            {
              icon: <EventRepeat sx={{ fontSize: 32, color: "#facc15" }} />,
              label: "Rescheduled",
              count: 0,
              glow: "rgba(250, 204, 21, 0.2)"
            },
            {
              icon: <EventBusy sx={{ fontSize: 32, color: "#f87171" }} />,
              label: "Cancelled",
              count: 0,
              glow: "rgba(248, 113, 113, 0.2)"
            },
          ].map((stat, idx) => (
            <Grid item xs={12} sm={4} key={idx}>
              <Box
                component={motion.div}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                sx={{
                  p: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.4)})`,
                  backdropFilter: "blur(10px)",
                  borderRadius: 4,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: `0 8px 32px ${stat.glow}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease"
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.background.default, 0.5),
                      boxShadow: `inset 0 2px 10px ${stat.glow}`
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="body1" fontWeight="600" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="800" color="text.primary">
                  {stat.count}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={6} mb={3}>
          <Typography variant="h6" fontWeight="700" color="text.primary">
            Upcoming - <Typography component="span" variant="h6" color="primary.main" fontWeight="700">{meetings.length} meetings</Typography>
          </Typography>
        </Box>

        <Grid container spacing={3} component={motion.div} variants={containerVariants}>
          {meetings.map((meeting) => (
            <Grid item xs={12} sm={6} lg={4} key={meeting._id}>
              <MeetingCard 
                meeting={meeting} 
                onJoin={handleJoin}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            </Grid>
          ))}
          {meetings.length === 0 && (
            <Grid item xs={12}>
              <Typography color="text.secondary" mt={2}>No scheduled meetings found. Create one!</Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Right Sidebar */}
      <Box
        component={motion.div}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 90 }}
        width={{ xs: "100%", md: "320px" }}
        p={3}
        sx={{
          background: alpha(theme.palette.background.paper, 0.4),
          backdropFilter: "blur(20px)",
          borderLeft: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column'
        }}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            setEditMeetingId(null);
            setNewTitle("");
            setNewTime(null);
            setSelectedFriends([]);
            setIsModalOpen(true);
          }}
          sx={{
            py: 1.5,
            borderRadius: 3,
            mb: 4,
            fontWeight: "700",
            textTransform: "none",
            fontSize: "1rem",
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
            "&:hover": {
              boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.6)}`,
            }
          }}
        >
          <Add sx={{ mr: 1 }} /> Create Meeting
        </Button>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="700">Calendar</Typography>
          <Box display="flex" alignItems="center" gap={1} bgcolor={alpha(theme.palette.primary.main, 0.1)} px={1.5} py={0.5} borderRadius={2}>
            <CalendarMonthIcon sx={{ color: "primary.light", fontSize: 18 }} />
            <Typography variant="caption" fontWeight="600" color="primary.light">
              {dayjs().format("MMM DD, YYYY")}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: alpha(theme.palette.divider, 0.1) }} />

        <Typography variant="h6" fontWeight="700" mb={2}>Reminders</Typography>
        <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
          {reminders.map((reminder) => (
            <Box
              key={reminder.id}
              p={2}
              mb={2}
              sx={{
                bgcolor: alpha(theme.palette[reminder.color].main, 0.1),
                borderLeft: `4px solid ${theme.palette[reminder.color].main}`,
                borderRadius: 2,
                transition: "transform 0.2s",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                "&:hover": {
                  transform: "translateX(4px)",
                  "& .delete-btn": { opacity: 1 }
                }
              }}
            >
              <Typography variant="body2" fontWeight="500" color="text.primary">
                {reminder.text}
              </Typography>
              <IconButton
                size="small"
                className="delete-btn"
                onClick={() => setReminders(reminders.filter(r => r.id !== reminder.id))}
                sx={{ opacity: 0, transition: "opacity 0.2s", color: theme.palette[reminder.color].main, p: 0.5 }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
        <Box mt={2} display="flex" gap={1}>
          <TextField
            size="small"
            placeholder="New reminder..."
            variant="outlined"
            fullWidth
            value={newReminderText}
            onChange={(e) => setNewReminderText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newReminderText.trim()) {
                const colors = ['info', 'error', 'success', 'warning', 'primary'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                setReminders([...reminders, { id: Date.now(), text: newReminderText.trim(), color: randomColor }]);
                setNewReminderText("");
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.5)
              }
            }}
          />
          <Button
            variant="contained"
            onClick={() => {
              if (newReminderText.trim()) {
                const colors = ['info', 'error', 'success', 'warning', 'primary'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                setReminders([...reminders, { id: Date.now(), text: newReminderText.trim(), color: randomColor }]);
                setNewReminderText("");
              }
            }}
            sx={{ minWidth: 40, width: 40, borderRadius: 2, p: 0 }}
          >
            <Add />
          </Button>
        </Box>
      </Box>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} PaperProps={{ sx: { borderRadius: 4, p: 2, width: 400 } }}>
        <DialogTitle fontWeight="bold">{editMeetingId ? "Edit Meeting" : "Create New Meeting"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Meeting Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Start Time"
              value={newTime}
              onChange={(newValue) => setNewTime(newValue)}
              sx={{ width: '100%', mb: 2 }}
              slotProps={{ textField: { margin: 'dense', variant: 'outlined' } }}
            />
          </LocalizationProvider>
          <Autocomplete
            multiple
            options={friends}
            getOptionLabel={(option) => option.full_name || option.username}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={selectedFriends}
            onChange={(event, newValue) => {
              setSelectedFriends(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Add Friends"
                placeholder="Select friends"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  avatar={<Avatar src={option.profilePic} />}
                  label={option.full_name || option.username}
                  {...getTagProps({ index })}
                  key={option._id}
                />
              ))
            }
          />
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 2 }}>
          <Button onClick={() => setIsModalOpen(false)} color="inherit" sx={{ textTransform: "none", fontWeight: "bold" }}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 2 }}>{editMeetingId ? "Save" : "Create"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MeetingListPage;
