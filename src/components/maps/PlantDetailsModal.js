import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Update as UpdateIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const GrowthChart = ({ updates }) => {
  const chartData = updates
    .slice()
    .reverse()
    .map((update) => ({
      date: new Date(
        update.updateDate || update.createdAt
      ).toLocaleDateString(),
      height: parseFloat(update.height),
      diameter: parseFloat(update.diameter),
    }));

  return (
    <Box sx={{ width: "100%", height: 300, mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
        Crescimento da Planta
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis unit="m" />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "8px",
              border: "1px solid rgba(76, 175, 80, 0.2)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="height"
            name="Altura (m)"
            stroke="#4caf50"
            strokeWidth={2}
            dot={{ fill: "#4caf50" }}
          />
          <Line
            type="monotone"
            dataKey="diameter"
            name="Diâmetro (m)"
            stroke="#81c784"
            strokeWidth={2}
            dot={{ fill: "#81c784" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

// Add this helper function for date formatting
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const PlantDetailsModal = ({
  open,
  onClose,
  selectedPlant,
  user,
  onDelete,
  onUpdate,
}) => {
  if (!selectedPlant) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "90vw",
          maxWidth: "1000px",
          minHeight: "80vh",
          borderRadius: "20px",
        },
      }}
    >
      <DialogTitle>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: 600, color: "primary.main" }}
        >
          {selectedPlant?.species?.commonName}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
          {selectedPlant?.species?.scientificName}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          {selectedPlant?.updates && selectedPlant.updates.length > 0 && (
            <Box
              component="img"
              src={selectedPlant.updates[0].imageUrl}
              alt="Plant"
              sx={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: "16px",
                mb: 3,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            />
          )}

          {/* Project Information */}
          <Box
            sx={{
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(76, 175, 80, 0.1)",
              p: 3,
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
            >
              Informações do Projeto
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Nome do Projeto
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedPlant?.project?.name}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Status do Projeto
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedPlant?.project?.status === "IN_PROGRESS"
                      ? "Em Andamento"
                      : selectedPlant?.project?.status === "COMPLETED"
                      ? "Concluído"
                      : selectedPlant?.project?.status === "PLANNING"
                      ? "Em Planejamento"
                      : selectedPlant?.project?.status === "ON_HOLD"
                      ? "Em Espera"
                      : "Cancelado"}
                  </Typography>
                </Box>
              </Grid>
              {selectedPlant?.project?.description && (
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Descrição do Projeto
                    </Typography>
                    <Typography variant="body1">
                      {selectedPlant?.project?.description}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Current Status Section */}
          <Box
            sx={{
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(76, 175, 80, 0.1)",
              p: 3,
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
            >
              Status Atual
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Estado de Saúde
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color:
                        selectedPlant?.updates &&
                        selectedPlant.updates.length > 0
                          ? selectedPlant.updates[0].healthStatus === "HEALTHY"
                            ? "#4caf50"
                            : selectedPlant.updates[0].healthStatus ===
                              "NEEDS_ATTENTION"
                            ? "#ff9800"
                            : "#f44336"
                          : "#4caf50",
                      fontWeight: 600,
                    }}
                  >
                    {selectedPlant?.updates && selectedPlant.updates.length > 0
                      ? selectedPlant.updates[0].healthStatus === "HEALTHY"
                        ? "Saudável"
                        : selectedPlant.updates[0].healthStatus ===
                          "NEEDS_ATTENTION"
                        ? "Precisa de Atenção"
                        : "Doente"
                      : "Saudável"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Dimensões Atuais
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedPlant?.updates && selectedPlant.updates.length > 0
                      ? `${selectedPlant.updates[0].height}m x ${selectedPlant.updates[0].diameter}m`
                      : "Não informado"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Data de plantio:{" "}
                    {formatDate(
                      selectedPlant?.plantedAt || selectedPlant?.createdAt
                    )}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Growth Chart Section */}
          {selectedPlant?.updates && selectedPlant.updates.length > 0 && (
            <Box
              sx={{
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(76, 175, 80, 0.1)",
                p: 3,
                mb: 3,
              }}
            >
              <GrowthChart updates={selectedPlant.updates} />
            </Box>
          )}

          {/* Updates Timeline */}
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h6"
              sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
            >
              Histórico de Atualizações
            </Typography>
            {selectedPlant?.updates && selectedPlant.updates.length > 0 ? (
              <Box sx={{ position: "relative" }}>
                {/* Timeline line */}
                <Box
                  sx={{
                    position: "absolute",
                    left: "16px",
                    top: 0,
                    bottom: 0,
                    width: "2px",
                    background: "rgba(76, 175, 80, 0.2)",
                    zIndex: 0,
                  }}
                />
                {selectedPlant.updates.map((update, index) => (
                  <Box
                    key={update.id}
                    sx={{
                      position: "relative",
                      mb: index !== selectedPlant.updates.length - 1 ? 4 : 0,
                      ml: 5,
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: "-24px",
                        top: "24px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor:
                          update.healthStatus === "HEALTHY"
                            ? "#4caf50"
                            : update.healthStatus === "NEEDS_ATTENTION"
                            ? "#ff9800"
                            : "#f44336",
                        border: "3px solid white",
                        boxShadow: "0 0 0 2px rgba(76, 175, 80, 0.2)",
                        zIndex: 1,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        background: "white",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                        border: "1px solid rgba(76, 175, 80, 0.1)",
                      }}
                    >
                      <Box sx={{ p: 3 }}>
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
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: "primary.main",
                                mb: 0.5,
                              }}
                            >
                              {update.healthStatus === "HEALTHY"
                                ? "Saudável"
                                : update.healthStatus === "NEEDS_ATTENTION"
                                ? "Precisa de Atenção"
                                : "Doente"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Atualização em{" "}
                              {formatDate(
                                update.updateDate || update.createdAt
                              )}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Measurements Section */}
                        <Box
                          sx={{
                            mb: 2,
                            display: "flex",
                            gap: 4,
                            backgroundColor: "rgba(76, 175, 80, 0.05)",
                            p: 2,
                            borderRadius: "12px",
                          }}
                        >
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Altura
                            </Typography>
                            <Typography variant="subtitle2" fontWeight="600">
                              {update.height}m
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Diâmetro
                            </Typography>
                            <Typography variant="subtitle2" fontWeight="600">
                              {update.diameter}m
                            </Typography>
                          </Box>
                        </Box>

                        {update.notes && (
                          <Typography
                            sx={{
                              color: "text.secondary",
                              fontStyle: "italic",
                              mb: 2,
                            }}
                          >
                            "{update.notes}"
                          </Typography>
                        )}

                        {update.imageUrl && (
                          <Box
                            sx={{
                              borderRadius: "12px",
                              overflow: "hidden",
                              maxWidth: "600px",
                              margin: "0 auto",
                            }}
                          >
                            <Box
                              component="img"
                              src={update.imageUrl}
                              alt={`Update on ${formatDate(
                                update.updateDate || update.createdAt
                              )}`}
                              sx={{
                                width: "100%",
                                height: "300px",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography
                sx={{
                  textAlign: "center",
                  color: "text.secondary",
                  py: 3,
                }}
              >
                Nenhuma atualização registrada
              </Typography>
            )}
          </Box>

          {/* Species Information */}
          <Box
            sx={{
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(76, 175, 80, 0.1)",
              p: 3,
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
            >
              Informações da Espécie
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Nome Popular
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedPlant?.species?.commonName}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Nome Científico
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, fontStyle: "italic" }}
                  >
                    {selectedPlant?.species?.scientificName}
                  </Typography>
                </Box>
              </Grid>
              {selectedPlant?.species?.origin && (
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Origem
                    </Typography>
                    <Typography variant="body1">
                      {selectedPlant?.species?.origin}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {selectedPlant?.species?.height && (
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Altura Esperada
                    </Typography>
                    <Typography variant="body1">
                      {selectedPlant?.species?.height}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {selectedPlant?.species?.specification && (
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Especificação
                    </Typography>
                    <Typography variant="body1">
                      {selectedPlant?.species?.specification}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        {(user?.role === "ADMIN" ||
          (user?.role === "FARMER" &&
            selectedPlant?.project?.farmer?.user?.id === user?.userId)) && (
          <>
            <Button
              onClick={() => onDelete(selectedPlant.id)}
              color="error"
              startIcon={<DeleteIcon />}
            >
              Excluir
            </Button>
            {user?.role === "FARMER" && (
              <Button
                onClick={() => onUpdate(selectedPlant)}
                color="primary"
                startIcon={<UpdateIcon />}
              >
                Atualizar
              </Button>
            )}
          </>
        )}
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlantDetailsModal;
