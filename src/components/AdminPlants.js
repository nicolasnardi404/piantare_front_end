import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import api from "../services/api";

const PlantForm = ({ plant, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(
    plant || {
      nomePopular: "",
      nomeCientifico: "",
      categoria: "",
      descricao: "",
      altura: "",
      diametroCopa: "",
      origem: "",
      cicloVida: "",
      clima: "",
      solo: "",
      luminosidade: "",
      irrigacao: "",
      propagacao: "",
      podas: "",
      pragas: "",
      observacoes: "",
    }
  );

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/plants/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Nome Popular"
          name="nomePopular"
          value={formData.nomePopular}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Nome Científico"
          name="nomeCientifico"
          value={formData.nomeCientifico}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth>
          <InputLabel>Categoria</InputLabel>
          <Select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Descrição"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <TextField
          fullWidth
          label="Altura"
          name="altura"
          value={formData.altura}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Diâmetro da Copa"
          name="diametroCopa"
          value={formData.diametroCopa}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Origem"
          name="origem"
          value={formData.origem}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Ciclo de Vida"
          name="cicloVida"
          value={formData.cicloVida}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Clima"
          name="clima"
          value={formData.clima}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Solo"
          name="solo"
          value={formData.solo}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Luminosidade"
          name="luminosidade"
          value={formData.luminosidade}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Irrigação"
          name="irrigacao"
          value={formData.irrigacao}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Propagação"
          name="propagacao"
          value={formData.propagacao}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Podas"
          name="podas"
          value={formData.podas}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Pragas"
          name="pragas"
          value={formData.pragas}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Observações"
          name="observacoes"
          value={formData.observacoes}
          onChange={handleChange}
          multiline
          rows={3}
        />
      </Stack>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant="contained" color="primary">
          {plant ? "Atualizar" : "Criar"}
        </Button>
      </DialogActions>
    </form>
  );
};

const AdminPlants = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPlants, setTotalPlants] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const response = await api.get("/plants", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search,
          categoria: selectedCategory,
        },
      });
      setPlants(response.data.plants || []);
      setTotalPlants(response.data.total || 0);
      setError(null);
    } catch (error) {
      setError("Erro ao carregar plantas");
      console.error("Error fetching plants:", error);
      setPlants([]);
      setTotalPlants(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/plants/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    fetchPlants();
    fetchCategories();
  }, [page, rowsPerPage, search, selectedCategory]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreatePlant = async (plantData) => {
    try {
      await api.post("/plants", plantData);
      setAlertMessage({ type: "success", text: "Planta criada com sucesso!" });
      setOpenDialog(false);
      fetchPlants();
    } catch (error) {
      setAlertMessage({ type: "error", text: "Erro ao criar planta" });
    }
  };

  const handleUpdatePlant = async (plantData) => {
    try {
      await api.put(`/plants/${selectedPlant.id}`, plantData);
      setAlertMessage({
        type: "success",
        text: "Planta atualizada com sucesso!",
      });
      setOpenDialog(false);
      fetchPlants();
    } catch (error) {
      setAlertMessage({ type: "error", text: "Erro ao atualizar planta" });
    }
  };

  const handleDeletePlant = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta planta?")) {
      try {
        await api.delete(`/plants/${id}`);
        setAlertMessage({
          type: "success",
          text: "Planta removida com sucesso!",
        });
        fetchPlants();
      } catch (error) {
        setAlertMessage({ type: "error", text: "Erro ao remover planta" });
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Plantas
      </Typography>

      {alertMessage && (
        <Alert
          severity={alertMessage.type}
          onClose={() => setAlertMessage(null)}
          sx={{ mb: 2 }}
        >
          {alertMessage.text}
        </Alert>
      )}

      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <TextField
          label="Buscar"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Categoria</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Categoria"
          >
            <MenuItem value="">Todas</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedPlant(null);
            setOpenDialog(true);
          }}
        >
          Nova Planta
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome Popular</TableCell>
              <TableCell>Nome Científico</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plants.map((plant) => (
              <TableRow key={plant.id}>
                <TableCell>{plant.nomePopular}</TableCell>
                <TableCell>{plant.nomeCientifico}</TableCell>
                <TableCell>{plant.categoria}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedPlant(plant);
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeletePlant(plant.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalPlants}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPlant ? "Editar Planta" : "Nova Planta"}
        </DialogTitle>
        <DialogContent>
          <PlantForm
            plant={selectedPlant}
            onSubmit={selectedPlant ? handleUpdatePlant : handleCreatePlant}
            onClose={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminPlants;
