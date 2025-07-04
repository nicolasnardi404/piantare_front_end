import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Link as MuiLink,
  Stack,
  Avatar,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import YardIcon from "@mui/icons-material/Yard";
import PublicIcon from "@mui/icons-material/Public";
import HandshakeIcon from "@mui/icons-material/Handshake";
import LoginIcon from "@mui/icons-material/Login";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppBarMenu from "../components/AppBarMenu";

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: "40vh",
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

const ContentCard = styled(Card)(({ theme }) => ({
  height: "100%",
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease-in-out",
  textAlign: "center",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const IconLink = styled(MuiLink)(({ theme }) => ({
  color: theme.palette.primary.main,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  textDecoration: "none",
  transition: "color 0.3s ease",
  "&:hover": {
    color: theme.palette.primary.dark,
  },
}));

const ValueIcon = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
  "& .MuiSvgIcon-root": {
    fontSize: 32,
  },
}));

const About = () => {
  return (
    <Box>
      <AppBarMenu />

      <HeroSection>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              mb: 2,
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              mt: 8,
            }}
          >
            Sobre o Piantare
          </Typography>
          <Typography
            variant="h5"
            sx={{
              maxWidth: "800px",
              mx: "auto",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            Conectando pessoas e natureza para um futuro mais sustentável
          </Typography>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <ContentCard>
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  color="primary"
                  sx={{ mb: 4 }}
                >
                  Nossa Missão
                </Typography>
                <Typography
                  paragraph
                  sx={{ maxWidth: "800px", mx: "auto", mb: 3 }}
                >
                  O Piantare nasceu da necessidade de criar uma ponte entre
                  agricultores comprometidos com a biodiversidade e empresas que
                  desejam apoiar iniciativas sustentáveis. Nossa plataforma
                  facilita essa conexão, promovendo o plantio consciente e a
                  preservação ambiental.
                </Typography>
                <Typography
                  paragraph
                  sx={{ maxWidth: "800px", mx: "auto", mb: 5 }}
                >
                  Acreditamos que cada planta conta uma história e cada
                  agricultor é um guardião da natureza. Através da tecnologia,
                  tornamos visível o impacto positivo de cada iniciativa,
                  inspirando mais pessoas a se juntarem a essa causa.
                </Typography>

                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ mt: 6, mb: 4, color: "primary.main" }}
                >
                  Nossos Valores
                </Typography>
                <Grid
                  container
                  spacing={4}
                  sx={{ mt: 2 }}
                  justifyContent="center"
                >
                  {[
                    {
                      icon: <YardIcon />,
                      title: "Sustentabilidade",
                      description:
                        "Compromisso com práticas que preservam nossos recursos naturais",
                    },
                    {
                      icon: <PublicIcon />,
                      title: "Biodiversidade",
                      description:
                        "Promoção da diversidade de espécies em nossos ecossistemas",
                    },
                    {
                      icon: <HandshakeIcon />,
                      title: "Agricultura Consciente",
                      description:
                        "Apoio a práticas agrícolas que respeitam o meio ambiente",
                    },
                  ].map((value, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box
                        sx={{
                          textAlign: "center",
                          maxWidth: "300px",
                          mx: "auto",
                        }}
                      >
                        <ValueIcon>{value.icon}</ValueIcon>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ mt: 2, mb: 1 }}
                        >
                          {value.title}
                        </Typography>
                        <Typography color="text.secondary">
                          {value.description}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </ContentCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <ContentCard>
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  color="primary"
                  sx={{ mb: 3 }}
                >
                  Contato
                </Typography>
                <Typography paragraph sx={{ mb: 4 }}>
                  Estamos sempre abertos para ouvir suas sugestões, responder
                  suas dúvidas ou discutir possíveis parcerias.
                </Typography>

                <Stack
                  spacing={2}
                  sx={{ mt: 4, maxWidth: "300px", mx: "auto" }}
                >
                  <IconLink href="mailto:contato@piantare.com" target="_blank">
                    <EmailIcon /> contato@piantare.com
                  </IconLink>
                  <IconLink href="https://wa.me/5511999999999" target="_blank">
                    <WhatsAppIcon /> +55 (11) 99999-9999
                  </IconLink>
                  <IconLink
                    href="https://instagram.com/piantare"
                    target="_blank"
                  >
                    <InstagramIcon /> Instagram
                  </IconLink>
                </Stack>
              </CardContent>
            </ContentCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
