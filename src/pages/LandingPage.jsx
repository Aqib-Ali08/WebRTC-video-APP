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

const features = [
  {
    icon: <VideoCall sx={{ fontSize: 50, color: "primary.main" }} />,
    title: "Crystal-Clear Video Meetings",
    desc: "Host high-quality video calls with screen sharing & chat.",
  },
  {
    icon: <Chat sx={{ fontSize: 50, color: "primary.main" }} />,
    title: "Real-Time Messaging",
    desc: "Stay in touch with private & group chats anytime.",
  },
  {
    icon: <Schedule sx={{ fontSize: 50, color: "primary.main" }} />,
    title: "Smart Scheduling",
    desc: "Schedule meetings and get reminders instantly.",
  },
  {
    icon: <Lock sx={{ fontSize: 50, color: "primary.main" }} />,
    title: "Secure & Reliable",
    desc: "End-to-end encrypted communication with total privacy.",
  },
];

const LandingPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: "5rem" }}
      >
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          Effortless Meetings. Meaningful Connections.
        </Typography>

        <Typography variant="h6" color="text.secondary" paragraph>
          Syncora brings teams together with seamless video meetings and instant
          messaging — all in one powerful platform.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button component={Link} to="/login" variant="outlined" size="large">
            Join Meeting
          </Button>
        </Box>
      </motion.div>

      {/* Features */}
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              style={{ height: "100%" }}
            >
              <Card
                sx={{
                  textAlign: "center",
                  py: { xs: 4, md: 5 },
                  px: { xs: 2, md: 3 },
                  minHeight: 280,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: 3,
                  height: "100%",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {feature.icon}
                  <Typography variant="h6" mt={3} mb={1}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Final CTA */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginTop: "6rem" }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ready to sync your world?
        </Typography>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          size="large"
        >
          Get Started Free
        </Button>
      </motion.div>
    </Container>
  );
};

export default LandingPage;
