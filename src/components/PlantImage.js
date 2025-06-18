// import React, { useState } from "react";
// import { Box, CircularProgress, Typography } from "@mui/material";

// const PlantImage = ({ url, alt = "Plant image" }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   const handleLoad = () => {
//     setLoading(false);
//   };

//   const handleError = () => {
//     setLoading(false);
//     setError(true);
//   };

//   return (
//     <Box
//       sx={{
//         position: "relative",
//         width: "100%",
//         maxWidth: 500,
//         height: 300,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#f5f5f5",
//         borderRadius: 1,
//         overflow: "hidden",
//       }}
//     >
//       {loading && (
//         <CircularProgress
//           sx={{
//             position: "absolute",
//             zIndex: 1,
//           }}
//         />
//       )}
//       {error ? (
//         <Typography color="error">Failed to load image</Typography>
//       ) : (
//         <img
//           src={url}
//           alt={alt}
//           onLoad={handleLoad}
//           onError={handleError}
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             opacity: loading ? 0 : 1,
//             transition: "opacity 0.3s",
//           }}
//         />
//       )}
//     </Box>
//   );
// };

// export default PlantImage;
