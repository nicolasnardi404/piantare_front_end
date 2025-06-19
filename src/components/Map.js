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
import { plantLocations, companies, plants } from "../services/api";
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
import DeleteIcon from "@mui/icons-material/Delete";

// Import marker cluster CSS
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Define red icon for user location
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
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
  const [locationError, setLocationError] = useState(null);
  const map = useMap();
  const { user } = useAuth();

  const handleGetLocation = () => {
    setLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocalização não é suportada pelo seu navegador");
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true, // Use GPS if available
      timeout: 10000, // Wait up to 10 seconds
      maximumAge: 0, // Don't use cached position
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        map.setView([latitude, longitude], 15);

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
        console.error("Geolocation error:", error);
        let errorMessage = "";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Por favor, permita o acesso à sua localização nas configurações do seu dispositivo.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Não foi possível determinar sua localização. Verifique se o GPS está ativado.";
            break;
          case error.TIMEOUT:
            errorMessage =
              "Tempo excedido ao tentar obter sua localização. Verifique sua conexão e o GPS.";
            break;
          default:
            errorMessage = "Erro ao obter sua localização. Tente novamente.";
        }

        setLocationError(errorMessage);
        setLoading(false);
      },
      options
    );
  };

  return (
    <>
      <Tooltip
        title={
          locationError ||
          (user?.role === "FARMER"
            ? "Adicionar planta na minha localização (ative o GPS)"
            : "Minha Localização (ative o GPS)")
        }
        placement="left"
      >
        <LocationButton
          onClick={handleGetLocation}
          disabled={loading}
          size="large"
          color={locationError ? "error" : "primary"}
          sx={{
            ...(locationError && {
              backgroundColor: "rgba(211, 47, 47, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(211, 47, 47, 0.2)",
              },
            }),
          }}
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
      {locationError && (
        <Alert
          severity="error"
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "90%",
            zIndex: 1000,
          }}
        >
          {locationError}
        </Alert>
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
  const { user, token } = useAuth();
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({
    latitude: null,
    longitude: null,
    plantId: null,
    description: "",
  });
  const [availablePlants, setAvailablePlants] = useState([]);
  const [error, setError] = useState("");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [imageUpload, setImageUpload] = useState({
    file: null,
    preview: null,
    uploading: false,
    error: null,
  });
  const [companyStats, setCompanyStats] = useState({
    totalPlants: 0,
    speciesCount: {},
    recentPlants: [],
  });
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
    loadAvailablePlants();
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
    if (!token) {
      setError("You must be logged in to view plant locations");
      return;
    }

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
      setCompanies(response.data);
    } catch (err) {
      setError("Failed to load companies");
    }
  };

  const loadAvailablePlants = async () => {
    try {
      const response = await plants.getAll();
      setAvailablePlants(response.data.plants || []);
    } catch (error) {
      console.error("Error loading plants:", error);
      setError("Failed to load available plants");
      setAvailablePlants([]);
    }
  };

  const handleMapClick = (location) => {
    if (user?.role === "FARMER" && isAddMode) {
      setNewLocation({
        ...newLocation,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setIsAddMode(false);
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
        !newLocation.plantId
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
            `${API_URL}/uploads/upload`,
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
        plantId: null,
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
    if (!file) {
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setImageUpload((prev) => ({
        ...prev,
        error: "Por favor selecione uma imagem válida",
      }));
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setImageUpload((prev) => ({
        ...prev,
        error: "A imagem deve ter menos que 10MB",
      }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUpload({
        file,
        preview: reader.result,
        uploading: false,
        error: null,
      });
    };
    reader.onerror = () => {
      setImageUpload((prev) => ({
        ...prev,
        error: "Erro ao carregar a imagem",
      }));
    };
    reader.readAsDataURL(file);

    // Clear the input value to allow selecting the same file again
    event.target.value = "";
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

  const handleDeletePlant = async (plantId) => {
    if (!token) {
      setError("You must be logged in to delete plants");
      return;
    }

    try {
      await plantLocations.delete(plantId);
      setIsDetailModalOpen(false);
      loadLocations();
      setError("");
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.error || "Failed to delete plant location");
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
                      ? "Cancel adding plant"
                      : "Click to add a new plant"
                  }
                  placement="left"
                >
                  <LocationButton
                    onClick={() => {
                      setIsAddMode(!isAddMode);
                      if (isAddingLocation) {
                        setIsAddingLocation(false);
                        setNewLocation({
                          latitude: null,
                          longitude: null,
                          plantId: null,
                          description: "",
                        });
                      }
                    }}
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
                    {isAddMode ? <GrassIcon /> : <YardIcon />}
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

          {/* Show temporary marker for selected location */}
          {newLocation.latitude &&
            newLocation.longitude &&
            !isAddingLocation && (
              <Marker
                position={[newLocation.latitude, newLocation.longitude]}
                icon={redIcon}
              >
                <Popup>
                  <Box sx={{ p: 1, minWidth: 200 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Selected Location
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, color: "text.secondary" }}
                    >
                      Click the button below to add plant details
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => setIsAddingLocation(true)}
                    >
                      Add Plant Details
                    </Button>
                  </Box>
                </Popup>
              </Marker>
            )}
        </MapContainer>
      </Box>

      {renderFarmerReport()}
      {renderCompanyReport()}

      {/* Plant Details Dialog */}
      <Dialog
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            {selectedPlant?.plant?.nomePopular}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {selectedPlant?.plant?.nomeCientifico}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            {selectedPlant?.imageUrl && (
              <Box
                component="img"
                src={selectedPlant.imageUrl}
                alt="Plant"
                sx={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 1,
                  mb: 2,
                }}
              />
            )}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Added by
                </Typography>
                <Typography>
                  {selectedPlant?.addedBy?.name || "Unknown"}
                </Typography>
              </Grid>
              {selectedPlant?.company && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Company
                  </Typography>
                  <Typography>{selectedPlant.company.name}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography>
                  {selectedPlant?.latitude.toFixed(6)},{" "}
                  {selectedPlant?.longitude.toFixed(6)}
                </Typography>
              </Grid>
              {selectedPlant?.description && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography>{selectedPlant.description}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Plant Details
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography>
                    <strong>Category:</strong> {selectedPlant?.plant?.categoria}
                  </Typography>
                  {selectedPlant?.plant?.altura && (
                    <Typography>
                      <strong>Height:</strong> {selectedPlant.plant.altura}
                    </Typography>
                  )}
                  {selectedPlant?.plant?.origem && (
                    <Typography>
                      <strong>Origin:</strong> {selectedPlant.plant.origem}
                    </Typography>
                  )}
                  {selectedPlant?.plant?.especificacao && (
                    <Typography>
                      <strong>Specifications:</strong>{" "}
                      {selectedPlant.plant.especificacao}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
          {user?.role === "COMPANY" && !selectedPlant?.company && (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Assign to Company</InputLabel>
                <Select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleAssignCompany}
                sx={{ mt: 2 }}
              >
                Assign to Company
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {(user?.role === "ADMIN" ||
            (user?.role === "FARMER" &&
              selectedPlant?.addedBy?.id === user?.id)) && (
            <Button
              onClick={() => handleDeletePlant(selectedPlant.id)}
              color="error"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          )}
          <Button onClick={() => setIsDetailModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Plant Dialog - only show after location is selected */}
      <Dialog
        open={isAddingLocation}
        onClose={() => {
          setIsAddingLocation(false);
          setNewLocation({
            latitude: null,
            longitude: null,
            plantId: null,
            description: "",
          });
          setImageUpload({
            file: null,
            preview: null,
            uploading: false,
            error: null,
          });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Plant Details</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Selected Location: {newLocation.latitude?.toFixed(6)},{" "}
              {newLocation.longitude?.toFixed(6)}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Plant</InputLabel>
                  <Select
                    value={newLocation.plantId || ""}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        plantId: e.target.value,
                      })
                    }
                    required
                  >
                    {availablePlants.map((plant) => (
                      <MenuItem key={plant.id} value={plant.id}>
                        {plant.nomePopular} ({plant.nomeCientifico})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={newLocation.description}
                  onChange={(e) =>
                    setNewLocation({
                      ...newLocation,
                      description: e.target.value,
                    })
                  }
                  multiline
                  rows={3}
                  margin="normal"
                />
              </Grid>
            </Grid>
            <ImageUploadButton
              component="label"
              disabled={imageUpload.uploading}
            >
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageSelect}
              />
              <CloudUploadIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="body1">
                {imageUpload.uploading
                  ? "Uploading..."
                  : "Click to upload plant image"}
              </Typography>
              {imageUpload.preview && (
                <Box
                  component="img"
                  src={imageUpload.preview}
                  sx={{
                    mt: 2,
                    maxWidth: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                  }}
                />
              )}
            </ImageUploadButton>
            {imageUpload.error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {imageUpload.error}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsAddingLocation(false);
              setIsAddMode(true); // Allow selecting a new location
            }}
          >
            Change Location
          </Button>
          <Button onClick={() => setIsAddingLocation(false)}>Cancel</Button>
          <Button
            onClick={handleAddLocation}
            variant="contained"
            disabled={imageUpload.uploading}
          >
            Add Plant
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
