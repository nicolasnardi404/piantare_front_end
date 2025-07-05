import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Paper, // Added Paper
} from "@mui/material";
import { auth } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FlickeringGrid } from "./FlickeringGridProps";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await auth.login({ email, password });
      login(response.data.user, response.data.token);

      // Redirect based on user role
      const role = response.data.user.role;
      if (role === "FARMER") {
        navigate("/dashboard");
      } else if (role === "COMPANY") {
        navigate("/map");
      } else if (role === "ADMIN") {
        navigate("/map/general");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Falha ao entrar");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Cerebro Planta background image */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: "url('/images/cerebro planta.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Optional dark overlay for contrast */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      {/* FlickeringGrid background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
        }}
      >
        <FlickeringGrid
          className="relative inset-0 z-0 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
          squareSize={4}
          gridGap={6}
          color="#60A5FA"
          maxOpacity={0.5}
          flickerChance={0.1}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      </div>
      {/* Login card */}
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          width: "100%",
          maxWidth: 400,
          p: 0,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            width: "100%",
            maxWidth: 400,
            boxShadow: 6,
            backdropFilter: "blur(8px)",
            background: "rgba(255,255,255,0.85)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Placeholder for logo */}
            <Box sx={{ mb: 2 }}>
              {/* <img src="/logo192.png" alt="Logo" style={{ width: 56, height: 56 }} /> */}
            </Box>
            <Typography
              component="h1"
              variant="h4"
              fontWeight={700}
              align="center"
              sx={{ mb: 2 }}
            >
              Bem-vinde a ApeForest!
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: "100%" }}
            >
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="E-mail"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, borderRadius: 2, fontWeight: 600 }}
              >
                Entrar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
