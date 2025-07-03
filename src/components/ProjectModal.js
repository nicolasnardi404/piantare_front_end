import React, { useState, useEffect, useRef } from "react";
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
  Tabs,
  Tab,
} from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapContainer, TileLayer, Polygon, LayersControl } from "react-leaflet";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "leaflet/dist/leaflet.css";
import { projects, uploads } from "../services/api";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Camera as CameraIcon,
  Delete as DeleteIcon,
  InfoOutlined,
  LocalFlorist,
} from "@mui/icons-material";
import ProjectAreaMap from "./ProjectAreaMap";
import html2canvas from "html2canvas";
import L from "leaflet";
import TreePlanting from "./TreePlanting";

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

const ProjectModal = ({ open, onClose, projectId, onUpdate, initialTab }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedProject, setEditedProject] = useState(null);
  const [error, setError] = useState(null);
  const [capturedMap, setCapturedMap] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  useEffect(() => {
    // Set the initial tab when the modal opens
    if (open && initialTab) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

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

  const handleMapInstance = (map) => {
    console.log("Map instance received:", map);
    mapInstanceRef.current = map;
  };

  const captureMap = async () => {
    try {
      const mapContainerElement =
        mapRef.current?.querySelector(".leaflet-container");
      if (!mapContainerElement) {
        console.error("Map element not found");
        return null;
      }

      // Hide all controls before capture
      const controls = mapContainerElement.querySelectorAll(
        ".leaflet-control-container, .leaflet-draw"
      );
      const hiddenElements = [];
      controls.forEach((element) => {
        if (element.style.display !== "none") {
          hiddenElements.push({
            element,
            display: element.style.display,
          });
          element.style.display = "none";
        }
      });

      try {
        // Create canvas with the map's dimensions
        const canvas = await html2canvas(mapContainerElement, {
          useCORS: true,
          allowTaint: true,
          logging: false,
          scale: 1,
        });

        // Convert canvas to blob
        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            if (!blob) {
              console.error("Failed to create blob from canvas");
              resolve(null);
              return;
            }
            resolve(blob);
          }, "image/png");
        });
      } finally {
        // Restore visibility of controls
        hiddenElements.forEach(({ element, display }) => {
          element.style.display = display;
        });
      }
    } catch (error) {
      console.error("Error capturing map:", error);
      return null;
    }
  };

  const handleAreaChange = async (coordinates) => {
    console.log("Area drawing completed with coordinates:", coordinates);

    // Update coordinates
    setEditedProject((prev) => ({
      ...prev,
      areaCoordinates: coordinates,
    }));

    // Wait a bit for the map to settle after drawing
    setTimeout(async () => {
      console.log("Starting map capture after delay");
      const blob = await captureMap();
      if (blob) {
        console.log("Map captured successfully, storing blob");
        setCapturedMap(blob);
      }
    }, 500);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!editedProject.areaCoordinates) {
        setError("Por favor, defina a área do projeto no mapa");
        setLoading(false);
        return;
      }

      console.log("Preparing project data for save...");

      let mapImageUrl = null;

      // If we have a captured map, upload it first
      if (capturedMap) {
        try {
          console.log("Uploading captured map...");
          const file = new File([capturedMap], "map.png", {
            type: "image/png",
          });
          const formData = new FormData();
          formData.append("file", file);

          const response = await uploads.uploadFile(formData);
          console.log("Map upload successful:", response.data);
          mapImageUrl = response.data.url;
        } catch (error) {
          console.error("Error uploading map:", error);
          setError("Erro ao fazer upload do mapa");
          setLoading(false);
          return;
        }
      }

      // Create project data
      const projectData = {
        name: editedProject.name,
        description: editedProject.description,
        status: editedProject.status,
        startDate: editedProject.startDate,
        endDate: editedProject.endDate,
        areaCoordinates: editedProject.areaCoordinates,
        mapImageUrl: mapImageUrl,
      };

      console.log("Saving project with data:", projectData);

      // Save the project
      if (projectId) {
        await projects.update(projectId, projectData);
        console.log("Project updated successfully");
      } else {
        await projects.create(projectData);
        console.log("Project created successfully");
      }
      onUpdate?.();
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
      setError("Erro ao salvar o projeto");
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
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: "80vh",
        },
      }}
    >
      <DialogTitle>{projectId ? "Project Details" : "New Project"}</DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            {!project && (
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
                >
                  <Tab
                    label="Detalhes"
                    value="details"
                    icon={<InfoOutlined />}
                    iconPosition="start"
                  />
                  <Tab
                    label="Plantio de Árvores"
                    value="tree-planting"
                    icon={<LocalFlorist />}
                    iconPosition="start"
                  />
                </Tabs>
              </Box>
            )}

            {project && activeTab === "details" && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Descrição"
                      value={project?.description || ""}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          description: e.target.value,
                        })
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={ptBR}
                    >
                      <DatePicker
                        label="Data de Início"
                        value={
                          project?.startDate
                            ? new Date(project.startDate)
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
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={ptBR}
                    >
                      <DatePicker
                        label="Data de Término"
                        value={
                          project?.endDate ? new Date(project.endDate) : null
                        }
                        onChange={(newValue) =>
                          setEditedProject({
                            ...editedProject,
                            endDate: newValue?.toISOString().split("T")[0],
                          })
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                        minDate={
                          project?.startDate
                            ? new Date(project.startDate)
                            : null
                        }
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        Área do Projeto
                      </Typography>
                    </Box>

                    {/* Map preview if captured */}
                    {capturedMap && (
                      <Box sx={{ mb: 2, position: "relative" }}>
                        <img
                          src={URL.createObjectURL(capturedMap)}
                          alt="Mapa capturado"
                          style={{
                            width: "100%",
                            maxWidth: 500,
                            height: "auto",
                            borderRadius: 8,
                            display: "block",
                            margin: "0 auto",
                          }}
                        />
                        <IconButton
                          onClick={() => setCapturedMap(null)}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "background.paper",
                            "&:hover": {
                              bgcolor: "action.hover",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}

                    {/* Original map box */}
                    <Box
                      ref={mapRef}
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
                      {project?.areaCoordinates ? (
                        <MapContainer
                          center={getMapCenter(project.areaCoordinates)}
                          zoom={13}
                          style={{ height: "100%", width: "100%" }}
                          zoomControl={true}
                          dragging={true}
                          scrollWheelZoom={true}
                          ref={mapInstanceRef}
                        >
                          <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            maxZoom={19}
                          />
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

                  {!project && (
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

                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                  Project Area
                </Typography>
                <Box ref={mapRef} sx={{ height: 400, width: "100%" }}>
                  <ProjectAreaMap
                    coordinates={project.areaCoordinates}
                    onMapInstance={handleMapInstance}
                  />
                </Box>
              </Box>
            )}

            {!project && project && activeTab === "tree-planting" && (
              <Box>
                <TreePlanting
                  projectId={project.id}
                  mapRef={mapInstanceRef}
                  onPlantingComplete={() => {
                    // Optionally refresh project data
                    fetchProjectDetails();
                  }}
                />
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {!project && (
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        )}
        {!project && project && (
          <Button
            startIcon={<EditIcon />}
            onClick={() => setActiveTab("details")}
            color="primary"
          >
            Edit
          </Button>
        )}
        {!project && project && (
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProjectModal;
