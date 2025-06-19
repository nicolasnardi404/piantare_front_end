import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { useAuth } from "../context/AuthContext";
import { plantLocations, companies } from "../services/api";
import { b2Service } from "../services/b2";
import axios from "axios";
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
  IconButton,
  InputAdornment,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import "leaflet/dist/leaflet.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SearchIcon from "@mui/icons-material/Search";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import PlantUpdates from "./PlantUpdates";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import YardIcon from "@mui/icons-material/Yard";
import GrassIcon from "@mui/icons-material/Grass";

// Import marker cluster CSS
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Add this near the top of the file with other imports
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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

const ImageUploadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  padding: theme.spacing(2),
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(1),
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1),
  backgroundColor: "rgba(76, 175, 80, 0.04)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "rgba(76, 175, 80, 0.08)",
    borderStyle: "solid",
  },
}));

const SearchControl = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const map = useMap();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`
      );

      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        map.setView([location.lat, location.lon], 13);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(4px)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        borderRadius: 1,
        padding: 1,
      }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="Buscar cidade ou local..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleSearch}
                sx={{ color: "primary.main" }}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
          },
        }}
      />
    </Box>
  );
};

function LocationControl({ onLocationSelected }) {
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const map = useMap();
  const { user } = useAuth();

  const handleGetLocation = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          map.setView([latitude, longitude], 15);
          // If user is a farmer, trigger the add plant dialog
          if (user?.role === "FARMER") {
            onLocationSelected({
              latitude,
              longitude,
              fromCurrentLocation: true,
            });
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip
        title={
          user?.role === "FARMER"
            ? "Adicionar planta na minha localização"
            : "Minha Localização"
        }
        placement="left"
      >
        <LocationButton
          onClick={handleGetLocation}
          disabled={loading}
          size="large"
          color="primary"
        >
          {loading ? <CircularProgress size={24} /> : <MyLocationIcon />}
        </LocationButton>
      </Tooltip>
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={redIcon}>
          <Popup>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Sua localização atual
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: "block", color: "text.secondary" }}
            >
              {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
            </Typography>
            {user?.role === "FARMER" && (
              <Button
                variant="contained"
                size="small"
                color="primary"
                sx={{ mt: 1 }}
                onClick={() =>
                  onLocationSelected({
                    latitude: userLocation.lat,
                    longitude: userLocation.lng,
                    fromCurrentLocation: true,
                  })
                }
              >
                Adicionar Planta Aqui
              </Button>
            )}
          </Popup>
        </Marker>
      )}
    </>
  );
}

const MapControls = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: { xs: "60px", sm: "10px" },
  right: "10px",
  left: { xs: "10px", sm: "auto" },
  zIndex: 1000,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const LocationButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(4px)",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  display: "flex",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  padding: "8px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
}));

const Map = () => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
  const [imageUpload, setImageUpload] = useState({
    file: null,
    preview: null,
    uploading: false,
    error: null,
  });
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [farmerStats, setFarmerStats] = useState({
    totalPlants: 0,
    speciesCount: {},
    recentPlants: [],
  });

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

  // Calculate farmer statistics whenever locations change
  useEffect(() => {
    if (user?.role === "FARMER") {
      // Filter plants added by this farmer
      const farmerPlants = locations.filter(
        (loc) => loc.addedBy.id === user.userId
      );

      // Calculate species count
      const speciesCount = farmerPlants.reduce((acc, plant) => {
        acc[plant.species] = (acc[plant.species] || 0) + 1;
        return acc;
      }, {});

      // Sort plants by most recent first
      const sortedPlants = [...farmerPlants].sort((a, b) => {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });

      setFarmerStats({
        totalPlants: farmerPlants.length,
        speciesCount,
        recentPlants: sortedPlants,
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

  const handleMapClick = (location) => {
    if (
      user?.role === "FARMER" &&
      (isAddMode || location.fromCurrentLocation)
    ) {
      setNewLocation({
        ...newLocation,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setIsAddingLocation(true);
    }
  };

  const handleMarkerClick = (location) => {
    setSelectedPlant(location);
    setIsDetailModalOpen(true);
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

      let imageUrl = null;
      if (imageUpload.file) {
        setImageUpload((prev) => ({ ...prev, uploading: true }));
        try {
          const formData = new FormData();
          formData.append("file", imageUpload.file);

          const response = await axios.post(
            `${API_URL}/api/uploads/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          imageUrl = response.data.url;
        } catch (err) {
          console.error("Image upload error:", err);
          setImageUpload((prev) => ({
            ...prev,
            uploading: false,
            error: "Failed to upload image",
          }));
          return;
        }
      }

      await plantLocations.create({
        ...newLocation,
        imageUrl,
      });

      setIsAddingLocation(false);
      setNewLocation({
        latitude: null,
        longitude: null,
        species: "",
        description: "",
      });
      setImageUpload({
        file: null,
        preview: null,
        uploading: false,
        error: null,
      });
      loadLocations();
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add plant location");
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUpload({
          file,
          preview: reader.result,
          uploading: false,
          error: null,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAssignCompany = async () => {
    try {
      if (!selectedCompanyId) {
        setError("Please select a company");
        return;
      }

      await plantLocations.assignCompany(selectedPlant.id, {
        companyId: selectedCompanyId,
      });
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
      <Box sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 1, md: 2 } }}>
        <Typography
          variant="h5"
          sx={{
            mb: { xs: 2, md: 3 },
            fontSize: { xs: "1.25rem", md: "1.5rem" },
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
        <Grid container spacing={{ xs: 2, md: 3 }}>
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

  const renderFarmerReport = () => {
    if (user?.role !== "FARMER") return null;

    return (
      <Box sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 1, md: 2 } }}>
        <Typography
          variant="h5"
          sx={{
            mb: { xs: 2, md: 3 },
            fontSize: { xs: "1.25rem", md: "1.5rem" },
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
          Minhas Plantas
        </Typography>
        <Grid container spacing={{ xs: 2, md: 3 }}>
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
                    {farmerStats.totalPlants}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Total de Plantas Cadastradas
                  </Typography>
                </StatBox>
              </CardContent>
            </ReportCard>
          </Grid>
          <Grid item xs={12} md={8}>
            <ReportCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Minhas Espécies
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {Object.entries(farmerStats.speciesCount).map(
                    ([species, count]) => (
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
                                (count / farmerStats.totalPlants) * 100
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

      <Box
        sx={{
          flexGrow: 1,
          height: { xs: "calc(100vh - 150px)", md: "calc(100vh - 200px)" },
          mb: { xs: 2, md: 4 },
          position: "relative",
        }}
      >
        <MapContainer
          center={defaultPosition}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {user?.role === "FARMER" && isAddMode && (
            <AddMarkerToClick onLocationSelected={handleMapClick} />
          )}

          <MapControls>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <SearchControl />
              <LocationControl onLocationSelected={handleMapClick} />
              {user?.role === "FARMER" && (
                <Tooltip
                  title={
                    isAddMode
                      ? "Desativar modo de adicionar planta"
                      : "Ativar modo de adicionar planta"
                  }
                  placement="left"
                >
                  <LocationButton
                    onClick={() => setIsAddMode(!isAddMode)}
                    color={isAddMode ? "primary" : "default"}
                    sx={{
                      backgroundColor: isAddMode
                        ? "rgba(76, 175, 80, 0.9)"
                        : "rgba(255, 255, 255, 0.9)",
                      color: isAddMode ? "white" : "rgba(76, 175, 80, 0.8)",
                      "&:hover": {
                        backgroundColor: isAddMode
                          ? "rgba(76, 175, 80, 0.95)"
                          : "rgba(255, 255, 255, 0.95)",
                      },
                    }}
                  >
                    <YardIcon />
                  </LocationButton>
                </Tooltip>
              )}
            </Box>
          </MapControls>

          <MarkerClusterGroup
            chunkedLoading
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={true}
            zoomToBoundsOnClick={true}
            maxClusterRadius={50}
            iconCreateFunction={(cluster) => {
              const count = cluster.getChildCount();
              let size = 40;
              let className = "marker-cluster-";

              if (count < 10) {
                className += "small";
              } else if (count < 100) {
                className += "medium";
                size = 50;
              } else {
                className += "large";
                size = 60;
              }

              return L.divIcon({
                html: `<div><span>${count}</span></div>`,
                className: `marker-cluster ${className}`,
                iconSize: L.point(size, size),
              });
            }}
          >
            {locations.map((location) => (
              <Marker
                key={location.id}
                position={[location.latitude, location.longitude]}
                eventHandlers={{
                  click: () => handleMarkerClick(location),
                  mouseover: (e) => {
                    e.target.openPopup();
                  },
                  mouseout: (e) => {
                    e.target.closePopup();
                  },
                }}
              >
                <Popup>
                  <Box
                    sx={{
                      p: 1,
                      minWidth: 200,
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {location.species}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {location.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 1, color: "text.secondary" }}
                    >
                      Added by: {location.addedBy.name}
                    </Typography>
                    {location.company && (
                      <Typography
                        variant="caption"
                        sx={{ display: "block", color: "text.secondary" }}
                      >
                        Company: {location.company.name}
                      </Typography>
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 1,
                        color: "primary.main",
                        fontStyle: "italic",
                      }}
                    >
                      Click for more details
                    </Typography>
                  </Box>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>

          {/* Display temporary marker for new location */}
          {newLocation.latitude && newLocation.longitude && (
            <Marker position={[newLocation.latitude, newLocation.longitude]}>
              <Popup>New plant location</Popup>
            </Marker>
          )}
        </MapContainer>
      </Box>

      {renderFarmerReport()}
      {renderCompanyReport()}

      {/* Plant Detail Modal */}
      <Dialog
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: 1, sm: 2 },
            width: { xs: "calc(100% - 16px)", sm: "calc(100% - 32px)" },
            maxHeight: { xs: "calc(100% - 16px)", sm: "calc(100% - 32px)" },
          },
        }}
      >
        {selectedPlant && (
          <>
            <DialogTitle>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {selectedPlant.species}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {selectedPlant.imageUrl && (
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        width: "100%",
                        height: 400,
                        position: "relative",
                        borderRadius: 1,
                        overflow: "hidden",
                        backgroundColor: "grey.100",
                      }}
                    >
                      <img
                        src={selectedPlant.imageUrl}
                        alt={selectedPlant.species}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12} md={selectedPlant.imageUrl ? 6 : 12}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Descrição
                  </Typography>
                  <Typography variant="body1">
                    {selectedPlant.description || "Sem descrição disponível"}
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "text.secondary" }}
                        >
                          Localização
                        </Typography>
                        <Typography variant="body2">
                          Latitude: {selectedPlant.latitude.toFixed(6)}
                          <br />
                          Longitude: {selectedPlant.longitude.toFixed(6)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "text.secondary" }}
                        >
                          Adicionado por
                        </Typography>
                        <Typography variant="body2">
                          {selectedPlant.addedBy.name}
                        </Typography>
                        {selectedPlant.company && (
                          <>
                            <Typography
                              variant="subtitle2"
                              sx={{ color: "text.secondary", mt: 1 }}
                            >
                              Empresa
                            </Typography>
                            <Typography variant="body2">
                              {selectedPlant.company.name}
                            </Typography>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {user?.role === "ADMIN" && !selectedPlant.company && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 2 }}
                    >
                      Controles de Administrador
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel>Atribuir à Empresa</InputLabel>
                      <Select
                        value={selectedCompanyId}
                        label="Atribuir à Empresa"
                        onChange={(e) => setSelectedCompanyId(e.target.value)}
                      >
                        <MenuItem value="">
                          <em>Nenhuma</em>
                        </MenuItem>
                        {companyList.map((company) => (
                          <MenuItem key={company.id} value={company.id}>
                            {company.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 1,
                          color: "text.secondary",
                          display: "block",
                        }}
                      >
                        Selecione uma empresa para atribuir esta planta
                      </Typography>
                    </FormControl>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={async () => {
                        await handleAssignCompany();
                        setIsDetailModalOpen(false);
                      }}
                      disabled={!selectedCompanyId}
                    >
                      Atribuir à Empresa
                    </Button>
                  </Grid>
                )}
                {user?.role === "ADMIN" && selectedPlant.company && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "success.light",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "success.dark",
                          fontWeight: 500,
                        }}
                      >
                        ✓ Esta planta já está atribuída à empresa{" "}
                        {selectedPlant.company.name}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <PlantUpdates plantId={selectedPlant.id} />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDetailModalOpen(false)}>
                Fechar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

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
          setImageUpload({
            file: null,
            preview: null,
            uploading: false,
            error: null,
          });
        }}
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: 1, sm: 2 },
            width: { xs: "calc(100% - 16px)", sm: "calc(100% - 32px)" },
            maxHeight: { xs: "calc(100% - 16px)", sm: "calc(100% - 32px)" },
          },
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

          <input
            type="file"
            accept="image/*"
            id="image-upload"
            style={{ display: "none" }}
            onChange={handleImageSelect}
          />
          <label htmlFor="image-upload">
            <ImageUploadButton
              component="span"
              disabled={imageUpload.uploading}
            >
              <CloudUploadIcon sx={{ fontSize: 32, mb: 1 }} />
              {imageUpload.uploading
                ? "Uploading..."
                : imageUpload.preview
                ? "Change Image"
                : "Upload Plant Image"}
            </ImageUploadButton>
          </label>

          {imageUpload.preview && (
            <Box
              sx={{
                mt: 2,
                position: "relative",
                width: "100%",
                height: 200,
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <img
                src={imageUpload.preview}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          )}

          {imageUpload.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {imageUpload.error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddingLocation(false)}>Cancel</Button>
          <Button
            onClick={handleAddLocation}
            variant="contained"
            color="primary"
            disabled={imageUpload.uploading}
          >
            {imageUpload.uploading ? "Uploading..." : "Add Plant"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Add these styles at the end of the file, before the export
const styles = `
  .marker-cluster {
    background-clip: padding-box;
    border-radius: 20px;
    background-color: rgba(76, 175, 80, 0.6);
  }
  
  .marker-cluster div {
    width: 30px;
    height: 30px;
    margin-left: 5px;
    margin-top: 5px;
    text-align: center;
    border-radius: 15px;
    font-size: 12px;
    color: white;
    font-weight: bold;
    background-color: rgba(76, 175, 80, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .marker-cluster-small {
    background-color: rgba(76, 175, 80, 0.6);
  }
  
  .marker-cluster-small div {
    background-color: rgba(76, 175, 80, 0.8);
  }
  
  .marker-cluster-medium {
    background-color: rgba(241, 211, 87, 0.6);
  }
  
  .marker-cluster-medium div {
    background-color: rgba(240, 194, 12, 0.8);
  }
  
  .marker-cluster-large {
    background-color: rgba(253, 156, 115, 0.6);
  }
  
  .marker-cluster-large div {
    background-color: rgba(241, 128, 23, 0.8);
  }
`;

// Add style tag to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Map;
