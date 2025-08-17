import { Avatar, Box, Button, Divider, Paper, Typography } from "@mui/material";

export default function ChatProfilePanel() {
  return (
    <Paper
      elevation={3}
      sx={{ width: 300, p: 2, display: "flex", flexDirection: "column" }}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar
          src="/elizabeth.jpg"
          sx={{ width: 80, height: 80, mb: 1, bgcolor: "#0e7490" }}
        />
        <Typography variant="h6">Elizabeth Olsen</Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
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
  );
}
