// import React, { useState } from "react";
// import { Box, Paper } from "@mui/material";
// import FileUpload from "./FileUpload";
// import PlantImage from "./PlantImage";

// const PlantImageUploader = () => {
//   const [imageUrl, setImageUrl] = useState(null);

//   const handleUploadSuccess = (url) => {
//     setImageUrl(url);
//   };

//   return (
//     <Paper sx={{ p: 2, maxWidth: 600, mx: "auto", my: 2 }}>
//       <FileUpload onUploadSuccess={handleUploadSuccess} />
//       {imageUrl && (
//         <Box sx={{ mt: 2 }}>
//           <PlantImage url={imageUrl} />
//         </Box>
//       )}
//     </Paper>
//   );
// };

// export default PlantImageUploader;
