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
} from "@mui/material";
import {
  ArrowBack,
  Save,
  Add as AddIcon,
  LocationOn,
  Description,
  CalendarToday,
  Business,
  Map as MapIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { projects } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProjectAreaSelector from "../components/ProjectAreaSelector";

const AddProjectPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showMapSelector, setShowMapSelector] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "PLANNING",
    startDate: new Date().toISOString().split("T")[0], // Today's date
    endDate: "",
    areaCoordinates: null,
    mapImageUrl: "",
  });

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleAreaChange = (coordinates) => {
    setFormData({
      ...formData,
      areaCoordinates: coordinates,
    });
  };

  const handleMapImageCapture = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      mapImageUrl: imageUrl,
    }));
    console.log("Image URL received from map:", imageUrl);
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare the data for submission
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        areaCoordinates: formData.areaCoordinates,
        mapImageUrl: formData.mapImageUrl || null,
      };

      console.log("Form data before submit:", formData);
      console.log("Sending projectData:", projectData);
      const response = await projects.create(projectData);

      setSuccess("Projeto criado com sucesso!");

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error creating project:", error);
      setError(
        error.response?.data?.error || "Erro ao criar projeto. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const statusOptions = [
    { value: "PLANNING", label: "Planejamento" },
    { value: "IN_PROGRESS", label: "Em Andamento" },
    { value: "COMPLETED", label: "Concluído" },
    { value: "ON_HOLD", label: "Em Espera" },
    { value: "CANCELLED", label: "Cancelado" },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <IconButton onClick={handleCancel} color="primary">
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Criar Novo Projeto
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Adicione um novo projeto de plantio para gerenciar suas atividades
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Form */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Project Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
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
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição do Projeto"
                value={formData.description}
                onChange={handleInputChange("description")}
                required
                multiline
                rows={4}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Description sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                placeholder="Descreva os objetivos, espécies a serem plantadas, e outras informações relevantes do projeto..."
              />
            </Grid>

            {/* Status and Dates */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
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
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data de Início"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange("startDate")}
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <CalendarToday sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>

            {/* End Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data de Término (Opcional)"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange("endDate")}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <CalendarToday sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>

            {/* Area Coordinates */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Área do Projeto
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Defina a área geográfica do seu projeto usando o mapa
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="outlined"
                    onClick={() => setShowMapSelector(true)}
                    startIcon={<MapIcon />}
                    sx={{ minWidth: 200 }}
                  >
                    {formData.areaCoordinates
                      ? "Editar Área"
                      : "Selecionar Área"}
                  </Button>
                  {formData.areaCoordinates && (
                    <Chip
                      label={`${formData.areaCoordinates.length} pontos selecionados`}
                      color="success"
                      variant="outlined"
                    />
                  )}
                  {formData.mapImageUrl && (
                    <Chip
                      label="Imagem capturada"
                      color="primary"
                      variant="outlined"
                      startIcon={<LocationOn />}
                    />
                  )}
                </Stack>
              </Box>
              <ProjectAreaSelector
                open={showMapSelector}
                onClose={() => setShowMapSelector(false)}
                initialArea={formData.areaCoordinates}
                onAreaChange={handleAreaChange}
                onMapImageCapture={handleMapImageCapture}
              />
            </Grid>

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

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading}
                  startIcon={<ArrowBack />}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <Save />
                  }
                  sx={{
                    minWidth: 120,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      transition: "transform 0.2s",
                    },
                  }}
                >
                  {loading ? "Criando..." : "Criar Projeto"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Help Card */}
      <Card sx={{ mt: 3, bgcolor: "grey.50" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            💡 Dicas para um bom projeto
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • Use um nome descritivo que identifique claramente o projeto
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • Inclua detalhes sobre as espécies que serão plantadas
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • Defina datas realistas para início e término
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • As coordenadas da área podem ser adicionadas posteriormente
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddProjectPage;
