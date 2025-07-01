import React, { useRef, useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, LayersControl, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Box, IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";

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
  const [geoError, setGeoError] = useState("");
  const mapRef = useRef(null);

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
