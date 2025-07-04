import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Alert,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import PlantGroupForm from "./PlantGroupForm";
import plantGroupService from "../services/plantGroupService";

const TreePlanting = ({ projectId, onPlantingComplete, mapRef }) => {
  const [plantGroups, setPlantGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [plantingMode, setPlantingMode] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPlantGroups();
  }, [projectId]);

  const loadPlantGroups = async () => {
    try {
      const groups = await plantGroupService.getProjectPlantGroups(projectId);
      setPlantGroups(groups);
    } catch (err) {
      setError("Failed to load plant groups");
    }
  };

  const handleGroupCreated = (newGroup) => {
    setPlantGroups((prev) => [...prev, newGroup]);
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await plantGroupService.deletePlantGroup(groupId);
      setPlantGroups((prev) => prev.filter((group) => group.id !== groupId));
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
        setPlantingMode(false);
      }
    } catch (err) {
      setError("Failed to delete plant group");
    }
  };

  const startPlanting = (group) => {
    setSelectedGroup(group);
    setPlantingMode(true);
    setCoordinates([]);

    // Enable map click handlers
    if (mapRef.current) {
      mapRef.current.on("click", handleMapClick);
    }
  };

  const handleMapClick = (e) => {
    if (plantingMode && selectedGroup) {
      const newCoord = { lat: e.latlng.lat, lng: e.latlng.lng };
      setCoordinates((prev) => [...prev, newCoord]);
    }
  };

  const savePlantedTrees = async () => {
    try {
      await plantGroupService.addPlantedPlants(selectedGroup.id, coordinates);
      setPlantingMode(false);
      setSelectedGroup(null);
      setCoordinates([]);
      loadPlantGroups();

      // Disable map click handlers
      if (mapRef.current) {
        mapRef.current.off("click", handleMapClick);
      }

      if (onPlantingComplete) {
        onPlantingComplete();
      }
    } catch (err) {
      setError("Failed to save planted trees");
    }
  };

  const undoLastPlacement = () => {
    setCoordinates((prev) => prev.slice(0, -1));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Plant Groups</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setShowGroupForm(true)}
        >
          New Group
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <List>
          {plantGroups.map((group) => (
            <ListItem key={group.id}>
              <ListItemText
                primary={group.species}
                secondary={`${group._count?.plantedPlants || 0} trees planted`}
              />
              <ListItemSecondaryAction>
                {!plantingMode && (
                  <>
                    <Tooltip title="Start planting trees">
                      <IconButton
                        edge="end"
                        onClick={() => startPlanting(group)}
                        sx={{ mr: 1 }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete group">
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteGroup(group.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      {plantingMode && selectedGroup && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Planting: {selectedGroup.species}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Trees placed: {coordinates.length}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={savePlantedTrees}
              startIcon={<SaveIcon />}
              disabled={coordinates.length === 0}
            >
              Save Trees
            </Button>
            <Button
              variant="outlined"
              onClick={undoLastPlacement}
              disabled={coordinates.length === 0}
            >
              Undo Last
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setPlantingMode(false);
                setSelectedGroup(null);
                setCoordinates([]);
                if (mapRef.current) {
                  mapRef.current.off("click", handleMapClick);
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      <PlantGroupForm
        open={showGroupForm}
        onClose={() => setShowGroupForm(false)}
        projectId={projectId}
        onGroupCreated={handleGroupCreated}
      />
    </Box>
  );
};

export default TreePlanting;
