// src/components/SharedNotes.jsx
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  ButtonGroup,
  Chip,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import GridViewIcon from "@mui/icons-material/GridView";
import TableRowsIcon from "@mui/icons-material/TableRows";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// Register all Community features for Ag-Grid
ModuleRegistry.registerModules([AllCommunityModule]);

// Import Ag-Grid Styles safely
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { handleUnshareNote } from "../services";

export default function SharedNotes({ sharedNotes, onRefresh }) {
  // Tabs State (0 = Received Notes, 1 = Sent Notes)
  const [subTab, setSubTab] = useState(0);
  // View mode State ('grid' or 'table')
  const [viewMode, setViewMode] = useState("grid");

  // Dialog State
  const [viewNoteOpen, setViewNoteOpen] = useState(false);
  const [unsendOpen, setUnsendOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [unsharingLoading, setUnsharingLoading] = useState(false);

  const handleViewNoteOpen = (row) => {
    setSelectedRow(row);
    setViewNoteOpen(true);
  };

  const handleViewNoteClose = () => {
    setViewNoteOpen(false);
    setSelectedRow(null);
  };

  const handleUnsendOpen = (row) => {
    setSelectedRow(row);
    setUnsendOpen(true);
  };

  const handleUnsendClose = () => {
    setUnsendOpen(false);
    setSelectedRow(null);
  };

  const handleUnsendConfirm = async () => {
    if (!selectedRow) return;
    setUnsharingLoading(true);
    try {
      await handleUnshareNote(selectedRow.id);
      onRefresh();
      handleUnsendClose();
    } catch (err) {
      console.error("Failed to unshare note:", err);
    } finally {
      setUnsharingLoading(false);
    }
  };

  // Filter notes
  const receivedNotes = sharedNotes.filter((n) => n.isIncoming);
  const sentNotes = sharedNotes.filter((n) => !n.isIncoming);
  
  const currentDataList = subTab === 0 ? receivedNotes : sentNotes;

  // Ag-Grid columns definition
  const colDefs = [
    {
      field: "from",
      headerName: subTab === 0 ? "Shared By" : "Owner",
      flex: 1,
      minWidth: 150,
      cellRenderer: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.5 }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem", bgcolor: "primary.main" }}>
            {params.value?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <span>{params.value}</span>
        </Box>
      )
    },
    {
      field: "to",
      headerName: subTab === 0 ? "Recipient" : "Shared With",
      flex: 1,
      minWidth: 150,
      cellRenderer: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.5 }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem", bgcolor: "primary.dark" }}>
            {params.value?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <span>{params.value}</span>
        </Box>
      )
    },
    {
      field: "title",
      headerName: "Note Title",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "sharedAt",
      headerName: "Shared At",
      flex: 1,
      minWidth: 180,
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleString(undefined, {
          dateStyle: "short",
          timeStyle: "short",
        });
      }
    },
    {
      headerName: "Actions",
      cellStyle: { display: "flex", alignItems: "center", justifyContent: "center" },
      cellRenderer: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="View Note Details">
              <IconButton size="small" onClick={() => handleViewNoteOpen(params.data)} color="primary">
                <DescriptionIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {subTab === 1 && (
              <Tooltip title="Unsend/Cancel Share">
                <IconButton size="small" onClick={() => handleUnsendOpen(params.data)} color="error">
                  <PersonOffIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      },
      width: 120,
    },
  ];

  return (
    <Box>
      {/* Sub tabs and View Switcher Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Tabs
          value={subTab}
          onChange={(e, val) => setSubTab(val)}
          sx={{
            minHeight: 40,
            "& .MuiTabs-indicator": {
              backgroundColor: "primary.main",
            },
            "& .MuiTab-root": {
              textTransform: "capitalize",
              fontWeight: 700,
              fontSize: "0.95rem",
              minHeight: 40,
              color: "text.secondary",
              "&.Mui-selected": {
                color: "primary.main",
              },
            },
          }}
        >
          <Tab label={`Received Notes (${receivedNotes.length})`} />
          <Tab label={`Sent Notes (${sentNotes.length})`} />
        </Tabs>

        {/* View Mode Button Group */}
        <ButtonGroup size="small" aria-label="view mode toggle">
          <Button
            variant={viewMode === "grid" ? "contained" : "outlined"}
            onClick={() => setViewMode("grid")}
            sx={{
              borderColor: "divider",
              backgroundColor: viewMode === "grid" ? "primary.main" : "transparent",
              color: viewMode === "grid" ? "background.paper" : "text.secondary",
              "&:hover": {
                backgroundColor: viewMode === "grid" ? "primary.dark" : "action.hover",
                borderColor: "action.focus",
              },
            }}
          >
            <GridViewIcon fontSize="small" sx={{ mr: 0.5 }} /> Grid
          </Button>
          <Button
            variant={viewMode === "table" ? "contained" : "outlined"}
            onClick={() => setViewMode("table")}
            sx={{
              borderColor: "divider",
              backgroundColor: viewMode === "table" ? "primary.main" : "transparent",
              color: viewMode === "table" ? "background.paper" : "text.secondary",
              "&:hover": {
                backgroundColor: viewMode === "table" ? "primary.dark" : "action.hover",
                borderColor: "action.focus",
              },
            }}
          >
            <TableRowsIcon fontSize="small" sx={{ mr: 0.5 }} /> Table
          </Button>
        </ButtonGroup>
      </Box>

      {/* Main List Display */}
      {currentDataList.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
            backgroundColor: "background.paper",
            borderRadius: 3,
            border: "1px dashed #cbd5e1",
          }}
        >
          <Typography variant="h6" color="text.secondary" fontWeight={600} mb={1}>
            No shared notes found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subTab === 0
              ? "Notes shared with you by other connections will appear here."
              : "Click the share icon on any note in 'My Notes' to distribute it."}
          </Typography>
        </Box>
      ) : viewMode === "grid" ? (
        /* GRID CARD VIEW */
        <Grid container spacing={3}>
          {currentDataList.map((item) => (
            <Grid item xs={12} sm={6} lg={4} key={item.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                <CardContent sx={{ p: 2.5, pb: 1 }}>
                  {/* Share Info Badge */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                      pb: 1.5,
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        backgroundColor: subTab === 0 ? "primary.main" : "primary.dark",
                      }}
                    >
                      {subTab === 0
                        ? item.from?.[0]?.toUpperCase()
                        : item.to?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", fontWeight: 700 }}
                      >
                        {subTab === 0 ? "SHARED BY" : "SHARED WITH"}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.primary"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {subTab === 0 ? item.from : item.to}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="text.primary"
                    sx={{
                      mb: 1,
                      lineHeight: 1.3,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: 1.5,
                      color: "text.secondary",
                      mb: 2,
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>

                {/* Footer Details */}
                <Box>
                  <Box
                    sx={{
                      px: 2.5,
                      py: 1,
                      backgroundColor: "background.default",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CalendarMonthIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(item.sharedAt).toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </Typography>
                  </Box>
                  <CardActions
                    sx={{
                      p: 1.5,
                      justifyContent: "flex-end",
                      borderTop: "1px solid #f1f5f9",
                    }}
                  >
                    <Button
                      size="small"
                      startIcon={<DescriptionIcon sx={{ fontSize: 16 }} />}
                      onClick={() => handleViewNoteOpen(item)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        color: "primary.main",
                      }}
                    >
                      View Note
                    </Button>
                    {subTab === 1 && (
                      <Button
                        size="small"
                        color="error"
                        startIcon={<PersonOffIcon sx={{ fontSize: 16 }} />}
                        onClick={() => handleUnsendOpen(item)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 700,
                        }}
                      >
                        Unsend
                      </Button>
                    )}
                  </CardActions>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        /* TABLE VIEW (AG-GRID) */
        <Box
          className="ag-theme-quartz"
          sx={{
            height: 400,
            width: "100%",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            "--ag-header-background-color": "background.default",
            "--ag-header-cell-hover-background-color": "action.hover",
            "--ag-row-hover-color": "background.default",
            "--ag-selected-row-background-color": "action.selected",
            "--ag-range-selection-border-color": "primary.main",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <AgGridReact
            rowData={currentDataList}
            columnDefs={colDefs}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
            rowHeight={48}
            headerHeight={48}
          />
        </Box>
      )}

      {/* View Note Modal */}
      <Dialog
        open={viewNoteOpen}
        onClose={handleViewNoteClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 4, p: 1 },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h5" fontWeight={800} color="text.primary">
            {selectedRow?.title}
          </Typography>
          <Chip
            avatar={
              <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
                {selectedRow?.from?.[0]?.toUpperCase() || "U"}
              </Avatar>
            }
            label={`From: ${selectedRow?.from}`}
            sx={{ fontWeight: 700, color: "primary.main", bgcolor: "action.selected" }}
          />
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "action.hover" }}>
          <Typography
            variant="body1"
            color="text.primary"
            sx={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
              mt: 2,
            }}
          >
            {selectedRow?.description}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleViewNoteClose}
            variant="contained"
            sx={{
              backgroundColor: "primary.main",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { backgroundColor: "primary.dark" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unsend Confirmation Dialog */}
      <Dialog
        open={unsendOpen}
        onClose={handleUnsendClose}
        PaperProps={{
          sx: { borderRadius: 4, p: 1 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={800} color="text.primary">
            Unsend Shared Note
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText color="text.secondary">
            Are you sure you want to unshare <strong>"{selectedRow?.title}"</strong> with <strong>{selectedRow?.to}</strong>?
            This will remove their access to the note.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            disabled={unsharingLoading}
            onClick={handleUnsendClose}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderColor: "divider",
              color: "text.secondary",
              "&:hover": { borderColor: "action.focus" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={unsharingLoading}
            onClick={handleUnsendConfirm}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              backgroundColor: "error.main",
              "&:hover": { backgroundColor: "error.dark" },
            }}
          >
            {unsharingLoading ? "Unsending..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
