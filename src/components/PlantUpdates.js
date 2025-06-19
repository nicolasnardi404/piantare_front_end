import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Stack,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "../services/api";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Utility function to safely format dates
const formatDate = (dateString) => {
  try {
    const date =
      typeof dateString === "string"
        ? parseISO(dateString)
        : new Date(dateString);
    return format(date, "dd 'de' MMMM', às' HH:mm", { locale: ptBR });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Data inválida";
  }
};

const StyledTimelineContent = styled(TimelineContent)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderRadius: theme.spacing(1),
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const HealthStatusDot = ({ status }) => {
  const colors = {
    healthy: "success.main",
    needs_attention: "warning.main",
    sick: "error.main",
  };

  return (
    <TimelineDot sx={{ bgcolor: colors[status] }}>
      <MonitorHeartIcon />
    </TimelineDot>
  );
};

const StyledImageGallery = styled(Box)(({ theme }) => ({
  display: "flex",
  overflowX: "auto",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  "&::-webkit-scrollbar": {
    height: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "4px",
    "&:hover": {
      background: "#555",
    },
  },
}));

const StyledImageCard = styled(Card)(({ theme }) => ({
  minWidth: 280,
  maxWidth: 280,
  marginRight: theme.spacing(2),
  position: "relative",
  "&:last-child": {
    marginRight: 0,
  },
}));

const PlantUpdates = ({ plantId, onClose }) => {
  const [updates, setUpdates] = useState([]);
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [newUpdate, setNewUpdate] = useState({
    notes: "",
    health_status: "healthy",
    measurements: {
      height: "",
      width: "",
      additional_notes: "",
    },
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUpdates();
  }, [plantId]);

  const fetchUpdates = async () => {
    try {
      const response = await api.get(`/plant-updates/${plantId}/updates`);
      setUpdates(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching updates:", error);
      setError("Falha ao carregar atualizações");
      setLoading(false);
    }
  };

  const handleAddUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("notes", newUpdate.notes);
      formData.append("health_status", newUpdate.health_status);
      formData.append("measurements", JSON.stringify(newUpdate.measurements));
      if (newUpdate.image) {
        formData.append("image", newUpdate.image);
      }

      await api.post(`/plant-updates/${plantId}/updates`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsAddingUpdate(false);
      setNewUpdate({
        notes: "",
        health_status: "healthy",
        measurements: {
          height: "",
          width: "",
          additional_notes: "",
        },
        image: null,
      });
      fetchUpdates();
    } catch (error) {
      console.error("Error adding update:", error);
      setError("Falha ao adicionar atualização");
    }
  };

  const handleDeleteUpdate = async (updateId) => {
    try {
      await api.delete(`/plant-updates/updates/${updateId}`);
      fetchUpdates();
    } catch (error) {
      console.error("Error deleting update:", error);
      setError("Falha ao deletar atualização");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setNewUpdate((prev) => ({
      ...prev,
      image: file,
    }));
  };

  if (loading) {
    return <Typography>Carregando atualizações...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6">Histórico de Atualizações</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddingUpdate(true)}
        >
          Nova Atualização
        </Button>
      </Box>

      {/* Image Gallery */}
      {updates.length > 0 && updates.some((update) => update.imageUrl) && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Galeria de Imagens
          </Typography>
          <StyledImageGallery>
            {updates
              .filter((update) => update.imageUrl)
              .map((update) => (
                <StyledImageCard key={`gallery-${update.id}`}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={update.imageUrl}
                    alt={`Atualização de ${formatDate(
                      update.updateDate || update.update_date
                    )}`}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ py: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(update.updateDate || update.update_date)}
                    </Typography>
                  </CardContent>
                </StyledImageCard>
              ))}
          </StyledImageGallery>
        </Box>
      )}

      <Timeline position="alternate">
        {updates.map((update) => (
          <TimelineItem key={update.id}>
            <TimelineOppositeContent color="text.secondary">
              {formatDate(update.updateDate || update.update_date)}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <HealthStatusDot
                status={update.healthStatus || update.health_status}
              />
              <TimelineConnector />
            </TimelineSeparator>
            <StyledTimelineContent>
              <Card>
                {update.imageUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={update.imageUrl}
                    alt="Plant update"
                    sx={{ objectFit: "cover" }}
                  />
                )}
                <CardContent>
                  <Typography variant="body1">{update.notes}</Typography>
                  {update.measurements && (
                    <Box sx={{ mt: 1 }}>
                      {update.measurements.height && (
                        <Typography variant="body2">
                          Altura: {update.measurements.height}cm
                        </Typography>
                      )}
                      {update.measurements.width && (
                        <Typography variant="body2">
                          Largura: {update.measurements.width}cm
                        </Typography>
                      )}
                      {update.measurements.additional_notes && (
                        <Typography variant="body2" color="text.secondary">
                          {update.measurements.additional_notes}
                        </Typography>
                      )}
                    </Box>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteUpdate(update.id)}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </StyledTimelineContent>
          </TimelineItem>
        ))}
      </Timeline>

      <Dialog
        open={isAddingUpdate}
        onClose={() => setIsAddingUpdate(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Nova Atualização</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notas"
              value={newUpdate.notes}
              onChange={(e) =>
                setNewUpdate((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
            <FormControl fullWidth>
              <InputLabel>Estado da Planta</InputLabel>
              <Select
                value={newUpdate.health_status}
                label="Estado da Planta"
                onChange={(e) =>
                  setNewUpdate((prev) => ({
                    ...prev,
                    health_status: e.target.value,
                  }))
                }
              >
                <MenuItem value="healthy">Saudável</MenuItem>
                <MenuItem value="needs_attention">Precisa de Atenção</MenuItem>
                <MenuItem value="sick">Doente</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                type="number"
                label="Altura (cm)"
                value={newUpdate.measurements.height}
                onChange={(e) =>
                  setNewUpdate((prev) => ({
                    ...prev,
                    measurements: {
                      ...prev.measurements,
                      height: e.target.value,
                    },
                  }))
                }
              />
              <TextField
                type="number"
                label="Largura (cm)"
                value={newUpdate.measurements.width}
                onChange={(e) =>
                  setNewUpdate((prev) => ({
                    ...prev,
                    measurements: {
                      ...prev.measurements,
                      width: e.target.value,
                    },
                  }))
                }
              />
            </Box>
            <TextField
              fullWidth
              label="Observações Adicionais"
              value={newUpdate.measurements.additional_notes}
              onChange={(e) =>
                setNewUpdate((prev) => ({
                  ...prev,
                  measurements: {
                    ...prev.measurements,
                    additional_notes: e.target.value,
                  },
                }))
              }
            />
            <Button
              component="label"
              variant="outlined"
              startIcon={<ImageIcon />}
              sx={{ mt: 1 }}
            >
              Adicionar Foto
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {newUpdate.image && (
              <Typography variant="caption">
                Foto selecionada: {newUpdate.image.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddingUpdate(false)}>Cancelar</Button>
          <Button onClick={handleAddUpdate} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlantUpdates;
