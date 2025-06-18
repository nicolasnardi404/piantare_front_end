import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  CssBaseline,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  Map as MapIcon,
  People as PeopleIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 240;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
}));

const BrandTitle = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: 800,
  letterSpacing: "-0.03em",
  background: `linear-gradient(
    135deg,
    ${theme.palette.primary.light} 0%,
    #81c784 30%,
    ${theme.palette.secondary.light} 70%,
    ${theme.palette.primary.main} 100%
  )`,
  backgroundSize: "200% auto",
  color: "transparent",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  textShadow: "2px 4px 8px rgba(0,0,0,0.2)",
  position: "relative",
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
  padding: "0.2em 0.5em",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: "30%",
    background: "rgba(255,255,255,0.1)",
    transform: "translateY(-50%)",
    filter: "blur(8px)",
    zIndex: -1,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "2px",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transform: "scaleX(0.8)",
    opacity: 0,
    transition: "all 0.3s ease-in-out",
  },
  "&:hover": {
    backgroundPosition: "right center",
    transform: "translateY(-2px)",
    "&::after": {
      transform: "scaleX(1)",
      opacity: 1,
    },
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    boxSizing: "border-box",
    width: drawerWidth,
    background: "linear-gradient(180deg, #f8f8f8 0%, #ffffff 100%)",
    borderRight: "1px solid rgba(0, 0, 0, 0.08)",
  },
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    ...(user?.role === "FARMER"
      ? [
          {
            text: "Dashboard",
            icon: <DashboardIcon />,
            path: "/dashboard",
          },
          {
            text: "Perfil",
            icon: <PersonIcon />,
            path: "/profile",
          },
        ]
      : []),
    ...(user?.role === "COMPANY"
      ? [
          {
            text: "Perfil da Empresa",
            icon: <PersonIcon />,
            path: "/company-profile",
          },
        ]
      : []),
    {
      text: "Mapa",
      icon: <MapIcon />,
      path: "/map",
    },
    ...(user?.role === "ADMIN"
      ? [
          {
            text: "Usuários",
            icon: <PeopleIcon />,
            path: "/users",
          },
        ]
      : []),
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Plantas Milena
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={logout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <StyledAppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <MenuButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </MenuButton>
          <BrandTitle
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Piantare
          </BrandTitle>
          {user && (
            <UserInfo>
              <Typography variant="body1">{user.email}</Typography>
              <Button
                color="inherit"
                onClick={logout}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <LogoutIcon />
              </Button>
            </UserInfo>
          )}
        </Toolbar>
      </StyledAppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <StyledDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
          }}
        >
          {drawer}
        </StyledDrawer>
        <StyledDrawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
          }}
          open
        >
          {drawer}
        </StyledDrawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
