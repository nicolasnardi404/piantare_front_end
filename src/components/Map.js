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
  Paper,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
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

const ReportCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(3),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease-in-out",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  overflow: "visible",
  height: "100%",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 48px rgba(0, 0, 0, 0.12)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #4caf50, #81c784)",
    borderRadius: "4px 4px 0 0",
  },
}));

const StatBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background:
    "linear-gradient(135deg, rgba(46, 125, 50, 0.08), rgba(129, 199, 132, 0.08))",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
    transform: "rotate(45deg)",
  },
}));

const PlantCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  background: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(8px)",
  borderRadius: theme.spacing(2),
  transition: "all 0.2s ease-in-out",
  border: "1px solid rgba(76, 175, 80, 0.1)",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.95)",
    transform: "translateX(4px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
}));

const SpeciesTag = styled(Typography)(({ theme }) => ({
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: "12px",
  background: "rgba(76, 175, 80, 0.1)",
  color: theme.palette.primary.main,
  fontSize: "0.875rem",
  fontWeight: 500,
  marginBottom: theme.spacing(1),
}));

const LocationChip = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 8px",
  borderRadius: "8px",
  background: "rgba(0, 0, 0, 0.04)",
  color: theme.palette.text.secondary,
  fontSize: "0.75rem",
  gap: "4px",
  "& svg": {
    fontSize: "1rem",
  },
}));

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
  const [companyStats, setCompanyStats] = useState({
    totalPlants: 0,
    speciesCount: {},
    recentPlants: [],
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

  // Calculate company statistics whenever locations change
  useEffect(() => {
    if (user?.role === "COMPANY") {
      // Filter plants for this company
      const companyPlants = locations.filter((loc) => {
        console.log("Checking location company id:", loc.company?.id);
        console.log("User id:", user.userId);
        return loc.company?.id === user.userId;
      });

      console.log("Filtered company plants:", companyPlants);

      // Calculate species count
      const speciesCount = companyPlants.reduce((acc, plant) => {
        acc[plant.species] = (acc[plant.species] || 0) + 1;
        return acc;
      }, {});

      // Sort plants by most recent first
      const sortedPlants = [...companyPlants].sort((a, b) => {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });

      setCompanyStats({
        totalPlants: companyPlants.length,
        speciesCount,
        recentPlants: sortedPlants.slice(0, 5), // Get 5 most recent plants
      });
    }
  }, [locations, user]);

  const loadLocations = async () => {
    try {
      const response = await plantLocations.getAll();
      console.log("API Response:", response.data);
      setLocations(response.data);
    } catch (err) {
      console.error("Error loading locations:", err);
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

  const renderCompanyReport = () => {
    if (user?.role !== "COMPANY") return null;

    return (
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 600,
            background: "linear-gradient(135deg, #2e7d32, #81c784)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-8px",
              left: 0,
              width: "60%",
              height: "3px",
              background: "linear-gradient(90deg, #4caf50, transparent)",
              borderRadius: "2px",
            },
          }}
        >
          Relatório de Plantas
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ReportCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Visão Geral
                </Typography>
                <StatBox>
                  <Typography
                    variant="h2"
                    color="primary"
                    sx={{
                      fontWeight: 700,
                      textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {companyStats.totalPlants}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Total de Plantas
                  </Typography>
                </StatBox>
              </CardContent>
            </ReportCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <ReportCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Espécies
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {Object.entries(companyStats.speciesCount).map(
                    ([species, count], index) => (
                      <Box
                        key={species}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          padding: "12px",
                          borderRadius: "12px",
                          backgroundColor: "rgba(76, 175, 80, 0.04)",
                          border: "1px solid rgba(76, 175, 80, 0.1)",
                          transition: "all 0.2s ease-in-out",
                          position: "relative",
                          overflow: "hidden",
                          "&:hover": {
                            backgroundColor: "rgba(76, 175, 80, 0.08)",
                            transform: "translateX(4px)",
                          },
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "4px",
                            background:
                              "linear-gradient(to bottom, #4caf50, #81c784)",
                            borderRadius: "4px",
                            opacity: 0.8,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: "text.primary",
                              fontWeight: 600,
                              fontSize: "0.95rem",
                            }}
                          >
                            {species}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              color: "primary.main",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                backgroundColor: "rgba(76, 175, 80, 0.12)",
                                padding: "4px 12px",
                                borderRadius: "12px",
                                fontSize: "0.875rem",
                              }}
                            >
                              {count}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            width: "100%",
                            height: "4px",
                            backgroundColor: "rgba(76, 175, 80, 0.08)",
                            borderRadius: "2px",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${
                                (count / companyStats.totalPlants) * 100
                              }%`,
                              height: "100%",
                              background:
                                "linear-gradient(90deg, #4caf50, #81c784)",
                              borderRadius: "2px",
                              transition: "width 0.3s ease-in-out",
                            }}
                          />
                        </Box>
                      </Box>
                    )
                  )}
                </Box>
              </CardContent>
            </ReportCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <ReportCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Plantas Recentes
                </Typography>
                <Grid container spacing={2}>
                  {companyStats.recentPlants.map((plant) => (
                    <Grid item xs={12} key={plant.id}>
                      <PlantCard>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <Box>
                              <SpeciesTag>{plant.species}</SpeciesTag>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  display: "block",
                                  mb: 1,
                                  lineHeight: 1.6,
                                }}
                              >
                                {plant.description}
                              </Typography>
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "primary.main",
                                backgroundColor: "rgba(76, 175, 80, 0.08)",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontWeight: 500,
                              }}
                            >
                              Adicionado por: {plant.addedBy.name}
                            </Typography>
                          </Box>
                          <LocationChip>
                            <Box component="span" sx={{ opacity: 0.7 }}>
                              📍
                            </Box>
                            {plant.latitude.toFixed(6)},{" "}
                            {plant.longitude.toFixed(6)}
                          </LocationChip>
                        </Box>
                      </PlantCard>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </ReportCard>
          </Grid>
        </Grid>
      </Box>
    );
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

      {renderCompanyReport()}

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
