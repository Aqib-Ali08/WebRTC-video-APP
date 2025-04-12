import React from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  AvatarGroup,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const MeetingCard = ({ title, time, members, pending, highlight }) => (
  <Card
    component={motion.div}
    whileHover={{ scale: 1.02 }}
    sx={{
      p: 2,
      border: highlight ? "2px solid #ff9800" : "1px solid #eee",
      borderRadius: 1,
    }}
  >
    <Typography fontWeight="600">{title}</Typography>
    <Typography variant="body2" color="text.secondary">
      {time}
    </Typography>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={2}
    >
      <Box>
        <Typography variant="caption">
          {members.length} Members Going
        </Typography>
        <AvatarGroup max={4}>
          {members.map((src, idx) => (
            <Avatar key={idx} src={src} />
          ))}
        </AvatarGroup>
      </Box>
      {pending && (
        <Typography color="error" fontSize={12}>
          {pending} Pending
        </Typography>
      )}
    </Box>
    <Button
      variant={highlight ? "contained" : "outlined"}
      size="small"
      fullWidth
      sx={{ mt: 2 }}
    >
      View Details
    </Button>
  </Card>
);

const MeetingListPage = () => {
  return (
    <Box display="flex" minHeight="100%" bgcolor="#f3f5ff">
      {/* Main Content */}
      <Box flex={1} p={4}>
        <Typography variant="h6" fontWeight="600">
          Schedule Meetings
        </Typography>
        <Box display="flex" gap={2} mt={2}>
          {[
            {
              icon: "mdi:calendar-check",
              label: "Schedule meeting",
              count: 36,
              color: "#4caf50",
            },
            {
              icon: "mdi:calendar-refresh",
              label: "Rescheduled meeting",
              count: 14,
              color: "#ffc107",
            },
            {
              icon: "mdi:calendar-remove",
              label: "Cancelled meeting",
              count: 20,
              color: "#f44336",
            },
          ].map((stat, idx) => (
            <Box
              key={idx}
              p={2}
              bgcolor="white"
              borderRadius={1}
              display="flex"
              alignItems="center"
              gap={2}
              flex={1}
            >
              <Icon
                icon={stat.icon}
                color={stat.color}
                width={32}
                height={32}
              />
              <Box>
                <Typography fontWeight="600">{stat.count}</Typography>
                <Typography variant="caption">{stat.label}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Typography mt={4} fontWeight="600">
          Today - 6 meetings
        </Typography>
        <Grid container spacing={2} mt={1}>
          {[
            {
              title: "Design startup pro",
              time: "10:30 AM to 11:00 AM",
              members: [],
              pending: "2 Pending",
            },
            {
              title: "Design review",
              time: "10:30 AM to 11:00 AM",
              members: [],
              // highlight: true,
            },
            { title: "Client call", time: "10:30 AM to 11:00 AM", members: [] },
            {
              title: "New project",
              time: "10:30 AM to 11:00 AM",
              members: [],
              pending: "3 Pending",
            },
            {
              title: "Design testing",
              time: "10:30 AM to 11:00 AM",
              members: [],
              pending: "1 Pending",
            },
            {
              title: "Kick off meeting",
              time: "10:30 AM to 11:00 AM",
              members: [],
            },
          ].map((meeting, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <MeetingCard {...meeting} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Right Sidebar */}
      <Box width="260px" p={2} bgcolor="white" borderLeft="1px solid #eee">
        <Typography fontWeight="600">Date</Typography>
        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <CalendarMonthIcon />
          <Typography variant="body2">14th February 2020</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Typography fontWeight="600">Reminders</Typography>
        <Box mt={1}>
          {[
            { text: "Today is your meeting with PM.", color: "#e1f5fe" },
            { text: "You need to add 4 artwork in vector.", color: "#fce4ec" },
            {
              text: "You have closed the logo design in final.",
              color: "#e8f5e9",
            },
            { text: "Successfully completion of project.", color: "#fff3e0" },
          ].map((reminder, idx) => (
            <Box
              key={idx}
              p={1}
              my={1}
              bgcolor={reminder.color}
              borderRadius={1}
            >
              <Typography variant="caption">{reminder.text}</Typography>
            </Box>
          ))}
        </Box>
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          + Create Meeting
        </Button>
      </Box>
    </Box>
  );
};

export default MeetingListPage;
