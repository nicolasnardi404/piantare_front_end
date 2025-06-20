import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { users, plantLocations, companies } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Users = ({ translations }) => {
  const { user: currentUser } = useAuth();
  const [userList, setUserList] = useState([]);
  const [plantsList, setPlantsList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 0 for farmers, 1 for companies, 2 for plants
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    companyName: "",
  });
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  useEffect(() => {
    loadUsers();
    loadPlants();
    loadCompanies();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await users.getAll();
      setUserList(response.data);
    } catch (err) {
      setError("Falha ao carregar usuários");
    }
  };

  const loadPlants = async () => {
    try {
      const response = await plantLocations.getAll();
      setPlantsList(response.data);
    } catch (err) {
      setError("Falha ao carregar plantas");
    }
  };

  const loadCompanies = async () => {
    try {
      const response = await companies.getAll();
      setCompanyList(response.data);
    } catch (err) {
      setError("Falha ao carregar empresas");
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setIsEditMode(true);
      setSelectedUser(user);
      setFormData({
        email: user.email,
        password: "",
        name: user.name,
        companyName: user.role === "COMPANY" ? user.company?.name || "" : "",
      });
    } else {
      setIsEditMode(false);
      setSelectedUser(null);
      setFormData({
        email: "",
        password: "",
        name: "",
        companyName: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({
      email: "",
      password: "",
      name: "",
      companyName: "",
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isEditMode && !formData.password) {
        setError("Senha é obrigatória para novos usuários");
        return;
      }

      const submitData = { ...formData };
      const isCompany = activeTab === 1;

      if (isCompany && !submitData.companyName) {
        setError("Nome da empresa é obrigatório");
        return;
      }

      // Add role based on active tab
      submitData.role = isCompany ? "COMPANY" : "FARMER";

      if (isEditMode) {
        if (!submitData.password) {
          delete submitData.password;
        }
        delete submitData.companyName; // Remove companyName as it's not needed for updates
        await users.update(selectedUser.id, submitData);
      } else {
        await users.create(submitData);
      }

      handleCloseDialog();
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Falha ao salvar usuário");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await users.delete(id);
        loadUsers();
      } catch (err) {
        setError("Falha ao excluir usuário");
      }
    }
  };

  const handleAssignCompany = async (plantId) => {
    try {
      if (!selectedCompanyId) {
        setError("Por favor, selecione uma empresa");
        return;
      }

      await plantLocations.assignCompany(plantId, {
        companyId: selectedCompanyId,
      });
      loadPlants();
      setSelectedCompanyId("");
      setError("");
    } catch (err) {
      setError("Falha ao atribuir empresa à planta");
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setFormData({
      email: "",
      password: "",
      name: "",
      companyName: "",
    });
    setError("");
  };

  const filteredUsers = userList.filter((user) =>
    activeTab === 0 ? user.role === "FARMER" : user.role === "COMPANY"
  );

  if (currentUser?.role !== "ADMIN") {
    return <div>Acesso negado</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 0: // Farmers
      case 1: // Companies
        return (
          <>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography variant="h4">
                {activeTab === 0
                  ? translations.farmers
                  : translations.companies}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Adicionar{" "}
                {activeTab === 0
                  ? translations.farmers
                  : translations.companies}
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Email</TableCell>
                    {activeTab === 1 && <TableCell>Nome da Empresa</TableCell>}
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      {activeTab === 1 && (
                        <TableCell>{user.company?.name}</TableCell>
                      )}
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(user)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );
      case 2: // Plants
        return (
          <>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Todas as Plantas
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Espécie</TableCell>
                    <TableCell>Adicionado Por</TableCell>
                    <TableCell>Empresa</TableCell>
                    <TableCell>Localização</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plantsList.map((plant) => (
                    <TableRow key={plant.id}>
                      <TableCell>{plant.species}</TableCell>
                      <TableCell>{plant.addedBy?.name}</TableCell>
                      <TableCell>
                        {plant.company ? (
                          plant.company.name
                        ) : (
                          <Typography color="text.secondary">
                            Não atribuída
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {plant.latitude.toFixed(6)},{" "}
                        {plant.longitude.toFixed(6)}
                      </TableCell>
                      <TableCell>
                        {!plant.company && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setSelectedCompanyId("");
                              setSelectedUser(plant);
                              setIsDialogOpen(true);
                            }}
                          >
                            Atribuir Empresa
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Dialog
              open={isDialogOpen && activeTab === 2}
              onClose={() => {
                setIsDialogOpen(false);
                setSelectedCompanyId("");
              }}
            >
              <DialogTitle>Atribuir Planta à Empresa</DialogTitle>
              <DialogContent>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Selecionar Empresa</InputLabel>
                  <Select
                    value={selectedCompanyId}
                    label="Selecionar Empresa"
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                  >
                    {companyList.map((company) => (
                      <MenuItem key={company.id} value={company.id}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedCompanyId("");
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleAssignCompany(selectedUser?.id)}
                  variant="contained"
                  color="primary"
                >
                  Atribuir
                </Button>
              </DialogActions>
            </Dialog>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label={translations.farmers} />
          <Tab label={translations.companies} />
          <Tab label={translations.plants} />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {renderContent()}

      {/* User/Company Creation/Edit Dialog */}
      {activeTab !== 2 && (
        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>
            {isEditMode ? "Editar" : "Adicionar"}{" "}
            {activeTab === 0 ? translations.farmers : translations.companies}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Nome"
              fullWidth
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label={isEditMode ? "Nova Senha (opcional)" : "Senha"}
              type="password"
              fullWidth
              required={!isEditMode}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {activeTab === 1 && (
              <TextField
                margin="dense"
                label="Nome da Empresa"
                fullWidth
                required
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {isEditMode ? "Atualizar" : "Criar"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Users;
