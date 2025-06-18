import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
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
} from "@mui/material";
import {
  Person,
  LocalFlorist,
  Timeline,
  LocationOn,
  Edit,
  Add,
} from "@mui/icons-material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import PlantUpdates from "./PlantUpdates";

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
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlants();
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
    </Box>
  );
};

export default FarmerDashboard;
