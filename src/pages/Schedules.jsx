import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import AllNotes from "./AllNotes";
import SharedNotes from "./SharedNotes";

function TabPanel({ children, value, index }) {
  return (
    value === index && (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mt: 2,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography>{children}</Typography>
      </Paper>
    )
  );
}

export default function Schedules() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box
      sx={{
        p: 4,
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
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
        {/* Tabs */}
        <Tabs
          value={tabIndex}
          onChange={(e, newIndex) => setTabIndex(newIndex)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              textTransform: "capitalize", // apply capitalize to all tabs
              fontWeight: "bold",
            },
          }}
        >
          <Tab label="All Notes" />
          <Tab label="Shared Notes" />
        </Tabs>
      </Box>
      <TabPanel value={tabIndex} index={0}>
        <AllNotes />
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <SharedNotes />
      </TabPanel>
    </Box>
  );
}
