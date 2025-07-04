import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import MapIcon from "@mui/icons-material/Map";
import InfoIcon from "@mui/icons-material/Info";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import LoginIcon from "@mui/icons-material/Login";

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

const AppBarMenu = () => (
  <AppBar
    position="absolute"
    elevation={0}
    sx={{
      background: "rgba(0,0,0,0.15)",
      boxShadow: "none",
      backdropFilter: "blur(6px)",
      zIndex: 20,
      py: 1,
    }}
  >
    <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
      <Logo
        component={Link}
        to="/"
        sx={{
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        {/* <img src="/images/apeforestlogo.svg" alt="ApeForest" style={{ height: 36, marginRight: 8 }} /> */}
        ApeForest
      </Logo>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1,
          justifyContent: "left",
          marginLeft: "20px",
        }}
      >
        <NavLink component={Link} to="/about" startIcon={<InfoIcon />}>
          Sobre
        </NavLink>
        <NavLink
          component={Link}
          to="/support"
          startIcon={<VolunteerActivismIcon />}
        >
          Apoie
        </NavLink>
        {/* <NavLink component={Link} to="/permaculture" startIcon={<InfoIcon />}>
          Permacultura
        </NavLink> */}
        <NavLink component={Link} to="/mapa" startIcon={<MapIcon />}>
          Mapa
        </NavLink>
        <NavLink component={Link} to="/how-it-works">
          Como Funciona
        </NavLink>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <CTAButton component={Link} to="/login" startIcon={<LoginIcon />}>
          Entrar
        </CTAButton>
      </Box>
    </Toolbar>
  </AppBar>
);

export default AppBarMenu;
