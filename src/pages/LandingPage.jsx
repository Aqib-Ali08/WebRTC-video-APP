import {
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import { VideoCall, Chat, Schedule, Lock } from "@mui/icons-material";
import { Link } from "react-router-dom";
import applogo from "../assets/video-call.svg";

const features = [
  {
    icon: <VideoCall sx={{ fontSize: 45, color: "primary.main" }} />,
    title: "Crystal-Clear Video Meetings",
    desc: "Host high-quality video calls with screen sharing & chat.",
  },
  {
    icon: <Chat sx={{ fontSize: 36, color: "primary.main" }} />,
    title: "Real-Time Messaging",
    desc: "Stay in touch with private & group chats anytime.",
  },
  {
    icon: <Schedule sx={{ fontSize: 36, color: "primary.main" }} />,
    title: "Smart Scheduling",
    desc: "Schedule meetings and get reminders instantly.",
  },
  {
    icon: <Lock sx={{ fontSize: 36, color: "primary.main" }} />,
    title: "Secure & Reliable",
    desc: "End-to-end encrypted communication with total privacy.",
  },
];

const LandingPage = () => {
  return (
    <Box
      sx={{
        height: "100vh", // Full viewport height
        overflow: "hidden", // Prevent scroll
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Bar */}
      <Box
        sx={{
          px: 4,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <img
            src={applogo}
            alt="Company Logo"
            style={{ width: "50px", height: "50px" }}
          />{" "}
          <Typography variant="subtitle1" fontWeight={600}>
            WebRTC
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="subtitle2">Ready to sync your world?</Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="small"
          >
            Get Started for Free
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          overflow: "auto", // allow scroll only if absolutely necessary
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 2,
        }}
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Effortless Meetings. Meaningful Connections.
          </Typography>

          <Typography variant="subtitle2" color="text.secondary">
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: "1rem",
                background: "linear-gradient(90deg, #115e59, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Syncora
            </Box>{" "}
            brings teams together with seamless video meetings and instant
            messaging — all in one powerful platform.
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{ mr: 1.5 }}
            >
              Get Started
            </Button>
            <Button component={Link} to="/login" variant="outlined">
              Join Meeting
            </Button>
          </Box>
        </motion.div>

        {/* Features Section */}
        <Grid container spacing={2}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ height: "100%" }}
              >
                <Card
                  sx={{
                    textAlign: "center",
                    py: 2,
                    px: 1,
                    minHeight: 180,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    boxShadow: 2,
                  }}
                >
                  <CardContent>
                    {feature.icon}
                    <Typography variant="h6" mt={1} mb={0.5}>
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.8rem" }}
                    >
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
