import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  Stack,
  Chip,
  IconButton,
  Button,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  CircularProgress,
} from "@mui/material";
import {
  Person,
  LocalFlorist,
  Timeline,
  LocationOn,
  Edit,
  Add,
  Map as MapIcon,
  Delete,
} from "@mui/icons-material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "../context/AuthContext";
import api, { projects } from "../services/api";
import PlantUpdates from "./PlantUpdates";
import ProjectModal from "./ProjectModal";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// São Paulo coordinates as default center
const defaultPosition = [-23.5505, -46.6333];

// Get map center coordinates for a project
const getProjectMapCenter = (project) => {
  if (!project?.areaCoordinates) return defaultPosition;

  try {
    const coordinates =
      typeof project.areaCoordinates === "string"
        ? JSON.parse(project.areaCoordinates)
        : project.areaCoordinates;

    if (Array.isArray(coordinates) && coordinates.length > 0) {
      return coordinates[0];
    }
  } catch (error) {
    console.error("Error parsing area coordinates:", error);
  }

  return defaultPosition;
};

const StatCard = ({ icon, title, value, color }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: color }}>{icon}</Avatar>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5">{value}</Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const FarmerDashboard = () => {
  const { user, token } = useAuth();
  const [plants, setPlants] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  useEffect(() => {
    console.log("Current user:", user);
    console.log("Auth token:", token);
    fetchPlants();
    loadProjects();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await api.get("/plant-locations");
      setPlants(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching plants:", error);
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      console.log("Loading projects...");
      console.log("Current auth state:", { user, token });
      const response = await projects.getList();
      console.log("Projects response:", response);
      setProjectsList(response.data);
    } catch (error) {
      console.error("Error loading projects:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Tem certeza que deseja excluir este projeto?")) {
      try {
        await projects.delete(projectId);
        loadProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
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

  const calculateStats = () => {
    const stats = {
      totalPlants: plants.length,
      healthyPlants: 0,
      needsAttention: 0,
      sickPlants: 0,
    };

    plants.forEach((plant) => {
      // Get the latest update if it exists
      const lastUpdate = plant.updates?.[0];

      if (!lastUpdate) {
        // Plants without updates are considered healthy
        stats.healthyPlants++;
      } else {
        switch (lastUpdate.healthStatus) {
          case "HEALTHY":
            stats.healthyPlants++;
            break;
          case "NEEDS_ATTENTION":
            stats.needsAttention++;
            break;
          case "SICK":
            stats.sickPlants++;
            break;
          default:
            // Unknown status plants are considered healthy
            stats.healthyPlants++;
        }
      }
    });

    return stats;
  };

  const getHealthStatusColor = (status) => {
    const colors = {
      HEALTHY: "success",
      NEEDS_ATTENTION: "warning",
      SICK: "error",
    };
    return colors[status] || "success"; // Default to success (healthy) if no status
  };

  const getHealthStatusLabel = (status) => {
    const labels = {
      HEALTHY: "SAUDÁVEL",
      NEEDS_ATTENTION: "PRECISA DE ATENÇÃO",
      SICK: "DOENTE",
    };
    return labels[status] || "SAUDÁVEL"; // Default to "SAUDÁVEL" if no status
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  const stats = calculateStats();

  return (
    <Box sx={{ p: 3 }}>
      {/* Farmer Profile */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar sx={{ width: 64, height: 64, bgcolor: "primary.main" }}>
            <Person sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h5">{user.name}</Typography>
            <Typography color="text.secondary">{user.email}</Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Projects Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Meus Projetos
        </Typography>
        <Fab
          color="primary"
          onClick={() => {
            setSelectedProjectId(null);
            setShowProjectModal(true);
          }}
        >
          <Add />
        </Fab>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : projectsList.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            bgcolor: "grey.100",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum projeto cadastrado
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedProjectId(null);
              setShowProjectModal(true);
            }}
          >
            Criar Novo Projeto
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projectsList.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {project.areaCoordinates && (
                  <Box
                    sx={{ height: 200, width: "100%", position: "relative" }}
                  >
                    <MapContainer
                      center={getProjectMapCenter(project)}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                      zoomControl={false}
                      dragging={false}
                      scrollWheelZoom={false}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      {project.areaCoordinates && (
                        <Polygon
                          positions={
                            typeof project.areaCoordinates === "string"
                              ? JSON.parse(project.areaCoordinates)
                              : project.areaCoordinates
                          }
                          pathOptions={{
                            color: "#4CAF50",
                            fillColor: "#4CAF50",
                            fillOpacity: 0.2,
                          }}
                        />
                      )}
                    </MapContainer>
                    <IconButton
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        bgcolor: "background.paper",
                        "&:hover": { bgcolor: "background.paper" },
                      }}
                      onClick={() => {
                        setSelectedProjectId(project.id);
                        setShowProjectModal(true);
                      }}
                    >
                      <MapIcon />
                    </IconButton>
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" component="h2" gutterBottom>
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
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {project.description}
                  </Typography>
                  <Box sx={{ mt: "auto" }}>
                    <Typography variant="body2" color="text.secondary">
                      Início:{" "}
                      {format(new Date(project.startDate), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </Typography>
                    {project.endDate && (
                      <Typography variant="body2" color="text.secondary">
                        Término:{" "}
                        {format(new Date(project.endDate), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Plantas: {project._count?.locations || 0}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setShowProjectModal(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<LocalFlorist />}
            title="Total de Plantas"
            value={stats.totalPlants}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<LocalFlorist />}
            title="Plantas Saudáveis"
            value={stats.healthyPlants}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<LocalFlorist />}
            title="Precisam de Atenção"
            value={stats.needsAttention}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<LocalFlorist />}
            title="Plantas Doentes"
            value={stats.sickPlants}
            color="error.main"
          />
        </Grid>
      </Grid>

      {/* Plants Table */}
      <Paper sx={{ width: "100%", mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Espécie</TableCell>
                <TableCell>Localização</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Última Atualização</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plants
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((plant) => (
                  <TableRow key={plant.id}>
                    <TableCell>{plant.species}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOn color="action" fontSize="small" />
                        <Typography variant="body2">
                          {`${plant.latitude.toFixed(
                            6
                          )}, ${plant.longitude.toFixed(6)}`}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getHealthStatusLabel(
                          plant.updates?.[0]?.healthStatus
                        )}
                        color={getHealthStatusColor(
                          plant.updates?.[0]?.healthStatus
                        )}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {plant.updates?.[0]
                        ? format(
                            new Date(plant.updates[0].updateDate),
                            "dd/MM/yyyy HH:mm",
                            { locale: ptBR }
                          )
                        : "Sem atualizações"}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => setSelectedPlant(plant)}
                        >
                          <Timeline />
                        </IconButton>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={plants.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página"
        />
      </Paper>

      {/* Plant Updates Dialog */}
      {selectedPlant && (
        <Dialog
          open={Boolean(selectedPlant)}
          onClose={() => setSelectedPlant(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Histórico - {selectedPlant.species}</DialogTitle>
          <DialogContent>
            <PlantUpdates plantId={selectedPlant.id} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedPlant(null)}>Fechar</Button>
          </DialogActions>
        </Dialog>
      )}

      <ProjectModal
        open={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setSelectedProjectId(null);
        }}
        projectId={selectedProjectId}
        onUpdate={loadProjects}
      />
    </Box>
  );
};

export default FarmerDashboard;
