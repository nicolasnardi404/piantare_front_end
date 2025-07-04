import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
} from "@mui/material";
import {
  Search,
  MyLocation,
  Draw,
  Save,
  Clear,
  Close,
  Check,
  CameraAlt,
} from "@mui/icons-material";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polygon,
  useMap,
  Marker,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import html2canvas from "html2canvas";
import { uploads } from "../services/api";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom icons
const searchIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: #1976d2; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const currentLocationIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: #4caf50; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// São Paulo coordinates as default center
const defaultPosition = [-23.5505, -46.6333];

const MapController = ({
  initialArea,
  onMapInstance,
  searchLocation,
  currentLocation,
  onLocationFound,
}) => {
  const map = useMap();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    onMapInstance(map);

    // Force a map resize after mounting
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Set initial view
    if (initialArea && Array.isArray(initialArea) && initialArea.length > 0) {
      const bounds = L.latLngBounds(initialArea);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView(defaultPosition, 13);
    }
  }, [map, initialArea, onMapInstance]);

  useEffect(() => {
    if (searchLocation) {
      map.setView(searchLocation, 15);
      setMarkers((prev) => [
        ...prev.filter((m) => m.type !== "search"),
        {
          position: searchLocation,
          icon: searchIcon,
          type: "search",
        },
      ]);
    }
  }, [searchLocation, map]);

  useEffect(() => {
    if (currentLocation) {
      map.setView(currentLocation, 15);
      setMarkers((prev) => [
        ...prev.filter((m) => m.type !== "current"),
        {
          position: currentLocation,
          icon: currentLocationIcon,
          type: "current",
        },
      ]);
      onLocationFound && onLocationFound(currentLocation);
    }
  }, [currentLocation, map, onLocationFound]);

  return (
    <>
      {markers.map((marker, index) => (
        <Marker
          key={`${marker.type}-${index}`}
          position={marker.position}
          icon={marker.icon}
        />
      ))}
    </>
  );
};

const ProjectAreaSelector = ({
  initialArea = null,
  onAreaChange,
  onMapImageCapture,
  open,
  onClose,
}) => {
  const [mapInstance, setMapInstance] = useState(null);
  const [drawnItems, setDrawnItems] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [capturingImage, setCapturingImage] = useState(false);
  const mapRef = useRef(null);

  const handleCreated = (e) => {
    const { layer } = e;
    if (drawnItems) {
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);
    }
    const coordinates = layer
      .getLatLngs()[0]
      .map((latLng) => [latLng.lat, latLng.lng]);
    onAreaChange(coordinates);
  };

  const handleEdited = (e) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      const coordinates = layer
        .getLatLngs()[0]
        .map((latLng) => [latLng.lat, latLng.lng]);
      onAreaChange(coordinates);
    });
  };

  const handleDeleted = () => {
    onAreaChange(null);
  };

  const handleDrawStart = () => {
    if (drawnItems) {
      drawnItems.clearLayers();
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");

    try {
      // Use a geocoding service (you can replace this with your preferred service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const location = data[0];
        const coords = [parseFloat(location.lat), parseFloat(location.lon)];
        setSearchLocation(coords);
        setError("");
      } else {
        setError(
          "Localização não encontrada. Tente uma busca mais específica."
        );
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Erro ao buscar localização. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        setCurrentLocation(coords);
        setLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError("Erro ao obter localização atual. Verifique as permissões.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleCaptureImage = async () => {
    if (!mapInstance) return;

    setCapturingImage(true);
    try {
      // Wait for map to be fully rendered
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Capture the map container
      const mapElement = mapInstance.getContainer();
      const canvas = await html2canvas(mapElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2, // Higher quality
      });

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        try {
          // Create form data for upload
          const formData = new FormData();
          formData.append("file", blob, "project-map.png");

          // Upload to backend
          const response = await uploads.uploadFile(formData);
          console.log("Upload response:", response);

          // Call the callback with the image URL
          onMapImageCapture && onMapImageCapture(response.data.url);

          setError("");
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          setError("Erro ao salvar imagem do mapa.");
        } finally {
          setCapturingImage(false);
        }
      }, "image/png");
    } catch (error) {
      console.error("Image capture error:", error);
      setError("Erro ao capturar imagem do mapa.");
      setCapturingImage(false);
    }
  };

  const handleClearArea = () => {
    if (drawnItems) {
      drawnItems.clearLayers();
    }
    onAreaChange(null);
  };

  const handleLocationFound = (location) => {
    // Optional: You can add additional logic when current location is found
    console.log("Current location found:", location);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: "90vh" },
      }}
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Selecionar Área do Projeto</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>
        {/* Search and Controls */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Buscar localização..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              sx={{ flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <Search sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
            <Button
              variant="outlined"
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
              startIcon={loading ? <CircularProgress size={16} /> : <Search />}
            >
              Buscar
            </Button>
            <Button
              variant="outlined"
              onClick={handleCurrentLocation}
              disabled={loading}
              startIcon={<MyLocation />}
            >
              Minha Localização
            </Button>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Instructions */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              💡 Use a ferramenta de desenho no canto superior direito para
              desenhar a área do projeto
            </Typography>
          </Box>
        </Box>

        {/* Map Container */}
        <Box sx={{ flexGrow: 1, position: "relative" }}>
          <MapContainer
            ref={mapRef}
            center={defaultPosition}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              maxZoom={19}
              minZoom={0}
              tileSize={256}
            />

            <FeatureGroup ref={setDrawnItems}>
              <EditControl
                position="topright"
                onCreated={handleCreated}
                onEdited={handleEdited}
                onDeleted={handleDeleted}
                onDrawStart={handleDrawStart}
                draw={{
                  rectangle: false,
                  circle: false,
                  circlemarker: false,
                  marker: false,
                  polyline: false,
                  polygon: {
                    allowIntersection: false,
                    drawError: {
                      color: "#e1e100",
                      message: "Os limites do polígono não podem se cruzar!",
                    },
                    shapeOptions: {
                      color: "#4caf50",
                      fillColor: "#4caf50",
                      fillOpacity: 0.2,
                    },
                  },
                }}
                edit={{
                  featureGroup: drawnItems,
                  remove: true,
                  edit: true,
                }}
              />
            </FeatureGroup>

            {initialArea &&
              Array.isArray(initialArea) &&
              initialArea.length > 0 && (
                <Polygon
                  positions={initialArea}
                  pathOptions={{
                    color: "#4caf50",
                    fillColor: "#4caf50",
                    fillOpacity: 0.2,
                  }}
                />
              )}

            <MapController
              initialArea={initialArea}
              onMapInstance={setMapInstance}
              searchLocation={searchLocation}
              currentLocation={currentLocation}
              onLocationFound={handleLocationFound}
            />
          </MapContainer>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={handleClearArea}
                startIcon={<Clear />}
              >
                Limpar Área
              </Button>
              <Button
                variant="outlined"
                onClick={handleCaptureImage}
                disabled={capturingImage}
                startIcon={
                  capturingImage ? (
                    <CircularProgress size={16} />
                  ) : (
                    <CameraAlt />
                  )
                }
              >
                {capturingImage ? "Capturando..." : "Capturar Imagem"}
              </Button>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={onClose}
                startIcon={<Check />}
              >
                Confirmar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectAreaSelector;
