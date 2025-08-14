import { styled } from "@mui/material/styles";
import {
  Box,
  Paper,
  Grid,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import { Add } from "@mui/icons-material";
import { useState } from "react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function AllNotes() {
  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [mode, setMode] = useState("view"); // "view" | "create" | "edit"
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
  });

  const gridItems = [
    {
      type: "card",
      xs: 6,
      title: "Note 1",
      subtitle: "adjective",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      type: "card",
      xs: 4,
      title: "Word of the Day",
      subtitle: "adjective",
      description: 'well meaning and kindly. "a benevolent smile"',
    },
    {
      type: "card",
      xs: 4,
      title: "Meeting Details",
      subtitle: "adjective",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reprehenderit doloribus deserunt consectetur ducimus inventore porro voluptatum atque? Doloribus, ea quisquam!",
    },
    {
      type: "card",
      xs: 6,
      title: "Note 2",
      subtitle: "adjective",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores, corrupti!",
    },
  ];

  const handleCardClick = (note) => {
    setSelectedNote(note);
    setMode("view");
    setOpen(true);
  };

  const handleCreateClick = () => {
    setForm({ title: "", subtitle: "", description: "" });
    setMode("create");
    setOpen(true);
  };

  const handleEditClick = (note) => {
    setForm({
      title: note.title,
      subtitle: note.subtitle,
      description: note.description,
    });
    setMode("edit");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNote(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving note:", form);
    handleClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <Button
          startIcon={<Add />}
          size="small"
          variant="contained"
          onClick={handleCreateClick}
        >
          Create Note
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        {gridItems.map((item, index) => (
          <Grid item xs={item.xs} key={index}>
            {item.type === "card" ? (
              <Tooltip title="View Note">
                <Card
                  sx={{ width: "auto", cursor: "pointer" }}
                  onClick={() => handleCardClick(item)}
                >
                  <CardContent>
                    <Typography
                      gutterBottom
                      sx={{ color: "text.secondary", fontSize: 14 }}
                    >
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                      {item.subtitle}
                    </Typography>
                    <Typography variant="body2" noWrap sx={{ width: 200 }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Tooltip title="Edit Note">
                      <IconButton
                        aria-label="edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(item);
                        }}
                      >
                        <EditNoteIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Note">
                      <IconButton aria-label="delete">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Share Note">
                      <IconButton aria-label="share">
                        <ShareIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Tooltip>
            ) : (
              <Item>{item.text}</Item>
            )}
          </Grid>
        ))}
      </Grid>

      {/* Reusable Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        {mode === "view" && selectedNote && (
          <>
            <DialogTitle>{selectedNote.title}</DialogTitle>
            <DialogContent dividers>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                {selectedNote.subtitle}
              </Typography>
              <Typography variant="body1">
                {selectedNote.description}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} size="small" variant="outlined">
                Close
              </Button>
            </DialogActions>
          </>
        )}

        {(mode === "create" || mode === "edit") && (
          <>
            <DialogTitle>
              {mode === "create" ? "Create Note" : "Edit Note"}
            </DialogTitle>
            <DialogContent dividers>
              <TextField
                margin="dense"
                label="Title"
                name="title"
                value={form.title}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Subtitle"
                name="subtitle"
                value={form.subtitle}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Description"
                name="description"
                value={form.description}
                onChange={handleFormChange}
                fullWidth
                multiline
                rows={4}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} size="small" variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleSave} size="small" variant="contained">
                Save
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
