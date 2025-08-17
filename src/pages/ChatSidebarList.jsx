import { Add, Block, Delete, MoreHoriz, MoreVert } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { handleGetUsersChat } from "../services";
import { useNavigate } from "react-router-dom";

export default function ChatSidebarList() {
  const navigate = useNavigate();

  const { data, isPending, isError } = useQuery({
    queryKey: ["userChat"],
    queryFn: handleGetUsersChat,
    refetchOnWindowFocus: false,
  });

  console.log("Data", data);

  return (
    <Paper
      elevation={3}
      sx={{ width: 300, p: 2, display: "flex", flexDirection: "column" }}
    >
      <TextField
        placeholder="Search Friends"
        size="small"
        fullWidth
        variant="outlined"
      />

      {isError && (
        <Typography sx={{ marginTop: 2, textAlign: "center" }}>
          Oops! No data found
        </Typography>
      )}

      {data?.length === 0 ? (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography sx={{ textAlign: "center" }}>
            It seems like you have no connections yet!
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<Add />}
            onClick={() => navigate("/dashboard/connections")}
          >
            Add Connections
          </Button>
        </Box>
      ) : isPending ? (
        <Stack
          spacing={1}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 1,
            gap: 2,
          }}
        >
          <Skeleton variant="circular" width={50} height={50} />
          <Skeleton variant="rounded" width={200} height={50} />
        </Stack>
      ) : (
        <List sx={{ overflowY: "auto", flex: 1 }}>
          {data?.map((item, i) => {
            const isDirect = item.type === "direct";
            const participant = item.participants?.[0];

            const lastMessageTime = item.lastMessage?.createdAt;
            const onlyTime = new Date(lastMessageTime);
            const formattedPaymentTime = onlyTime.toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            return (
              <ListItem
                key={i}
                disablePadding
                sx={{ "&:hover .hoverIcon": { opacity: 1 } }}
                onClick={() =>
                  navigate(`/dashboard/messages/${item.conversation_id}`, {
                    state: {
                      fullName: participant?.full_name,
                      profilePic: participant?.profilePic,
                    },
                  })
                }
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      src={
                        isDirect ? participant?.profilePic : item.groupAvatar
                      }
                      sx={{ bgcolor: "#0e7490" }}
                    >
                      {(isDirect
                        ? participant?.full_name?.[0]
                        : item.groupName?.[0]) || ""}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        {isDirect ? participant?.full_name : item.groupName}
                      </Typography>
                    }
                    secondary={
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 2,
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 100,
                          }}
                        >
                          {item?.lastMessage?.content}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          {formattedPaymentTime}
                        </Typography>
                      </Box>
                    }
                  />
                  <IconButton
                    size="small"
                    className="hoverIcon"
                    sx={{ opacity: 0, transition: "opacity 0.2s ease" }}
                  >
                    <MoreVert sx={{ fontSize: "20px" }} />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
}
