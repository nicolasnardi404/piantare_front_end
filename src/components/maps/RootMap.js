import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  Polygon,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { plantLocations, projects, farmer } from "../../services/api";

// São Paulo coordinates as default center
const defaultPosition = [-23.5505, -46.6333];

// Red icon for user location
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

const RootMap = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [geoError, setGeoError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const mapRef = useRef(null);
  const { user } = useAuth();
  const [plants, setPlants] = useState([]);
  const [projectPolygons, setProjectPolygons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Callback ref to always have the latest map instance
  const setMapRef = useCallback((mapInstance) => {
    if (mapInstance) {
      mapRef.current = mapInstance;
    }
  }, []);

  // Move map when userLocation or mapRef changes
  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView(userLocation, 15);
    }
  }, [userLocation, mapRef.current]);

  // Move map when searchLocation changes
  useEffect(() => {
    if (searchLocation && mapRef.current) {
      mapRef.current.setView(searchLocation, 15);
    }
  }, [searchLocation, mapRef.current]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        if (!user) return;
        if (user.role === "ADMIN") {
          // Admin: all plants and all projects
          const [plantsRes, projectsRes] = await Promise.all([
            plantLocations.getMapMarkers(),
            projects.getList(),
          ]);
          setPlants(plantsRes.data);
          setProjectPolygons(
            (projectsRes.data || [])
              .filter((p) => p.areaCoordinates)
              .map((p) => ({
                ...p,
                areaCoordinates:
                  typeof p.areaCoordinates === "string"
                    ? JSON.parse(p.areaCoordinates)
                    : p.areaCoordinates,
              }))
          );
        } else if (user.role === "FARMER") {
          // Farmer: their plants and projects
          const [plantsRes, projectsRes] = await Promise.all([
            plantLocations.getFarmerPlants(),
            farmer.getProjects(),
          ]);
          setPlants(plantsRes.data);
          setProjectPolygons(
            (projectsRes.data || [])
              .filter((p) => p.areaCoordinates)
              .map((p) => ({
                ...p,
                areaCoordinates:
                  typeof p.areaCoordinates === "string"
                    ? JSON.parse(p.areaCoordinates)
                    : p.areaCoordinates,
              }))
          );
        } else if (user.role === "COMPANY") {
          // Company: only assigned plants and their projects
          const plantsRes = await plantLocations.getCompanyPlantsDetailed();
          setPlants(plantsRes.data);
          // Extract unique projects from plants
          const uniqueProjects = [];
          const seen = new Set();
          (plantsRes.data || []).forEach((plant) => {
            const proj = plant.project;
            if (proj && proj.areaCoordinates && !seen.has(proj.id)) {
              seen.add(proj.id);
              uniqueProjects.push({
                ...proj,
                areaCoordinates:
                  typeof proj.areaCoordinates === "string"
                    ? JSON.parse(proj.areaCoordinates)
                    : proj.areaCoordinates,
              });
            }
          });
          setProjectPolygons(uniqueProjects);
        }
      } catch (err) {
        setError("Erro ao carregar dados do mapa.");
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocalização não suportada pelo navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        console.log("User location set:", latitude, longitude);
      },
      (error) => {
        let message = "Erro ao obter localização.";
        if (error.code === error.PERMISSION_DENIED)
          message = "Permissão de localização negada.";
        if (error.code === error.POSITION_UNAVAILABLE)
          message = "Localização indisponível.";
        if (error.code === error.TIMEOUT)
          message = "Tempo esgotado ao obter localização.";
        setGeoError(message);
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`
      );
      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        setSearchLocation([parseFloat(location.lat), parseFloat(location.lon)]);
        setGeoError("");
      } else {
        setGeoError("Local não encontrado.");
      }
    } catch (error) {
      setGeoError("Erro ao buscar local.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCloseSnackbar = () => setGeoError("");

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      {/* Loading and error states */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 80,
            left: 0,
            right: 0,
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Box
          sx={{
            position: "absolute",
            top: 80,
            left: 0,
            right: 0,
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      {/* Search Bar - top right */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 5001,
          width: 320,
          maxWidth: "90vw",
        }}
      >
        <TextField
          size="small"
          fullWidth
          placeholder="Buscar cidade, endereço..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          InputProps={{
            sx: {
              background: "#fff",
              borderRadius: "8px",
              boxShadow: 1,
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch} disabled={searchLoading}>
                  {searchLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <SearchIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <MapContainer
        center={defaultPosition}
        zoom={13}
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        ref={setMapRef}
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
        {userLocation && <Marker position={userLocation} icon={redIcon} />}
        {searchLocation && <Marker position={searchLocation} icon={redIcon} />}
        {/* Project polygons */}
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
            >
              <Popup>
                <Box>
                  <strong>Projeto:</strong> {project.name}
                  <br />
                  <strong>Status:</strong> {project.status}
                  {project.description && (
                    <>
                      <br />
                      <strong>Descrição:</strong> {project.description}
                    </>
                  )}
                </Box>
              </Popup>
            </Polygon>
          ) : null
        )}
        {/* Plant markers */}
        {plants.map((plant) =>
          plant.latitude && plant.longitude ? (
            <Marker
              key={plant.id}
              position={[plant.latitude, plant.longitude]}
              icon={redIcon}
            >
              <Popup>
                <Box>
                  <strong>{plant.species?.commonName}</strong>
                  <br />
                  <em>{plant.species?.scientificName}</em>
                  <br />
                  {plant.description && (
                    <span>
                      {plant.description}
                      <br />
                    </span>
                  )}
                  {plant.project && (
                    <span>
                      Projeto: {plant.project.name}
                      <br />
                    </span>
                  )}
                  {plant.project?.status && (
                    <span>
                      Status: {plant.project.status}
                      <br />
                    </span>
                  )}
                  {plant.height && plant.width && (
                    <span>
                      Dimensões: {plant.height}m x {plant.width}m<br />
                    </span>
                  )}
                  {plant.plantedAt && (
                    <span>
                      Plantado em:{" "}
                      {new Date(plant.plantedAt).toLocaleDateString()}
                      <br />
                    </span>
                  )}
                </Box>
              </Popup>
            </Marker>
          ) : null
        )}
        {children}
      </MapContainer>
      {/* Current Location Button - bottom right above LayersControl */}
      <Box sx={{ position: "absolute", bottom: 96, right: 16, zIndex: 5000 }}>
        <Tooltip title="Minha Localização">
          <IconButton
            onClick={handleCurrentLocation}
            sx={{
              background: "#fff",
              border: "1px solid #bdbdbd",
              color: "#1976d2",
              boxShadow: 1,
              width: 40,
              height: 40,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
              "&:hover": { background: "#e3f2fd" },
            }}
            size="medium"
          >
            <MyLocationIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Snackbar
        open={!!geoError}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {geoError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RootMap;
