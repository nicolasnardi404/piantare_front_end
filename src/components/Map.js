import React, { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  LayersControl,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { useAuth } from "../context/AuthContext";
import {
  plantLocations,
  companies,
  plants,
  plantUpdates,
  geoGpt,
  api,
} from "../services/api";
import { b2Service } from "../services/b2";
import axios from "axios";
import { format } from "date-fns";
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
import "leaflet.markercluster/dist/MarkerCluster.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SearchIcon from "@mui/icons-material/Search";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import PlantUpdates from "./PlantUpdates";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import YardIcon from "@mui/icons-material/Yard";
import GrassIcon from "@mui/icons-material/Grass";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CompanyReport from "./CompanyReport";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import Autocomplete from "@mui/material/Autocomplete";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Import marker cluster CSS
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// Constants
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
// São Paulo coordinates as default center
const defaultPosition = [-23.5505, -46.6333];

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

// Add this mapping function near the top of the file, after the imports
const formatPlantCategory = (category) => {
  const categoryMap = {
    TREES: "Árvores",
    FRUIT_TREES: "Árvores Frutíferas",
    GRASSES: "Capins",
    TALL_FOLIAGE: "Folhagens Altas",
    SHRUBS: "Arbustos",
    CLIMBING_PLANTS: "Trepadeiras",
    AROMATIC_AND_EDIBLE: "Aromáticas e Comestíveis",
    GROUND_COVER: "Plantas de Forração",
    AQUATIC_OR_MARSH: "Plantas Aquáticas ou Palustres",
  };

  return categoryMap[category] || category;
};

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
  width: "100%",
  height: "auto",
  minHeight: 150,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1),
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
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

// In the MapContainer component:
<MapContainer
  center={defaultPosition}
  zoom={13}
  style={{ height: "100%", width: "100%" }}
>
  <LayersControl position="bottomright">
    <LayersControl.BaseLayer checked name="Street Map">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </LayersControl.BaseLayer>
    <LayersControl.BaseLayer name="Satellite">
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        maxZoom={19}
        minZoom={0}
        tileSize={256}
      />
    </LayersControl.BaseLayer>
  </LayersControl>

  {/* ... rest of your existing MapContainer content ... */}
</MapContainer>;

const LocationMap = () => {
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
    height: "",
    width: "",
    notes: "",
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
    plantsByCategory: {},
    recentPlants: [],
  });
  const [farmerStats, setFarmerStats] = useState({
    totalPlants: 0,
    speciesCount: {},
    recentPlants: [],
  });
  const [updateDialogState, setUpdateDialogState] = useState({
    open: false,
    plantId: null,
    plantName: "",
  });
  const [geoAnalysis, setGeoAnalysis] = useState({
    loading: false,
    data: null,
    error: null,
  });
  const [locationDetails, setLocationDetails] = useState({});
  const [locationAddress, setLocationAddress] = useState(null);

  useEffect(() => {
    loadLocations();
    loadAvailablePlants();
  }, [user]);

  const analyzeEnvironmentalImpact = useCallback(async (plants) => {
    try {
      setGeoAnalysis((prev) => ({ ...prev, loading: true, error: null }));

      const response = await geoGpt.analyze(plants);

      setGeoAnalysis((prev) => ({
        ...prev,
        loading: false,
        data: response.data,
      }));
    } catch (error) {
      console.error("Error analyzing environmental impact:", error);
      setGeoAnalysis((prev) => ({
        ...prev,
        loading: false,
        error: "Falha ao analisar o impacto ambiental",
      }));
    }
  }, []);

  // Calculate company statistics whenever locations change
  useEffect(() => {
    if (user?.role === "COMPANY") {
      // Filter plants for this company
      console.log("Current user:", user);
      console.log("All locations:", locations);

      // Changed the filter condition since companyId might be null
      const companyPlants = locations;

      console.log("Filtered company plants:", companyPlants);

      // Calculate plants by category
      const plantsByCategory = companyPlants.reduce((acc, location) => {
        const category = location.plant?.category || "OUTROS";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(location);
        return acc;
      }, {});

      console.log("Plants by category:", plantsByCategory);

      // Sort plants by most recent first
      const sortedPlants = [...companyPlants].sort((a, b) => {
        return (
          new Date(b.plantedAt || b.createdAt) -
          new Date(a.plantedAt || a.createdAt)
        );
      });

      setCompanyStats({
        totalPlants: companyPlants.length,
        plantsByCategory,
        recentPlants: sortedPlants,
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
      let response;
      if (user?.role === "COMPANY") {
        response = await plantLocations.getCompanyPlants();
      } else if (user?.role === "FARMER") {
        response = await plantLocations.getFarmerPlants();
      } else {
        response = await plantLocations.getMapMarkers();
      }

      setLocations(response.data);
    } catch (err) {
      console.error("Error loading locations:", err);
      setError("Failed to load plant locations");
    }
  };

  const loadAvailablePlants = async () => {
    try {
      const response = await plants.getList();
      setAvailablePlants(response.data || []);
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

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "PlantasApp/1.0",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching address:", error);
      return null;
    }
  };

  const handleMarkerClick = async (location) => {
    try {
      // Get detailed plant information
      const detailedResponse = await plantLocations.getPlantDetails(
        location.id
      );
      const detailedLocation = detailedResponse.data;

      // Get location address
      const addressData = await getAddressFromCoordinates(
        location.latitude,
        location.longitude
      );
      setLocationAddress(addressData);

      setSelectedPlant(detailedLocation);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Error fetching plant details:", error);
      setError("Failed to load plant details");
    }
  };

  const handleAddLocation = async () => {
    try {
      if (
        !newLocation.latitude ||
        !newLocation.longitude ||
        !newLocation.plantId
      ) {
        setError(
          "Por favor, selecione uma localização no mapa e escolha uma planta"
        );
        return;
      }

      if (!newLocation.height || !newLocation.width) {
        setError("Por favor, preencha a altura e a largura da planta");
        return;
      }

      if (!imageUpload.file) {
        setError("Por favor, adicione uma foto da planta");
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
          console.error("Erro no upload da imagem:", err);
          setImageUpload((prev) => ({
            ...prev,
            uploading: false,
            error: "Falha ao fazer upload da imagem",
          }));
          return;
        }
      }

      const locationData = {
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
        plantId: newLocation.plantId,
        description: newLocation.description,
        imageUrl,
        height: parseFloat(newLocation.height),
        width: parseFloat(newLocation.width),
        notes: newLocation.notes,
      };

      await plantLocations.create(locationData);

      setIsAddingLocation(false);
      setNewLocation({
        latitude: null,
        longitude: null,
        plantId: null,
        description: "",
        height: "",
        width: "",
        notes: "",
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
      console.error("Erro ao adicionar planta:", err);
      setError(
        err.response?.data?.error || "Falha ao adicionar localização da planta"
      );
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

  const handleAddUpdate = async (
    plantId,
    healthStatus,
    observations,
    image,
    height,
    width
  ) => {
    try {
      let imageUrl = null;
      if (image) {
        const formData = new FormData();
        formData.append("file", image);

        const uploadResponse = await axios.post(
          `${API_URL}/uploads/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        imageUrl = uploadResponse.data.url;
      }

      // Create the update with consistent measurements structure
      const updateResponse = await plantUpdates.create({
        plantLocationId: plantId,
        healthStatus,
        notes: observations,
        imageUrl,
        height: parseFloat(height),
        width: parseFloat(width),
      });

      console.log("Update created:", updateResponse);

      await loadLocations();
      setUpdateDialogState({ open: false, plantId: null, plantName: "" });
    } catch (error) {
      console.error("Error adding update:", error);
      setError("Failed to add plant update");
    }
  };

  const renderCompanyReport = () => {
    if (user?.role !== "COMPANY") return null;

    return (
      <Box sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 1, md: 2 } }}>
        {/* Environmental Impact Analysis Section */}
        <Box
          sx={{
            mb: 4,
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95))",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            boxShadow: "0 4px 24px -1px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            border: "1px solid rgba(76, 175, 80, 0.1)",
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid rgba(76, 175, 80, 0.1)",
              background: "rgba(76, 175, 80, 0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "primary.main",
              }}
            >
              Análise de Impacto Ambiental
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {geoAnalysis.loading && (
                <CircularProgress size={24} color="primary" />
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (companyStats.recentPlants.length > 0) {
                    analyzeEnvironmentalImpact(companyStats.recentPlants);
                  }
                }}
                disabled={
                  geoAnalysis.loading || companyStats.recentPlants.length === 0
                }
                startIcon={<AutorenewIcon />}
              >
                Gerar Análise
              </Button>
              {geoAnalysis.data && (
                <PDFDownloadLink
                  document={
                    <CompanyReport
                      companyStats={companyStats}
                      geoAnalysis={geoAnalysis}
                      locations={locations}
                    />
                  }
                  fileName={`relatorio-impacto-ambiental-${format(
                    new Date(),
                    "dd-MM-yyyy"
                  )}.pdf`}
                >
                  {({ blob, url, loading, error }) => (
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={loading}
                      startIcon={<PictureAsPdfIcon />}
                      sx={{
                        bgcolor: "secondary.main",
                        "&:hover": {
                          bgcolor: "secondary.dark",
                        },
                      }}
                    >
                      {loading ? "Gerando PDF..." : "Baixar Relatório"}
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
            </Box>
          </Box>
          <Box sx={{ p: 3 }}>
            {geoAnalysis.error ? (
              <Alert severity="error">{geoAnalysis.error}</Alert>
            ) : geoAnalysis.data ? (
              <Box
                sx={{
                  p: 3,
                  background: "rgba(76, 175, 80, 0.05)",
                  borderRadius: "12px",
                }}
              >
                {geoAnalysis.data.analysis
                  .split(/\[(COMPOSIÇÃO|DISTRIBUIÇÃO|CONTEXTO)\]/)
                  .map((text, index) => {
                    if (text === "COMPOSIÇÃO") {
                      return (
                        <Typography
                          key={index}
                          variant="h6"
                          sx={{
                            color: "primary.main",
                            fontWeight: 600,
                            mt: index === 0 ? 0 : 3,
                            mb: 2,
                          }}
                        >
                          Composição e Diversidade
                        </Typography>
                      );
                    }
                    if (text === "DISTRIBUIÇÃO") {
                      return (
                        <Typography
                          key={index}
                          variant="h6"
                          sx={{
                            color: "primary.main",
                            fontWeight: 600,
                            mt: 3,
                            mb: 2,
                          }}
                        >
                          Distribuição Espacial
                        </Typography>
                      );
                    }
                    if (text === "CONTEXTO") {
                      return (
                        <Typography
                          key={index}
                          variant="h6"
                          sx={{
                            color: "primary.main",
                            fontWeight: 600,
                            mt: 3,
                            mb: 2,
                          }}
                        >
                          Contextualização Regional
                        </Typography>
                      );
                    }
                    return (
                      <Typography
                        key={index}
                        sx={{
                          lineHeight: 1.8,
                          mb: 2,
                          "& > p": { mb: 2 },
                          "& > ul": {
                            pl: 2,
                            mb: 2,
                            "& > li": { mb: 1 },
                          },
                        }}
                      >
                        {text}
                      </Typography>
                    );
                  })}
              </Box>
            ) : (
              <Typography
                sx={{
                  textAlign: "center",
                  color: "text.secondary",
                  fontStyle: "italic",
                }}
              >
                Carregando análise ambiental...
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1.5rem", md: "1.75rem" },
                fontWeight: 700,
                background: "linear-gradient(135deg, #2e7d32, #81c784)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Relatório de Plantas
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              Total de plantas cadastradas: {companyStats.totalPlants}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {Object.entries(companyStats.plantsByCategory || {}).map(
            ([category, plants]) => (
              <Grid item xs={12} md={6} key={category}>
                <Box
                  sx={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95))",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    boxShadow: "0 4px 24px -1px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    border: "1px solid rgba(76, 175, 80, 0.1)",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: "1px solid rgba(76, 175, 80, 0.1)",
                      background: "rgba(76, 175, 80, 0.05)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "primary.main",
                      }}
                    >
                      {formatPlantCategory(category)}
                    </Typography>
                    <Typography
                      sx={{
                        backgroundColor: "rgba(76, 175, 80, 0.12)",
                        color: "primary.main",
                        px: 2,
                        py: 0.5,
                        borderRadius: "12px",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      {plants.length} plantas
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    {plants.map((plant) => (
                      <Box
                        key={plant.id}
                        sx={{
                          mb: 2,
                          p: 2,
                          background: "rgba(76, 175, 80, 0.03)",
                          borderRadius: "12px",
                          transition: "all 0.2s ease-in-out",
                          cursor: "pointer",
                          "&:hover": {
                            transform: "translateX(8px)",
                            background: "rgba(76, 175, 80, 0.06)",
                          },
                          "&:last-child": {
                            mb: 0,
                          },
                        }}
                        onClick={() => handleMarkerClick(plant)}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.5,
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600 }}
                              >
                                {plant.plant?.commonName}
                              </Typography>
                              {plant.updates && plant.updates.length > 0 && (
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    bgcolor:
                                      plant.updates[0].healthStatus ===
                                      "HEALTHY"
                                        ? "#4caf50"
                                        : plant.updates[0].healthStatus ===
                                          "NEEDS_ATTENTION"
                                        ? "#ff9800"
                                        : "#f44336",
                                  }}
                                />
                              )}
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.secondary",
                                fontStyle: "italic",
                                mb: 1,
                              }}
                            >
                              {plant.plant?.scientificName}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            )
          )}
        </Grid>
      </Box>
    );
  };

  const renderFarmerReport = () => {
    if (user?.role !== "FARMER") return null;

    // Group plants by category
    const plantsByCategory = farmerStats.recentPlants.reduce((acc, plant) => {
      const category = plant.plant?.category || "OUTROS";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(plant);
      return acc;
    }, {});

    return (
      <Box sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 1, md: 2 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1.5rem", md: "1.75rem" },
                fontWeight: 700,
                background: "linear-gradient(135deg, #2e7d32, #81c784)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Minhas Plantas
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              Total de plantas cadastradas: {farmerStats.totalPlants}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {Object.entries(plantsByCategory).map(([category, plants]) => (
            <Grid item xs={12} md={6} key={category}>
              <Box
                sx={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95))",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  boxShadow: "0 4px 24px -1px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  border: "1px solid rgba(76, 175, 80, 0.1)",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderBottom: "1px solid rgba(76, 175, 80, 0.1)",
                    background: "rgba(76, 175, 80, 0.05)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                    }}
                  >
                    {formatPlantCategory(category)}
                  </Typography>
                  <Typography
                    sx={{
                      backgroundColor: "rgba(76, 175, 80, 0.12)",
                      color: "primary.main",
                      px: 2,
                      py: 0.5,
                      borderRadius: "12px",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    {plants.length} plantas
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  {plants.map((plant) => (
                    <Box
                      key={plant.id}
                      sx={{
                        mb: 2,
                        p: 2,
                        background: "rgba(76, 175, 80, 0.03)",
                        borderRadius: "12px",
                        transition: "all 0.2s ease-in-out",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateX(8px)",
                          background: "rgba(76, 175, 80, 0.06)",
                        },
                        "&:last-child": {
                          mb: 0,
                        },
                      }}
                      onClick={() => handleMarkerClick(plant)}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600 }}
                            >
                              {plant.plant?.commonName}
                            </Typography>
                            {plant.updates && plant.updates.length > 0 && (
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  bgcolor:
                                    plant.updates[0].healthStatus === "HEALTHY"
                                      ? "#4caf50"
                                      : plant.updates[0].healthStatus ===
                                        "NEEDS_ATTENTION"
                                      ? "#ff9800"
                                      : "#f44336",
                                }}
                              />
                            )}
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              fontStyle: "italic",
                              mb: 1,
                            }}
                          >
                            {plant.plant?.scientificName}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
        <PlantUpdateDialog />
      </Box>
    );
  };

  const PlantUpdateDialog = () => {
    const [healthStatus, setHealthStatus] = useState("HEALTHY");
    const [observations, setObservations] = useState("");
    const [height, setHeight] = useState("");
    const [width, setWidth] = useState("");
    const [imageUpload, setImageUpload] = useState({
      file: null,
      preview: null,
      error: null,
    });

    const handleImageSelect = (event) => {
      const file = event.target.files[0];
      if (!file) return;

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
    };

    const handleSubmit = async () => {
      if (!height || !width) {
        setError("Por favor, preencha a altura e largura da planta");
        return;
      }

      try {
        await handleAddUpdate(
          updateDialogState.plantId,
          healthStatus,
          observations,
          imageUpload.file,
          height,
          width
        );
        // Reset form
        setHealthStatus("HEALTHY");
        setObservations("");
        setHeight("");
        setWidth("");
        setImageUpload({
          file: null,
          preview: null,
          error: null,
        });
      } catch (error) {
        console.error("Error submitting update:", error);
      }
    };

    return (
      <Dialog
        open={updateDialogState.open}
        onClose={() =>
          setUpdateDialogState({ open: false, plantId: null, plantName: "" })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Atualizar Status da Planta: {updateDialogState.plantName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Estado de Saúde</InputLabel>
              <Select
                value={healthStatus}
                onChange={(e) => setHealthStatus(e.target.value)}
                label="Estado de Saúde"
              >
                <MenuItem value="HEALTHY">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#4caf50",
                      }}
                    />
                    Saudável
                  </Box>
                </MenuItem>
                <MenuItem value="NEEDS_ATTENTION">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#ff9800",
                      }}
                    />
                    Precisa de Atenção
                  </Box>
                </MenuItem>
                <MenuItem value="SICK">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#f44336",
                      }}
                    />
                    Doente
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Altura (metros)"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  inputProps={{ step: "0.01" }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Largura (metros)"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  inputProps={{ step: "0.01" }}
                  required
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Observações"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Descreva o estado atual da planta, tratamentos aplicados, etc."
              sx={{ mb: 3 }}
            />
            <ImageUploadButton
              component="label"
              disabled={false}
              sx={{
                mt: 2,
                mb: imageUpload.preview ? 1 : 3,
              }}
            >
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageSelect}
              />
              <CloudUploadIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="body1">
                Clique para adicionar uma foto
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
              <Typography color="error" variant="body2" sx={{ mt: 1, mb: 2 }}>
                {imageUpload.error}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setUpdateDialogState({
                open: false,
                plantId: null,
                plantName: "",
              })
            }
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<UpdateIcon />}
          >
            Atualizar Status
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderAddLocationDialog = () => (
    <Dialog
      open={isAddingLocation}
      onClose={() => setIsAddingLocation(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          maxHeight: "90vh",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #4caf50 0%, #81c784 100%)",
            p: 3,
            color: "white",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Adicionar Nova Planta
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
            Preencha os detalhes da planta para registrar sua localização
          </Typography>
        </Box>

        {/* Content */}
        <DialogContent
          sx={{
            p: 4,
            overflowY: "auto",
            flex: 1,
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              {/* Plant Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, color: "primary.main", fontWeight: 500 }}
                >
                  Informações da Planta
                </Typography>
                <Autocomplete
                  fullWidth
                  options={availablePlants}
                  getOptionLabel={(option) =>
                    `${option.commonName} (${option.scientificName})`
                  }
                  onChange={(event, newValue) => {
                    setNewLocation((prev) => ({
                      ...prev,
                      plantId: newValue?.id || null,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Buscar e Selecionar Planta"
                      placeholder="Digite para buscar..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(76, 175, 80, 0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(76, 175, 80, 0.3)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "primary.main",
                          },
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="body1">
                          {option.commonName}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", fontStyle: "italic" }}
                        >
                          {option.scientificName}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  noOptionsText="Nenhuma planta encontrada"
                  loadingText="Carregando..."
                />
              </Box>

              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Descrição"
                  placeholder="Adicione detalhes sobre a localização ou condição da planta"
                  value={newLocation.description}
                  onChange={(e) =>
                    setNewLocation((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(76, 175, 80, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(76, 175, 80, 0.3)",
                      },
                    },
                  }}
                />
              </Box>

              {/* Measurements */}
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, color: "primary.main", fontWeight: 500 }}
                >
                  Medidas da Planta
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Altura (metros)"
                      type="number"
                      value={newLocation.height}
                      onChange={(e) =>
                        setNewLocation((prev) => ({
                          ...prev,
                          height: e.target.value,
                        }))
                      }
                      inputProps={{ step: "0.01", min: "0" }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(76, 175, 80, 0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(76, 175, 80, 0.3)",
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Diâmetro (metros)"
                      type="number"
                      value={newLocation.width}
                      onChange={(e) =>
                        setNewLocation((prev) => ({
                          ...prev,
                          width: e.target.value,
                        }))
                      }
                      inputProps={{ step: "0.01", min: "0" }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(76, 175, 80, 0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(76, 175, 80, 0.3)",
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              {/* Notes */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, color: "primary.main", fontWeight: 500 }}
                >
                  Observações
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Observações Iniciais"
                  placeholder="Adicione notas sobre o estado inicial da planta"
                  value={newLocation.notes}
                  onChange={(e) =>
                    setNewLocation((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(76, 175, 80, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(76, 175, 80, 0.3)",
                      },
                    },
                  }}
                />
              </Box>

              {/* Image Upload */}
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, color: "primary.main", fontWeight: 500 }}
                >
                  Foto da Planta
                </Typography>
                <Box
                  sx={{
                    border: "2px dashed rgba(76, 175, 80, 0.2)",
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "rgba(76, 175, 80, 0.04)",
                    },
                  }}
                >
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageSelect}
                    id="plant-image-upload"
                  />
                  <label htmlFor="plant-image-upload">
                    {imageUpload.uploading ? (
                      <CircularProgress size={40} />
                    ) : imageUpload.preview ? (
                      <Box sx={{ position: "relative" }}>
                        <Box
                          component="img"
                          src={imageUpload.preview}
                          alt="Preview"
                          sx={{
                            maxWidth: "100%",
                            maxHeight: 200,
                            borderRadius: 1,
                            mb: 2,
                          }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() =>
                            setImageUpload({
                              file: null,
                              preview: null,
                              uploading: false,
                              error: null,
                            })
                          }
                        >
                          Trocar Imagem
                        </Button>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <CloudUploadIcon
                          sx={{ fontSize: 48, color: "primary.main", mb: 1 }}
                        />
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          Clique para adicionar uma foto
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ou arraste e solte aqui
                        </Typography>
                      </Box>
                    )}
                  </label>
                  {imageUpload.error && (
                    <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                      {imageUpload.error}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        {/* Actions */}
        <DialogActions
          sx={{
            p: 3,
            gap: 2,
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            bgcolor: "background.paper",
          }}
        >
          <Button
            onClick={() => setIsAddingLocation(false)}
            variant="outlined"
            color="primary"
            sx={{
              borderColor: "rgba(76, 175, 80, 0.5)",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "rgba(76, 175, 80, 0.04)",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAddLocation}
            variant="contained"
            disabled={imageUpload.uploading}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            {imageUpload.uploading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Adicionar Planta"
            )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );

  const getLocationDetails = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const address = response.data.address;
      return {
        city: address.city || address.town || address.village || "N/A",
        state: address.state || "N/A",
        country: address.country || "N/A",
      };
    } catch (error) {
      console.error("Error fetching location details:", error);
      return {
        city: "N/A",
        state: "N/A",
        country: "N/A",
      };
    }
  };

  // Add this component before LocationMap
  const GrowthChart = ({ updates }) => {
    const chartData = updates
      .slice()
      .reverse()
      .map((update) => ({
        date: new Date(update.updateDate).toLocaleDateString(),
        height: parseFloat(update.height),
        width: parseFloat(update.width),
      }));

    return (
      <Box sx={{ width: "100%", height: 300, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
          Crescimento da Planta
        </Typography>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis unit="m" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "8px",
                border: "1px solid rgba(76, 175, 80, 0.2)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="height"
              name="Altura (m)"
              stroke="#4caf50"
              strokeWidth={2}
              dot={{ fill: "#4caf50" }}
            />
            <Line
              type="monotone"
              dataKey="width"
              name="Largura (m)"
              stroke="#81c784"
              strokeWidth={2}
              dot={{ fill: "#81c784" }}
            />
          </LineChart>
        </ResponsiveContainer>
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
          width: "100%", // Add explicit width
          "& .leaflet-container": {
            // Add specific Leaflet container styles
            height: "100%",
            width: "100%",
            zIndex: 1,
          },
        }}
      >
        <MapContainer
          center={defaultPosition}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <LayersControl position="bottomright">
            <LayersControl.BaseLayer checked name="Street Map">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                maxZoom={19}
                minZoom={0}
                tileSize={256}
              />
            </LayersControl.BaseLayer>
          </LayersControl>

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
                          height: "",
                          width: "",
                          notes: "",
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
                      {location.plant?.commonName || "Planta Desconhecida"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      {location.plant?.scientificName}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {location.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 1, color: "text.secondary" }}
                    >
                      Adicionado por: {location.addedBy.name}
                    </Typography>
                    {location.company && (
                      <Typography
                        variant="caption"
                        sx={{ display: "block", color: "text.secondary" }}
                      >
                        Empresa: {location.company.name}
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
                      Clique para mais detalhes
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
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "90vw",
            maxWidth: "1000px",
            minHeight: "80vh",
            borderRadius: "20px",
          },
        }}
      >
        <DialogTitle>
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: 600, color: "primary.main" }}
          >
            {selectedPlant?.plant?.commonName}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {selectedPlant?.plant?.scientificName}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            {selectedPlant?.updates && selectedPlant.updates.length > 0 && (
              <Box
                component="img"
                src={selectedPlant.updates[0].imageUrl}
                alt="Plant"
                sx={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "16px",
                  mb: 3,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                }}
              />
            )}

            {/* Current Status Section */}
            <Box
              sx={{
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(76, 175, 80, 0.1)",
                p: 3,
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
              >
                Status Atual
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Estado de Saúde
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color:
                          selectedPlant?.updates &&
                          selectedPlant.updates.length > 0
                            ? selectedPlant.updates[0].healthStatus ===
                              "HEALTHY"
                              ? "#4caf50"
                              : selectedPlant.updates[0].healthStatus ===
                                "NEEDS_ATTENTION"
                              ? "#ff9800"
                              : "#f44336"
                            : "#4caf50",
                        fontWeight: 600,
                      }}
                    >
                      {selectedPlant?.updates &&
                      selectedPlant.updates.length > 0
                        ? selectedPlant.updates[0].healthStatus === "HEALTHY"
                          ? "Saudável"
                          : selectedPlant.updates[0].healthStatus ===
                            "NEEDS_ATTENTION"
                          ? "Precisa de Atenção"
                          : "Doente"
                        : "Saudável"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Dimensões Atuais
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {selectedPlant?.updates &&
                      selectedPlant.updates.length > 0
                        ? `${selectedPlant.updates[0].height}m x ${selectedPlant.updates[0].width}m`
                        : "Não informado"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Última Atualização
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {selectedPlant?.updates &&
                      selectedPlant.updates.length > 0
                        ? new Date(
                            selectedPlant.updates[0].updateDate
                          ).toLocaleDateString()
                        : "Sem atualizações"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box
              sx={{
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(76, 175, 80, 0.1)",
                p: 3,
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                      p: 2,
                      background: "rgba(76, 175, 80, 0.04)",
                      borderRadius: "12px",
                      transition: "all 0.2s ease",
                      height: "100%",
                      "&:hover": {
                        background: "rgba(76, 175, 80, 0.08)",
                      },
                    }}
                  >
                    <PersonIcon sx={{ color: "primary.main", mt: 0.5 }} />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        Plantado por
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedPlant?.addedBy?.name || "Desconhecido"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                {selectedPlant?.company && (
                  <Grid item xs={12} sm={4}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1.5,
                        p: 2,
                        background: "rgba(76, 175, 80, 0.04)",
                        borderRadius: "12px",
                        transition: "all 0.2s ease",
                        height: "100%",
                        "&:hover": {
                          background: "rgba(76, 175, 80, 0.08)",
                        },
                      }}
                    >
                      <BusinessIcon sx={{ color: "primary.main", mt: 0.5 }} />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          Empresa
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedPlant.company.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                      p: 2,
                      background: "rgba(76, 175, 80, 0.04)",
                      borderRadius: "12px",
                      transition: "all 0.2s ease",
                      height: "100%",
                      "&:hover": {
                        background: "rgba(76, 175, 80, 0.08)",
                      },
                    }}
                  >
                    <LocationOnIcon sx={{ color: "primary.main", mt: 0.5 }} />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        Localização
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {locationAddress ? (
                          <>
                            {locationAddress.address.city ||
                              locationAddress.address.town ||
                              locationAddress.address.village ||
                              ""}
                            {locationAddress.address.state
                              ? `, ${locationAddress.address.state}`
                              : ""}{" "}
                            - {locationAddress.address.country || ""}
                          </>
                        ) : (
                          "Carregando endereço..."
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {selectedPlant?.description && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    p: 2.5,
                    background: "rgba(76, 175, 80, 0.04)",
                    borderRadius: "12px",
                    transition: "all 0.2s ease",
                    mt: 3,
                    "&:hover": {
                      background: "rgba(76, 175, 80, 0.08)",
                    },
                  }}
                >
                  <DescriptionIcon sx={{ color: "primary.main", mt: 0.5 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      Descrição
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 500, whiteSpace: "pre-wrap" }}
                    >
                      {selectedPlant.description}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Growth Chart */}
            {selectedPlant?.updates && selectedPlant.updates.length > 1 && (
              <Box
                sx={{
                  background: "white",
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(76, 175, 80, 0.1)",
                  p: 3,
                  mt: 3,
                }}
              >
                <GrowthChart updates={selectedPlant.updates} />
              </Box>
            )}

            {/* Updates Timeline */}
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
              >
                Histórico de Atualizações
              </Typography>
              {selectedPlant?.updates && selectedPlant.updates.length > 0 ? (
                <Box sx={{ position: "relative" }}>
                  {/* Timeline line */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: "16px",
                      top: 0,
                      bottom: 0,
                      width: "2px",
                      background: "rgba(76, 175, 80, 0.2)",
                      zIndex: 0,
                    }}
                  />
                  {selectedPlant.updates.map((update, index) => (
                    <Box
                      key={update.id}
                      sx={{
                        position: "relative",
                        mb: index !== selectedPlant.updates.length - 1 ? 4 : 0,
                        ml: 5,
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: "-24px",
                          top: "24px",
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          backgroundColor:
                            update.healthStatus === "HEALTHY"
                              ? "#4caf50"
                              : update.healthStatus === "NEEDS_ATTENTION"
                              ? "#ff9800"
                              : "#f44336",
                          border: "3px solid white",
                          boxShadow: "0 0 0 2px rgba(76, 175, 80, 0.2)",
                          zIndex: 1,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          background: "white",
                          borderRadius: "16px",
                          overflow: "hidden",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                          border: "1px solid rgba(76, 175, 80, 0.1)",
                        }}
                      >
                        <Box sx={{ p: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 2,
                            }}
                          >
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 600,
                                  color: "primary.main",
                                  mb: 0.5,
                                }}
                              >
                                {update.healthStatus === "HEALTHY"
                                  ? "Saudável"
                                  : update.healthStatus === "NEEDS_ATTENTION"
                                  ? "Precisa de Atenção"
                                  : "Doente"}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {new Date(
                                  update.updateDate
                                ).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Measurements Section */}
                          <Box
                            sx={{
                              mb: 2,
                              display: "flex",
                              gap: 4,
                              backgroundColor: "rgba(76, 175, 80, 0.05)",
                              p: 2,
                              borderRadius: "12px",
                            }}
                          >
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Altura
                              </Typography>
                              <Typography variant="subtitle2" fontWeight="600">
                                {update.height}m
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Largura
                              </Typography>
                              <Typography variant="subtitle2" fontWeight="600">
                                {update.width}m
                              </Typography>
                            </Box>
                          </Box>

                          {update.notes && (
                            <Typography
                              sx={{
                                color: "text.secondary",
                                fontStyle: "italic",
                                mb: 2,
                              }}
                            >
                              "{update.notes}"
                            </Typography>
                          )}

                          {update.imageUrl && (
                            <Box
                              sx={{
                                borderRadius: "12px",
                                overflow: "hidden",
                                maxWidth: "600px",
                                margin: "0 auto",
                              }}
                            >
                              <Box
                                component="img"
                                src={update.imageUrl}
                                alt={`Update on ${new Date(
                                  update.updateDate
                                ).toLocaleDateString()}`}
                                sx={{
                                  width: "100%",
                                  height: "300px",
                                  objectFit: "cover",
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    py: 3,
                  }}
                >
                  Nenhuma atualização registrada
                </Typography>
              )}
            </Box>
          </Box>

          {/* General Information Card */}
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h6"
              sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
            >
              Informações Gerais
            </Typography>
            <Box
              sx={{
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(76, 175, 80, 0.1)",
                p: 3,
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Nome Popular
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {selectedPlant?.plant?.commonName}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Nome Científico
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="500"
                          sx={{ fontStyle: "italic" }}
                        >
                          {selectedPlant?.plant?.scientificName}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Origem
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {selectedPlant?.plant?.origin || "Não informado"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Altura Esperada
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {selectedPlant?.plant?.height || "Não informado"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Especificação
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {selectedPlant?.plant?.specification ||
                            "Não informado"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          {(user?.role === "ADMIN" ||
            (user?.role === "FARMER" &&
              selectedPlant?.addedBy?.id === user?.userId)) && (
            <>
              <Button
                onClick={() => handleDeletePlant(selectedPlant.id)}
                color="error"
                startIcon={<DeleteIcon />}
              >
                Excluir
              </Button>
              {user?.role === "FARMER" && (
                <Button
                  onClick={() => {
                    setUpdateDialogState({
                      open: true,
                      plantId: selectedPlant.id,
                      plantName: selectedPlant.plant?.commonName,
                    });
                    setIsDetailModalOpen(false);
                  }}
                  color="primary"
                  startIcon={<UpdateIcon />}
                >
                  Atualizar
                </Button>
              )}
            </>
          )}
          <Button onClick={() => setIsDetailModalOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {renderAddLocationDialog()}
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

export default LocationMap;
