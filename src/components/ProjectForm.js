// import React, { useState } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Grid,
//   MenuItem,
//   Paper,
//   Alert,
// } from "@mui/material";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import ProjectAreaMap from "./ProjectAreaMap";
// import { ptBR } from "date-fns/locale";

// const ProjectForm = ({
//   initialData,
//   onSubmit,
//   isLoading = false,
//   error = null,
// }) => {
//   const [formData, setFormData] = useState({
//     name: initialData?.name || "",
//     description: initialData?.description || "",
//     status: initialData?.status || "PLANNING",
//     startDate: initialData?.startDate
//       ? new Date(initialData.startDate)
//       : new Date(),
//     endDate: initialData?.endDate ? new Date(initialData.endDate) : null,
//     areaCoordinates: initialData?.areaCoordinates || null,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleAreaChange = (coordinates) => {
//     console.log("New area coordinates:", coordinates);
//     setFormData((prev) => ({
//       ...prev,
//       areaCoordinates: coordinates,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <Paper
//       component="form"
//       onSubmit={handleSubmit}
//       sx={{
//         p: 3,
//         backgroundColor: "background.paper",
//         borderRadius: 2,
//       }}
//     >
//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {error}
//         </Alert>
//       )}

//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
//             Detalhes do Projeto
//           </Typography>
//         </Grid>

//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label="Nome do Projeto"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             variant="outlined"
//           />
//         </Grid>

//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label="Descrição"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             multiline
//             rows={4}
//             variant="outlined"
//           />
//         </Grid>

//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             select
//             label="Status"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             variant="outlined"
//           >
//             <MenuItem value="PLANNING">Planejamento</MenuItem>
//             <MenuItem value="IN_PROGRESS">Em Andamento</MenuItem>
//             <MenuItem value="COMPLETED">Concluído</MenuItem>
//             <MenuItem value="ON_HOLD">Em Espera</MenuItem>
//             <MenuItem value="CANCELLED">Cancelado</MenuItem>
//           </TextField>
//         </Grid>

//         <Grid item xs={12} sm={6}>
//           <LocalizationProvider
//             dateAdapter={AdapterDateFns}
//             adapterLocale={ptBR}
//           >
//             <DatePicker
//               label="Data de Início"
//               value={formData.startDate}
//               onChange={(newValue) =>
//                 setFormData((prev) => ({ ...prev, startDate: newValue }))
//               }
//               slotProps={{ textField: { fullWidth: true } }}
//             />
//           </LocalizationProvider>
//         </Grid>

//         <Grid item xs={12} sm={6}>
//           <LocalizationProvider
//             dateAdapter={AdapterDateFns}
//             adapterLocale={ptBR}
//           >
//             <DatePicker
//               label="Data de Término"
//               value={formData.endDate}
//               onChange={(newValue) =>
//                 setFormData((prev) => ({ ...prev, endDate: newValue }))
//               }
//               slotProps={{ textField: { fullWidth: true } }}
//               minDate={formData.startDate}
//             />
//           </LocalizationProvider>
//         </Grid>

//         <Grid item xs={12}>
//           <Typography variant="subtitle1" sx={{ mb: 2, color: "primary.main" }}>
//             Área do Projeto
//           </Typography>
//           <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//             Desenhe um polígono no mapa para definir a área do seu projeto. Isso
//             ajudará você a rastrear e gerenciar plantas dentro desta região
//             específica.
//           </Typography>
//           <Box
//             sx={{
//               height: 400,
//               width: "100%",
//               borderRadius: 2,
//               overflow: "hidden",
//             }}
//           >
//             <ProjectAreaMap
//               initialArea={formData.areaCoordinates}
//               onChange={handleAreaChange}
//             />
//           </Box>
//         </Grid>

//         <Grid item xs={12}>
//           <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               disabled={isLoading || !formData.areaCoordinates}
//               sx={{
//                 px: 4,
//                 py: 1.5,
//                 borderRadius: 2,
//                 textTransform: "none",
//                 fontSize: "1rem",
//               }}
//             >
//               {isLoading
//                 ? "Salvando..."
//                 : initialData?.id
//                 ? "Atualizar Projeto"
//                 : "Criar Projeto"}
//             </Button>
//             <Button
//               variant="outlined"
//               color="primary"
//               onClick={() => window.history.back()}
//               sx={{
//                 px: 4,
//                 py: 1.5,
//                 borderRadius: 2,
//                 textTransform: "none",
//                 fontSize: "1rem",
//               }}
//             >
//               Cancelar
//             </Button>
//           </Box>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// };

// export default ProjectForm;
