import { styled, Box } from "@mui/material";

const ProcessSection = styled(Box)(({ theme }) => ({
  padding: "30px 20px",
  borderRadius: "50px",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  "& h4": {
    fontSize: { xs: "1.5rem", md: "2rem" },
    wordBreak: "break-word",
    marginBottom: theme.spacing(4),
  },
  "& h6": {
    fontSize: { xs: "1.1rem", md: "1.25rem" },
  },
}));

export default ProcessSection;
