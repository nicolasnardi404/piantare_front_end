import React, { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  LayersControl,
  Polygon,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { useAuth } from "../context/AuthContext";
import {
  plantLocations,
  plants,
  plantUpdates,
  geoGpt,
  api,
  farmer,
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
  Fade,
  Autocomplete,
} from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  Line,
} from "recharts";
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
import LegendToggleIcon from "@mui/icons-material/LegendToggle";
import PlantDetailsModal from "./maps/PlantDetailsModal";

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

const LocationMap = () => {
  const { user, token } = useAuth();
  const [locations, setLocations] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [companyStats, setCompanyStats] = useState({
    totalPlants: 0,
    plantsByCategory: {},
    recentPlants: [],
  });
  const [geoAnalysis, setGeoAnalysis] = useState({
    loading: false,
    data: null,
    error: null,
  });
  const [newLocation, setNewLocation] = useState({
    latitude: null,
    longitude: null,
    plantId: null,
    projectId: null,
    description: "",
    height: "",
    width: "",
    notes: "",
  });
  const [availablePlants, setAvailablePlants] = useState([]);
  const [error, setError] = useState("");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [imageUpload, setImageUpload] = useState({
    file: null,
    preview: null,
    uploading: false,
    error: null,
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
  const [locationDetails, setLocationDetails] = useState({});
  const [locationAddress, setLocationAddress] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectPolygons, setProjectPolygons] = useState([]);
  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    loadLocations();
    loadAvailablePlants();
  }, [user]);

  useEffect(() => {
    const loadProjects = async () => {
      if (user?.role === "FARMER" && isAddingLocation) {
        try {
          const response = await farmer.getProjects();
          setProjects(response.data);
        } catch (error) {
          console.error("Error loading projects:", error);
          setError("Failed to load projects");
        }
      }
    };
    loadProjects();
  }, [user, isAddingLocation]);

  useEffect(() => {
    const loadProjectPolygons = async () => {
      if (user?.role === "FARMER") {
        try {
          const response = await farmer.getProjects();
          const projectsWithArea = response.data
            .filter((project) => project.areaCoordinates)
            .map((project) => ({
              ...project,
              // Ensure coordinates are in the correct format: [[lat, lng], [lat, lng], ...]
              areaCoordinates: Array.isArray(project.areaCoordinates)
                ? project.areaCoordinates.map((coord) =>
                    Array.isArray(coord) ? [coord[0], coord[1]] : coord
                  )
                : JSON.parse(project.areaCoordinates).map((coord) =>
                    Array.isArray(coord) ? [coord[0], coord[1]] : coord
                  ),
            }));
          setProjectPolygons(projectsWithArea);
        } catch (error) {
          console.error("Error loading project areas:", error);
        }
      }
    };
    loadProjectPolygons();
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
        const category = location.species?.category || "OUTROS";
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
      console.log("Current user:", user);
      console.log("All locations:", locations);

      // Filter plants added by this farmer
      const farmerPlants = locations.filter((loc) => {
        console.log("Checking location:", loc);
        console.log("Project farmer user:", loc.project?.farmer?.user);
        console.log("User ID comparison:", {
          locationUserId: loc.project?.farmer?.user?.id,
          currentUserId: user?.userId,
          matches: loc.project?.farmer?.user?.id === parseInt(user?.userId),
        });
        return loc.project?.farmer?.user?.id === parseInt(user?.userId);
      });

      console.log("Filtered farmer plants:", farmerPlants);

      // Calculate species count
      const speciesCount = farmerPlants.reduce((acc, plant) => {
        const commonName = plant.species?.commonName || "Unknown";
        acc[commonName] = (acc[commonName] || 0) + 1;
        return acc;
      }, {});

      console.log("Species count:", speciesCount);

      // Sort plants by most recent first
      const sortedPlants = [...farmerPlants].sort((a, b) => {
        return (
          new Date(b.createdAt || b.plantedAt || 0) -
          new Date(a.createdAt || a.plantedAt || 0)
        );
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
      if (user?.role === "FARMER") {
        console.log("Loading farmer plants...");
        response = await plantLocations.getFarmerPlants();
        console.log("Farmer plants API response:", response);
      } else {
        response = await plantLocations.getMapMarkers();
      }

      console.log("Loaded locations:", response.data);
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
      console.log("Clicked location:", location);
      // Get detailed plant information
      const detailedResponse = await plantLocations.getPlantDetails(
        location.id
      );
      const detailedLocation = detailedResponse.data;
      console.log("Detailed plant data received:", detailedLocation);

      // Get location address
      const addressData = await getAddressFromCoordinates(
        location.latitude,
        location.longitude
      );
      setLocationAddress(addressData);

      // Set the selected plant and open the modal
      setSelectedPlant({
        ...detailedLocation,
        project: {
          ...detailedLocation.project,
          farmer: detailedLocation.project?.farmer || null,
        },
      });
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
        !newLocation.plantId ||
        !newLocation.projectId ||
        !newLocation.height ||
        !newLocation.width
      ) {
        setError(
          "Por favor, preencha todos os campos obrigatórios (localização, planta, projeto, altura e diâmetro)"
        );
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
        projectId: newLocation.projectId,
        description: newLocation.description,
        imageUrl,
        height: parseFloat(newLocation.height),
        width: parseFloat(newLocation.width),
      };

      await plantLocations.create(locationData);
      await loadLocations();

      setIsAddingLocation(false);
      setNewLocation({
        latitude: null,
        longitude: null,
        plantId: null,
        projectId: null,
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
      setError("");
    } catch (error) {
      console.error("Error adding location:", error);
      setError(error.response?.data?.error || "Failed to add plant location");
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
    diameter
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

      const updateResponse = await plantUpdates.create({
        plantedPlantId: plantId,
        healthStatus,
        notes: observations,
        imageUrl,
        height: parseFloat(height),
        diameter: parseFloat(diameter),
      });

      console.log("Update created:", updateResponse);

      await loadLocations();
      setUpdateDialogState({ open: false, plantId: null, plantName: "" });
    } catch (error) {
      console.error("Error adding update:", error);
      setError("Failed to add plant update");
    }
  };

  const renderFarmerReport = () => {
    if (user?.role !== "FARMER") return null;

    // Group plants by category
    const plantsByCategory = farmerStats.recentPlants.reduce((acc, plant) => {
      const category = plant.species?.category || "OUTROS";
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
                              {plant.species?.commonName}
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
                            {plant.species?.scientificName}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            Projeto: {plant.project?.name}
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
      </Box>
    );
  };

  const PlantUpdateDialog = () => {
    const [healthStatus, setHealthStatus] = useState("HEALTHY");
    const [observations, setObservations] = useState("");
    const [height, setHeight] = useState("");
    const [diameter, setDiameter] = useState("");
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
      if (!height || !diameter) {
        setError("Por favor, preencha a altura e diâmetro da planta");
        return;
      }

      try {
        await handleAddUpdate(
          updateDialogState.plantId,
          healthStatus,
          observations,
          imageUpload.file,
          height,
          diameter
        );
        // Reset form
        setHealthStatus("HEALTHY");
        setObservations("");
        setHeight("");
        setDiameter("");
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
                  label="Diâmetro (metros)"
                  type="number"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
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
      onClose={() => {
        setIsAddingLocation(false);
        setNewLocation({
          latitude: null,
          longitude: null,
          plantId: null,
          projectId: null,
          description: "",
          height: "",
          diameter: "",
          notes: "",
        });
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Adicionar Nova Planta</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            {/* Project and Plant Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, color: "primary.main", fontWeight: 500 }}
              >
                Informações da Planta
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Projeto</InputLabel>
                <Select
                  value={newLocation.projectId || ""}
                  onChange={(e) =>
                    setNewLocation((prev) => ({
                      ...prev,
                      projectId: e.target.value,
                    }))
                  }
                  label="Projeto"
                  required
                >
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                    required
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
          onClick={() => {
            setIsAddingLocation(false);
            setNewLocation({
              latitude: null,
              longitude: null,
              plantId: null,
              projectId: null,
              description: "",
              height: "",
              width: "",
              notes: "",
            });
          }}
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
        date: new Date(
          update.updateDate || update.createdAt
        ).toLocaleDateString(),
        height: parseFloat(update.height),
        diameter: parseFloat(update.diameter),
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
              dataKey="diameter"
              name="Diâmetro (m)"
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
          width: "100%",
          "& .leaflet-container": {
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
                          projectId: null,
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
          >
            {locations.map((location) => (
              <Marker
                key={location.id}
                position={[location.latitude, location.longitude]}
                eventHandlers={{
                  click: () => handleMarkerClick(location),
                }}
              >
                <Popup>
                  <Box sx={{ minWidth: 200 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {location.species?.commonName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", color: "text.secondary" }}
                    >
                      {location.species?.scientificName}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {location.description}
                    </Typography>
                    {location.project && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          color: "text.secondary",
                          mt: 1,
                        }}
                      >
                        Projeto: {location.project.name}
                      </Typography>
                    )}
                  </Box>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>

          {/* Project Polygons */}
          {projectPolygons.map((project) =>
            project.areaCoordinates && project.areaCoordinates.length > 0 ? (
              <Polygon
                key={project.id}
                positions={[project.areaCoordinates]}
                pathOptions={{
                  color:
                    project.status === "IN_PROGRESS"
                      ? "#4caf50"
                      : project.status === "COMPLETED"
                      ? "#2196f3"
                      : project.status === "PLANNING"
                      ? "#ff9800"
                      : project.status === "ON_HOLD"
                      ? "#fdd835"
                      : "#f44336",
                  fillColor:
                    project.status === "IN_PROGRESS"
                      ? "#4caf5033"
                      : project.status === "COMPLETED"
                      ? "#2196f333"
                      : project.status === "PLANNING"
                      ? "#ff980033"
                      : project.status === "ON_HOLD"
                      ? "#fdd83533"
                      : "#f4433633",
                  fillOpacity: 0.3,
                  weight: 2,
                }}
                eventHandlers={{
                  mouseover: (e) => {
                    const statusText =
                      project.status === "IN_PROGRESS"
                        ? "Em Andamento"
                        : project.status === "COMPLETED"
                        ? "Concluído"
                        : project.status === "PLANNING"
                        ? "Em Planejamento"
                        : project.status === "ON_HOLD"
                        ? "Em Espera"
                        : "Cancelado";

                    const popup = L.popup()
                      .setLatLng(e.latlng)
                      .setContent(
                        `<div style="min-width: 200px;">
                          <h4 style="margin: 0 0 8px 0;">${project.name}</h4>
                          <p style="margin: 0;">Status: ${statusText}</p>
                        </div>`
                      )
                      .openOn(e.target._map);

                    e.target.on("mouseout", () => {
                      e.target._map.closePopup(popup);
                    });
                  },
                }}
              />
            ) : null
          )}
        </MapContainer>
      </Box>

      {renderFarmerReport()}

      {/* Plant Details Modal */}
      <PlantDetailsModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        selectedPlant={selectedPlant}
        user={user}
        onDelete={handleDeletePlant}
        onUpdate={(plant) =>
          setUpdateDialogState({
            open: true,
            plantId: plant.id,
            plantName: plant.species?.commonName,
          })
        }
      />

      {renderAddLocationDialog()}
      {PlantUpdateDialog()}

      {/* Legend Toggle Button */}
      {user?.role === "FARMER" && projectPolygons.length > 0 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 200,
            right: 30,
            zIndex: 1000,
          }}
        >
          <Tooltip
            title={showLegend ? "Ocultar Legenda" : "Mostrar Legenda"}
            placement="left"
          >
            <IconButton
              onClick={() => setShowLegend(!showLegend)}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                },
              }}
            >
              <LegendToggleIcon color={showLegend ? "primary" : "inherit"} />
            </IconButton>
          </Tooltip>

          <Fade in={showLegend}>
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                right: 0,
                mt: 1,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: 1,
                p: 1,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                minWidth: "180px",
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Áreas dos Projetos
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{ width: 16, height: 16, backgroundColor: "#4caf50" }}
                  />
                  <Typography variant="caption">Em Andamento</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{ width: 16, height: 16, backgroundColor: "#2196f3" }}
                  />
                  <Typography variant="caption">Concluído</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{ width: 16, height: 16, backgroundColor: "#ff9800" }}
                  />
                  <Typography variant="caption">Em Planejamento</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{ width: 16, height: 16, backgroundColor: "#fdd835" }}
                  />
                  <Typography variant="caption">Em Espera</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{ width: 16, height: 16, backgroundColor: "#f44336" }}
                  />
                  <Typography variant="caption">Cancelado</Typography>
                </Box>
              </Box>
            </Box>
          </Fade>
        </Box>
      )}
    </Box>
  );
};

export default LocationMap;
