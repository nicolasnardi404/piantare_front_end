import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Map from "./components/Map";
import Users from "./components/Users";
import Home from "./pages/Home";
import About from "./pages/About";
import FarmerDashboard from "./components/FarmerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import CompanyProfile from "./components/CompanyProfile";
import AdminPlants from "./components/AdminPlants";
import "./App.css";

// Create a theme instance with translations for user-visible text
const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32", // Green shade
      light: "#4caf50",
      dark: "#1b5e20",
    },
    secondary: {
      main: "#ffd700", // Gold shade
      light: "#ffeb3b",
      dark: "#fbc02d",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

// Add translations object for user-visible text
const translations = {
  farmers: "Agricultores",
  companies: "Empresas",
  plants: "Plantas",
  map: "Mapa",
  users: "Usuários",
  login: "Entrar",
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={["FARMER"]}>
                  <Layout>
                    <FarmerDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Map />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <Layout>
                    <Users translations={translations} />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/plants"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <Layout>
                    <AdminPlants />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute roles={["FARMER"]}>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/company-profile"
              element={
                <ProtectedRoute roles={["COMPANY"]}>
                  <Layout>
                    <CompanyProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
