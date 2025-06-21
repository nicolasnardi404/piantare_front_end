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
      commonName: "",
      scientificName: "",
      origin: "",
      height: "",
      specification: "",
      category: "",
    }
  );

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/plants/categories");
        // Ensure we're using the exact enum values from the backend
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

  const categoryLabels = {
    TREES: "Árvores",
    FRUIT_TREES: "Árvores Frutíferas",
    GRASSES: "Capins",
    TALL_FOLIAGE: "Folhagens Altas",
    SHRUBS: "Arbustos",
    CLIMBING_PLANTS: "Trepadeiras",
    AROMATIC_AND_EDIBLE: "Aromáticas e Comestíveis",
    GROUND_COVER: "Plantas de Forração",
    AQUATIC_OR_MARSH: "Plantas Aquáticas ou Palustres",
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Nome Popular"
          name="commonName"
          value={formData.commonName}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Nome Científico"
          name="scientificName"
          value={formData.scientificName}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth>
          <InputLabel>Categoria</InputLabel>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {categoryLabels[category] || category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Origem"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Altura"
          name="height"
          value={formData.height}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Especificações"
          name="specification"
          value={formData.specification}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Stack>
    </form>
  );
};

const AdminPlants = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const categoryLabels = {
    TREES: "Árvores",
    FRUIT_TREES: "Árvores Frutíferas",
    GRASSES: "Capins",
    TALL_FOLIAGE: "Folhagens Altas",
    SHRUBS: "Arbustos",
    CLIMBING_PLANTS: "Trepadeiras",
    AROMATIC_AND_EDIBLE: "Aromáticas e Comestíveis",
    GROUND_COVER: "Plantas de Forração",
    AQUATIC_OR_MARSH: "Plantas Aquáticas ou Palustres",
  };

  useEffect(() => {
    fetchPlants();
    fetchCategories();
  }, [page, rowsPerPage, search, selectedCategory]);

  const fetchPlants = async () => {
    try {
      const response = await api.get("/plants", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search,
          category: selectedCategory,
        },
      });
      setPlants(response.data.plants);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar plantas:", error);
      setError("Falha ao carregar plantas");
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
      setOpenDialog(false);
      fetchPlants();
    } catch (error) {
      console.error("Erro ao criar planta:", error);
      setError("Falha ao criar planta");
    }
  };

  const handleUpdatePlant = async (plantData) => {
    try {
      await api.put(`/plants/${selectedPlant.id}`, plantData);
      setOpenDialog(false);
      setSelectedPlant(null);
      fetchPlants();
    } catch (error) {
      console.error("Erro ao atualizar planta:", error);
      setError("Falha ao atualizar planta");
    }
  };

  const handleDeletePlant = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta planta?")) {
      try {
        await api.delete(`/plants/${id}`);
        fetchPlants();
      } catch (error) {
        console.error("Erro ao excluir planta:", error);
        setError("Falha ao excluir planta");
      }
    }
  };

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Categoria</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Categoria"
          >
            <MenuItem value="">Todas</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {categoryLabels[category] || category}
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
          Adicionar Planta
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
                <TableCell>{plant.commonName}</TableCell>
                <TableCell>{plant.scientificName}</TableCell>
                <TableCell>
                  {categoryLabels[plant.category] || plant.category}
                </TableCell>
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
        <TablePagination
          component="div"
          count={plants.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedPlant(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPlant ? "Editar Planta" : "Adicionar Nova Planta"}
        </DialogTitle>
        <DialogContent>
          <PlantForm
            plant={selectedPlant}
            onSubmit={selectedPlant ? handleUpdatePlant : handleCreatePlant}
            onClose={() => {
              setOpenDialog(false);
              setSelectedPlant(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminPlants;
