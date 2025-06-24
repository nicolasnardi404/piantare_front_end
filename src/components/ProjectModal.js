import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  Alert,
} from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapContainer, TileLayer, Polygon, LayersControl } from "react-leaflet";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "leaflet/dist/leaflet.css";
import { projects } from "../services/api";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import ProjectAreaMap from "./ProjectAreaMap";

// São Paulo coordinates as default center
const defaultPosition = [-23.5505, -46.6333];

const getMapCenter = (coordinates) => {
  if (!coordinates) return defaultPosition;

  try {
    const parsedCoords =
      typeof coordinates === "string" ? JSON.parse(coordinates) : coordinates;

    if (Array.isArray(parsedCoords) && parsedCoords.length > 0) {
      return parsedCoords[0];
    }
  } catch (error) {
    console.error("Error parsing coordinates for map center:", error);
  }

  return defaultPosition;
};

const ProjectModal = ({ open, onClose, projectId, onUpdate }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    } else {
      // New project
      setProject(null);
      setEditing(true);
      setEditedProject({
        name: "",
        description: "",
        status: "PLANNING",
        startDate: new Date().toISOString().split("T")[0],
        endDate: null,
        areaCoordinates: null,
      });
      setLoading(false);
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await projects.getById(projectId);
      setProject(response.data);
      setEditedProject(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching project details:", error);
      setError("Erro ao carregar detalhes do projeto");
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!editedProject.areaCoordinates) {
        setError("Por favor, defina a área do projeto no mapa");
        setLoading(false);
        return;
      }

      if (projectId) {
        await projects.update(projectId, editedProject);
      } else {
        await projects.create(editedProject);
      }
      onUpdate?.();
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
      setError("Erro ao salvar o projeto");
      setLoading(false);
    }
  };

  const handleAreaChange = (coordinates) => {
    console.log("New area coordinates:", coordinates);
    setEditedProject((prev) => ({
      ...prev,
      areaCoordinates: coordinates,
    }));
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

  const statusOptions = [
    { value: "PLANNING", label: "PLANEJAMENTO" },
    { value: "IN_PROGRESS", label: "EM ANDAMENTO" },
    { value: "COMPLETED", label: "CONCLUÍDO" },
    { value: "ON_HOLD", label: "EM ESPERA" },
    { value: "CANCELLED", label: "CANCELADO" },
  ];

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: "80vh",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {editing ? (
              <TextField
                fullWidth
                label="Nome do Projeto"
                value={editedProject?.name || ""}
                onChange={(e) =>
                  setEditedProject({ ...editedProject, name: e.target.value })
                }
                sx={{ mr: 2 }}
              />
            ) : (
              <Typography variant="h5" component="span">
                {project?.name}
              </Typography>
            )}
            {editing ? (
              <TextField
                select
                value={editedProject?.status || "PLANNING"}
                onChange={(e) =>
                  setEditedProject({ ...editedProject, status: e.target.value })
                }
                sx={{ minWidth: 150 }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={getStatusLabel(project?.status)}
                  color={getStatusColor(project?.status)}
                  size="small"
                />
                <IconButton size="small" onClick={() => setEditing(true)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        )}
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              {editing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Descrição"
                  value={editedProject?.description || ""}
                  onChange={(e) =>
                    setEditedProject({
                      ...editedProject,
                      description: e.target.value,
                    })
                  }
                />
              ) : (
                <Typography variant="body1" color="text.secondary" paragraph>
                  {project?.description}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              {editing ? (
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={ptBR}
                >
                  <DatePicker
                    label="Data de Início"
                    value={
                      editedProject?.startDate
                        ? new Date(editedProject.startDate)
                        : null
                    }
                    onChange={(newValue) =>
                      setEditedProject({
                        ...editedProject,
                        startDate: newValue?.toISOString().split("T")[0],
                      })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.secondary">
                    Data de Início
                  </Typography>
                  <Typography variant="body1">
                    {format(
                      new Date(project?.startDate),
                      "dd 'de' MMMM 'de' yyyy",
                      {
                        locale: ptBR,
                      }
                    )}
                  </Typography>
                </>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              {editing ? (
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={ptBR}
                >
                  <DatePicker
                    label="Data de Término"
                    value={
                      editedProject?.endDate
                        ? new Date(editedProject.endDate)
                        : null
                    }
                    onChange={(newValue) =>
                      setEditedProject({
                        ...editedProject,
                        endDate: newValue?.toISOString().split("T")[0],
                      })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                    minDate={
                      editedProject?.startDate
                        ? new Date(editedProject.startDate)
                        : null
                    }
                  />
                </LocalizationProvider>
              ) : (
                project?.endDate && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary">
                      Data de Término
                    </Typography>
                    <Typography variant="body1">
                      {format(
                        new Date(project.endDate),
                        "dd 'de' MMMM 'de' yyyy",
                        {
                          locale: ptBR,
                        }
                      )}
                    </Typography>
                  </>
                )
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Área do Projeto
              </Typography>
              <Box
                sx={{
                  height: 500,
                  width: "100%",
                  aspectRatio: "1/1",
                  maxWidth: 500,
                  margin: "0 auto",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {editing ? (
                  <ProjectAreaMap
                    initialArea={editedProject?.areaCoordinates}
                    onChange={handleAreaChange}
                  />
                ) : editedProject?.areaCoordinates ? (
                  <MapContainer
                    center={getMapCenter(editedProject.areaCoordinates)}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={false}
                    dragging={false}
                    scrollWheelZoom={false}
                  >
                    <LayersControl position="bottomright">
                      <LayersControl.BaseLayer checked name="Mapa">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      </LayersControl.BaseLayer>
                      <LayersControl.BaseLayer name="Satélite">
                        <TileLayer
                          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                          maxZoom={19}
                        />
                      </LayersControl.BaseLayer>
                    </LayersControl>
                    <Polygon
                      positions={
                        typeof editedProject.areaCoordinates === "string"
                          ? JSON.parse(editedProject.areaCoordinates)
                          : editedProject.areaCoordinates
                      }
                      pathOptions={{
                        color: "#4CAF50",
                        fillColor: "#4CAF50",
                        fillOpacity: 0.2,
                      }}
                    />
                  </MapContainer>
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "action.hover",
                    }}
                  >
                    <Typography color="text.secondary">
                      Nenhuma área definida
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            {!editing && (
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Plantas no Projeto
                </Typography>
                <Typography variant="h6">
                  {project?._count?.locations || 0} plantas
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {editing ? (
          <>
            <Button
              onClick={() => {
                if (projectId) {
                  setEditing(false);
                  setEditedProject(project);
                } else {
                  onClose();
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={loading || !editedProject?.areaCoordinates}
              startIcon={<SaveIcon />}
            >
              Salvar
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onClose}>Fechar</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setEditing(true)}
              startIcon={<EditIcon />}
            >
              Editar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProjectModal;
