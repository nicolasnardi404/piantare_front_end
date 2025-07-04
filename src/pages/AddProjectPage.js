import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  IconButton,
  Chip,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack,
  Save,
  Map as MapIcon,
  LocationOn,
  CalendarToday,
  Business,
  Description,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { projects } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProjectAreaSelector from "../components/ProjectAreaSelector";

const AddProjectPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showMapSelector, setShowMapSelector] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "PLANNING",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    areaCoordinates: null,
    mapImageUrl: "",
  });

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleAreaChange = (coordinates) => {
    setFormData((prev) => ({
      ...prev,
      areaCoordinates: coordinates,
    }));
  };

  const handleMapImageCapture = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      mapImageUrl: imageUrl,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Nome do projeto é obrigatório");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Descrição do projeto é obrigatória");
      return false;
    }
    if (!formData.startDate) {
      setError("Data de início é obrigatória");
      return false;
    }
    if (
      formData.endDate &&
      new Date(formData.endDate) <= new Date(formData.startDate)
    ) {
      setError("Data de término deve ser posterior à data de início");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        areaCoordinates: formData.areaCoordinates,
        mapImageUrl: formData.mapImageUrl || null,
      };

      const response = await projects.create(projectData);
      setSuccess("Projeto criado com sucesso!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      setError(
        error.response?.data?.error || "Erro ao criar projeto. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/dashboard");

  const statusOptions = [
    { value: "PLANNING", label: "Planejamento" },
    { value: "IN_PROGRESS", label: "Em Andamento" },
    { value: "COMPLETED", label: "Concluído" },
    { value: "ON_HOLD", label: "Em Espera" },
    { value: "CANCELLED", label: "Cancelado" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 4,
        px: { xs: 1, md: 4 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 1600, // or even 1800 for ultra-wide screens
          mx: "auto",
          p: { xs: 2, md: 4 },
          borderRadius: 4,
        }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <IconButton onClick={handleCancel} color="primary">
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Criar Novo Projeto
            </Typography>
            <Typography color="text.secondary">
              Adicione um novo projeto de plantio para gerenciar suas atividades
            </Typography>
          </Box>
        </Stack>
        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            width: "100%",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          {/* Informações do Projeto */}
          <Box
            sx={{
              flex: 2, // or even 2.5 for more space
              minWidth: 0,
              p: 3,
              borderRadius: 3,
              bgcolor: "grey.50",
              boxShadow: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Informações do Projeto
            </Typography>
            {/* Row 1: Name, Status */}
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              sx={{ mb: 2 }}
            >
              <TextField
                label="Nome do Projeto"
                value={formData.name}
                onChange={handleInputChange("name")}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Business sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                placeholder="Ex: Reflorestamento da Área Norte"
                sx={{ flex: 2 }}
              />
              <FormControl required sx={{ flex: 1 }}>
                <InputLabel>Status do Projeto</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleInputChange("status")}
                  label="Status do Projeto"
                  startAdornment={
                    <CalendarToday sx={{ mr: 1, color: "text.secondary" }} />
                  }
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            {/* Row 2: Start Date, End Date */}
            <Stack
              direction="row"
              spacing={2}
              sx={{ mb: 2, alignItems: "center" }}
            >
              <TextField
                label="Data de Início"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange("startDate")}
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <CalendarToday sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{ width: 180 }}
              />
              <TextField
                label="Data de Término (Opcional)"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange("endDate")}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <CalendarToday sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{ width: 180 }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 2, minWidth: 200, maxWidth: 260 }}
              >
                Deixe em branco se o projeto ainda não tem data de conclusão
              </Typography>
            </Stack>
            {/* Row 3: Description */}
            <TextField
              fullWidth
              label="Descrição do Projeto"
              value={formData.description}
              onChange={handleInputChange("description")}
              required
              multiline
              minRows={4}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <Description sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
              placeholder="Descreva os objetivos, espécies a serem plantadas, e outras informações relevantes do projeto..."
              sx={{ mb: 2 }}
            />
          </Box>

          {/* Área do Projeto */}
          <Card
            variant="outlined"
            sx={{
              flex: 1,
              minWidth: 350, // or less if you want the info card even wider
              p: 3,
              borderRadius: 3,
              boxShadow: 0,
              bgcolor: "grey.50",
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Área do Projeto
            </Typography>
            <Stack spacing={2} alignItems="center">
              <Button
                variant="outlined"
                onClick={() => setShowMapSelector(true)}
                startIcon={<MapIcon />}
                sx={{ minWidth: 180 }}
              >
                {formData.areaCoordinates ? "Editar Área" : "Selecionar Área"}
              </Button>
              <Stack direction="row" spacing={1}>
                {formData.areaCoordinates && (
                  <Chip
                    label={`${formData.areaCoordinates.length} pontos`}
                    color="success"
                    variant="outlined"
                  />
                )}
                {formData.mapImageUrl && (
                  <Chip
                    label="Imagem capturada"
                    color="primary"
                    variant="outlined"
                    startIcon={<ImageIcon />}
                  />
                )}
              </Stack>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 320,
                  height: 180,
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #ccc",
                }}
              >
                {formData.mapImageUrl ? (
                  <img
                    src={formData.mapImageUrl}
                    alt="Área do projeto"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Nenhuma imagem capturada
                  </Typography>
                )}
              </Box>
            </Stack>
            <ProjectAreaSelector
              open={showMapSelector}
              onClose={() => setShowMapSelector(false)}
              initialArea={formData.areaCoordinates}
              onAreaChange={handleAreaChange}
              onMapImageCapture={handleMapImageCapture}
            />
          </Card>
        </Box>

        {/* Error/Success Messages */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          </Grid>
        )}
        {success && (
          <Grid item xs={12}>
            <Alert severity="success" onClose={() => setSuccess("")}>
              {success}
            </Alert>
          </Grid>
        )}
      </Paper>

      {/* Action Buttons */}
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        justifyContent="flex-end"
        alignItems="center"
        sx={{ mt: 4 }}
      >
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={loading}
          startIcon={<ArrowBack />}
          sx={{ minWidth: 120 }}
          fullWidth={isMobile}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
          sx={{
            minWidth: 160,
            fontWeight: 700,
            fontSize: "1.1rem",
          }}
          fullWidth={isMobile}
        >
          {loading ? "Criando..." : "Criar Projeto"}
        </Button>
      </Stack>
    </Box>
  );
};

export default AddProjectPage;
