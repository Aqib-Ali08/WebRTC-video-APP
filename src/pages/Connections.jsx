import { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Badge,
  Tooltip,
  Card,
  Avatar,
  CardContent,
  CardActions,
} from "@mui/material";
import AddNewConnection from "./AddNewConnections";
import NewRequests from "./NewRequests";
import ConnectionManagement from "./ConnectionManagement";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useQuery } from "@tanstack/react-query";
import { handleSearchList } from "../services";
import { Add, Check } from "@mui/icons-material";
import useFriendActions from "../hooks/useFriendActions";

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
          flexGrow: 1,
          overflowY: "auto",
          // maxHeight: "100vh", // causing problem of cutting the internal section due to fixed height
          maxHeight: "calc(100vh - 120px)",
        }}
      >
        {children}
      </Paper>
    )
  );
}

export default function Connections() {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [newRequestsCount, setNewRequestsCount] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchQuery("");
  };

  const {
    loadingAction,
    addFriend,
    acceptFriend,
    rejectFriend,
    removeFriend,
    blockFriend,
    unblockFriend,
  } = useFriendActions();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const {
    data = [],
    isFetching,
    isFetched,
  } = useQuery({
    // queryKey: ["searchResults", searchQuery],
    queryKey: ["searchResults", debouncedQuery],
    // queryFn: async () => {
    //   const res = await handleSearchList(searchQuery);
    //   if (Array.isArray(res)) return res;
    //   return [];
    // },
    queryFn: () => handleSearchList(debouncedQuery),
    enabled: debouncedQuery.length >= 3,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Box
      sx={{
        p: 4,
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
          <Tab label="Add New Connections" />
          <Tab
            label={
              <Badge badgeContent={newRequestsCount} color="primary" showZero>
                <span style={{ paddingRight: "1rem" }}>New Requests</span>
              </Badge>
            }
          />
          <Tab label="Connection List" />
        </Tabs>

        <Tooltip title="Search your Connections">
          <IconButton aria-label="search" onClick={handleClickOpen}>
            <SearchIcon />
          </IconButton>
        </Tooltip>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            Search by Connection Name
            <Button onClick={handleClose}>
              <ClearIcon />
            </Button>
          </DialogTitle>
          <DialogContent>
            <TextField
              value={searchQuery}
              autoFocus
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search connection"
              size="small"
              fullWidth
              sx={{
                backgroundColor: "#fff",
                borderRadius: 3,
                mb: 2,
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchQuery("")}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Show searching indicator */}
            {isFetching && (
              <Typography
                variant="body2"
                sx={{ mb: 2, color: "text.secondary" }}
              >
                Searching...
              </Typography>
            )}

            {/* Show results only when searchQuery is valid and data exists */}
            {searchQuery.length >= 3 && isFetched && data?.length > 0 && (
              <Box>
                {data?.map((item) => {
                  const showAddButton =
                    !item.isFriend &&
                    !item.isSentRequest &&
                    !item.hasRequestSentToU &&
                    item.canSendFriendRequest;
                  const showSendRequest =
                    !item.isFriend &&
                    !item.hasRequestSentToU &&
                    !item.canSendFriendRequest &&
                    item.isSentRequest;
                  const showIsFriend =
                    !item.hasRequestSentToU &&
                    !item.isSentRequest &&
                    !item.canSendFriendRequest &&
                    item.isFriend;
                  const showHasRequestSentToU =
                    !item.isFriend &&
                    !item.isSentRequest &&
                    !item.canSendFriendRequest &&
                    item.hasRequestSentToU;

                  return (
                    <Card
                      key={item._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        p: 1,
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Avatar
                        src={item.profilePic}
                        alt={item.full_name}
                        sx={{ width: 40, height: 40 }}
                      />
                      <CardContent sx={{ flex: 1, p: "8px !important" }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {item.full_name}
                        </Typography>
                      </CardContent>

                      <CardActions>
                        {showAddButton && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={
                              loadingAction.id === item._id &&
                              loadingAction.type === "add"
                            }
                            onClick={() => addFriend(item._id, item.full_name)}
                            startIcon={<Add />}
                          >
                            {loadingAction.id === item._id &&
                            loadingAction.type === "add"
                              ? "Adding..."
                              : "Add Friend"}
                          </Button>
                        )}

                        {showSendRequest && (
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              "&.Mui-disabled": {
                                color: "green",
                              },
                            }}
                            disabled
                            startIcon={<Check />}
                          >
                            Request Sent
                          </Button>
                        )}

                        {showHasRequestSentToU && (
                          <>
                            <Button
                              v
                              sx={{
                                backgroundColor: "#ff5252",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "#e64949",
                                },
                              }}
                              size="small"
                              disabled={
                                loadingAction.id === item._id &&
                                loadingAction.type === "reject"
                              }
                              onClick={() =>
                                rejectFriend(item._id, item.full_name)
                              }
                            >
                              {loadingAction.id === item._id &&
                              loadingAction.type === "reject"
                                ? "Rejecting..."
                                : "Reject"}
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              disabled={
                                loadingAction.id === item._id &&
                                loadingAction.type === "accept"
                              }
                              onClick={() =>
                                acceptFriend(item._id, item.full_name)
                              }
                            >
                              {loadingAction.id === item._id &&
                              loadingAction.type === "accept"
                                ? "Accepting..."
                                : "Accept"}
                            </Button>
                          </>
                        )}

                        {showIsFriend && (
                          <>
                            <Button
                              variant="outlined"
                              size="small"
                              disabled={
                                loadingAction.id === item._id &&
                                loadingAction.type === "remove"
                              }
                              onClick={() =>
                                removeFriend(item._id, item.full_name)
                              }
                            >
                              {loadingAction.id === item._id &&
                              loadingAction.type === "remove"
                                ? "Removing..."
                                : "Remove"}
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              disabled={
                                loadingAction.id === item._id &&
                                (loadingAction.type === "BLOCK" ||
                                  loadingAction.type === "UNBLOCK")
                              }
                              onClick={() =>
                                item.isBlocked
                                  ? unblockFriend(
                                      item._id,
                                      item.full_name,
                                      debouncedQuery
                                    )
                                  : blockFriend(
                                      item._id,
                                      item.full_name,
                                      debouncedQuery
                                    )
                              }
                            >
                              {loadingAction.id === item._id &&
                              (loadingAction.type === "BLOCK" ||
                                loadingAction.type === "UNBLOCK")
                                ? item.isBlocked
                                  ? "Unblocking..."
                                  : "Blocking..."
                                : item.isBlocked
                                  ? "Unblock"
                                  : "Block"}
                            </Button>
                          </>
                        )}
                      </CardActions>
                    </Card>
                  );
                })}
              </Box>
            )}

            {/* No results message */}
            {searchQuery.length >= 3 && !isFetching && data?.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No connections found.
              </Typography>
            )}
          </DialogContent>
        </Dialog>
      </Box>

      {/* Tab Contents */}
      <TabPanel value={tabIndex} index={0}>
        <AddNewConnection />
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <NewRequests setNewRequestsCount={setNewRequestsCount} />
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <ConnectionManagement />
      </TabPanel>
    </Box>
  );
}
