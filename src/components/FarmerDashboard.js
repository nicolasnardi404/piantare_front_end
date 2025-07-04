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
  Tooltip,
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
  KeyboardArrowDown,
} from "@mui/icons-material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "../context/AuthContext";
import { farmer, projects } from "../services/api";
import PlantUpdates from "./PlantUpdates";
import { useNavigate } from "react-router-dom";

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
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalPlants: 0,
      healthyPlants: 0,
      needsAttention: 0,
      sickPlants: 0,
    },
    projects: [],
  });
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await farmer.getDashboardComplete();
      console.log("Dashboard response:", response.data); // Debug log

      // Ensure we have the correct structure
      const data = response.data || {};
      setDashboardData({
        stats: data.stats || {
          totalPlants: 0,
          healthyPlants: 0,
          needsAttention: 0,
          sickPlants: 0,
        },
        projects: data.projects || [],
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Set default data on error
      setDashboardData({
        stats: {
          totalPlants: 0,
          healthyPlants: 0,
          needsAttention: 0,
          sickPlants: 0,
        },
        projects: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Tem certeza que deseja excluir este projeto?")) {
      try {
        await projects.delete(projectId);
        loadDashboardData(); // Reload all data after deletion
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
            value={stats.totalPlants || 0}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<LocalFlorist />}
            title="Plantas Saudáveis"
            value={stats.healthyPlants || 0}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<LocalFlorist />}
            title="Precisam de Atenção"
            value={stats.needsAttention || 0}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<LocalFlorist />}
            title="Plantas Doentes"
            value={stats.sickPlants || 0}
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
          onClick={() => navigate("/add-project")}
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

      {dashboardData.projects.length === 0 ? (
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
            onClick={() => navigate("/add-project")}
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
          {dashboardData.projects.map((project) => (
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
                  flexDirection: "column",
                  position: "relative",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                  borderRadius: 2,
                  overflow: "hidden",
                  mb: 2,
                }}
              >
                <Box
                  onClick={() =>
                    setExpandedProject(
                      expandedProject === project.id ? null : project.id
                    )
                  }
                  sx={{
                    display: "flex",
                    cursor: "pointer",
                    height: 280,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
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
                      {project.mapImageUrl ? (
                        <Box
                          sx={{
                            height: "100%",
                            width: "100%",
                            position: "relative",
                            overflow: "hidden",
                            "& img": {
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            },
                          }}
                        >
                          <img
                            src={project.mapImageUrl}
                            alt={`Área do projeto ${project.name}`}
                          />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            height: "100%",
                            width: "100%",
                            position: "relative",
                            overflow: "hidden",
                            "& img": {
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            },
                          }}
                        >
                          <img
                            src="https://via.placeholder.com/150" // Placeholder for map image
                            alt="Área do projeto"
                          />
                        </Box>
                      )}
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
                          zIndex: 1,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProjectId(project.id);
                          // setShowProjectModal(true); // Removed as per edit hint
                        }}
                      >
                        {project.mapImageUrl ? <Edit /> : <MapIcon />}
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
                              {format(
                                new Date(project.startDate),
                                "dd/MM/yyyy",
                                {
                                  locale: ptBR,
                                }
                              )}
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
                                {format(
                                  new Date(project.endDate),
                                  "dd/MM/yyyy",
                                  {
                                    locale: ptBR,
                                  }
                                )}
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
                              {project.plantGroups?.reduce(
                                (total, group) =>
                                  total + (group._count?.plantedPlants || 0),
                                0
                              ) || 0}
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
                        justifyContent: "space-between",
                        p: 2,
                        bgcolor: "grey.50",
                        borderTop: 1,
                        borderColor: "grey.200",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedProject(
                              expandedProject === project.id ? null : project.id
                            );
                          }}
                          sx={{
                            transform:
                              expandedProject === project.id
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            transition: "transform 0.2s",
                          }}
                        >
                          <KeyboardArrowDown />
                        </IconButton>
                        <Typography variant="body2" color="text.secondary">
                          {expandedProject === project.id
                            ? "Recolher grupos"
                            : `Ver ${
                                project.plantGroups?.length || 0
                              } grupos de plantas`}
                        </Typography>
                      </Box>
                      <Box>
                        <Button
                          startIcon={<Edit />}
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProjectId(project.id);
                            // setShowProjectModal(true); // Removed as per edit hint
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                          sx={{
                            "&:hover": {
                              transform: "translateY(-2px)",
                            },
                            transition: "transform 0.2s",
                          }}
                        >
                          Excluir
                        </Button>
                        <Button
                          startIcon={<Add />}
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/add-plant-group/${project.id}`);
                          }}
                          sx={{
                            mr: 1,
                            "&:hover": {
                              transform: "translateY(-2px)",
                            },
                            transition: "transform 0.2s",
                          }}
                        >
                          Novo Grupo
                        </Button>
                      </Box>
                    </CardActions>
                  </Box>
                </Box>
                {expandedProject === project.id && (
                  <Box sx={{ p: 2, bgcolor: "grey.50" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        Grupos de Plantas
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total: {project.plantGroups?.length || 0} grupos
                      </Typography>
                    </Box>
                    <TableContainer
                      component={Paper}
                      sx={{ boxShadow: "none", bgcolor: "background.paper" }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Espécie</TableCell>
                            <TableCell>Quantidade</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Ações</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {project.plantGroups?.map((group) => (
                            <TableRow key={group.id} hover>
                              <TableCell>
                                {group.species?.commonName ||
                                  "Espécie não especificada"}
                              </TableCell>
                              <TableCell>
                                {group._count?.plantedPlants || 0} plantas
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={getStatusLabel(project.status)}
                                  color={getStatusColor(project.status)}
                                  size="small"
                                  sx={{ minWidth: 100 }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  justifyContent="flex-end"
                                >
                                  <Tooltip title="Ver no mapa">
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setSelectedProjectId(project.id);
                                        // setShowProjectModal(true); // Removed as per edit hint
                                      }}
                                    >
                                      <MapIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Adicionar plantas">
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setSelectedProjectId(project.id);
                                        // setShowProjectModal(true); // Removed as per edit hint
                                        // setInitialTab("tree-planting"); // Removed as per edit hint
                                      }}
                                    >
                                      <Add fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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

      {/* ProjectModal component removed as per edit hint */}
    </Box>
  );
};

export default FarmerDashboard;
