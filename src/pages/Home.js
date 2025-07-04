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
import FuzzyText from "../components/FuzzyText";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "../services/api";
import Particles from "../components/Particles";
import AppBarMenu from "../components/AppBarMenu";

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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  position: "relative",
  color: "white",
  overflow: "hidden",
  padding: 0,
  margin: 0,
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

const NavLink = styled(Button)(({ theme }) => ({
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

const CTAButton = styled(Button)(({ theme }) => ({
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

  // if (loading) {
  //   return <Typography>Carregando...</Typography>;
  // }

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
          <AppBarMenu />
          <Container sx={{ position: "relative", zIndex: 1 }}>
            <FuzzyText
              baseIntensity={0.05}
              hoverIntensity={0}
              enableHover={false}
            >
              Plant Today
            </FuzzyText>
            <FuzzyText
              baseIntensity={0.05}
              hoverIntensity={0}
              enableHover={false}
            >
              Forest Tomorrow
            </FuzzyText>
            <Box
              sx={{
                mt: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            ></Box>
          </Container>
        </HeroSection>
      </Fade>
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
