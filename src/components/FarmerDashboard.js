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
import { farmer, projects } from "../services/api";
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
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({ stats: {}, plants: [] });
  const [projectsList, setProjectsList] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [plantsTableData, setPlantsTableData] = useState([]);

  useEffect(() => {
    loadDashboardData();
    loadProjects();
    loadPlantsTable();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await farmer.getDashboardData();
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await projects.getList();
      setProjectsList(response.data);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const loadPlantsTable = async () => {
    try {
      const response = await farmer.getPlantsTable();
      setPlantsTableData(response.data);
    } catch (error) {
      console.error("Error loading plants table:", error);
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
      totalPlants: plantsTableData.length,
      healthyPlants: 0,
      needsAttention: 0,
      sickPlants: 0,
    };

    plantsTableData.forEach((plant) => {
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
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const { stats } = dashboardData;

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

      {/* Projects Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          mt: 6,
          width: "100%",
          px: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: 60,
              height: 4,
              backgroundColor: "primary.main",
              borderRadius: 2,
            },
          }}
        >
          Meus Projetos
        </Typography>
        <Fab
          color="primary"
          onClick={() => {
            setSelectedProjectId(null);
            setShowProjectModal(true);
          }}
          sx={{
            boxShadow: 4,
            "&:hover": {
              transform: "scale(1.05)",
              transition: "transform 0.2s",
            },
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
            bgcolor: "grey.50",
            borderRadius: 4,
            border: "1px dashed",
            borderColor: "grey.300",
            mx: 2,
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
            sx={{
              mt: 2,
              boxShadow: 2,
              "&:hover": {
                transform: "translateY(-2px)",
                transition: "transform 0.2s",
              },
            }}
          >
            Criar Novo Projeto
          </Button>
        </Box>
      ) : (
        <Grid
          container
          spacing={3}
          sx={{
            width: "100%",
            margin: 0,
            "& .MuiGrid-item": {
              padding: 2,
              width: "100%",
            },
          }}
        >
          {projectsList.map((project) => (
            <Grid
              item
              xs={12}
              key={project.id}
              sx={{
                width: "100%",
                "& .MuiCard-root": {
                  width: "100%",
                },
              }}
            >
              <Card
                sx={{
                  display: "flex",
                  position: "relative",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                  borderRadius: 2,
                  overflow: "hidden",
                  height: 280,
                  width: "100%",
                }}
              >
                {project.areaCoordinates && (
                  <Box
                    sx={{
                      width: "30%",
                      position: "relative",
                      "&:after": {
                        content: '""',
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: "40px",
                        background:
                          "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))",
                      },
                    }}
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
                        boxShadow: 2,
                        "&:hover": {
                          bgcolor: "background.paper",
                          transform: "scale(1.1)",
                        },
                        transition: "transform 0.2s",
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: project.areaCoordinates ? "70%" : "100%",
                    position: "relative",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h5"
                          component="h2"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            color: "text.primary",
                          }}
                        >
                          {project.name}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{
                            mb: 3,
                            lineHeight: 1.6,
                            maxWidth: "80%",
                          }}
                        >
                          {project.description}
                        </Typography>
                      </Box>
                      <Chip
                        label={getStatusLabel(project.status)}
                        color={getStatusColor(project.status)}
                        sx={{
                          fontWeight: 500,
                          boxShadow: 1,
                          px: 2,
                        }}
                      />
                    </Box>

                    <Grid container spacing={4} sx={{ mt: 1 }}>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={2}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Timeline fontSize="small" color="primary" />
                            Início:{" "}
                            {format(new Date(project.startDate), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </Typography>
                          {project.endDate && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Timeline fontSize="small" color="primary" />
                              Término:{" "}
                              {format(new Date(project.endDate), "dd/MM/yyyy", {
                                locale: ptBR,
                              })}
                            </Typography>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={2}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <LocalFlorist fontSize="small" color="primary" />
                            Total de Plantas:{" "}
                            {project._count?.plantedPlants || 0}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <LocationOn fontSize="small" color="primary" />
                            Área do Projeto
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions
                    sx={{
                      justifyContent: "flex-end",
                      p: 2,
                      bgcolor: "grey.50",
                      borderTop: 1,
                      borderColor: "grey.200",
                    }}
                  >
                    <Button
                      startIcon={<Edit />}
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setSelectedProjectId(project.id);
                        setShowProjectModal(true);
                      }}
                      sx={{
                        mr: 1,
                        "&:hover": {
                          transform: "translateY(-2px)",
                        },
                        transition: "transform 0.2s",
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      startIcon={<Delete />}
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteProject(project.id)}
                      sx={{
                        "&:hover": {
                          transform: "translateY(-2px)",
                        },
                        transition: "transform 0.2s",
                      }}
                    >
                      Excluir
                    </Button>
                  </CardActions>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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
              {plantsTableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((plant) => (
                  <TableRow key={plant.id}>
                    <TableCell>
                      {plant.species.commonName} ({plant.species.scientificName}
                      )
                    </TableCell>
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
                            new Date(plant.updates[0].createdAt),
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
          count={plantsTableData.length}
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
          <DialogTitle>
            Histórico - {selectedPlant.species.commonName}
          </DialogTitle>
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
