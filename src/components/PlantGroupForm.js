import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import plantGroupService from "../services/plantGroupService";

const PlantGroupForm = ({ open, onClose, projectId, onGroupCreated }) => {
  const [formData, setFormData] = useState({
    species: "",
    quantity: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const newGroup = await plantGroupService.createPlantGroup(
        projectId,
        formData
      );
      onGroupCreated(newGroup);
      onClose();
      setFormData({ species: "", quantity: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create plant group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Plant Group</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              name="species"
              label="Species"
              value={formData.species}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              name="quantity"
              label="Planned Quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 1 }}
            />

            <Typography variant="body2" color="text.secondary">
              After creating the group, you'll be able to place trees on the
              map.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Group"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PlantGroupForm;
