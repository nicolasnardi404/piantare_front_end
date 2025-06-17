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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

import YardIcon from "@mui/icons-material/Yard";
import BusinessIcon from "@mui/icons-material/Business";
import PublicIcon from "@mui/icons-material/Public";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MapIcon from "@mui/icons-material/Map";
import HandshakeIcon from "@mui/icons-material/Handshake";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import AssessmentIcon from "@mui/icons-material/Assessment";

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

const Home = () => {
  return (
    <Box>
      <Fade in={true} timeout={1000}>
        <HeroSection>
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
            <Button
              component={Link}
              to="/map"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "white",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.9)",
                },
                px: 4,
                py: 2,
              }}
            >
              Explorar Mapa
            </Button>
          </Container>
        </HeroSection>
      </Fade>

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
