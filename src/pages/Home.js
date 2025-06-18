import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Fade,
  Grow,
  useScrollTrigger,
  Avatar,
  useTheme,
  Stack,
  AppBar,
  Toolbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "../services/api";

import YardIcon from "@mui/icons-material/Yard";
import BusinessIcon from "@mui/icons-material/Business";
import PublicIcon from "@mui/icons-material/Public";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MapIcon from "@mui/icons-material/Map";
import HandshakeIcon from "@mui/icons-material/Handshake";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import InfoIcon from "@mui/icons-material/Info";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: "80vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  position: "relative",
  color: "white",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url("/images/cerebro planta.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "brightness(0.6)",
    zIndex: -2,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(135deg, rgba(26,116,49,0.8) 0%, rgba(46,125,50,0.8) 100%)",
    zIndex: -1,
  },
}));

const ProcessCard = styled(Card)(({ theme }) => ({
  height: "100%",
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  position: "relative",
  overflow: "visible",
  background: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
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

const StepIcon = styled(Box)(({ theme }) => ({
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4caf50, #81c784)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  color: "white",
  boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "transform 0.3s ease-in-out",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  "&:hover": {
    transform: "translateY(-8px)",
  },
}));

const StyledIcon = styled(Box)(({ theme }) => ({
  fontSize: "3rem",
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  "& > svg": {
    fontSize: "3rem",
  },
}));

const CustomIcon = styled(Avatar)(({ theme }) => ({
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  marginBottom: theme.spacing(2),
}));

const ProcessSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
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

const StatsCard = styled(Card)(({ theme }) => ({
  height: "100%",
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  borderRadius: theme.spacing(2),
  position: "relative",
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

const MapWrapper = styled(Box)(({ theme }) => ({
  height: "70vh",
  width: "100%",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  "& .leaflet-container": {
    height: "100%",
    width: "100%",
  },
}));

const TopBar = styled(AppBar)(({ theme }) => ({
  background: "transparent",
  boxShadow: "none",
  position: "absolute",
  top: 0,
  zIndex: 1,
}));

const LoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  color: "white",
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1, 3),
  textTransform: "none",
  fontSize: "0.9rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: "translateY(-2px)",
  },
  "& .MuiButton-startIcon": {
    marginRight: theme.spacing(1),
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  color: "white",
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  textTransform: "none",
  fontSize: "1rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: "translateY(-2px)",
  },
  "& .MuiButton-startIcon": {
    marginRight: theme.spacing(1),
  },
}));

function ScrollTriggeredSection({ children, threshold = 0.3 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [element, threshold]);

  return (
    <div ref={setElement}>
      <Fade in={isVisible} timeout={1000}>
        <div>{children}</div>
      </Fade>
    </div>
  );
}

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Add these styles before the component
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

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await api.get("/plant-locations/map");
      setPlants(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching plants:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  const center =
    plants.length > 0
      ? [plants[0].latitude, plants[0].longitude]
      : [-14.235004, -51.92528]; // Brazil center

  return (
    <Box>
      <Fade in={true} timeout={1000}>
        <HeroSection>
          <TopBar>
            <Toolbar sx={{ justifyContent: "flex-end" }}>
              <LoginButton
                component={Link}
                to="/login"
                startIcon={<LoginIcon />}
              >
                Entrar
              </LoginButton>
            </Toolbar>
          </TopBar>
          <Container>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "4rem" },
                fontWeight: "bold",
                mb: 3,
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Piantare
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.5rem", md: "2rem" },
                mb: 4,
                maxWidth: "800px",
                mx: "auto",
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              Conectando Agricultores e Empresas para Cultivar a Biodiversidade
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <NavButton component={Link} to="/about" startIcon={<InfoIcon />}>
                Sobre
              </NavButton>
              <NavButton
                component={Link}
                to="/support"
                startIcon={<VolunteerActivismIcon />}
              >
                Apoie
              </NavButton>
            </Stack>
          </Container>
        </HeroSection>
      </Fade>

      <Container sx={{ py: 8 }}>
        <ScrollTriggeredSection>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <StatsCard>
                <Typography variant="h4" color="primary" gutterBottom>
                  {plants.length}
                </Typography>
                <Typography variant="subtitle1">
                  Plantas Plantadas no Total
                </Typography>
              </StatsCard>
            </Grid>
          </Grid>

          <MapWrapper>
            <MapContainer center={center} zoom={4}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
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
                {plants.map((plant) => (
                  <Marker
                    key={plant.id}
                    position={[plant.latitude, plant.longitude]}
                  >
                    <Popup>
                      <Box sx={{ p: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {plant.species}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Plantada por: {plant.addedBy.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Data:{" "}
                          {format(new Date(plant.createdAt), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </Typography>
                      </Box>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          </MapWrapper>
        </ScrollTriggeredSection>
      </Container>

      <Container sx={{ py: 8 }}>
        <ScrollTriggeredSection>
          <Grid
            container
            spacing={4}
            sx={{
              justifyContent: "center",
              alignItems: "stretch",
            }}
          >
            {[
              {
                icon: <YardIcon fontSize="inherit" />,
                title: "Para Agricultores",
                description:
                  "Compartilhe suas iniciativas de biodiversidade e conecte-se com empresas interessadas em apoiar a agricultura sustentável.",
              },
              {
                icon: <BusinessIcon fontSize="inherit" />,
                title: "Para Empresas",
                description:
                  "Encontre e apoie agricultores locais que estão contribuindo ativamente para a restauração de ecossistemas e biodiversidade.",
              },
              {
                icon: <PublicIcon fontSize="inherit" />,
                title: "Para o Planeta",
                description:
                  "Juntos estamos criando um futuro mais sustentável, promovendo a biodiversidade e a restauração dos ecossistemas brasileiros.",
              },
            ].map((feature, index) => (
              <Grid
                item
                xs={12}
                md={4}
                key={index}
                sx={{
                  display: "flex",
                }}
              >
                <Grow
                  in={true}
                  timeout={1000 + index * 200}
                  style={{ transformOrigin: "center center", width: "100%" }}
                >
                  <FeatureCard>
                    <CardContent
                      sx={{
                        textAlign: "center",
                        py: 4,
                        px: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <StyledIcon>{feature.icon}</StyledIcon>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{
                          maxWidth: "90%",
                          mx: "auto",
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </ScrollTriggeredSection>
      </Container>

      <Box
        sx={{
          bgcolor: "background.default",
          py: 12,
          background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            background: 'url("/images/cerebro planta.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.05,
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              mb: 8,
              fontSize: { xs: "2rem", md: "2.5rem" },
              position: "relative",
              zIndex: 1,
              "&::after": {
                content: '""',
                display: "block",
                width: "60px",
                height: "4px",
                background: "linear-gradient(90deg, #4caf50, #81c784)",
                margin: "20px auto 0",
                borderRadius: "2px",
              },
            }}
          >
            Como Funciona
          </Typography>

          <ScrollTriggeredSection>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 4,
                width: "100%",
              }}
            >
              <ProcessSection>
                <Typography
                  variant="h4"
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    mb: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <YardIcon sx={{ fontSize: 32 }} /> Para Agricultores
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {[
                    {
                      icon: <MapIcon />,
                      title: "Mapeie Suas Áreas",
                      description:
                        "Cadastre e gerencie seus locais de plantio de forma simples e intuitiva em nosso mapa interativo.",
                    },
                    {
                      icon: <DescriptionIcon />,
                      title: "Documente Sua Biodiversidade",
                      description:
                        "Registre as espécies plantadas, técnicas utilizadas e o impacto positivo no ecossistema local.",
                    },
                    {
                      icon: <HandshakeIcon />,
                      title: "Conecte-se",
                      description:
                        "Receba propostas de empresas interessadas em apoiar seus projetos de biodiversidade.",
                    },
                  ].map((step, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "flex-start",
                      }}
                    >
                      <StepIcon>{step.icon}</StepIcon>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {step.title}
                        </Typography>
                        <Typography color="text.secondary">
                          {step.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </ProcessSection>

              <ProcessSection>
                <Typography
                  variant="h4"
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    mb: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 32 }} /> Para Empresas
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {[
                    {
                      icon: <SearchIcon />,
                      title: "Encontre Parceiros",
                      description:
                        "Descubra agricultores próximos à sua região que compartilham dos mesmos valores de sustentabilidade.",
                    },
                    {
                      icon: <AssessmentIcon />,
                      title: "Avalie Projetos",
                      description:
                        "Analise detalhadamente os projetos de biodiversidade e seu potencial impacto ambiental.",
                    },
                    {
                      icon: <CheckCircleOutlineIcon />,
                      title: "Faça a Diferença",
                      description:
                        "Estabeleça parcerias duradouras e contribua diretamente para a restauração dos ecossistemas.",
                    },
                  ].map((step, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "flex-start",
                      }}
                    >
                      <StepIcon>{step.icon}</StepIcon>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {step.title}
                        </Typography>
                        <Typography color="text.secondary">
                          {step.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </ProcessSection>
            </Box>
          </ScrollTriggeredSection>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
