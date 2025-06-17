import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { useAuth } from "../context/AuthContext";
import { plantLocations, companies } from "../services/api";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function AddMarkerToClick({ onLocationSelected }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelected({ latitude: lat, longitude: lng });
    },
  });
  return null;
}

const Map = () => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [isAssigningCompany, setIsAssigningCompany] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [newLocation, setNewLocation] = useState({
    latitude: null,
    longitude: null,
    species: "",
    description: "",
  });
  const { user } = useAuth();

  // São Paulo coordinates as default center
  const defaultPosition = [-23.5505, -46.6333];

  useEffect(() => {
    loadLocations();
    if (user?.role === "ADMIN") {
      loadCompanies();
    }
  }, [user]);

  const loadLocations = async () => {
    try {
      const response = await plantLocations.getAll();
      setLocations(response.data);
    } catch (err) {
      setError("Failed to load plant locations");
    }
  };

  const loadCompanies = async () => {
    try {
      const response = await companies.getAll();
      setCompanyList(response.data);
    } catch (err) {
      setError("Failed to load companies");
    }
  };

  const handleLocationClick = (location) => {
    if (user?.role === "COMPANY" && !location.company) {
      setSelectedLocation(location);
      setIsAssigningCompany(true);
    }
  };

  const handleMapClick = (location) => {
    if (user?.role === "FARMER") {
      setNewLocation({
        ...newLocation,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setIsAddingLocation(true);
    }
  };

  const handleAdminAssign = (location) => {
    if (user?.role === "ADMIN") {
      setSelectedLocation(location);
      setSelectedCompanyId("");
      setIsAssigningCompany(true);
    }
  };

  const handleAddLocation = async () => {
    try {
      if (
        !newLocation.latitude ||
        !newLocation.longitude ||
        !newLocation.species
      ) {
        setError("Please fill in all required fields");
        return;
      }

      await plantLocations.create(newLocation);
      setIsAddingLocation(false);
      setNewLocation({
        latitude: null,
        longitude: null,
        species: "",
        description: "",
      });
      loadLocations();
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add plant location");
    }
  };

  const handleAssignCompany = async () => {
    try {
      const companyId =
        user?.role === "ADMIN" ? selectedCompanyId : user.companyId;

      if (!companyId) {
        setError("Please select a company");
        return;
      }

      await plantLocations.assignCompany(selectedLocation.id, { companyId });
      setIsAssigningCompany(false);
      setSelectedLocation(null);
      setSelectedCompanyId("");
      loadLocations();
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to assign company");
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ flexGrow: 1, height: "calc(100vh - 200px)" }}>
        <MapContainer
          center={defaultPosition}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <AddMarkerToClick onLocationSelected={handleMapClick} />

          {/* Display existing locations */}
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              eventHandlers={{
                click: () => {
                  if (user?.role === "ADMIN") {
                    handleAdminAssign(location);
                  } else if (user?.role === "COMPANY" && !location.company) {
                    handleLocationClick(location);
                  }
                },
              }}
            >
              <Popup>
                <Typography variant="subtitle1">{location.species}</Typography>
                <Typography variant="body2">{location.description}</Typography>
                <Typography variant="caption">
                  Added by: {location.addedBy.name}
                </Typography>
                {location.company && (
                  <Typography variant="caption" display="block">
                    Company: {location.company.name}
                  </Typography>
                )}
              </Popup>
            </Marker>
          ))}

          {/* Display temporary marker for new location */}
          {newLocation.latitude && newLocation.longitude && (
            <Marker position={[newLocation.latitude, newLocation.longitude]}>
              <Popup>New plant location</Popup>
            </Marker>
          )}
        </MapContainer>
      </Box>

      {/* Add Plant Dialog */}
      <Dialog
        open={isAddingLocation}
        onClose={() => {
          setIsAddingLocation(false);
          setNewLocation({
            latitude: null,
            longitude: null,
            species: "",
            description: "",
          });
        }}
      >
        <DialogTitle>Add New Plant Location</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Species"
            required
            fullWidth
            value={newLocation.species}
            onChange={(e) =>
              setNewLocation({ ...newLocation, species: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newLocation.description}
            onChange={(e) =>
              setNewLocation({ ...newLocation, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddingLocation(false)}>Cancel</Button>
          <Button
            onClick={handleAddLocation}
            variant="contained"
            color="primary"
          >
            Add Plant
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Company Dialog */}
      <Dialog
        open={isAssigningCompany}
        onClose={() => {
          setIsAssigningCompany(false);
          setSelectedLocation(null);
          setSelectedCompanyId("");
        }}
      >
        <DialogTitle>Assign Plant to Company</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Typography variant="subtitle1">Plant Details:</Typography>
            <Typography>Species: {selectedLocation?.species}</Typography>
            <Typography>Added by: {selectedLocation?.addedBy.name}</Typography>
          </Box>
          {user?.role === "ADMIN" && (
            <FormControl fullWidth margin="dense">
              <InputLabel>Select Company</InputLabel>
              <Select
                value={selectedCompanyId}
                label="Select Company"
                onChange={(e) => setSelectedCompanyId(e.target.value)}
              >
                {companyList.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAssigningCompany(false)}>Cancel</Button>
          <Button
            onClick={handleAssignCompany}
            variant="contained"
            color="primary"
          >
            Assign to Company
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Map;
