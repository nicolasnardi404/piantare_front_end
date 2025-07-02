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
  CardMedia,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "../services/api";
import Particles from "../components/Particles";

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
      "linear-gradient(135deg, rgba(26,116,49,0.5) 0%, rgba(46,125,50,0.5) 100%)",
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
  width: { xs: "40px", md: "48px" },
  height: { xs: "40px", md: "48px" },
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4caf50, #81c784)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  color: "white",
  boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
  "& svg": {
    fontSize: { xs: "1.5rem", md: "1.75rem" },
  },
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
  fontSize: { xs: "2.5rem", md: "3rem" },
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  "& > svg": {
    fontSize: { xs: "2.5rem", md: "3rem" },
  },
}));

const CustomIcon = styled(Avatar)(({ theme }) => ({
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  marginBottom: theme.spacing(2),
}));

const ProcessSection = styled(Box)(({ theme }) => ({
  padding: "30px 20px",
  borderRadius: "50px",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  "& h4": {
    fontSize: { xs: "1.5rem", md: "2rem" },
    wordBreak: "break-word",
    marginBottom: theme.spacing(4),
  },
  "& h6": {
    fontSize: { xs: "1.1rem", md: "1.25rem" },
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
  [theme.breakpoints.down("md")]: {
    height: "50vh",
  },
  [theme.breakpoints.up("md")]: {
    height: "70vh",
  },
  width: "100%",
  borderRadius: { xs: theme.spacing(1), md: theme.spacing(2) },
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#f8f9fa",
  "& .leaflet-container": {
    height: "100%",
    width: "100%",
    background: "#f8f9fa",
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

const HoverCard = styled(Card)(({ theme }) => ({
  position: "relative",
  overflow: "visible",
  transition: "transform 0.3s, box-shadow 0.3s",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.04)",
    boxShadow: "0 8px 32px rgba(76, 175, 80, 0.2)",
    zIndex: 2,
  },
}));

const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(34, 49, 63, 0.85)",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  opacity: 0,
  transition: "opacity 0.3s",
  pointerEvents: "none",
  zIndex: 3,
  padding: theme.spacing(3),
  textAlign: "center",
  "&.open": {
    opacity: 1,
    pointerEvents: "auto",
  },
}));

const cardData = [
  {
    image: "/images/solodebananeira.jpg",
    bgPos: "left",
    title: "Cuidado do Solo",
    short: "Uso de recursos naturais para regenerar e alimentar o solo.",
    long: "O solo de bananeira é rico em matéria orgânica e nutrientes. Ao devolver restos vegetais ao solo, promovemos a vida microbiana, aumentamos a fertilidade e reduzimos a dependência de insumos químicos. Cuidar do solo é garantir a saúde das plantas e a sustentabilidade do sistema.",
  },
  {
    image: "/images/piantare1.jpg",
    bgPos: "center",
    title: "Biodiversidade e Polinizadores",
    short: "Flores e abelhas: a base da biodiversidade.",
    long: "A presença de flores atrai abelhas e outros polinizadores, essenciais para a reprodução das plantas e o equilíbrio do ecossistema. Promover a biodiversidade é fortalecer a resiliência do ambiente e garantir colheitas mais saudáveis.",
  },
  {
    image: "/images/mudadetomate.jpg",
    bgPos: "right",
    title: "Produção Coletiva de Mudas",
    short: "Apoio a coletivos para produção de mudas.",
    long: "Incentivar a produção coletiva de mudas fortalece comunidades, promove a troca de saberes e amplia o acesso a alimentos saudáveis. Juntos, podemos cultivar um futuro mais justo e sustentável.",
  },
];

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

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);
  const theme = useTheme();
  const [activeIdx, setActiveIdx] = useState(null);

  useEffect(() => {
    fetchPlants();
  }, []);

  useEffect(() => {
    // Force a resize event after the map is mounted
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);

    return () => clearTimeout(timer);
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
          <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <Particles
              particleColors={["#ffffff", "#4caf50"]}
              particleCount={200}
              particleSpread={10}
              speed={0.1}
              particleBaseSize={100}
              moveParticlesOnHover={true}
              alphaParticles={false}
              disableRotation={false}
            />
          </Box>
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
          <Container sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h1"
              sx={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: { xs: "2.5rem", md: "4rem" },
                mb: 3,
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                letterSpacing: "0.04em",
              }}
            >
              ApeForest
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: { xs: "1.5rem", md: "2rem" },
                mb: 4,
                maxWidth: "800px",
                mx: "auto",
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                letterSpacing: "0.01em",
              }}
            >
              Plant Today, Forest Tomorrow
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

      <Container sx={{ py: { xs: 4, md: 8 } }}>
        <ScrollTriggeredSection>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            justifyContent="center"
            sx={{ mb: { xs: 2, md: 4 } }}
          >
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
            <MapContainer
              center={center}
              zoom={4}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {plants.map((plant) => (
                <Marker
                  key={plant.id}
                  position={[plant.latitude, plant.longitude]}
                >
                  <Popup>
                    <Box sx={{ p: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {plant.species?.commonName ||
                          "Espécie não especificada"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {plant.species?.scientificName &&
                          `(${plant.species.scientificName})`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Projeto: {plant.project?.name || "Não especificado"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Agricultor:{" "}
                        {plant.project?.farmer?.user?.name ||
                          "Não especificado"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Data:{" "}
                        {format(
                          new Date(plant.createdAt || new Date()),
                          "dd/MM/yyyy",
                          {
                            locale: ptBR,
                          }
                        )}
                      </Typography>
                    </Box>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </MapWrapper>
        </ScrollTriggeredSection>
      </Container>

      <Container sx={{ py: { xs: 4, md: 8 } }}>
        <ScrollTriggeredSection>
          <Grid
            container
            spacing={{ xs: 2, md: 4 }}
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
                        py: { xs: 3, md: 4 },
                        px: { xs: 2, md: 3 },
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
                          fontSize: { xs: "1.25rem", md: "1.5rem" },
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{
                          maxWidth: "90%",
                          mx: "auto",
                          fontSize: { xs: "0.875rem", md: "1rem" },
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
          py: { xs: 8, md: 12 },
          px: { xs: 2, md: 0 },
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
              mb: { xs: 6, md: 8 },
              fontSize: { xs: "2rem", md: "2.5rem" },
              position: "relative",
              zIndex: 1,
              "&::after": {
                content: '""',
                display: "block",
                width: { xs: "250px", md: "400px" },
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
                gap: { xs: 4, md: 6 },
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

      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 8,
            fontWeight: 700,
            fontSize: { xs: "2rem", md: "2.8rem" },
          }}
        >
          Práticas Sustentáveis em Destaque
        </Typography>
        <Box
          sx={{
            position: "relative",
            borderRadius: 6,
            overflow: "hidden",
            boxShadow: 6,
            minHeight: { xs: 320, md: 520 },
            background: "#f5f7fa",
            width: "100%",
            maxWidth: 1400,
            mx: "auto",
          }}
        >
          {/* Multi-image state (no hover) */}
          <Fade in={activeIdx === null} timeout={500} unmountOnExit>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                height: { xs: 320, md: 520 },
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            >
              {cardData.map((card, idx) => (
                <Box
                  key={idx}
                  sx={{
                    flex: 1,
                    position: "relative",
                    backgroundImage: `url(${card.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: card.bgPos,
                    height: "100%",
                    transition:
                      "background-image 0.4s, background-position 0.4s",
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      bgcolor: "rgba(34,49,63,0.3)",
                      color: "#fff",
                      p: 3,
                      zIndex: 3,
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {card.title}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Fade>
          {/* Single-image state (hovered) */}
          <Fade in={activeIdx !== null} timeout={500} unmountOnExit>
            <Box
              sx={{
                width: "100%",
                height: { xs: 320, md: 520 },
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 2,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${cardData[activeIdx ?? 0].image})`,
                  backgroundSize: "cover",
                  backgroundPosition: cardData[activeIdx ?? 0].bgPos,
                  transition: "background-image 0.4s, background-position 0.4s",
                }}
              />
              {/* Floating text panel */}
              <Box
                sx={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  height: "100%",
                  width: { xs: "100%", md: "38%" },
                  bgcolor: "rgba(34,49,63,0.92)",
                  color: "#fff",
                  p: { xs: 3, md: 6 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  zIndex: 10,
                  transition: "all 0.3s",
                  borderTopRightRadius: 48,
                  borderBottomRightRadius: 48,
                  boxShadow: 8,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 60,
                    bgcolor: "#4caf50",
                    borderRadius: 3,
                    mb: 3,
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: "1.5rem", md: "2.2rem" },
                  }}
                >
                  {cardData[activeIdx ?? 0].title}
                </Typography>
                <Typography
                  color="inherit"
                  sx={{
                    mt: 1,
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    lineHeight: 1.6,
                  }}
                >
                  {cardData[activeIdx ?? 0].long}
                </Typography>
              </Box>
            </Box>
          </Fade>
          {/* Hover zones */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "33.33%",
              height: "100%",
              zIndex: 20,
            }}
            onMouseEnter={() => setActiveIdx(0)}
            onMouseLeave={() => setActiveIdx(null)}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "33.33%",
              width: "33.34%",
              height: "100%",
              zIndex: 20,
            }}
            onMouseEnter={() => setActiveIdx(1)}
            onMouseLeave={() => setActiveIdx(null)}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "66.67%",
              width: "33.33%",
              height: "100%",
              zIndex: 20,
            }}
            onMouseEnter={() => setActiveIdx(2)}
            onMouseLeave={() => setActiveIdx(null)}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
