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
      category: "",
      description: "",
      height: "",
      crownDiameter: "",
      origin: "",
      lifeCycle: "",
      climate: "",
      soil: "",
      lighting: "",
      irrigation: "",
      propagation: "",
      pruning: "",
      pests: "",
      observations: "",
    }
  );

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/plants/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
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
          label="Common Name"
          name="commonName"
          value={formData.commonName}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Scientific Name"
          name="scientificName"
          value={formData.scientificName}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={formData.category}
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
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <TextField
          fullWidth
          label="Height"
          name="height"
          value={formData.height}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Crown Diameter"
          name="crownDiameter"
          value={formData.crownDiameter}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Origin"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Life Cycle"
          name="lifeCycle"
          value={formData.lifeCycle}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Climate"
          name="climate"
          value={formData.climate}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Soil"
          name="soil"
          value={formData.soil}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Lighting"
          name="lighting"
          value={formData.lighting}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Irrigation"
          name="irrigation"
          value={formData.irrigation}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Propagation"
          name="propagation"
          value={formData.propagation}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Pruning"
          name="pruning"
          value={formData.pruning}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Pests"
          name="pests"
          value={formData.pests}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Observations"
          name="observations"
          value={formData.observations}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
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
      console.error("Error fetching plants:", error);
      setError("Failed to fetch plants");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/plants/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
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
      console.error("Error creating plant:", error);
      setError("Failed to create plant");
    }
  };

  const handleUpdatePlant = async (plantData) => {
    try {
      await api.put(`/plants/${selectedPlant.id}`, plantData);
      setOpenDialog(false);
      setSelectedPlant(null);
      fetchPlants();
    } catch (error) {
      console.error("Error updating plant:", error);
      setError("Failed to update plant");
    }
  };

  const handleDeletePlant = async (id) => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      try {
        await api.delete(`/plants/${id}`);
        fetchPlants();
      } catch (error) {
        console.error("Error deleting plant:", error);
        setError("Failed to delete plant");
      }
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All</MenuItem>
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
          Add Plant
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Common Name</TableCell>
              <TableCell>Scientific Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plants.map((plant) => (
              <TableRow key={plant.id}>
                <TableCell>{plant.commonName}</TableCell>
                <TableCell>{plant.scientificName}</TableCell>
                <TableCell>{plant.category}</TableCell>
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
          {selectedPlant ? "Edit Plant" : "Add New Plant"}
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
