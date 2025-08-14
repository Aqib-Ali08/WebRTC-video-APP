import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonOffIcon from "@mui/icons-material/PersonOff";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function SharedNotes() {
  const [viewNoteOpen, setViewNoteOpen] = useState(false);
  const [unsendOpen, setUnsendOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

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

  const [rowData] = useState([
    {
      from: "John Doe",
      to: "Victoria King",
      sendReceived: "10-08-2025, 10:00 AM",
      viewNote: true,
      unsend: true,
    },
    {
      from: "Hannah Scott",
      to: "Bob Williams",
      sendReceived: "11-08-2025, 05:30 PM",
      viewNote: false,
      unsend: true,
    },
    {
      from: "John Doe",
      to: "Hannah Scott",
      sendReceived: "12-08-2025, 12:00 AM",
      viewNote: false,
      unsend: true,
    },
  ]);

  const [colDefs] = useState([
    { field: "from", headerName: "From" },
    { field: "to", headerName: "To" },
    { field: "sendReceived", headerName: "Send/Received At" },
    {
      field: "viewNote",
      headerName: "View Note",
      cellRenderer: (params) => {
        return (
          <Tooltip title="View Note">
            <IconButton onClick={() => handleViewNoteOpen(params.data)}>
              <DescriptionIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      field: "unsend",
      headerName: "Unsend Note",
      cellRenderer: (params) => {
        return (
          <Tooltip title="Unsend Note">
            <IconButton onClick={() => handleUnsendOpen(params.data)}>
              <PersonOffIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ]);

  return (
    <>
      <div style={{ height: 200 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          rowStyle={{
            textAlign: "center",
          }}
        />
      </div>

      {/* Dialog rendered once here */}
      <Dialog open={viewNoteOpen} onClose={handleViewNoteClose}>
        <DialogTitle>Note Title</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedRow
              ? `This is the note from ${selectedRow.from} to ${selectedRow.to}.`
              : ""}
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog open={unsendOpen} onClose={handleUnsendClose}>
        <DialogTitle>Note Title</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to unsend the Note?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleUnsendClose(selectedRow)}
          >
            Cancel
          </Button>
          <Button variant="contained" size="small">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
