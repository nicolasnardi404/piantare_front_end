import React from "react";
import { Box, Typography, Link as MuiLink, Container } from "@mui/material";

const Footer = () => (
  <Box
    component="footer"
    sx={{
      bgcolor: "#f5f5f5",
      color: "#333",
      py: 3,
      mt: 8,
      borderTop: "1px solid #e0e0e0",
      textAlign: "center",
    }}
  >
    <Container maxWidth="md">
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        &copy; {new Date().getFullYear()} ApeForest - Plant Today Forest
        Tomorrow
      </Typography>
    </Container>
  </Box>
);

export default Footer;
