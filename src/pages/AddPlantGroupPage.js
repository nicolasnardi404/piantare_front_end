import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Divider,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  Add as AddIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  LocalFlorist,
  LocationOn,
  Timeline,
  CheckCircle,
  Undo as UndoIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { projects, plants } from "../services/api";
import plantGroupService from "../services/plantGroupService";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// São Paulo coordinates as default center
const defaultPosition = [-23.5505, -46.6333];

// Custom tree icon
const treeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

// Map click handler component
const MapClickHandler = ({ onMapClick, disabled }) => {
  const map = useMapEvents({
    click: (e) => {
      if (!disabled) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
};

const steps = [
  "Selecionar Projeto",
  "Definir Espécie",
  "Configurar Quantidade",
  "Posicionar Plantas no Mapa",
  "Confirmar e Salvar",
];

const AddPlantGroupPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Data states
  const [userProjects, setUserProjects] = useState([]);
  const [availableSpecies, setAvailableSpecies] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    species: "",
    quantity: "",
    notes: "",
    plannedPlantingDate: "",
  });

  // Map states
  const [plantCoordinates, setPlantCoordinates] = useState([]);
  const [mapCenter, setMapCenter] = useState(defaultPosition);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (projectId) {
      setActiveStep(1); // Skip project selection if projectId is provided
      loadProjectDetails();
    }
  }, [projectId]);

  useEffect(() => {
    // Update map center when project is selected
    if (selectedProject?.areaCoordinates) {
      try {
        const coordinates =
          typeof selectedProject.areaCoordinates === "string"
            ? JSON.parse(selectedProject.areaCoordinates)
            : selectedProject.areaCoordinates;

        if (Array.isArray(coordinates) && coordinates.length > 0) {
          setMapCenter(coordinates[0]);
        }
      } catch (error) {
        console.error("Error parsing project coordinates:", error);
      }
    }
  }, [selectedProject]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load user's projects
      const projectsResponse = await projects.getList();
      setUserProjects(projectsResponse.data || []);

      // Load available species
      const speciesResponse = await plants.getList();
      setAvailableSpecies(speciesResponse.data || []);
    } catch (error) {
      setError("Erro ao carregar dados iniciais");
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectDetails = async () => {
    if (!projectId) return;

    try {
      const response = await projects.getById(projectId);
      setSelectedProject(response.data);
    } catch (error) {
      setError("Erro ao carregar detalhes do projeto");
      console.error("Error loading project details:", error);
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setActiveStep(1);
  };

  const handleSpeciesSelect = (species) => {
    setSelectedSpecies(species);
    setFormData((prev) => ({
      ...prev,
      species: species.commonName,
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMapClick = (latlng) => {
    const targetQuantity = parseInt(formData.quantity) || 0;

    if (plantCoordinates.length < targetQuantity) {
      setPlantCoordinates((prev) => [
        ...prev,
        { lat: latlng.lat, lng: latlng.lng },
      ]);
    }
  };

  const handleUndoLastPlant = () => {
    setPlantCoordinates((prev) => prev.slice(0, -1));
  };

  const handleClearAllPlants = () => {
    setPlantCoordinates([]);
  };

  const handleSubmit = async () => {
    if (!selectedProject || !selectedSpecies || !formData.quantity) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const targetQuantity = parseInt(formData.quantity);
    if (plantCoordinates.length !== targetQuantity) {
      setError(
        `Você precisa posicionar exatamente ${targetQuantity} plantas no mapa`
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First create the plant group
      const groupData = {
        species: selectedSpecies.commonName,
        quantity: targetQuantity,
        notes: formData.notes,
        plannedPlantingDate: formData.plannedPlantingDate,
      };

      const newGroup = await plantGroupService.createPlantGroup(
        selectedProject.id,
        groupData
      );

      // Then add the planted plants with coordinates
      await plantGroupService.addPlantedPlants(newGroup.id, plantCoordinates);

      setSuccess("Grupo de plantas criado com sucesso!");
      setTimeout(() => {
        navigate(`/dashboard`);
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || "Erro ao criar grupo de plantas");
      console.error("Error creating plant group:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PLANNING: "info",
      IN_PROGRESS: "warning",
      COMPLETED: "success",
      ON_HOLD: "default",
      CANCELLED: "error",
    };
    return colors[status] || "default";
  };

  const getStatusLabel = (status) => {
    const labels = {
      PLANNING: "PLANEJAMENTO",
      IN_PROGRESS: "EM ANDAMENTO",
      COMPLETED: "CONCLUÍDO",
      ON_HOLD: "EM ESPERA",
      CANCELLED: "CANCELADO",
    };
    return labels[status] || status;
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Selecione o Projeto
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Escolha o projeto onde você deseja adicionar o novo grupo de
              plantas.
            </Typography>

            <Grid container spacing={2}>
              {userProjects.map((project) => (
                <Grid item xs={12} md={6} key={project.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => handleProjectSelect(project)}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6" component="h3">
                          {project.name}
                        </Typography>
                        <Chip
                          label={getStatusLabel(project.status)}
                          color={getStatusColor(project.status)}
                          size="small"
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {project.description}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Timeline fontSize="small" color="primary" />
                        <Typography variant="caption" color="text.secondary">
                          Início:{" "}
                          {new Date(project.startDate).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocalFlorist fontSize="small" color="primary" />
                        <Typography variant="caption" color="text.secondary">
                          {project.plantGroups?.length || 0} grupos de plantas
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Definir Espécie
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Escolha a espécie de planta para o novo grupo.
            </Typography>

            {selectedProject && (
              <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
                <Typography variant="subtitle2" gutterBottom>
                  Projeto Selecionado: {selectedProject.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedProject.description}
                </Typography>
              </Paper>
            )}

            <Autocomplete
              options={availableSpecies}
              getOptionLabel={(option) =>
                `${option.commonName} (${option.scientificName})`
              }
              value={selectedSpecies}
              onChange={(event, newValue) => handleSpeciesSelect(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Selecionar Espécie"
                  placeholder="Digite para buscar..."
                  required
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body1">{option.commonName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.scientificName}
                    </Typography>
                  </Box>
                </Box>
              )}
            />

            {selectedSpecies && (
              <Paper sx={{ p: 2, mt: 2, bgcolor: "primary.50" }}>
                <Typography variant="subtitle2" gutterBottom>
                  Espécie Selecionada
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedSpecies.commonName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedSpecies.scientificName}
                </Typography>
                {selectedSpecies.category && (
                  <Chip
                    label={selectedSpecies.category}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </Paper>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Configurar Quantidade
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Defina a quantidade de plantas e informações adicionais.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quantidade de Plantas"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                  required
                  inputProps={{ min: 1 }}
                  helperText="Número de plantas que serão plantadas"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data Planejada de Plantio"
                  type="date"
                  value={formData.plannedPlantingDate}
                  onChange={(e) =>
                    handleInputChange("plannedPlantingDate", e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observações"
                  multiline
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Adicione observações sobre o grupo de plantas..."
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Posicionar Plantas no Mapa
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Clique no mapa para posicionar cada planta dentro da área do
              projeto.
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Paper sx={{ p: 2, bgcolor: "info.50" }}>
                <Typography variant="subtitle2" gutterBottom>
                  Instruções
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Clique no mapa para adicionar plantas
                  <br />• Você precisa posicionar {formData.quantity} plantas
                  <br />• Use os botões abaixo para desfazer ou limpar todas as
                  plantas
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <Badge badgeContent={plantCoordinates.length} color="primary">
                <LocalFlorist color="primary" />
              </Badge>
              <Typography variant="body1">
                Plantas posicionadas: {plantCoordinates.length} /{" "}
                {formData.quantity}
              </Typography>
            </Box>

            <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<UndoIcon />}
                onClick={handleUndoLastPlant}
                disabled={plantCoordinates.length === 0}
              >
                Desfazer Última
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<ClearIcon />}
                onClick={handleClearAllPlants}
                disabled={plantCoordinates.length === 0}
              >
                Limpar Todas
              </Button>
            </Box>

            <Box
              sx={{
                height: 500,
                width: "100%",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <MapContainer
                center={mapCenter}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                zoomControl={true}
                dragging={true}
                scrollWheelZoom={true}
              >
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                  maxZoom={19}
                  minZoom={0}
                  tileSize={256}
                />

                {/* Project area polygon */}
                {selectedProject?.areaCoordinates && (
                  <Polygon
                    positions={
                      typeof selectedProject.areaCoordinates === "string"
                        ? JSON.parse(selectedProject.areaCoordinates)
                        : selectedProject.areaCoordinates
                    }
                    pathOptions={{
                      color: "#4caf50",
                      fillColor: "#4caf50",
                      fillOpacity: 0.2,
                      weight: 2,
                    }}
                  />
                )}

                {/* Plant markers */}
                {plantCoordinates.map((coord, index) => (
                  <Marker
                    key={index}
                    position={[coord.lat, coord.lng]}
                    icon={treeIcon}
                  />
                ))}

                <MapClickHandler
                  onMapClick={handleMapClick}
                  disabled={
                    plantCoordinates.length >= parseInt(formData.quantity)
                  }
                />
              </MapContainer>
            </Box>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirmar e Salvar
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Revise as informações antes de criar o grupo de plantas.
            </Typography>

            <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Resumo do Grupo de Plantas
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Projeto
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedProject?.name}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Espécie
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedSpecies?.commonName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedSpecies?.scientificName}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Quantidade
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formData.quantity} plantas
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Plantas Posicionadas
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {plantCoordinates.length} / {formData.quantity}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Data Planejada
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formData.plannedPlantingDate
                      ? new Date(
                          formData.plannedPlantingDate
                        ).toLocaleDateString()
                      : "Não definida"}
                  </Typography>
                </Grid>

                {formData.notes && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Observações
                    </Typography>
                    <Typography variant="body1">{formData.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  if (loading && !selectedProject) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Tooltip title="Voltar ao Dashboard">
          <IconButton onClick={() => navigate("/dashboard")} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Adicionar Grupo de Plantas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Crie um novo grupo de plantas para seu projeto
          </Typography>
        </Box>
      </Box>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <Paper sx={{ p: 3, mb: 3 }}>{renderStepContent(activeStep)}</Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
        >
          Voltar
        </Button>

        <Box>
          <Button
            variant="outlined"
            onClick={() => navigate("/dashboard")}
            sx={{ mr: 2 }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              loading ||
              (activeStep === 3 &&
                plantCoordinates.length !== parseInt(formData.quantity))
            }
            startIcon={
              activeStep === steps.length - 1 ? <SaveIcon /> : <AddIcon />
            }
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : activeStep === steps.length - 1 ? (
              "Criar Grupo"
            ) : (
              "Próximo"
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddPlantGroupPage;
