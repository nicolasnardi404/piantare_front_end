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
  Lightbulb as LightbulbIcon,
  CropSquare as CropSquareIcon,
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
  Circle,
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

  // Add new state for suggestions
  const [suggestedPositions, setSuggestedPositions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [areaInfo, setAreaInfo] = useState(null);

  // Add new state for auto-placement
  const [autoPlaced, setAutoPlaced] = useState(false);

  // Add new state for rectangle planting
  const [plantingRectangle, setPlantingRectangle] = useState(null);
  const [isDrawingRectangle, setIsDrawingRectangle] = useState(false);
  const [rectangleStart, setRectangleStart] = useState(null);

  // Add new state for rectangle dimensions
  const [rectangleDimensions, setRectangleDimensions] = useState({
    width: "",
    height: "",
  });

  // Simplify state - remove unnecessary circle and pattern states
  const [plantingCircle, setPlantingCircle] = useState(null);
  const [circleCenter, setCircleCenter] = useState(null);
  const [circleRadius, setCircleRadius] = useState("");

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

    // Reset auto-placement if quantity changes
    if (field === "quantity") {
      setAutoPlaced(false);
      setPlantCoordinates([]);
    }
  };

  const handleMapClick = (latlng) => {
    if (isDrawingRectangle) {
      // Finish drawing rectangle
      if (rectangleStart) {
        const rect = {
          north: Math.max(rectangleStart.lat, latlng.lat),
          south: Math.min(rectangleStart.lat, latlng.lat),
          east: Math.max(rectangleStart.lng, latlng.lng),
          west: Math.min(rectangleStart.lng, latlng.lng),
        };
        setPlantingRectangle(rect);
        setIsDrawingRectangle(false);
        setRectangleStart(null);

        // Auto-place trees in the rectangle
        placeTreesInRectangle(rect);
      }
    } else {
      // Regular single tree placement
      const targetQuantity = parseInt(formData.quantity) || 0;
      if (plantCoordinates.length < targetQuantity) {
        setPlantCoordinates((prev) => [
          ...prev,
          { lat: latlng.lat, lng: latlng.lng },
        ]);
      }
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

  // Simplified smart grid function
  const placeTreesInSmartGrid = (center, radius, treeCount) => {
    const positions = [];
    const radiusInDegrees = radius / 111320;

    // Calculate grid dimensions
    const sideLength = Math.ceil(Math.sqrt(treeCount));
    const spacing = (2 * radiusInDegrees) / sideLength;

    let placed = 0;
    for (let row = 0; row < sideLength && placed < treeCount; row++) {
      for (let col = 0; col < sideLength && placed < treeCount; col++) {
        // Add some randomness to make it look more natural
        const randomOffset = (Math.random() - 0.5) * spacing * 0.3;

        const lat =
          center.lat - radiusInDegrees + (row + 0.5) * spacing + randomOffset;
        const lng =
          center.lng - radiusInDegrees + (col + 0.5) * spacing + randomOffset;

        // Check if within circle
        const distance = Math.sqrt(
          Math.pow(lat - center.lat, 2) + Math.pow(lng - center.lng, 2)
        );

        if (distance <= radiusInDegrees) {
          positions.push({ lat, lng });
          placed++;
        }
      }
    }

    return positions;
  };

  // Simplified apply smart grid function
  const applySmartGrid = () => {
    if (!circleCenter || !circleRadius || !formData.quantity) {
      setError("Por favor, defina o centro, raio e quantidade");
      return;
    }

    const radius = parseFloat(circleRadius);
    const targetQuantity = parseInt(formData.quantity);
    const positions = placeTreesInSmartGrid(
      circleCenter,
      radius,
      targetQuantity
    );

    if (positions.length > 0) {
      setPlantCoordinates(positions);
      setPlantingCircle({ center: circleCenter, radius });
      setError("");
    } else {
      setError("Não foi possível gerar posições para a grade inteligente");
    }
  };

  const startRectangleDrawing = () => {
    setIsDrawingRectangle(true);
    setPlantingRectangle(null);
    setPlantCoordinates([]);
    setAutoPlaced(false);
  };

  const placeTreesInRectangle = (rect) => {
    const targetQuantity = parseInt(formData.quantity);
    if (!targetQuantity || !rect) return;

    console.log("🌳 Placing trees in rectangle:", rect);
    console.log("Target quantity:", targetQuantity);

    // Calculate optimal grid
    const positions = calculateGridPositions(rect, targetQuantity);

    console.log("Generated positions:", positions);

    if (positions.length > 0) {
      setPlantCoordinates(positions);
      setAutoPlaced(true);
      console.log("✅ Trees placed successfully");
    }
  };

  const calculateGridPositions = (rect, treeCount) => {
    if (treeCount <= 0) return [];

    // Calculate rectangle dimensions in meters
    const latDiff = rect.north - rect.south;
    const lngDiff = rect.east - rect.west;

    // Convert to meters (approximate)
    const widthMeters =
      lngDiff *
      111320 *
      Math.cos((((rect.north + rect.south) / 2) * Math.PI) / 180);
    const heightMeters = latDiff * 111320;

    console.log("Rectangle dimensions:", {
      widthMeters: widthMeters.toFixed(2),
      heightMeters: heightMeters.toFixed(2),
      area: (widthMeters * heightMeters).toFixed(2),
    });

    // Calculate optimal grid
    const aspectRatio = widthMeters / heightMeters;
    const cols = Math.ceil(Math.sqrt(treeCount * aspectRatio));
    const rows = Math.ceil(treeCount / cols);

    console.log("Grid dimensions:", { rows, cols, total: rows * cols });

    // Calculate spacing
    const spacingX = widthMeters / (cols + 1);
    const spacingY = heightMeters / (rows + 1);

    // Convert spacing back to degrees
    const spacingLat = spacingY / 111320;
    const spacingLng =
      spacingX /
      (111320 * Math.cos((((rect.north + rect.south) / 2) * Math.PI) / 180));

    console.log("Spacing:", {
      spacingX: spacingX.toFixed(2),
      spacingY: spacingY.toFixed(2),
      spacingLat: spacingLat.toFixed(6),
      spacingLng: spacingLng.toFixed(6),
    });

    const positions = [];
    let placedCount = 0;

    // Place trees in grid
    for (let row = 0; row < rows && placedCount < treeCount; row++) {
      for (let col = 0; col < cols && placedCount < treeCount; col++) {
        const lat = rect.south + (row + 1) * spacingLat;
        const lng = rect.west + (col + 1) * spacingLng;

        positions.push({ lat, lng });
        placedCount++;
      }
    }

    console.log("Final positions:", positions);
    return positions;
  };

  const clearPlantingArea = () => {
    setPlantingRectangle(null);
    setPlantCoordinates([]);
    setAutoPlaced(false);
    setIsDrawingRectangle(false);
    setRectangleStart(null);
    setCircleCenter(null);
    setPlantingCircle(null);
  };

  const handleRectangleDimensionChange = (field, value) => {
    setRectangleDimensions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const placeTreesInSpecifiedDimensions = () => {
    const targetQuantity = parseInt(formData.quantity);
    const width = parseFloat(rectangleDimensions.width);
    const height = parseFloat(rectangleDimensions.height);

    if (!targetQuantity || !width || !height) {
      setError(
        "Por favor, especifique a quantidade e as dimensões do retângulo"
      );
      return;
    }

    if (!selectedProject?.areaCoordinates) {
      setError("Nenhum projeto selecionado");
      return;
    }

    try {
      // Get project center
      const coordinates =
        typeof selectedProject.areaCoordinates === "string"
          ? JSON.parse(selectedProject.areaCoordinates)
          : selectedProject.areaCoordinates;

      if (!Array.isArray(coordinates) || coordinates.length === 0) {
        setError("Coordenadas do projeto inválidas");
        return;
      }

      // Calculate center of project
      const centerLat =
        coordinates.reduce((sum, coord) => sum + coord[0], 0) /
        coordinates.length;
      const centerLng =
        coordinates.reduce((sum, coord) => sum + coord[1], 0) /
        coordinates.length;

      // Convert dimensions from meters to degrees
      const widthInDegrees =
        width / (111320 * Math.cos((centerLat * Math.PI) / 180));
      const heightInDegrees = height / 111320;

      // Create rectangle centered on project
      const rect = {
        north: centerLat + heightInDegrees / 2,
        south: centerLat - heightInDegrees / 2,
        east: centerLng + widthInDegrees / 2,
        west: centerLng - widthInDegrees / 2,
      };

      setPlantingRectangle(rect);
      placeTreesInRectangle(rect);
      setError(""); // Clear any previous errors
    } catch (error) {
      setError("Erro ao calcular as dimensões do retângulo");
      console.error("Error placing trees with specified dimensions:", error);
    }
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
        console.log("🗺️ Rendering map step");
        console.log("Current plant coordinates:", plantCoordinates);
        console.log("Planting circle:", plantingCircle);

        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Posicionar Plantas no Mapa
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Clique no mapa para posicionar cada planta individualmente ou use
              a Grade Inteligente para posicionamento automático.
            </Typography>

            {/* Planting Instructions */}
            <Paper sx={{ p: 2, mb: 2, bgcolor: "info.50" }}>
              <Typography variant="subtitle2" gutterBottom>
                Métodos de Posicionamento
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • <strong>Método 1:</strong> Clique no mapa para posicionar cada
                planta individualmente
                <br />• <strong>Método 2:</strong> Use a Grade Inteligente para
                posicionamento automático em uma área circular
              </Typography>
            </Paper>

            {/* Smart Grid Tool */}
            <Paper sx={{ p: 2, mb: 2, bgcolor: "primary.50" }}>
              <Typography variant="subtitle2" gutterBottom>
                Grade Inteligente (Opcional)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Posicione automaticamente as árvores em uma grade natural dentro
                de uma área circular.
              </Typography>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Raio da Área (metros)"
                    type="number"
                    value={circleRadius}
                    onChange={(e) => setCircleRadius(e.target.value)}
                    inputProps={{ min: 1, step: 0.1 }}
                    size="small"
                    helperText="Raio da área circular"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    onClick={applySmartGrid}
                    disabled={
                      !circleCenter || !circleRadius || !formData.quantity
                    }
                    startIcon={<CropSquareIcon />}
                    fullWidth
                    size="small"
                  >
                    Aplicar Grade Inteligente
                  </Button>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="outlined"
                    onClick={() => setCircleCenter(null)}
                    disabled={!circleCenter}
                    color="secondary"
                    fullWidth
                    size="small"
                  >
                    Limpar Centro
                  </Button>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="outlined"
                    onClick={clearPlantingArea}
                    color="error"
                    fullWidth
                    size="small"
                  >
                    Limpar Tudo
                  </Button>
                </Grid>
              </Grid>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Clique no mapa para definir o centro da área, depois especifique
                o raio e aplique a grade inteligente.
              </Typography>
            </Paper>

            {/* Status Information */}
            <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <Badge badgeContent={plantCoordinates.length} color="primary">
                <LocalFlorist color="primary" />
              </Badge>
              <Typography variant="body1">
                Plantas posicionadas: {plantCoordinates.length} /{" "}
                {formData.quantity}
              </Typography>
              {plantingCircle && (
                <Chip
                  label="Grade Inteligente aplicada"
                  color="success"
                  size="small"
                  icon={<CropSquareIcon />}
                />
              )}
            </Box>

            {/* Planting Controls */}
            <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
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
                onClick={clearPlantingArea}
                disabled={plantCoordinates.length === 0 && !plantingCircle}
              >
                Limpar Tudo
              </Button>
            </Box>

            {/* Circle Information */}
            {plantingCircle && (
              <Paper sx={{ p: 2, mb: 2, bgcolor: "success.50" }}>
                <Typography variant="subtitle2" gutterBottom>
                  Grade Inteligente Aplicada
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Raio da área: {plantingCircle.radius} metros
                  <br />• Área total:{" "}
                  {(
                    Math.PI *
                    plantingCircle.radius *
                    plantingCircle.radius
                  ).toFixed(1)}{" "}
                  m²
                  <br />• Plantas posicionadas automaticamente em grade natural
                </Typography>
              </Paper>
            )}

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
                      fillOpacity: 0.1,
                      weight: 2,
                    }}
                  />
                )}

                {/* Circle center marker */}
                {circleCenter && (
                  <Marker
                    position={[circleCenter.lat, circleCenter.lng]}
                    icon={
                      new L.Icon({
                        iconUrl:
                          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                      })
                    }
                  />
                )}

                {/* Circle outline */}
                {circleCenter && circleRadius && (
                  <Circle
                    center={[circleCenter.lat, circleCenter.lng]}
                    radius={parseFloat(circleRadius)}
                    pathOptions={{
                      color: "#2196f3",
                      fillColor: "#2196f3",
                      fillOpacity: 0.1,
                      weight: 2,
                      dashArray: "5, 5",
                    }}
                  />
                )}

                {/* Plant markers */}
                {plantCoordinates.map((coord, index) => {
                  console.log(`🎯 Rendering marker ${index}:`, coord);
                  return (
                    <Marker
                      key={index}
                      position={[coord.lat, coord.lng]}
                      icon={treeIcon}
                    />
                  );
                })}

                <MapClickHandler
                  onMapClick={(latlng) => {
                    if (!circleCenter) {
                      // Set circle center
                      setCircleCenter(latlng);
                    } else {
                      // Regular tree placement
                      const targetQuantity = parseInt(formData.quantity) || 0;
                      if (plantCoordinates.length < targetQuantity) {
                        setPlantCoordinates((prev) => [
                          ...prev,
                          { lat: latlng.lat, lng: latlng.lng },
                        ]);
                      }
                    }
                  }}
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
