import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "../services/api";
import MapIcon from "@mui/icons-material/Map";
import InfoIcon from "@mui/icons-material/Info";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import LoginIcon from "@mui/icons-material/Login";
import YardIcon from "@mui/icons-material/Yard";
import AppBarMenu from "../components/AppBarMenu";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import CountUp from "../components/CountUp";

const treeIconUrl = process.env.PUBLIC_URL + "/images/color-tree-icon.svg";

const Logo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  fontWeight: 800,
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "1.7rem",
  letterSpacing: "0.04em",
  color: "#fff",
  textShadow: "1px 1px 4px rgba(0,0,0,0.2)",
  "& img": {
    height: 36,
    marginRight: theme.spacing(1),
  },
}));

const NavLink = styled(Link)(({ theme }) => ({
  color: "#fff",
  fontWeight: 700,
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "1.1rem",
  textTransform: "none",
  letterSpacing: "0.03em",
  marginRight: "20px",
  mx: 1.5,
  background: "transparent",
  "&:hover": {
    background: "rgba(255,255,255,0.08)",
  },
}));

const CTAButton = styled(Link)(({ theme }) => ({
  background: "#4caf50",
  color: "#fff",
  fontWeight: 700,
  fontFamily: "'Montserrat', sans-serif",
  borderRadius: 24,
  px: 3,
  py: 1,
  boxShadow: "0 2px 8px rgba(76,175,80,0.15)",
  textTransform: "none",
  fontSize: "1rem",
  ml: 2,
  "&:hover": {
    background: "#388e3c",
  },
}));

const MapWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: 0,
  "& .leaflet-container": {
    height: "100%",
    width: "100%",
    background: "#f8f9fa",
    zIndex: 1,
  },
}));

const FloatingBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 40,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2.2, 4),
  borderRadius: 28,
  background: "rgba(255,255,255,0.92)",
  boxShadow: "0 4px 24px rgba(76,175,80,0.18)",
  backdropFilter: "blur(8px)",
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 700,
  fontSize: "1.35rem",
  color: theme.palette.primary.main,
  border: "2px solid #4caf50",
}));

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const treeIcon = new L.Icon({
  iconUrl: treeIconUrl,
  iconSize: [40, 40], // Adjust size as needed
  iconAnchor: [20, 40], // Center bottom
  popupAnchor: [0, -40],
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

const MapPage = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await api.get("/planted-plants/map-markers");
      setPlants(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching plants:", error);
      setLoading(false);
    }
  };

  const center =
    plants.length > 0
      ? [plants[0].latitude, plants[0].longitude]
      : [-14.235004, -51.92528]; // Brazil center

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AppBarMenu />
      <MapWrapper>
        <MapContainer
          center={center}
          zoom={4}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup
            iconCreateFunction={(cluster) =>
              L.divIcon({
                html: `<div style="
                  background: #388e3c;
                  color: #fff;
                  border-radius: 50%;
                  width: 40px;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 1.2rem;
                  font-weight: bold;
                  border: 3px solid #fff;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                ">${cluster.getChildCount()}</div>`,
                className: "custom-cluster-icon",
                iconSize: [40, 40],
              })
            }
          >
            {plants.map((plant) => (
              <Marker
                key={plant.id}
                position={[plant.latitude, plant.longitude]}
                icon={treeIcon}
              >
                <Popup>
                  <Box sx={{ p: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {plant.plantGroup?.species?.commonName ||
                        "Espécie não especificada"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {plant.plantGroup?.species?.scientificName &&
                        `(${plant.plantGroup.species.scientificName})`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Projeto:{" "}
                      {plant.plantGroup?.project?.name || "Não especificado"}
                    </Typography>
                  </Box>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
        <FloatingBadge>
          <YardIcon sx={{ fontSize: 32, color: "#388e3c" }} />
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#388e3c",
                lineHeight: 1,
              }}
            >
              Plantas Plantadas
            </Typography>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: "2rem",
                color: "#222",
                lineHeight: 1,
              }}
            >
              <CountUp
                from={0}
                to={plants.length}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
              />
            </Typography>
          </Box>
        </FloatingBadge>
      </MapWrapper>
    </Box>
  );
};

export default MapPage;
