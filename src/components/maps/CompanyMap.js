// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Grid,
//   Button,
//   CircularProgress,
//   Chip,
// } from "@mui/material";
// import {
//   LocationOn,
//   PictureAsPdf,
//   Autorenew as AutorenewIcon,
// } from "@mui/icons-material";
// import { format } from "date-fns";
// import { useAuth } from "../../context/AuthContext";
// import { plantLocations, geoGpt, plantUpdates } from "../../services/api";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import CompanyReport from "../CompanyReport";
// import BaseMap from "./BaseMap";
// import { Marker, Popup, Polygon } from "react-leaflet";
// import L from "leaflet";
// import PlantDetailsModal from "./PlantDetailsModal";

// const formatPlantCategory = (category) => {
//   const categoryMap = {
//     TREES: "Árvores",
//     FRUIT_TREES: "Árvores Frutíferas",
//     GRASSES: "Capins",
//     TALL_FOLIAGE: "Folhagens Altas",
//     SHRUBS: "Arbustos",
//     CLIMBING_PLANTS: "Trepadeiras",
//     AROMATIC_AND_EDIBLE: "Aromáticas e Comestíveis",
//     GROUND_COVER: "Plantas de Forração",
//     AQUATIC_OR_MARSH: "Plantas Aquáticas ou Palustres",
//   };

//   return categoryMap[category] || category;
// };

// const CompanyMap = () => {
//   const { user } = useAuth();
//   const [locations, setLocations] = useState([]);
//   const [selectedPlant, setSelectedPlant] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [companyStats, setCompanyStats] = useState({
//     totalPlants: 0,
//     plantsByCategory: {},
//     recentPlants: [],
//   });
//   const [geoAnalysis, setGeoAnalysis] = useState({
//     loading: false,
//     data: null,
//     error: null,
//   });
//   const [projectAreas, setProjectAreas] = useState([]);

//   useEffect(() => {
//     loadLocations();
//   }, []);

//   const loadLocations = async () => {
//     try {
//       const response = await plantLocations.getCompanyPlantsDetailed();
//       setLocations(response.data);
//       calculateCompanyStats(response.data);

//       // Extract unique projects and their area coordinates
//       const uniqueProjects = response.data.reduce((acc, plant) => {
//         if (
//           plant.project?.areaCoordinates &&
//           !acc.some((p) => p.id === plant.project.id)
//         ) {
//           // Parse coordinates if they're a string
//           const coordinates =
//             typeof plant.project.areaCoordinates === "string"
//               ? JSON.parse(plant.project.areaCoordinates)
//               : plant.project.areaCoordinates;

//           // Ensure coordinates are in the correct format
//           if (Array.isArray(coordinates) && coordinates.length > 0) {
//             acc.push({
//               id: plant.project.id,
//               name: plant.project.name,
//               coordinates: coordinates,
//             });
//           }
//         }
//         return acc;
//       }, []);

//       setProjectAreas(uniqueProjects);
//     } catch (error) {
//       console.error("Error loading locations:", error);
//     }
//   };

//   const calculateCompanyStats = (plants) => {
//     // Calculate plants by category
//     const plantsByCategory = plants.reduce((acc, location) => {
//       const category = location.species?.category || "OUTROS";
//       if (!acc[category]) {
//         acc[category] = [];
//       }
//       acc[category].push(location);
//       return acc;
//     }, {});

//     // Sort plants by most recent first
//     const sortedPlants = [...plants].sort((a, b) => {
//       return (
//         new Date(b.plantedAt || b.createdAt) -
//         new Date(a.plantedAt || a.createdAt)
//       );
//     });

//     setCompanyStats({
//       totalPlants: plants.length,
//       plantsByCategory,
//       recentPlants: sortedPlants,
//     });
//   };

//   const analyzeEnvironmentalImpact = async (plants) => {
//     try {
//       setGeoAnalysis((prev) => ({ ...prev, loading: true, error: null }));
//       const response = await geoGpt.analyze(plants);
//       setGeoAnalysis((prev) => ({
//         ...prev,
//         loading: false,
//         data: response.data,
//       }));
//     } catch (error) {
//       console.error("Error analyzing environmental impact:", error);
//       setGeoAnalysis((prev) => ({
//         ...prev,
//         loading: false,
//         error: "Falha ao analisar o impacto ambiental",
//       }));
//     }
//   };

//   const handleMarkerClick = (location) => {
//     setSelectedPlant(location);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedPlant(null);
//   };

//   const renderCompanyReport = () => (
//     <Box sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 1, md: 2 } }}>
//       {/* Environmental Impact Analysis Section */}
//       <Box
//         sx={{
//           mb: 4,
//           background:
//             "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95))",
//           backdropFilter: "blur(10px)",
//           borderRadius: "16px",
//           boxShadow: "0 4px 24px -1px rgba(0, 0, 0, 0.1)",
//           overflow: "hidden",
//           border: "1px solid rgba(76, 175, 80, 0.1)",
//         }}
//       >
//         <Box
//           sx={{
//             p: 2,
//             borderBottom: "1px solid rgba(76, 175, 80, 0.1)",
//             background: "rgba(76, 175, 80, 0.05)",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: 600, color: "primary.main" }}
//           >
//             Análise de Impacto Ambiental
//           </Typography>
//           <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//             {geoAnalysis.loading && (
//               <CircularProgress size={24} color="primary" />
//             )}
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => {
//                 if (companyStats.recentPlants.length > 0) {
//                   analyzeEnvironmentalImpact(companyStats.recentPlants);
//                 }
//               }}
//               disabled={
//                 geoAnalysis.loading || companyStats.recentPlants.length === 0
//               }
//               startIcon={<AutorenewIcon />}
//             >
//               Gerar Análise
//             </Button>
//             {geoAnalysis.data && (
//               <PDFDownloadLink
//                 document={
//                   <CompanyReport
//                     companyStats={companyStats}
//                     geoAnalysis={geoAnalysis}
//                     locations={locations}
//                   />
//                 }
//                 fileName={`relatorio-impacto-ambiental-${format(
//                   new Date(),
//                   "dd-MM-yyyy"
//                 )}.pdf`}
//               >
//                 {({ loading }) => (
//                   <Button
//                     variant="contained"
//                     color="secondary"
//                     disabled={loading}
//                     startIcon={<PictureAsPdf />}
//                   >
//                     {loading ? "Gerando PDF..." : "Baixar Relatório"}
//                   </Button>
//                 )}
//               </PDFDownloadLink>
//             )}
//           </Box>
//         </Box>
//         <Box sx={{ p: 3 }}>
//           {geoAnalysis.data && (
//             <Box
//               sx={{
//                 p: 3,
//                 background: "rgba(76, 175, 80, 0.05)",
//                 borderRadius: "12px",
//               }}
//             >
//               {geoAnalysis.data.analysis
//                 .split(/\[(COMPOSIÇÃO|DISTRIBUIÇÃO|CONTEXTO)\]/)
//                 .map((text, index) => {
//                   if (text === "COMPOSIÇÃO") {
//                     return (
//                       <Typography
//                         key={index}
//                         variant="h6"
//                         sx={{
//                           color: "primary.main",
//                           fontWeight: 600,
//                           mt: index === 0 ? 0 : 3,
//                           mb: 2,
//                         }}
//                       >
//                         Composição e Diversidade
//                       </Typography>
//                     );
//                   }
//                   if (text === "DISTRIBUIÇÃO") {
//                     return (
//                       <Typography
//                         key={index}
//                         variant="h6"
//                         sx={{
//                           color: "primary.main",
//                           fontWeight: 600,
//                           mt: 3,
//                           mb: 2,
//                         }}
//                       >
//                         Distribuição Espacial
//                       </Typography>
//                     );
//                   }
//                   if (text === "CONTEXTO") {
//                     return (
//                       <Typography
//                         key={index}
//                         variant="h6"
//                         sx={{
//                           color: "primary.main",
//                           fontWeight: 600,
//                           mt: 3,
//                           mb: 2,
//                         }}
//                       >
//                         Contextualização Regional
//                       </Typography>
//                     );
//                   }
//                   return (
//                     <Typography key={index} sx={{ lineHeight: 1.8, mb: 2 }}>
//                       {text}
//                     </Typography>
//                   );
//                 })}
//             </Box>
//           )}
//         </Box>
//       </Box>

// //       {/* Plants Report Section */}
// //       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 3,
//         }}
//       >
//         <Box>
//           <Typography
//             variant="h5"
//             sx={{
//               fontSize: { xs: "1.5rem", md: "1.75rem" },
//               fontWeight: 700,
//               background: "linear-gradient(135deg, #2e7d32, #81c784)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               mb: 1,
//             }}
//           >
//             Relatório de Plantas
//           </Typography>
//           <Typography
//             variant="subtitle1"
//             sx={{ color: "text.secondary", fontWeight: 500 }}
//           >
//             Total de plantas cadastradas: {companyStats.totalPlants}
//           </Typography>
//         </Box>
//       </Box>

//       <Grid container spacing={3}>
//         {Object.entries(companyStats.plantsByCategory || {}).map(
//           ([category, plants]) => (
//             <Grid item xs={12} md={6} key={category}>
//               <Box
//                 sx={{
//                   background:
//                     "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95))",
//                   backdropFilter: "blur(10px)",
//                   borderRadius: "16px",
//                   boxShadow: "0 4px 24px -1px rgba(0, 0, 0, 0.1)",
//                   overflow: "hidden",
//                   border: "1px solid rgba(76, 175, 80, 0.1)",
//                   height: "100%",
//                 }}
//               >
//                 <Box
//                   sx={{
//                     p: 2,
//                     borderBottom: "1px solid rgba(76, 175, 80, 0.1)",
//                     background: "rgba(76, 175, 80, 0.05)",
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Typography
//                     variant="h6"
//                     sx={{ fontWeight: 600, color: "primary.main" }}
//                   >
//                     {formatPlantCategory(category)}
//                   </Typography>
//                   <Typography
//                     sx={{
//                       backgroundColor: "rgba(76, 175, 80, 0.12)",
//                       color: "primary.main",
//                       px: 2,
//                       py: 0.5,
//                       borderRadius: "12px",
//                       fontSize: "0.875rem",
//                       fontWeight: 600,
//                     }}
//                   >
//                     {plants.length} plantas
//                   </Typography>
//                 </Box>
//                 <Box sx={{ p: 2 }}>
//                   {plants.map((plant) => (
//                     <Box
//                       key={plant.id}
//                       sx={{
//                         mb: 2,
//                         p: 2,
//                         background: "rgba(76, 175, 80, 0.03)",
//                         borderRadius: "12px",
//                         transition: "all 0.2s ease-in-out",
//                         cursor: "pointer",
//                         "&:hover": {
//                           transform: "translateX(8px)",
//                           background: "rgba(76, 175, 80, 0.06)",
//                         },
//                         "&:last-child": { mb: 0 },
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           display: "flex",
//                           flexDirection: "column",
//                           gap: 1,
//                         }}
//                       >
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "space-between",
//                           }}
//                         >
//                           <Box>
//                             <Typography
//                               variant="subtitle1"
//                               sx={{ fontWeight: 600 }}
//                             >
//                               {plant.species?.commonName}
//                             </Typography>
//                             <Typography
//                               variant="body2"
//                               sx={{
//                                 color: "text.secondary",
//                                 fontStyle: "italic",
//                               }}
//                             >
//                               {plant.species?.scientificName}
//                             </Typography>
//                           </Box>
//                           {plant.updates && plant.updates.length > 0 && (
//                             <Chip
//                               size="small"
//                               label={
//                                 plant.updates[0].healthStatus === "HEALTHY"
//                                   ? "Saudável"
//                                   : plant.updates[0].healthStatus ===
//                                     "NEEDS_ATTENTION"
//                                   ? "Precisa de Atenção"
//                                   : "Doente"
//                               }
//                               color={
//                                 plant.updates[0].healthStatus === "HEALTHY"
//                                   ? "success"
//                                   : plant.updates[0].healthStatus ===
//                                     "NEEDS_ATTENTION"
//                                   ? "warning"
//                                   : "error"
//                               }
//                             />
//                           )}
//                         </Box>

//                         <Box sx={{ mt: 1 }}>
//                           <Typography
//                             variant="body2"
//                             sx={{
//                               color: "text.secondary",
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 1,
//                               mb: 0.5,
//                             }}
//                           >
//                             <LocationOn fontSize="small" />
//                             {`${plant.latitude.toFixed(
//                               6
//                             )}, ${plant.longitude.toFixed(6)}`}
//                           </Typography>

//                           {plant.project && (
//                             <Box sx={{ mt: 1 }}>
//                               <Typography
//                                 variant="body2"
//                                 sx={{ color: "text.primary", fontWeight: 500 }}
//                               >
//                                 Projeto: {plant.project.name}
//                               </Typography>
//                               {plant.project.description && (
//                                 <Typography
//                                   variant="body2"
//                                   sx={{
//                                     color: "text.secondary",
//                                     mt: 0.5,
//                                     display: "-webkit-box",
//                                     WebkitLineClamp: 2,
//                                     WebkitBoxOrient: "vertical",
//                                     overflow: "hidden",
//                                   }}
//                                 >
//                                   {plant.project.description}
//                                 </Typography>
//                               )}
//                               <Box
//                                 sx={{
//                                   display: "flex",
//                                   gap: 2,
//                                   mt: 1,
//                                   alignItems: "center",
//                                 }}
//                               >
//                                 <Chip
//                                   size="small"
//                                   label={
//                                     plant.project.status === "IN_PROGRESS"
//                                       ? "Em Andamento"
//                                       : plant.project.status === "COMPLETED"
//                                       ? "Concluído"
//                                       : plant.project.status === "PLANNING"
//                                       ? "Planejamento"
//                                       : plant.project.status === "ON_HOLD"
//                                       ? "Em Espera"
//                                       : "Cancelado"
//                                   }
//                                   color={
//                                     plant.project.status === "IN_PROGRESS"
//                                       ? "warning"
//                                       : plant.project.status === "COMPLETED"
//                                       ? "success"
//                                       : plant.project.status === "PLANNING"
//                                       ? "info"
//                                       : plant.project.status === "ON_HOLD"
//                                       ? "default"
//                                       : "error"
//                                   }
//                                 />
//                                 {plant.project.areaCoordinates && (
//                                   <Typography
//                                     variant="caption"
//                                     sx={{ color: "text.secondary" }}
//                                   >
//                                     Área Demarcada:{" "}
//                                     {plant.project.areaCoordinates.length}{" "}
//                                     pontos
//                                   </Typography>
//                                 )}
//                               </Box>
//                             </Box>
//                           )}

//                         {plant.updates && plant.updates.length > 0 && (
//                           <Typography
//                             variant="caption"
//                             sx={{
//                               color: "text.secondary",
//                               display: "block",
//                               mt: 1,
//                             }}
//                           >
//                             Última atualização:{" "}
//                             {new Date(
//                               plant.updates[0].createdAt
//                             ).toLocaleDateString()}
//                           </Typography>
//                         )}
//                       </Box>
//                     </Box>
//                   </Box>
//                 ))}
//               </Box>
//             </Box>
//           </Grid>
//         )
//       )}
//     </Grid>
//   </Box>
// );

//   return (
//     <Box
//       sx={{
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//       }}
//     >
//       <Box sx={{ flex: 1, minHeight: "50vh", position: "relative" }}>
//         <BaseMap>
//           {/* Render project area polygons */}
//           {projectAreas.map((project) => (
//             <Polygon
//               key={project.id}
//               positions={project.coordinates}
//               pathOptions={{
//                 color: "#4caf50",
//                 weight: 2,
//                 fillColor: "#4caf50",
//                 fillOpacity: 0.1,
//               }}
//             >
//               <Popup>
//                 <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                   Projeto: {project.name}
//                 </Typography>
//               </Popup>
//             </Polygon>
//           ))}

//           {/* Existing markers */}
//           {locations.map((location) => (
//             <Marker
//               key={location.id}
//               position={[location.latitude, location.longitude]}
//               eventHandlers={{
//                 click: () => handleMarkerClick(location),
//               }}
//             >
//               <Popup>
//                 <Box sx={{ minWidth: 200 }}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                     {location.species?.commonName}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={{ color: "text.secondary", fontStyle: "italic" }}
//                   >
//                     {location.species?.scientificName}
//                   </Typography>
//                   {location.updates && location.updates.length > 0 && (
//                     <Chip
//                       size="small"
//                       sx={{ mt: 1 }}
//                       label={
//                         location.updates[0].healthStatus === "HEALTHY"
//                           ? "Saudável"
//                           : location.updates[0].healthStatus ===
//                             "NEEDS_ATTENTION"
//                           ? "Precisa de Atenção"
//                           : "Doente"
//                       }
//                       color={
//                         location.updates[0].healthStatus === "HEALTHY"
//                           ? "success"
//                           : location.updates[0].healthStatus ===
//                             "NEEDS_ATTENTION"
//                           ? "warning"
//                           : "error"
//                       }
//                     />
//                   )}
//                 </Box>
//               </Popup>
//             </Marker>
//           ))}
//         </BaseMap>
//       </Box>
//       <Box
//         sx={{
//           flex: 1,
//           overflowY: "auto",
//           bgcolor: "background.default",
//           p: 3,
//         }}
//       >
//         {renderCompanyReport()}
//       </Box>
//       <PlantDetailsModal
//         open={isModalOpen}
//         onClose={handleCloseModal}
//         selectedPlant={selectedPlant}
//         user={user}
//       />
//     </Box>
//   );
// };

// export default CompanyMap;
