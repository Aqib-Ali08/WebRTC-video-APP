import React from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  IconButton,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const ChatListPage = () => {
  return (
    <Box display="flex" height="100%">
      {/* Sidebar */}
      <Paper
        elevation={3}
        sx={{ width: 300, p: 2, display: "flex", flexDirection: "column" }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar src="/avatar.jpg" sx={{ mr: 2 }} />
          <Box>
            <Typography variant="h6">Gravid Christofer</Typography>
            <Typography variant="body2" color="text.secondary">
              Senior Developer
            </Typography>
          </Box>
        </Box>

        <TextField
          placeholder="Search Friends"
          size="small"
          fullWidth
          variant="outlined"
          // sx={{ mb: 2 }}
        />

        <List sx={{ overflowY: "auto", flex: 1 }}>
          {[
            "Brad Forst",
            "Paul Irish",
            "Lina Roy",
            "Jessica Giloy",
            "Eric Peterson",
            "Elizabeth Olsen",
          ].map((name) => (
            <ListItem key={name} button>
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="body1">{name}</Typography>}
                secondary={
                  <Typography variant="caption">{`Message for ${name.split(" ")[0].toLowerCase()}`}</Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Chat Section */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        borderLeft={1}
        borderRight={1}
        borderColor="divider"
      >
        <Box p={2} borderBottom={1} borderColor="divider">
          <Typography variant="h6">
            Elizabeth Olsen{" "}
            <span style={{ color: "green", fontSize: 12 }}>●</span>
          </Typography>
        </Box>

        <Box
          flex={1}
          p={2}
          display="flex"
          flexDirection="column"
          gap={1}
          sx={{ overflowY: "auto" }}
        >
          <Box
            alignSelf="flex-start"
            component={motion.div}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Paper
              sx={{ p: 1, bgcolor: "white", color: "black", borderRadius: 2 }}
            >
              <Typography variant="body2" align="left">
                That’s Great
              </Typography>
            </Paper>
          </Box>
          <Box
            alignSelf="flex-end"
            component={motion.div}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Paper
              sx={{ p: 1, bgcolor: "#6C63FF", color: "white", borderRadius: 2 }}
            >
              <Typography variant="body2">
                I am refer to the project structure and found some mistakes
              </Typography>
            </Paper>
          </Box>

          <Box
            alignSelf="flex-end"
            component={motion.div}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Paper
              sx={{ p: 1, bgcolor: "#6C63FF", color: "white", borderRadius: 2 }}
            >
              <Typography variant="body2">
                There are some bugs in this project
              </Typography>
            </Paper>
          </Box>
          <Box
            alignSelf="flex-start"
            component={motion.div}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Paper
              sx={{ p: 1, bgcolor: "white", color: "black", borderRadius: 2 }}
            >
              <Typography variant="body2" align="left">
                I see that project
              </Typography>
            </Paper>
          </Box>
          <Box
            alignSelf="flex-start"
            component={motion.div}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Paper
              sx={{ p: 1, bgcolor: "white", color: "black", borderRadius: 2 }}
            >
              <Typography variant="body2" align="left">
                Yes there are many bugs in that project
              </Typography>
            </Paper>
          </Box>

          <Box alignSelf="flex-end">
            <Button
              variant="contained"
              sx={{ textTransform: "none", borderRadius: 5 }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#fff", display: "flex", alignItems: "center" }}
              >
                PDF <Icon icon="mdi:chevron-down" style={{ marginLeft: 4 }} />
              </Typography>
            </Button>
          </Box>

          <Box alignSelf="flex-end">
            <Paper
              sx={{ p: 1, bgcolor: "#6C63FF", color: "white", borderRadius: 2 }}
            >
              <Typography variant="body2">
                Can you send me the report
              </Typography>
            </Paper>
          </Box>
        </Box>

        <Box
          p={2}
          borderTop={1}
          borderColor="divider"
          display="flex"
          alignItems="center"
          gap={1}
        >
          <TextField
            fullWidth
            placeholder="Write Something"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon icon="mdi:emoticon-happy-outline" />
                </InputAdornment>
              ),
            }}
          />
          <IconButton color="primary">
            <Icon icon="mdi:attachment" />
          </IconButton>
          <IconButton color="primary">
            <Icon icon="mdi:send" />
          </IconButton>
        </Box>
      </Box>

      {/* Profile Panel */}
      <Paper
        elevation={3}
        sx={{ width: 300, p: 2, display: "flex", flexDirection: "column" }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar src="/elizabeth.jpg" sx={{ width: 80, height: 80, mb: 1 }} />
          <Typography variant="h6">Elizabeth Olsen</Typography>
          <Typography variant="body2" color="text.secondary">
            Junior Developer
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-around" mb={2}>
          <Button
            startIcon={<Icon icon="mdi:chat-outline" />}
            variant="outlined"
          >
            <Typography variant="body2">Chat</Typography>
          </Button>
          <Button
            startIcon={<Icon icon="mdi:video-outline" />}
            variant="outlined"
          >
            <Typography variant="body2">Video Call</Typography>
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mb: 1 }}>
          ✔ View Friends
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          ⭐ Add to Favorites
        </Typography>

        <Typography variant="body2" fontWeight="bold" sx={{ mt: 2 }}>
          Attachments
        </Typography>
        <Box display="flex" gap={1} mt={1}>
          {["PDF", "Video", "MP3", "Image"].map((type) => (
            <Button key={type} variant="outlined" size="small">
              <Typography variant="caption">{type}</Typography>
            </Button>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatListPage;
